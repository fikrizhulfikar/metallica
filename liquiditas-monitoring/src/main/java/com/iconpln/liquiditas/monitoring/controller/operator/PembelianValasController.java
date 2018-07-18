package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import com.iconpln.liquiditas.core.service.ValasService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by israj on 10/4/2016.
 */
@RestController
@RequestMapping("/api_operator/pembelian_valas")
public class PembelianValasController {

    @Autowired
    ValasService valasService;

    @Autowired
    private ResourceLoader resourceLoader;

    @RequestMapping(value = "/ins_data", method = RequestMethod.POST)
    public Map<String, Object> insData(
            @RequestParam(value = "PidBeliValas", defaultValue = "") String PidBeliValas,
            @RequestParam(value = "pBankPengirim", defaultValue = "") String pBankPengirim,
            @RequestParam(value = "pbankPenerima", defaultValue = "") String pbankPenerima,
            @RequestParam(value = "pTglPosting", defaultValue = "") String pTglPosting,
            @RequestParam(value = "pCurr", defaultValue = "") String pCurr,
            @RequestParam(value = "pPembelian", defaultValue = "") String pPembelian,
            @RequestParam(value = "pKurs", defaultValue = "") String pKurs,
            @RequestParam(value = "pNo", defaultValue = "") String pNo,
            @RequestParam(value = "pPay", defaultValue = "") String pPay,
            @RequestParam(value = "pDoc1", defaultValue = "") String pDoc1,
            @RequestParam(value = "pDoc2", defaultValue = "") String pDoc2
    ) {
        try {
            return valasService.insPembelianValas(PidBeliValas, pBankPengirim, pbankPenerima, pTglPosting,
                    pCurr, pPembelian, pKurs,
                    pNo, pPay, pDoc1, pDoc2, WebUtils.getUsernameLogin());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_data", method = RequestMethod.GET)
    public Map listRekapData(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "ASC") String sortDir,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pCurrency", defaultValue = "ALL") String pCurrency,
            @RequestParam(value = "pDok1", defaultValue = "ALL") String pDok1,
            @RequestParam(value = "pDok2", defaultValue = "ALL") String pDok2,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {

        List<Map<String, Object>> list = new ArrayList<>();
        try {
            String sortBy = parseColumn(sortIndex);
            if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
                sortDir = "DESC";
            }
            list = valasService.getListPemebelianValas(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pDok1, pDok2, sortBy, sortDir, pSearch);
        } catch (Exception e) {
            e.printStackTrace();
        }


        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);
        AppUtils.getLogger(this).info("size data : {}", list.size());
        if (list.size() < 1 || list.isEmpty()) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }

        return mapData;
    }

    @RequestMapping(value = "/get_all_pembelian_valas", method = RequestMethod.GET)
    public List getAllpembayaran(
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pCurr", defaultValue = "ALL") String pCurr,
            @RequestParam(value = "pDok1", defaultValue = "ALL") String pDok1,
            @RequestParam(value = "pDok2", defaultValue = "ALL") String pDok2
    ) {
        try {
            return valasService.getAllPembelianValas(pTglAwal, pTglAkhir, pBank, pCurr, pDok1, pDok2);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/delete_data", method = RequestMethod.POST)
    public Map<String, Object> deleteData(
            @RequestParam(value = "pIdPembelianValas", defaultValue = "") String pIdPembelianValas
    ) {

        AppUtils.getLogger(this).debug("pIdPembelianValas : {} ", pIdPembelianValas);
        try {
            return valasService.deletePembelianValas(pIdPembelianValas);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/edit_data", method = RequestMethod.GET)
    public List getRekapDataById(
            @RequestParam(value = "pIdPembelianValas", defaultValue = "") String pIdPembelianValas
    ) {
        AppUtils.getLogger(this).info("pIdPembelianValas edit data: {}", pIdPembelianValas);
        try {
            return valasService.getPembelianValasById(pIdPembelianValas);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/xls/{pTglAwal}/{pTglAkhir}/{pBank}/{pCurr}/{pDok1}/{pDok2}", method = RequestMethod.GET)
    public String export(
            @PathVariable String pTglAwal,
            @PathVariable String pTglAkhir,
            @PathVariable String pBank,
            @PathVariable String pCurr,
            @PathVariable String pDok1,
            @PathVariable String pDok2,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        try {

            String tglAwal = "";
            String tglAkhir = "";

            if(!pTglAwal.equals("null")){
                tglAwal = pTglAwal;
            }
            if(!pTglAkhir.equals("null")){
                tglAkhir = pTglAkhir;
            }


            String doc1 = "ALL";
            String doc2 = "ALL";

            if(!pDok1.equals("null")){
                doc1 = pDok1;
            }
            if(!pDok2.equals("null")){
                doc2 = pDok2;
            }

            String title = "PEMBELIAN VALAS";
            String namaFile = "pembelian-valas.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = valasService.getAllPembelianValas(tglAwal,tglAkhir,pBank,pCurr,doc1,doc2);

            AppUtils.getLogger(this).info("data report : {}", listData.toString());
            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                paramDetail.put("TGL_POSTING", data.get("TGL_POSTING"));
                paramDetail.put("NAMA_BANK_PENGIRIM", data.get("NAMA_BANK_PENGIRIM"));
                paramDetail.put("BANK_PENGIRIM", data.get("BANK_PENGIRIM"));
                paramDetail.put("NAMA_BANK_PENERIMA", data.get("NAMA_BANK_PENERIMA"));
                paramDetail.put("BANK_PENERIMA", data.get("BANK_PENERIMA"));
                paramDetail.put("PEMBELIAN", data.get("PEMBELIAN"));
                paramDetail.put("CURRENCY", data.get("CURRENCY"));
                paramDetail.put("KURS", data.get("KURS"));
                paramDetail.put("KONVERSI_IDR", data.get("KONVERSI_IDR"));
                paramDetail.put("NO", data.get("NO"));
                paramDetail.put("PAY", data.get("PAY"));
                paramDetail.put("DOC1", data.get("DOC1"));
                paramDetail.put("DOC2", data.get("DOC2"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);


            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/pembelian-valas.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }

    public String parseColumn(int index) {
        switch (index) {
            case 1:
                return "POSTING_DATE";
            case 2:
                return "NAMA_BANK_PENGIRIM";
            case 3:
                return "KODE_BANK_PENGIRIM";
            case 4:
                return "NAMA_BANK_PENERIMA";
            case 5:
                return "KODE_BANK_PENERIMA";
            case 6:
                return "PEMBELIAN";
            case 7:
                return "CURRENCY";
            case 8:
                return "KURS";
            case 9:
                return "KONVERSI_IDR";
            case 10:
                return "NO_SETTLEMENT";
            case 11:
                return "PAY_REG";
            case 12:
                return "DOKUMEN1";
            case 13:
                return "DOKUMEN2";
            default:
                return "POSTING_DATE";
        }
    }

}
