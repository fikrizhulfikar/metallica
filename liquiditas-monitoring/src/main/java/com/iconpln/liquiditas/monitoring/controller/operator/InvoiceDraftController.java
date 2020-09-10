package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.InvoiceDraftService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Controller;
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
@RequestMapping(path = "/api_operator/rekap_invoice_draft")
public class InvoiceDraftController {
    @Autowired
    private InvoiceDraftService invoiceDraftService;

    @Autowired
    private ResourceLoader resourceLoader;

    private SimpleDateFormat excelDateFormat = new SimpleDateFormat("dd/mm/yyyy");

    @GetMapping(path = "/get_rekap_invoice_draft")
    public Map getInvoiceDraftList(
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
            list = invoiceDraftService.getInvoiceDraftList(((start / length) + 1), length, pTglAwal, pTglAkhir, pBank, pCurrency, pCaraBayar, WebUtils.getUsernameLogin(), sortBy, sortDir, pStatus, pStatusTracking, pSearch);
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

    @RequestMapping(value = "/get_total_tagihan", method = RequestMethod.GET)
    public String getTotalTagihan(@RequestParam(value = "tgl_awal", defaultValue = "") String tglAwal,
                                  @RequestParam(value = "tgl_akhir", defaultValue = "") String tglAkhir,
                                  @RequestParam(value = "currency", defaultValue = "ALL") String currency,
                                  @RequestParam(value = "caraBayar", defaultValue = "ALL") String caraBayar,
                                  @RequestParam(value = "bank", defaultValue = "ALL") String bank,
                                  @RequestParam(value = "search", defaultValue = "") String search) {
        BigDecimal result =  invoiceDraftService.getTotalTagihan(tglAwal, tglAkhir, currency, caraBayar, bank, WebUtils.getUsernameLogin(), search);
        String formatted = AppUtils.getInstance().formatDecimalCurrency(result);
        return formatted;
    }

    @RequestMapping(value = "/xls/{pTglAwal}/{pTglAkhir}/{pCurr}/{pCaraBayar}/{pBank}/{pStatus}/{pStatusTracking}", method = RequestMethod.GET)
    public String export(
            @PathVariable String pTglAwal,
            @PathVariable String pTglAkhir,
            @PathVariable String pCurr,
            @PathVariable String pCaraBayar,
            @PathVariable String pBank,
            @PathVariable String pStatus,
            @PathVariable String pStatusTracking,
            HttpServletRequest request,
            HttpServletResponse response) {
        try {
            SimpleDateFormat dateParser = new SimpleDateFormat("yyyymmdd");
            String pattern = "###,###.###";
            DecimalFormat df  = new DecimalFormat(pattern);
            String tglAwal = "";
            String tglAkhir = "";

            if (!pTglAwal.equals("null")) {
                tglAwal = pTglAwal;
            }
            if (!pTglAkhir.equals("null")) {
                tglAkhir = pTglAkhir;
            }

            String title = "REKAP INVOICE DRAFT (STATUS 2)";
            String namaFile = "rekap_invoice_draft.xls";

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + namaFile + "\"");

            List<Map<String, Object>> listData = invoiceDraftService.getAllpembayaranInvoiceDraft(WebUtils.getUsernameLogin(), tglAwal.replaceAll("-", "/"), tglAkhir.replaceAll("-", "/"), pCurr, pCaraBayar, pBank, pStatus, pStatusTracking);

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
                paramDetail.put("NAMA_HOUSE_BANK", data.get("NAMA_BANK"));
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
                paramDetail.put("NAMA_CASHCODE",data.get("NAMA_CASHCODE"));
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
                paramDetail.put("SPREAD_VALUE",data.get("SPREAD_VAL"));
                paramDetail.put("APPROVE_TGL_RENCANA_BAYAR",data.get("APPROVE_TGL_RENCANA_BAYAR"));
                paramDetail.put("STATUS_TRACKING",data.get("STATUS_TRACKING"));
                paramDetail.put("STATUS",data.get("STATUS"));
                paramDetail.put("POSISI", data.get("POSISI"));
                paramDetail.put("NOMINAL_DI_BAYAR", data.get("NOMINAL_DI_BAYAR"));
                paramDetail.put("JENIS_TRANSAKSI", data.get("JENIS"));
                listDetail.add(paramDetail);
            }
            param.put("DETAILS", listDetail);

            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/rekap_invoice_draft.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :" + e.getMessage();
        }
    }

    @RequestMapping(value = "/get_column", method = RequestMethod.GET)
    public Map getColumn() {
        Map data = new HashMap();
        try {
            data.put("data", invoiceDraftService.getColumn(WebUtils.getUsernameLogin()));
            return data;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/save_column", method = RequestMethod.POST)
    public Map saveColumn(@RequestParam("nomor") Integer nomor,
                          @RequestParam("ket") Integer ket,
                          @RequestParam("doc_no") Integer doc_no,
                          @RequestParam("doc_date2") Integer doc_date2,
                          @RequestParam("rev_with") Integer rev_with,
                          @RequestParam("rev_year") Integer rev_year,
                          @RequestParam("post_date2") Integer post_date2,
                          @RequestParam("base_date") Integer base_date,
                          @RequestParam("entry_date2") Integer entry_date2,
                          @RequestParam("doc_type") Integer doc_type,
                          @RequestParam("fisc_year") Integer fisc_year,
                          @RequestParam("doc_hdr_txt") Integer doc_hdr_txt,
                          @RequestParam("reference") Integer reference,
                          @RequestParam("tgl_tagihan_diterima") Integer tgl_tagihan_diterima,
                          @RequestParam("comp_code") Integer comp_code,
                          @RequestParam("bus_area") Integer bus_area,
                          @RequestParam("currency") Integer currency,
                          @RequestParam("exch_rate") Integer exch_rate,
                          @RequestParam("line_item") Integer line_item,
                          @RequestParam("dr_cr_ind") Integer dr_cr_ind,
                          @RequestParam("spec_gl") Integer spec_gl,
                          @RequestParam("gl_acct") Integer gl_acct,
                          @RequestParam("amt_tc") Integer amt_tc,
                          @RequestParam("amt_lc") Integer amt_lc,
                          @RequestParam("amt_with_base_tc") Integer amt_with_base_tc,
                          @RequestParam("amt_with_tc") Integer amt_with_tc,
                          @RequestParam("amt_with_base_lc") Integer amt_with_base_lc,
                          @RequestParam("amt_with_lc") Integer amt_with_lc,
                          @RequestParam("amount") Integer amount,
                          @RequestParam("acct_type") Integer acct_type,
                          @RequestParam("assignment") Integer assignment,
                          @RequestParam("item_text") Integer item_text,
                          @RequestParam("customer") Integer customer,
                          @RequestParam("vendor") Integer vendor,
                          @RequestParam("term_pmt") Integer term_pmt,
                          @RequestParam("due_on") Integer due_on,
                          @RequestParam("reference_key") Integer reference_key,
                          @RequestParam("pmt_ind") Integer pmt_ind,
                          @RequestParam("trans_type") Integer trans_type,
                          @RequestParam("spread_val") Integer spread_val,
                          @RequestParam("pmt_block") Integer pmt_block,
                          @RequestParam("house_bank") Integer house_bank,
                          @RequestParam("no_rek_house_bank") Integer no_rek_house_bank,
                          @RequestParam("prtnr_bank_type") Integer prtnr_bank_type,
                          @RequestParam("bank_key") Integer bank_key,
                          @RequestParam("bank_account") Integer bank_account,
                          @RequestParam("account_holder") Integer account_holder,
                          @RequestParam("cost_ctr") Integer cost_ctr,
                          @RequestParam("int_order") Integer int_order,
                          @RequestParam("wbs_num") Integer wbs_num,
                          @RequestParam("cash_code") Integer cash_code,
                          @RequestParam("po_num") Integer po_num,
                          @RequestParam("po_item") Integer po_item,
                          @RequestParam("ref_key1") Integer ref_key1,
                          @RequestParam("ref_key2") Integer ref_key2,
                          @RequestParam("ref_key3") Integer ref_key3,
                          @RequestParam("oi_ind") Integer oi_ind,
                          @RequestParam("tpba") Integer tpba,
                          @RequestParam("metode_pembayaran") Integer metode_pembayaran,
                          @RequestParam("tgl_rencana_bayar") Integer tgl_rencana_bayar,
                          @RequestParam("oss_id") Integer oss_id,
                          @RequestParam("group_id") Integer group_id,
                          @RequestParam("bank_byr") Integer bank_byr,
                          @RequestParam("curr_bayar") Integer curr_bayar,
                          @RequestParam("amount_bayar") Integer amount_bayar,
                          @RequestParam("bank_benef") Integer bank_benef,
                          @RequestParam("no_rek_benef") Integer no_rek_benef,
                          @RequestParam("nama_benef") Integer nama_benef,
                          @RequestParam("tgl_act_bayar") Integer tgl_act_bayar,
                          @RequestParam("sumber_dana") Integer sumber_dana,
                          @RequestParam("partial_ind") Integer partial_ind,
                          @RequestParam("keterangan") Integer keterangan,
                          @RequestParam("status_tracking") Integer status_tracking,
                          @RequestParam("corp_pmt") Integer corp_pmt,
                          @RequestParam("inq_customer_name") Integer inq_customer_name,
                          @RequestParam("inq_account_number") Integer inq_account_number,
                          @RequestParam("retrieval_ref_number") Integer retrieval_ref_number,
                          @RequestParam("customer_ref_number") Integer customer_ref_number,
                          @RequestParam("confirmation_code") Integer confirmation_code,
                          @RequestParam("verified_by") Integer verified_by,
                          @RequestParam("verified_on") Integer verified_on,
                          @RequestParam("no_giro") Integer no_giro
    ) {
        Map data = new HashMap();
        try {
            String result = invoiceDraftService.saveColumn(WebUtils.getUsernameLogin(),
                    nomor,
                    ket,
                    comp_code,
                    doc_no,
                    fisc_year,
                    doc_type,
                    doc_date2,
                    post_date2,
                    entry_date2,
                    reference,
                    rev_with,
                    rev_year,
                    doc_hdr_txt,
                    currency,
                    exch_rate,
                    reference_key,
                    pmt_ind,
                    trans_type,
                    spread_val,
                    line_item,
                    oi_ind,
                    acct_type,
                    spec_gl,
                    bus_area,
                    tpba,
                    amt_lc,
                    amt_tc,
                    amt_with_base_tc,
                    amount,
                    amt_with_tc,
                    assignment,
                    item_text,
                    cost_ctr,
                    gl_acct,
                    customer,
                    vendor,
                    base_date,
                    term_pmt,
                    due_on,
                    pmt_block,
                    house_bank,
                    prtnr_bank_type,
                    bank_key,
                    bank_account,
                    account_holder,
                    po_num,
                    po_item,
                    ref_key1,
                    ref_key2,
                    ref_key3,
                    int_order,
                    wbs_num,
                    cash_code,
                    dr_cr_ind,
                    corp_pmt,
                    amt_with_base_lc,
                    amt_with_lc,
                    metode_pembayaran,
                    keterangan,
                    status_tracking,
                    no_rek_house_bank,
                    inq_customer_name,
                    inq_account_number,
                    retrieval_ref_number,
                    customer_ref_number,
                    confirmation_code,
                    tgl_act_bayar,
                    oss_id,
                    group_id,
                    sumber_dana,
                    tgl_rencana_bayar,
                    bank_byr,
                    curr_bayar,
                    partial_ind,
                    amount_bayar,
                    bank_benef,
                    no_rek_benef,
                    nama_benef,
                    verified_by,
                    verified_on,
                    tgl_tagihan_diterima,
                    no_giro
            );
            data.put("data", result);
        } catch (Exception e) {
            data.put("data", "Gagal menyimpan");
            AppUtils.getLogger(this).debug("Error: {}", e.getMessage());
        }
        return data;
    }
}
