package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import com.iconpln.liquiditas.core.service.ValasService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by israj on 10/4/2016.
 */
@RestController
@RequestMapping("/api_operator/deposito")
public class DepositoController {

    @Autowired
    ValasService valasService;

    @Autowired
    private ResourceLoader resourceLoader;

    @RequestMapping(value = "/ins_data", method = RequestMethod.POST)
    public Map<String, Object> insData(
            @RequestParam(value = "pIdDeposito", defaultValue = "") String pIdDeposito,
            @RequestParam(value = "pBank", defaultValue = "") String pBank,
            @RequestParam(value = "pCurr", defaultValue = "") String pCurr,
            @RequestParam(value = "pNoAccount", defaultValue = "") String pNoAccount,
            @RequestParam(value = "pNominal", defaultValue = "") String pNominal,
            @RequestParam(value = "pInterest", defaultValue = "") String pInterest,
            @RequestParam(value = "pTglpenempatan", defaultValue = "") String pTglpenempatan,
            @RequestParam(value = "pTenor", defaultValue = "") String pTenor,
            @RequestParam(value = "pTglJatuhTempo", defaultValue = "") String pTglJatuhTempo,
            @RequestParam(value = "pKeterangan", defaultValue = "") String pKeterangan,
            @RequestParam(value = "pStatusDeposito", defaultValue = "") String pStatusDeposito
    ) {
        try {
            return valasService.insDeposito(pIdDeposito, pBank, pCurr, pNoAccount,
                    pNominal, pInterest, pTglpenempatan, pTenor,
                    pTglJatuhTempo, pKeterangan, pStatusDeposito, WebUtils.getUsernameLogin());
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
            @RequestParam(value = "pTenor", defaultValue = "ALL") String pTenor,
            @RequestParam(value = "pKeterangan", defaultValue = "0") String pKeterangan,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch

    ) {

        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = valasService.getListDeposito(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pTenor, pKeterangan, pSearch);
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

    @RequestMapping(value = "/get_all_deposito", method = RequestMethod.GET)
    public List getAllpembayaran(
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pCurr", defaultValue = "ALL") String pCurr,
            @RequestParam(value = "pTenor", defaultValue = "ALL") String pTenor,
            @RequestParam(value = "pKet", defaultValue = "ALL") String pKet
    ) {
        try {
            return valasService.getAllDeposito(pTglAwal, pTglAkhir, pBank, pCurr, pTenor, pKet);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/delete_data", method = RequestMethod.POST)
    public Map<String, Object> deleteData(
            @RequestParam(value = "pIdDeposito", defaultValue = "") String pIdDeposito
    ) {

        AppUtils.getLogger(this).debug("pIdDeposito : {} ", pIdDeposito);
        try {
            return valasService.deleteDeposito(pIdDeposito);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/edit_data", method = RequestMethod.GET)
    public List getRekapDataById(
            @RequestParam(value = "pIdDeposito", defaultValue = "") String pIdDeposito
    ) {
        AppUtils.getLogger(this).info("pIdDeposito edit data: {}", pIdDeposito);
        try {
            return valasService.getDepositobyId(pIdDeposito);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/xls/{pTglAwal}/{pTglAkhir}/{pBank}/{pCurr}/{pTenor}/{pKet}", method = RequestMethod.GET)
    public String export(
            @PathVariable String pTglAwal,
            @PathVariable String pTglAkhir,
            @PathVariable String pBank,
            @PathVariable String pCurr,
            @PathVariable String pTenor,
            @PathVariable String pKet,
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

            String title = "DEPOSITO";
            String namaFile = "deposito.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = valasService.getAllDeposito(tglAwal.replaceAll("-","/"), tglAkhir.replaceAll("-","/"),pBank,pCurr,pTenor,pKet);

            AppUtils.getLogger(this).info("data report : {}", listData.toString());
            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                paramDetail.put("BANK_CONTERPARTY", data.get("BANK_CONTERPARTY"));
                paramDetail.put("CURRENCY", data.get("CURRENCY"));
                paramDetail.put("NO_ACCOUNT", data.get("NO_ACCOUNT"));
                paramDetail.put("NOMINAL", data.get("NOMINAL"));
                paramDetail.put("INTEREST", data.get("INTEREST") + " %");
                paramDetail.put("TGL_PENEMPATAN", data.get("TGL_PENEMPATAN"));
                paramDetail.put("TGL_JATUH_TEMPO", data.get("TGL_JATUH_TEMPO"));
                paramDetail.put("TENOR", data.get("TENOR"));
                paramDetail.put("JUMLAH_HARI", data.get("JUMLAH_HARI"));
                paramDetail.put("BUNGA", data.get("BUNGA"));
                paramDetail.put("POKOK_BUNGA", data.get("POKOK_BUNGA"));
                paramDetail.put("COUNT_DOWN", data.get("COUNT_DOWN"));
                paramDetail.put("KETERANGAN", data.get("KETERANGAN"));
                String sts = (String) data.get("STATUS_DEPOSITO");
                if (sts == "1" || sts.equals("1")) {
                    paramDetail.put("STATUS_DEPOSITO", "AKTIF");
                } else {
                    paramDetail.put("STATUS_DEPOSITO", "TIDAK AKTIF");
                }
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);


            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/deposito.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }

    @RequestMapping(value = "/get_id_upload", method = RequestMethod.GET)
    public Map getIdUpload() {
        Map data = new HashMap();
        try {
            data.put("path", WebUtils.getFilePath());
            data.put("data_pembayaran", valasService.getIdUpload());
            return data;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/upload_xls", method = RequestMethod.POST)
    public Map<String, Object> uploadFileXls(
            @RequestParam(value = "file") MultipartFile file,
            HttpServletResponse response
    ) throws IOException, ParseException, SQLException {
        InputStream inputStream = file.getInputStream();
        /*Map<String, Object> listFailed = Map<String, Object>*/
        return valasService.uploadXls(inputStream, WebUtils.getUsernameLogin(), "6", "");

//        return generateReport(response,listFailed,"result");
//        return listFailed;
    }

    @RequestMapping(value = "/download/{idUpload}", method = RequestMethod.GET)
    public String export(HttpServletResponse response,
                         @PathVariable String idUpload) throws SQLException {
        AppUtils.getLogger(this).info("DOWNLOAD {} ID UPLOAD : {}", "download deposito", idUpload);

        return generateReport(response,valasService.getErrorData(idUpload, "6"), "download");
    }

    @RequestMapping(value = "/template", method = RequestMethod.GET)
    public String downloadTemplate(HttpServletResponse response) throws SQLException {
        return generateReport(response,null, "template");

    }

    public String generateReport(HttpServletResponse response, Map<String, Object> errorData, String tipe) {
        try {
            AppUtils.getLogger(this).debug("Masuknih : {}", errorData);

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            Map value = new HashMap();

            System.out.println("value : "+value);
            String resource;
            System.out.println("resources : deposito");

            response.setHeader("Content-Disposition", "attachment; filename=\""+tipe+"_deposito.xls\"");
            resource = "classpath:/templates/report/"+tipe+"_deposito.xls";
            if(tipe.equals("download")){
                value.put("listFailed", errorData.get("return"));
            }

            System.out.println("resources : "+ resource);
            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource(resource).getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, value);
            workbook.write(os);
            os.flush();
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }
}
