package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.InvoiceDraftService;
import com.iconpln.liquiditas.core.service.InvoiceSalahService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
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
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/api_operator/rekap_invoice_salah")
public class InvoiceSalahController {
    @Autowired
    private InvoiceSalahService invoiceSalahService;

    @Autowired
    private ResourceLoader resourceLoader;

    private SimpleDateFormat excelDateFormat = new SimpleDateFormat("dd/mm/yyyy");

    @GetMapping(path = "/get_rekap_invoice_salah")
    public Map getInvoiceSalahtList(
            @RequestParam(value = "draw", defaultValue = "0") int draw,
            @RequestParam(value = "start", defaultValue = "0") int start,
            @RequestParam(value = "length", defaultValue = "10") int length,
            @RequestParam(value = "columns[0][data]", defaultValue = "") String firstColumn,
            @RequestParam(value = "order[0][column]", defaultValue = "0") int sortIndex,
            @RequestParam(value = "order[0][dir]", defaultValue = "") String sortDir,
            @RequestParam(value = "pTglAwal", defaultValue = "") String pTglAwal,
            @RequestParam(value = "pTglAkhir", defaultValue = "") String pTglAkhir,
            @RequestParam(value = "pBank", defaultValue = "ALL") String pBank,
            @RequestParam(value = "pCurrency", defaultValue = "ALL") String pCurrency,
            @RequestParam(value = "pCaraBayar", defaultValue = "ALL") String pCaraBayar,
            @RequestParam(value = "status", defaultValue = "ALL") String pStatus,
            @RequestParam(value = "statusTracking", defaultValue = "ALL") String pStatusTracking,
            @RequestParam(value = "search[value]", defaultValue = "") String pSearch
    ) {
        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = invoiceSalahService.getInvoiceSalahList(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pCaraBayar, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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
                return "COMP_CODE";
            case 2:
                return "DOC_NO";
            case 3:
                return "FISC_YEAR";
            case 4:
                return "DOC_TYPE";
            case 5:
                return "DOC_DATE2";
            case 6:
                return "POST_DATE2";
            case 7:
                return "ENTRY_DATE2";
            case 8:
                return "REFERENCE";
            case 9:
                return "REV_WITH";
            case 10:
                return "REV_YEAR";
            case 11:
                return "DOC_HDR_TXT";
            case 12:
                return "CURRENCY";
            case 13:
                return "EXCH_RATE";
            case 14:
                return "REFERENCE_KEY";
            case 15:
                return "PMT_ID";
            case 16:
                return "TRANS_TYPE";
            case 17:
                return "SPREAD_VAL";
            case 18:
                return "LINE_ITEM";
            case 19:
                return "OI_IND";
            case 20:
                return "ACCT_TYPE";
            case 21:
                return "SPEC_GL";
            case 22:
                return "BUS_AREA";
            case 23:
                return "TPBA";
            case 24:
                return "AMT_LC";
            case 25:
                return "AMT_MC";
            case 26:
                return "AMT_WITH_BASE_TC";
            case 27:
                return "AMT_WITH_TC";
            case 28:
                return "AMOUNT";
            case 29:
                return "ASSIGNMENT";
            case 30:
                return "ITEM_TEXT";
            case 31:
                return "COST_CTR";
            case 32:
                return "GL_ACCT";
            case 33:
                return "CUSTOMER";
            case 34:
                return "VENDOR";
            case 35:
                return "BASE_DATE";
            case 36:
                return "TERM_PMT";
            case 37:
                return "DUE_ON";
            case 38:
                return "PMT_BLOCK";
            case 39:
                return "HOUSE_BANK";
            case 40:
                return "PRTNR_BANK_TYPE";
            case 41:
                return "BANK_KEY";
            case 42:
                return "BANK_ACCOUNT";
            case 43:
                return "ACCOUNT_HOLDER";
            case 44:
                return "PO_NUM";
            case 45:
                return "PO_ITEM";
            case 46:
                return "REF_KEY1";
            case 47:
                return "REF_KEY2";
            case 48:
                return "REF_KEY3";
            case 49:
                return "INT_ORDER";
            case 50:
                return "WBS_NUM";
            case 51:
                return "CASH_CODE";
            case 52:
                return "DR_CR_IND";
            case 53:
                return "AMT_WITH_BASE_LC";
            case 54:
                return "AMT_WITH_LC";
            case 55:
                return "METODE_PEMBAYARAN";
            case 56:
                return "TGL_RENCANA_BAYAR";
            case 57:
                return "SUMBER_DANA";
            case 58:
                return "KETERANGAN";
            case 59:
                return "STATUS_TRACKING";
            default:
                return "UPDATE_DATE";
        }
    }

    @RequestMapping(value = "/get_column", method = RequestMethod.GET)
    public Map getColumn() {
        Map data = new HashMap();
        try {
            data.put("data", invoiceSalahService.getColumn(WebUtils.getUsernameLogin()));
            return data;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/xls_invoice_salah", method = RequestMethod.GET)
    public String export(
            HttpServletRequest request,
            HttpServletResponse response) {
        try {
            SimpleDateFormat dateParser = new SimpleDateFormat("yyyymmdd");
            String pattern = "###,###.###";
            DecimalFormat df  = new DecimalFormat(pattern);
            String tglAwal = "";
            String tglAkhir = "";

            String title = "REKAP INVOICE SALAH/GAGAL";
            String namaFile = "rekap_invoice_salah.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = invoiceSalahService.getAllXlsInvoiceSalah();

            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();
            System.out.println("List_Excel_data : "+listData.toString());

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("ROW_NUMBER", data.get("ROW_NUMBER"));
                paramDetail.put("KET",data.get("KET"));
                paramDetail.put("COMP_CODE",data.get("COMP_CODE"));
                paramDetail.put("DOC_NO",data.get("DOC_NO"));
                paramDetail.put("FISC_YEAR",data.get("FISC_YEAR"));
                paramDetail.put("DOC_TYPE",data.get("DOC_TYPE"));
                paramDetail.put("DOC_DATE",(!data.get("DOC_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("DOC_DATE").toString())) : "-");
                paramDetail.put("DOC_DATE2",data.get("DOC_DATE2"));
                paramDetail.put("DESKRIPSI_BANK", data.get("DESKRIPSI_BANK"));
                paramDetail.put("POST_DATE",(!data.get("POST_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("POST_DATE").toString())) : "-");
                paramDetail.put("POST_DATE2",data.get("POST_DATE2"));
                paramDetail.put("ENTRY_DATE",(!data.get("ENTRY_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("ENTRY_DATE").toString())) : "-");
                paramDetail.put("ENTRY_DATE2",data.get("ENTRY_DATE2"));
                paramDetail.put("REFERENCE",data.get("REFERENCE"));
                paramDetail.put("REV_WITH",data.get("REV_WITH"));
                paramDetail.put("REV_YEAR",data.get("REV_YEAR"));
                paramDetail.put("DOC_HDR_TXT",data.get("DOC_HDR_TXT"));
                paramDetail.put("CURRENCY",data.get("CURRENCY"));
                paramDetail.put("EXCH_RATE",data.get("EXCH_RATE"));
                paramDetail.put("REFERENCE_KEY",data.get("REFERENCE_KEY"));
                paramDetail.put("PMT_IND",data.get("PMT_IND"));
                paramDetail.put("TRANS_TYPE",data.get("TRANS_TYPE"));
                paramDetail.put("SPREAD_VAL",data.get("SPREAD_VAL"));
                paramDetail.put("LINE_ITEM",data.get("LINE_ITEM"));
                paramDetail.put("OI_IND",data.get("OI_IND"));
                paramDetail.put("ACCT_TYPE",data.get("ACCT_TYPE"));
                paramDetail.put("SPEC_GL",data.get("SPEC_GL"));
                paramDetail.put("BUS_AREA",data.get("BUS_AREA"));
                paramDetail.put("TPBA",data.get("TPBA"));
                paramDetail.put("AMT_LC",data.get("AMT_LC"));
                paramDetail.put("AMT_TC", data.get("AMT_TC"));
                paramDetail.put("AMT_WITH_BASE_TC",data.get("AMT_WITH_BASE_TC"));
                paramDetail.put("AMT_WITH_TC",data.get("AMT_WITH_TC"));
                paramDetail.put("AMOUNT",data.get("AMOUNT"));
                paramDetail.put("ASSIGNMENT",data.get("ASSIGNMENT"));
                paramDetail.put("ITEM_TEXT",data.get("ITEM_TEXT"));
                paramDetail.put("COST_CTR",data.get("COST_CTR"));
                paramDetail.put("GL_ACCT",data.get("GL_ACCT"));
                paramDetail.put("CUSTOMER",data.get("CUSTOMER"));
                paramDetail.put("CUSTOMER_NAME",data.get("CUSTOMER_NAME"));
                paramDetail.put("VENDOR",data.get("VENDOR"));
                paramDetail.put("VENDOR_NAME",data.get("VENDOR_NAME"));
                paramDetail.put("BASE_DATE",(!data.get("BASE_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("BASE_DATE").toString())) : "-");
                paramDetail.put("TERM_PMT",data.get("TERM_PMT"));
                paramDetail.put("DUE_ON",data.get("DUE_ON"));
                paramDetail.put("PMT_BLOCK",data.get("PMT_BLOCK"));
                paramDetail.put("HOUSE_BANK",data.get("HOUSE_BANK"));
                paramDetail.put("NO_GIRO", data.get("NO_GIRO"));
                paramDetail.put("PRTNR_BANK_TYPE",data.get("PRTNR_BANK_TYPE"));
                paramDetail.put("BANK_KEY",data.get("BANK_KEY"));
                paramDetail.put("BANK_ACCOUNT",data.get("BANK_ACCOUNT"));
                paramDetail.put("ACCOUNT_HOLDER",data.get("ACCOUNT_HOLDER"));
                paramDetail.put("PO_NUM",data.get("PO_NUM"));
                paramDetail.put("PO_ITEM",data.get("PO_ITEM"));
                paramDetail.put("PARTIAL_IND", data.get("PARTIAL_IND"));
                paramDetail.put("REF_KEY1",data.get("REF_KEY1"));
                paramDetail.put("REF_KEY2",data.get("REF_KEY2"));
                paramDetail.put("REF_KEY3",data.get("REF_KEY3"));
                paramDetail.put("INT_ORDER",data.get("INT_ORDER"));
                paramDetail.put("WBS_NUM",data.get("WBS_NUM"));
                paramDetail.put("CASH_CODE",data.get("CASH_CODE"));
                paramDetail.put("AMT_WITH_BASE_LC",data.get("AMT_WITH_BASE_LC"));
                paramDetail.put("AMT_WITH_LC",data.get("AMT_WITH_LC"));
                paramDetail.put("DR_CR_IND",data.get("DR_CR_IND"));
                paramDetail.put("CORP_PMT",data.get("CORP_PMT"));
                paramDetail.put("TGL_VERIFIKASI_MAKER",data.get("TGL_VERIFIKASI_MAKER"));
                paramDetail.put("TGL_VERIFIKASI_CHECKER",data.get("TGL_VERIFIKASI_CHECKER"));
                paramDetail.put("TGL_VERIFIKASI_APPROVER",data.get("TGL_VERIFIKASI_APPROVER"));
                paramDetail.put("METODE_PEMBAYARAN",data.get("METODE_PEMBAYARAN"));
                paramDetail.put("TGL_TAGIHAN_DITERIMA",data.get("TGL_TAGIHAN_DITERIMA"));
                paramDetail.put("MAKER",data.get("MAKER"));
                paramDetail.put("CHECKER",data.get("CHECKER"));
                paramDetail.put("APPROVER",data.get("APPROVER"));
                paramDetail.put("COUNTER",data.get("COUNTER"));
                paramDetail.put("KETERANGAN",data.get("KETERANGAN"));
                paramDetail.put("FLAG_STATUS",data.get("FLAG_STATUS"));
                paramDetail.put("NO_REK_HOUSE_BANK",data.get("NO_REK_HOUSE_BANK"));
                paramDetail.put("INQ_CUSTOMER_NAME",data.get("INQ_CUSTOMER_NAME"));
                paramDetail.put("INQ_ACCOUNT_NUMBER",data.get("INQ_ACCOUNT_NUMBER"));
                paramDetail.put("INQ_ACCOUNT_STATUS",data.get("INQ_ACCOUNT_STATUS"));
                paramDetail.put("KODE_BANK_PENERIMA",data.get("KODE_BANK_PENERIMA"));
                paramDetail.put("RETRIEVAL_REF_NUMBER",data.get("RETRIEVAL_REF_NUMBER"));
                paramDetail.put("CUSTOMER_REF_NUMBER",data.get("CUSTOMER_REF_NUMBER"));
                paramDetail.put("CONFIRMATION_CODE",data.get("CONFIRMATION_CODE"));
                paramDetail.put("TGL_ACT_BAYAR",data.get("TGL_ACT_BAYAR"));
                paramDetail.put("OSS_ID",data.get("OSS_ID"));
                paramDetail.put("GROUP_ID",data.get("GROUP_ID"));
                paramDetail.put("SUMBER_DANA",data.get("SUMBER_DANA"));
                paramDetail.put("TGL_RENCANA_BAYAR",data.get("TGL_RENCANA_BAYAR"));
                paramDetail.put("BANK_BYR",data.get("BANK_BYR"));
                paramDetail.put("CURR_BAYAR",data.get("CURR_BAYAR"));
                paramDetail.put("PARTIAL_IND",data.get("PARTIAL_IND"));
                paramDetail.put("AMOUNT_BAYAR",data.get("AMOUNT_BAYAR"));
                paramDetail.put("BANK_BENEF",data.get("BANK_BENEF"));
                paramDetail.put("NO_REK_BENEF",data.get("NO_REK_BENEF"));
                paramDetail.put("NAMA_BENEF",data.get("NAMA_BENEF"));
                paramDetail.put("VERIFIED_BY",data.get("VERIFIED_BY"));
                paramDetail.put("VERIFIED_ON",data.get("VERIFIED_ON"));
                paramDetail.put("APPROVE_TGL_RENCANA_BAYAR",data.get("APPROVE_TGL_RENCANA_BAYAR"));
                paramDetail.put("STATUS_TRACKING",data.get("STATUS_TRACKING"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);

            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/rekap_invoice_salah.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }

    @RequestMapping(value = "/reverse_gagal_to_sap", method = RequestMethod.POST)
    public Map<String, Object> reverseSap(
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value = "pLineItem", defaultValue = "") String pLineItem,
            @RequestParam(value = "pKet", defaultValue = "") String pKet,
            @RequestParam(value = "pOssId", defaultValue = "") String pOssId,
            @RequestParam(value = "pGroupId", defaultValue = "") String pGroupId

    ) {
        AppUtils.getLogger(this).info("pCompCode edit data: {}", pCompCode);
//        AppUtils.getLogger(this).info("pDocNo edit data: {}", pDocNo);
//        AppUtils.getLogger(this).info("pFiscYear edit data: {}", pFiscYear);
//        AppUtils.getLogger(this).info("pLineItem edit data: {}", pLineItem);
//        AppUtils.getLogger(this).info("pKet edit data: {}", pKet);
//        AppUtils.getLogger(this).info("pBankPembayar edit data: {}", pBankPembayar);
//        AppUtils.getLogger(this).info("pKeterangan edit data: {}", pKeterangan);
//        AppUtils.getLogger(this).info("pTglRencanaBayar edit data: {}", pTglRencanaBayar);
//        AppUtils.getLogger(this).info("pSumberDana edit data: {}", pSumberDana);
//        AppUtils.getLogger(this).info("pMetodePembayaran edit data: {}", pMetodePembayaran);
        try {
            Map<String, Object> res = invoiceSalahService.reverseGagalToSap(pCompCode, pDocNo, pFiscYear, pLineItem, pKet,WebUtils.getUsernameLogin(), pOssId, pGroupId);

            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
