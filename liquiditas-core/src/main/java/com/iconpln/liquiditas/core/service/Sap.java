package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.alt.AltException;

import org.apache.chemistry.opencmis.commons.impl.json.JSONArray;
import org.apache.chemistry.opencmis.commons.impl.json.JSONObject;
import org.apache.chemistry.opencmis.commons.impl.json.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Repository;
import spark.utils.IOUtils;

import java.io.IOException;

import java.io.InputStream;
import java.math.BigDecimal;
import java.net.URISyntaxException;

import java.text.SimpleDateFormat;
import java.util.*;

// Irba Fairuz
@Repository
public class Sap {
    JSONParser parser = new JSONParser();
    org.apache.chemistry.opencmis.commons.impl.json.JSONArray arr = null;
    org.apache.chemistry.opencmis.commons.impl.json.JSONArray arrLines = null;
    org.apache.chemistry.opencmis.commons.impl.json.JSONArray arrLines2 = null;
    org.apache.chemistry.opencmis.commons.impl.json.JSONArray arrLines3 = null;
    Map<String, String> condition = new HashMap<>();

    HashMap<String, Object> param = new HashMap<>();

    SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
    Date date = new Date();
    private static final String TAG = Sap.class.getName();

    @Autowired
    private SapService sapService;


    // CLEAR, DELETE CLEAR
    public Object getApInvoice (String pCompanyCode,String pBusArea,String pDocNo,String pFiscYear, String pDatefrom, String pDateTo) throws IOException, URISyntaxException, AltException {
        try {
            param.put("comp_code",pCompanyCode);
            param.put("bus_area",pBusArea);
            param.put("doc_no",pDocNo);
            param.put("fiscal_year",pFiscYear);
            param.put("date_from",pDatefrom);
            param.put("date_to",pDateTo);

            Sapmaster sapmaster = new Sapmaster();

//            ClassLoader classLoader = Sap.class.getClassLoader();
//            InputStream inputStream = classLoader.getResourceAsStream("files/ApKateLuDeh.json");
//            String result = IOUtils.toString(inputStream);
//
//            System.out.println("Stream Cok! : "+result);
//            try {
//
//            }catch (Exception e){
//                e.printStackTrace();
//            }
//            sapmaster.getDataApInvoice(param);
            String list = "["+sapmaster.getDataApInvoice(param)+"]";
            System.out.println("LIST :"+list);
            arr = (org.apache.chemistry.opencmis.commons.impl.json.JSONArray) parser.parse(list);

            System.out.println("ARR:"+arr);
            List<Map<String, Object>> out = new ArrayList<>();
            int countter = 0 ;

            System.out.println("ARR SIZE :"+arr.size());
            for(int i=0; i<arr.size(); i++){

                org.apache.chemistry.opencmis.commons.impl.json.JSONObject jsonObject = (org.apache.chemistry.opencmis.commons.impl.json.JSONObject) arr.get(i);
                arrLines = (org.apache.chemistry.opencmis.commons.impl.json.JSONArray) parser.parse(String.valueOf(jsonObject.get("HEADER_DATA")));
                System.out.println("Arrlines Siza:"+arrLines.size());
                System.out.println("Arrlines Head:"+arrLines);

                for(int j=0; j < arrLines.size(); j++){
                    org.apache.chemistry.opencmis.commons.impl.json.JSONObject jsonObjectLines = (org.apache.chemistry.opencmis.commons.impl.json.JSONObject) arrLines.get(j);
                    String comp_code = String.valueOf(jsonObjectLines.get("COMP_CODE"));
                    String currency = String.valueOf(jsonObjectLines.get("CURRENCY"));
                    String doc_date = String.valueOf(jsonObjectLines.get("DOC_DATE"));
                    String doc_hdr_txt = String.valueOf(jsonObjectLines.get("DOC_HDR_TXT"));
                    String doc_no = String.valueOf(jsonObjectLines.get("DOC_NO"));
                    String doc_type = String.valueOf(jsonObjectLines.get("DOC_TYPE"));
                    String entry_date = String.valueOf(jsonObjectLines.get("ENTRY_DATE"));
                    String exch_rate = String.valueOf(jsonObjectLines.get("EXCH_RATE")).trim();
                    String fisc_year = String.valueOf(jsonObjectLines.get("FISC_YEAR"));
                    String pmt_ind = String.valueOf(jsonObjectLines.get("PMT_IND"));
                    String post_date = String.valueOf(jsonObjectLines.get("POST_DATE"));
                    String reference = String.valueOf(jsonObjectLines.get("REFERENCE"));
                    String reference_key = String.valueOf(jsonObjectLines.get("REFERENCE_KEY"));
                    String rev_with = String.valueOf(jsonObjectLines.get("REV_WITH"));
                    String rev_year = String.valueOf(jsonObjectLines.get("REV_YEAR"));
                    String spread_val = String.valueOf(jsonObjectLines.get("SPREAD_VAL"));
                    String trans_type = String.valueOf(jsonObjectLines.get("TRANS_TYPE"));
                    String oss_Id = String.valueOf(jsonObjectLines.get("OSS_ID"));
                    String group_id = String.valueOf(jsonObjectLines.get("GROUP_ID"));
                    String sumber_dana = String.valueOf(jsonObjectLines.get("SUMBER_DANA"));
                    String tgl_rencana_bayar = String.valueOf(jsonObjectLines.get("TGL_RENCANA_BYR"));
                    String bank_bayar = String.valueOf(jsonObjectLines.get("BANK_BYR"));
                    String curr_byr = String.valueOf(jsonObjectLines.get("CURR_BYR"));
                    String partial_ind = String.valueOf(jsonObjectLines.get("PARTIAL_IND"));
                    String amount_bayar = String.valueOf(jsonObjectLines.get("AMOUNT_BYR")).trim();
                    String bank_benef = String.valueOf(jsonObjectLines.get("BANK_BNF"));
                    String norek_benef = String.valueOf(jsonObjectLines.get("NOREK_BNF"));
                    String nama_benef = String.valueOf(jsonObjectLines.get("NAMA_BNF"));
                    String verified_by = String.valueOf(jsonObjectLines.get("VERIFIED_BY"));
                    String verified_on = String.valueOf(jsonObjectLines.get("VERIFIED_ON"));

                    System.out.println("Exch Rate : "+exch_rate);
                    System.out.println("Amount Bayar : "+amount_bayar);


                    try {
                        out = sapService.insertApInvoiceHead(comp_code, doc_no, fisc_year, doc_type, doc_date, post_date, entry_date, reference, rev_with, rev_year,
                                doc_hdr_txt, currency, exch_rate, reference_key, pmt_ind, trans_type, spread_val, oss_Id, group_id,sumber_dana, tgl_rencana_bayar, bank_bayar,
                                curr_byr, partial_ind, amount_bayar, bank_benef, norek_benef, nama_benef, verified_by, verified_on);
                        countter =+1;
                    }catch (Exception e){
                        e.printStackTrace();
                    }
//                    System.out.println("Udah Diinsert Cuy!");
                }
                System.out.println("Loop Head Ap Invoice :"+ countter);
                arrLines2 = (org.apache.chemistry.opencmis.commons.impl.json.JSONArray) parser.parse(String.valueOf(jsonObject.get("ITEM_DATA")));
                System.out.println("Arrlines Size:"+arrLines2.size());
                System.out.println("Arrlines Head:"+arrLines2);

                countter = 0;
                for(int j=0; j < arrLines2.size(); j++){
                    condition.clear();
                    org.apache.chemistry.opencmis.commons.impl.json.JSONObject jsonObjectLines2 = (org.apache.chemistry.opencmis.commons.impl.json.JSONObject) arrLines2.get(j);
                    condition.put("acct_type",String.valueOf(jsonObjectLines2.get("ACCT_TYPE")));
                    condition.put("amt_lc",String.valueOf(jsonObjectLines2.get("AMT_LC")).trim());
                    condition.put("amt_tc",String.valueOf(jsonObjectLines2.get("AMT_TC")).trim());
                    condition.put("amt_with_base_tc",String.valueOf(jsonObjectLines2.get("AMT_WITH_BASE_TC")).trim());
                    condition.put("amt_with_tc",String.valueOf(jsonObjectLines2.get("AMT_WITH_TC")).trim());
                    condition.put("assignment",String.valueOf(jsonObjectLines2.get("ASSIGNMENT")));
                    condition.put("base_date",String.valueOf(jsonObjectLines2.get("BASE_DATE")));
                    condition.put("bus_area",String.valueOf(jsonObjectLines2.get("BUS_AREA")));
                    condition.put("cash_code",String.valueOf(jsonObjectLines2.get("CASH_CODE")));
                    condition.put("comp_code",String.valueOf(jsonObjectLines2.get("COMP_CODE")));
                    condition.put("corp_pmt",String.valueOf(jsonObjectLines2.get("CORP_PMT")));
                    condition.put("cost_ctr",String.valueOf(jsonObjectLines2.get("COST_CTR")));
                    condition.put("customer",String.valueOf(jsonObjectLines2.get("CUSTOMER")));
                    condition.put("doc_no",String.valueOf(jsonObjectLines2.get("DOC_NO")));
                    condition.put("dr_cr_ind",String.valueOf(jsonObjectLines2.get("DR_CR_IND")));
                    condition.put("due_on",String.valueOf(jsonObjectLines2.get("DUE_ON")));
                    condition.put("fisc_year",String.valueOf(jsonObjectLines2.get("FISC_YEAR")));
                    condition.put("gl_acct",String.valueOf(jsonObjectLines2.get("GL_ACCT")));
                    condition.put("house_bank",String.valueOf(jsonObjectLines2.get("HOUSE_BANK")));
                    condition.put("int_order",String.valueOf(jsonObjectLines2.get("INT_ORDER")));
                    condition.put("item_text",String.valueOf(jsonObjectLines2.get("ITEM_TEXT")));
                    condition.put("line_item",String.valueOf(jsonObjectLines2.get("LINE_ITEM")));
                    condition.put("oi_ind",String.valueOf(jsonObjectLines2.get("OI_IND")));
                    condition.put("pmt_block",String.valueOf(jsonObjectLines2.get("PMT_BLOCK")));
                    condition.put("po_item",String.valueOf(jsonObjectLines2.get("PO_ITEM")));
                    condition.put("po_num",String.valueOf(jsonObjectLines2.get("PO_NUM")));
                    condition.put("prtnr_bank_type",String.valueOf(jsonObjectLines2.get("PRTNR_BANK_TYPE")));
                    condition.put("ref_key1",String.valueOf(jsonObjectLines2.get("REF_KEY1")));
                    condition.put("ref_key2",String.valueOf(jsonObjectLines2.get("REF_KEY2")));
                    condition.put("ref_key3",String.valueOf(jsonObjectLines2.get("REF_KEY3")));
                    condition.put("spec_gl",String.valueOf(jsonObjectLines2.get("SPEC_GL")));
                    condition.put("term_pmt",String.valueOf(jsonObjectLines2.get("TERM_PMT")));
                    condition.put("tpba",String.valueOf(jsonObjectLines2.get("TPBA")));
                    condition.put("vendor",String.valueOf(jsonObjectLines2.get("VENDOR")));
                    condition.put("wbs_num",String.valueOf(jsonObjectLines2.get("WBS_NUM")));
                    condition.put("amt_with_base_lc",String.valueOf(jsonObjectLines2.get("AMT_WITH_BASE_LC")).trim());
                    condition.put("amt_with_lc", String.valueOf(jsonObjectLines2.get("AMT_WITH_LC")).trim());
                    condition.put("m_date_date",param.get("date_from").toString());
                    System.out.println("Ini Condition : "+condition);
                    try{
                        sapService.insertApInvoiceItem(condition);
                        countter++;
                    }catch (Exception e){
                        e.printStackTrace();
                    }
                }
                System.out.println("Loop Item Ap Invoice : "+countter);
            }
            return out;
        }catch (Exception e){
            return e;
        }
    }

    //
    public Map<String, Object> getHrPayable (String comp_code, String bus_area, String doc_no, String fiscal_year, String date_from, String date_to) throws IOException, URISyntaxException, AltException {
        Map<String, Object> final_result = new HashMap<>();
        try {

            Sapmaster sapmaster = new Sapmaster();
            param.put("comp_code",comp_code);
            param.put("bus_area", bus_area);
            param.put("doc_no", doc_no);
            param.put("fiscal_year", fiscal_year);
            param.put("date_from",date_from);
            param.put("date_to", date_to);

            String list = "["+sapmaster.getDataHrPayable(param)+"]";

            arr = (JSONArray) parser.parse(list);
            int counter = 0;

            for(int i=0; i<arr.size(); i++){
                org.apache.chemistry.opencmis.commons.impl.json.JSONObject jsonObject = (org.apache.chemistry.opencmis.commons.impl.json.JSONObject) arr.get(i);
                arrLines = (JSONArray) parser.parse(String.valueOf(jsonObject.get("HEADER_DATA")));
                for(int j=0; j<arrLines.size(); j++){
                    condition.clear();
                    org.apache.chemistry.opencmis.commons.impl.json.JSONObject jsonObjectLines = (org.apache.chemistry.opencmis.commons.impl.json.JSONObject) arrLines.get(j);
                    condition.put("comp_code",String.valueOf(jsonObjectLines.get("COMP_CODE")));
                    condition.put("currency",String.valueOf(jsonObjectLines.get("CURRENCY")));
                    condition.put("doc_date",String.valueOf(jsonObjectLines.get("DOC_DATE")));
                    condition.put("doc_hdr_txt",String.valueOf(jsonObjectLines.get("DOC_HDR_TXT")));
                    condition.put("doc_no",String.valueOf(jsonObjectLines.get("DOC_NO")));
                    condition.put("doc_type",String.valueOf(jsonObjectLines.get("DOC_TYPE")));
                    condition.put("entry_date",String.valueOf(jsonObjectLines.get("ENTRY_DATE")));
                    condition.put("exch_rate",String.valueOf(jsonObjectLines.get("EXCH_RATE")).trim());
                    condition.put("fisc_year",String.valueOf(jsonObjectLines.get("FISC_YEAR")));
                    condition.put("pmt_ind",String.valueOf(jsonObjectLines.get("PMT_IND")));
                    condition.put("post_date",String.valueOf(jsonObjectLines.get("POST_DATE")));
                    condition.put("reference",String.valueOf(jsonObjectLines.get("REFERENCE")));
                    condition.put("reference_key",String.valueOf(jsonObjectLines.get("REFERENCE_KEY")));
                    condition.put("rev_with",String.valueOf(jsonObjectLines.get("REV_WITH")));
                    condition.put("rev_year",String.valueOf(jsonObjectLines.get("REV_YEAR")));
                    condition.put("spread_val",String.valueOf(jsonObjectLines.get("SPREAD_VAL")).trim());
                    condition.put("trans_type",String.valueOf(jsonObjectLines.get("TRANS_TYPE")));
                    condition.put("oss_id",String.valueOf(jsonObjectLines.get("OSS_ID")));
                    condition.put("group_id",String.valueOf(jsonObjectLines.get("GROUP_ID")));
                    condition.put("sumber_dana",String.valueOf(jsonObjectLines.get("SUMBER_DANA")));
                    condition.put("tgl_rencana_byr",String.valueOf(jsonObjectLines.get("TGL_RENCANA_BYR")));
                    condition.put("bank_byr",String.valueOf(jsonObjectLines.get("BANK_BYR")));
                    condition.put("curr_bayar",String.valueOf(jsonObjectLines.get("CURR_BAYAR")));
                    condition.put("partial_ind",String.valueOf(jsonObjectLines.get("PARTIAL_IND")));
                    condition.put("amount_bayar",String.valueOf(jsonObjectLines.get("AMOUNT_BAYAR")));
                    condition.put("bank_benef",String.valueOf(jsonObjectLines.get("BANK_BENEF")));
                    condition.put("no_rek_benef",String.valueOf(jsonObjectLines.get("NO_REK_BENEF")));
                    condition.put("nama_benef",String.valueOf(jsonObjectLines.get("NAMA_BENEF")));
                    condition.put("verified_by",String.valueOf(jsonObjectLines.get("VERIFIED_BY")));
                    condition.put("verified_on",String.valueOf(jsonObjectLines.get("VERIFIED_ON")));

                    try {
                        sapService.insertHrPayableHead(condition);
                        counter++;
                    }catch (Exception e){
                        e.printStackTrace();
                    }
                }
                System.out.println("Loop Header: "+counter);
                counter = 0;
                if (jsonObject.get("ITEM_DATA") != null) {
                    arrLines2 = (JSONArray) parser.parse(String.valueOf(jsonObject.get("ITEM_DATA")));
                    for (int j = 0; j < arrLines2.size(); j++) {
                        condition.clear();
                        org.apache.chemistry.opencmis.commons.impl.json.JSONObject jsonObjectLines2 = (org.apache.chemistry.opencmis.commons.impl.json.JSONObject) arrLines2.get(j);
                        condition.put("acct_type", String.valueOf(jsonObjectLines2.get("ACCT_TYPE")));
                        condition.put("amt_lc", String.valueOf(jsonObjectLines2.get("AMT_LC")).trim());
                        condition.put("amt_tc", String.valueOf(jsonObjectLines2.get("AMT_TC")).trim());
                        condition.put("amt_with_base_lc", String.valueOf(jsonObjectLines2.get("AMT_WITH_BASE_LC")).trim());
                        condition.put("amt_with_base_tc", String.valueOf(jsonObjectLines2.get("AMT_WITH_BASE_TC")).trim());
                        condition.put("amt_with_lc", String.valueOf(jsonObjectLines2.get("AMT_WITH_LC")).trim());
                        condition.put("amt_with_tc", String.valueOf(jsonObjectLines2.get("AMT_WITH_TC")).trim());
                        condition.put("assignment", String.valueOf(jsonObjectLines2.get("ASSIGNMENT")));
                        condition.put("base_date", String.valueOf(jsonObjectLines2.get("BASE_DATE")));
                        condition.put("bus_area", String.valueOf(jsonObjectLines2.get("BUS_AREA")));
                        condition.put("cash_code", String.valueOf(jsonObjectLines2.get("CASH_CODE")));
                        condition.put("comp_code", String.valueOf(jsonObjectLines2.get("COMP_CODE")));
                        condition.put("corp_pmt", String.valueOf(jsonObjectLines2.get("CORP_PMT")));
                        condition.put("cost_ctr", String.valueOf(jsonObjectLines2.get("COST_CTR")));
                        condition.put("customer", String.valueOf(jsonObjectLines2.get("CUSTOMER")));
                        condition.put("doc_no", String.valueOf(jsonObjectLines2.get("DOC_NO")));
                        condition.put("dr_cr_ind", String.valueOf(jsonObjectLines2.get("DR_CR_IND")));
                        condition.put("due_on", String.valueOf(jsonObjectLines2.get("DUE_ON")));
                        condition.put("fisc_year", String.valueOf(jsonObjectLines2.get("FISC_YEAR")));
                        condition.put("gl_acct", String.valueOf(jsonObjectLines2.get("GL_ACCT")));
                        condition.put("house_bank", String.valueOf(jsonObjectLines2.get("HOUSE_BANK")));
                        condition.put("int_order", String.valueOf(jsonObjectLines2.get("INT_ORDER")));
                        condition.put("item_text", String.valueOf(jsonObjectLines2.get("ITEM_TEXT")));
                        condition.put("line_item", String.valueOf(jsonObjectLines2.get("LINE_ITEM")));
                        condition.put("oi_ind", String.valueOf(jsonObjectLines2.get("OI_IND")));
                        condition.put("pmt_block", String.valueOf(jsonObjectLines2.get("PMT_BLOCK")));
                        condition.put("po_item", String.valueOf(jsonObjectLines2.get("PO_ITEM")));
                        condition.put("po_num", String.valueOf(jsonObjectLines2.get("PO_NUM")));
                        condition.put("prtnr_bank_type", String.valueOf(jsonObjectLines2.get("PRTNR_BANK_TYPE")));
                        condition.put("ref_key1", String.valueOf(jsonObjectLines2.get("REF_KEY1")));
                        condition.put("ref_key2", String.valueOf(jsonObjectLines2.get("REF_KEY2")));
                        condition.put("ref_key3", String.valueOf(jsonObjectLines2.get("REF_KEY3")));
                        condition.put("spec_gl", String.valueOf(jsonObjectLines2.get("SPEC_GL")));
                        condition.put("term_pmt", String.valueOf(jsonObjectLines2.get("TERM_PMT")));
                        condition.put("tpba", String.valueOf(jsonObjectLines2.get("TPBA")));
                        condition.put("vendor", String.valueOf(jsonObjectLines2.get("VENDOR")));
                        condition.put("wbs_num", String.valueOf(jsonObjectLines2.get("WBS_NUM")));

                        try {
                            sapService.insertHrPayableItem(condition);
                            counter++;
                        }catch (Exception e){
                            e.printStackTrace();
                        }
                    }
                }
                System.out.println("Loop Item : "+counter);
            }

        }catch (Exception e){
            e.printStackTrace();
        }
        return final_result;
    }
}