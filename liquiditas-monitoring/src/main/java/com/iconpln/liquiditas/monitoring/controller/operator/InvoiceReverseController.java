package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.InvoiceReverseService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import com.sun.org.apache.xalan.internal.xsltc.compiler.SourceLoader;
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
@RequestMapping(path = "api_operator/rekap_invoice_reverse")
public class InvoiceReverseController {
    @Autowired
    private InvoiceReverseService invoiceReverseService;

    @Autowired
    private ResourceLoader resourceLoader;

    private SimpleDateFormat excelDateFormat = new SimpleDateFormat("dd/mm/yyyy");

    @GetMapping(path = "get_invoice_reverse")
    public Map getInvoiceReverse(
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
    ){
        String sortBy = parseColumn(sortIndex);
        sortDir = sortDir.equalsIgnoreCase("DESC") ? "DESC" : "ASC";
        if (sortBy.equalsIgnoreCase("UPDATE_DATE")) {
            sortDir = "DESC";
        }
        List<Map<String, Object>> list = new ArrayList<>();
        try {
            list = invoiceReverseService.getListInvoiceReverse(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pCaraBayar, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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

    @RequestMapping(value = "/xls_reverse", method = RequestMethod.GET)
    public String export(
            HttpServletRequest request,
            HttpServletResponse response) {
        try {
            SimpleDateFormat dateParser = new SimpleDateFormat("yyyymmdd");
            String pattern = "###,###.###";
            DecimalFormat df  = new DecimalFormat(pattern);
            String tglAwal = "";
            String tglAkhir = "";

            String title = "REKAP INVOICE REVERSED";
            String namaFile = "rekap_invoice_reversed.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = invoiceReverseService.getAllXlsReversed();

            Map param = new HashMap();
            List<Map<String, Object>> listDetail = new ArrayList<>();
            System.out.println("List_Excel_data : "+listData.toString());

            param.put("TITLE", title);
            for (Map data : listData) {
                Map paramDetail = new HashMap();
                paramDetail.put("NO",data.get("ROW_NUMBER"));
                paramDetail.put("ID_PAYMENT_STATUS", data.get("ID_PAYMENT_STATUS"));
                paramDetail.put("DOC_NO",data.get("DOC_NO"));
                paramDetail.put("COMP_CODE",data.get("COMP_CODE"));
                paramDetail.put("DOC_DATE",(!data.get("DOC_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("DOC_DATE").toString())) : "-");
                paramDetail.put("FISC_YEAR",data.get("FISC_YEAR"));
                paramDetail.put("INV_STATUS",data.get("INV_STATUS"));
                paramDetail.put("PMT_PROPOSAL_ID",data.get("PMT_PROPOSAL_ID"));
                paramDetail.put("PMT_AMOUNT",data.get("PMT_AMOUNT"));
                paramDetail.put("PMT_RESIDUAL_IND", data.get("PMT_RESIDUAL_IND"));
                paramDetail.put("PMT_EXCHANGE_RATE",data.get("PMT_EXCHANGE_RATE"));
                paramDetail.put("PMT_CURRENCY",data.get("PMT_CURRENCY"));
                paramDetail.put("PMT_DATE",(!data.get("PMT_DATE").toString().equals("-")) ? excelDateFormat.format(dateParser.parse(data.get("PMT_DATE").toString())) : "-");
                paramDetail.put("PMT_HOUSE_BANK",data.get("PMT_HOUSE_BANK"));
                paramDetail.put("PMT_BUSINESS_AREA",data.get("PMT_BUSINESS_AREA"));
                paramDetail.put("PMT_CASH_CODE",data.get("PMT_CASH_CODE"));
                paramDetail.put("PMT_SUMBER_DANA",data.get("PMT_SUMBER_DANA"));
                paramDetail.put("REMARKS",data.get("REMARKS"));
                paramDetail.put("GROUP_ID",data.get("GROUP_ID"));
                listDetail.add(paramDetail);
            }

            param.put("DETAILS", listDetail);
            System.out.println("PARAMS : "+param);
            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/rekap_invoice_reverse.xls").getInputStream();
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
