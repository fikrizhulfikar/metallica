package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.domain.Notification;
import com.iconpln.liquiditas.core.service.GiroSpecialRateService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.NotificationUtil;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/api_operator/giro_special_rate")
public class GiroSpecialRateController {

    @Autowired
    private GiroSpecialRateService giroSpecialRateService;

    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private NotificationUtil notificationUtil;

    @RequestMapping(value = "/get_giro", method = RequestMethod.GET)
    public Map getDataGiro(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "") String sortDir,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pCurrency", defaultValue = "ALL") String pCurrency
    ) {

        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = giroSpecialRateService.getListGiro(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency);
        } catch (Exception e) {
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("draw", draw);
        mapData.put("data", list);
        AppUtils.getLogger(this).info("size data : {}", list.size());
        AppUtils.getLogger(this).info("list data : {}", list.toString());
        if (list.size() < 1 || list.isEmpty() || list.get(0).get("TOTAL_COUNT") == null) {
            mapData.put("recordsTotal", 0);
            mapData.put("recordsFiltered", 0);
        } else {
            mapData.put("recordsTotal", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
            mapData.put("recordsFiltered", new BigDecimal(list.get(0).get("TOTAL_COUNT").toString()));
        }
        return mapData;
    }

    private String parseColumn(int index) {
        switch (index) {
            case 1:
                return "ID_VALAS";
            case 2:
                return "JENIS_TAGIHAN";
            case 3:
                return "JENIS_PEMBAYARAN";
            case 4:
                return "JATUH_TEMPO";
            case 5:
                return "VENDOR";
            case 6:
                return "CURRENCY";
            case 7:
                return "TAGIHAN";
            case 8:
                return "UNIT";
            case 9:
                return "BANK_TUJUAN";
            case 10:
                return "BANK_PEMBAYAR";
            case 11:
                return "TGL_TERIMA_INVOICE";
            case 12:
                return "TGL_TAGIHAN";
            case 13:
                return "NO_TAGIHAN";
            case 14:
                return "TGL_NOTDIN";
            case 15:
                return "NO_NOTDIN";
            case 16:
                return "TGL_LUNAS";
            case 17:
                return "COUNT_DOWN";
            case 18:
                return "STATUS_VALAS";
            case 19:
                return "TIPE_TRANSAKSI";
            case 20:
                return "NOMINAL_SBLM_PAJAK";
            case 21:
                return "PAJAK";
            case 22:
                return "NOMINAL_STLH_PAJAK";
            case 23:
                return "NOMINAL_UNDERLYING";
            case 24:
                return "NOMINAL_TANPA_UNDERLYING";
            case 25:
                return "KURS_JISDOR";
            case 26:
                return "SPREAD";
            case 27:
                return "KURS_TRANSAKSI";
            case 28:
                return "NOMINAL_PEMBAYARAN_IDR";
            case 29:
                return "CREATE_DATE";
            case 30:
                return "STATUS_TRACKING";
            case 31:
                return "DESKRIPSI";
            default:
                return "UPDATE_DATE";
        }
    }

    @RequestMapping(value = "/ins_data_giro", method = RequestMethod.POST)
    public Map<String, Object> insDataGiro(
            @RequestParam(value = "pIdGiro", defaultValue = "") String pIdGiro,
            @RequestParam(value = "pTglJatuhTempo", defaultValue = "") String pTglJatuhTempo,
            @RequestParam(value = "pTglPenempatan", defaultValue = "") String pTglPenempatan,
            @RequestParam(value = "pCurr", defaultValue = "") String pCurr,
            @RequestParam(value = "pBankTujuan", defaultValue = "") String pBankTujuan,
            @RequestParam(value = "pPajak", defaultValue = "") String pPajak,
            @RequestParam(value = "pInterest", defaultValue = "") String pInterest,
            @RequestParam(value = "pNominal", defaultValue = "") String pNominal,
            @RequestParam(value = "pProduk", defaultValue = "") String pProduk,
            @RequestParam(value = "pKeterangan", defaultValue = "") String pKeterangan,
            @RequestParam(value = "pJenis", defaultValue = "") String pJenis,
            @RequestParam(value = "pJasaGiro", defaultValue = "") String pJasaGiro

    ) {
        try {
            Map<String, Object> res = giroSpecialRateService.insPembayaranGiro(pIdGiro, pTglJatuhTempo, pTglPenempatan, pCurr,
                    pBankTujuan, pPajak, pInterest, pNominal, pProduk, pKeterangan, pJenis, WebUtils.getUsernameLogin(), pJasaGiro);
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/edit_giro", method = RequestMethod.GET)
    public List editGiro(
            @RequestParam(value = "pIdGiro", defaultValue = "") String pId
    ) {
        AppUtils.getLogger(this).info("pId edit data: {}", pId);
        try {
            return giroSpecialRateService.editGiroService(pId);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/delete_giro", method = RequestMethod.POST)
    public Map<String, Object> deleteGiro(
            @RequestParam(value = "pIdGiro", defaultValue = "") String pIdGiro
    ) {

        AppUtils.getLogger(this).debug("pIdGiro : {} ", pIdGiro);
        try {
            WebUtils.deleteFile(pIdGiro);
            Map<String, Object> res = giroSpecialRateService.deleteGiro(pIdGiro);
            Notification notification =
                    Notification.builder()
                            .topic("DELETE")
                            .title("GIRO SPECIAL RATE")
                            .message("BERHASIL DELETE DENGAN ID : " + pIdGiro)
                            .additionalInfo(null)
                            .build();
            if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {
                notificationUtil.notifyMessage(notification);
            }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/xls_giro", method = RequestMethod.GET)
    public String export(HttpServletRequest request, HttpServletResponse response) {
        try {
            SimpleDateFormat dateParser = new SimpleDateFormat("yyyymmdd");
            String pattern = "###,###.###";
            DecimalFormat df  = new DecimalFormat(pattern);
            String tglAwal = "";
            String tglAkhir = "";

            String title = "REKAP GIRO SPECIAL RATE";
            String namaFile = "rekap_giro.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = giroSpecialRateService.getXlsGiroSpecialRate();

            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();
            System.out.println("List_Excel_giro : "+listData.toString());

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                paramDetail.put("ID_GIRO",data.get("ID_GIRO"));
                paramDetail.put("JENIS",data.get("JENIS"));
                paramDetail.put("BANK",data.get("BANK"));
                paramDetail.put("CURRENCY",data.get("CURRENCY"));
                paramDetail.put("PRODUK",data.get("PRODUK"));
                paramDetail.put("NOMINAL",data.get("NOMINAL"));
                paramDetail.put("INTEREST",data.get("INTEREST"));
                paramDetail.put("TGL_PENEMPATAN", data.get("TGL_PENEMPATAN"));
                paramDetail.put("JATUH_TEMPO",data.get("JATUH_TEMPO"));
                paramDetail.put("JUMLAH_HARI",data.get("JUMLAH_HARI"));
                paramDetail.put("JASA_GIRO",data.get("JASA_GIRO"));
                paramDetail.put("PAJAK",data.get("PAJAK"));
                paramDetail.put("NET_JASA_GIRO",data.get("NET_JASA_GIRO"));
                paramDetail.put("POKOK_JASA_GIRO",data.get("POKOK_JASA_GIRO"));
                paramDetail.put("KETERANGAN",data.get("KETERANGAN"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);

            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/rekap_giro.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }
}
