package com.iconpln.liquiditas.core.service;

import oracle.jdbc.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;
import sun.java2d.pipe.SpanShapeRenderer;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class SapService {

    @Autowired
    DataSource dataSource;

    private JdbcTemplate getJdbcTemplate() {return new JdbcTemplate(dataSource);}

    public List<Map<String, Object>> insertApInvoiceHead(
            String pCompCode, String pDocNo, String pFiscYear, String pDocType, String pDocDate, String pPostDate, String pEntryDate,
            String pReference, String pRevWith, String pRevYear, String pDocHdrText, String pCurrency, String pExcRate,
            String pReferenceKey, String pPmtInd, String pTransType, String pSpreadVal, String pOssId, String pGroupId, String pSumberDana,
            String pTglRencanBayar, String pBankBayar, String pCurrBayar, String pPartialInd, String pAmountBayar, String pBankBenef,
            String pNoRekBenef, String pNamaBenef, String pVerifiedBy, String pVerifiedOn
            ){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("sap_invoice_head_ins");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_comp_code", pCompCode)
                .addValue("p_doc_no", pDocNo)
                .addValue("p_fisc_year", pFiscYear)
                .addValue("p_doc_type", pDocType)
                .addValue("p_doc_date", pDocDate)
                .addValue("p_post_date", pPostDate)
                .addValue("p_entry_date", pEntryDate)
                .addValue("p_reference", pReference)
                .addValue("p_rev_with", pRevWith)
                .addValue("p_rev_year", pRevYear)
                .addValue("p_doc_hdr_txt", pDocHdrText)
                .addValue("p_currency", pCurrency)
                .addValue("p_exch_rate", pExcRate)
                .addValue("p_reference_key", pReferenceKey)
                .addValue("p_pmt_ind", pPmtInd)
                .addValue("p_trans_type", pTransType)
                .addValue("p_spread_val", pSpreadVal)
                .addValue("p_oss_id", pOssId)
                .addValue("p_group_id", pGroupId)
                .addValue("p_sumber_dana", pSumberDana)
                .addValue("p_tgl_rencana_byr", pTglRencanBayar)
                .addValue("p_bank_byr", pBankBayar)
                .addValue("p_curr_bayar", pCurrBayar)
                .addValue("p_partial_ind", pPartialInd)
                .addValue("p_amount_bayar", pAmountBayar)
                .addValue("p_bank_benef",pBankBenef)
                .addValue("p_no_rek_benef", pNoRekBenef)
                .addValue("p_nama_benef", pNamaBenef)
                .addValue("p_verified_by", pVerifiedBy)
                .addValue("p_verified_on", pVerifiedOn)
                .addValue("out_msg", OracleTypes.VARCHAR);

        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        return out;
    }

    public List<Map<String, Object>> insertApInvoiceItem(Map<String, String> insData){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("sap_invoice_item_ins");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_comp_code", insData.get("comp_code"))
                .addValue("p_doc_no",insData.get("doc_no"))
                .addValue("p_fisc_year", insData.get("fisc_year"))
                .addValue("p_line_item", insData.get("line_item"))
                .addValue("p_oi_ind",insData.get("oi_ind"))
                .addValue("p_acct_type", insData.get("acc_type"))
                .addValue("p_spec_gl",insData.get("spec_type"))
                .addValue("p_bus_area", insData.get("bus_area"))
                .addValue("p_tpba", insData.get("tpba"))
                .addValue("p_amt_lc",insData.get("amt_lc"))
                .addValue("p_amt_tc", insData.get("amt_tc"))
                .addValue("p_amt_with_base_tc", insData.get("amt_with_base_tc"))
                .addValue("p_amt_with_tc",insData.get("amt_with_tc"))
                .addValue("p_assignment", insData.get("assignment"))
                .addValue("p_item_text", insData.get("item_text"))
                .addValue("p_cost_ctr",insData.get("cost_ctr"))
                .addValue("p_gl_acct", insData.get("gl_acct"))
                .addValue("p_customer", insData.get("customer"))
                .addValue("p_vendor",insData.get("vendor"))
                .addValue("p_base_date", insData.get("base_date"))
                .addValue("p_term_pmt", insData.get("term_pmt"))
                .addValue("p_due_on",insData.get("due_on"))
                .addValue("p_pmt_block", insData.get("pmt_block"))
                .addValue("p_house_bank", insData.get("house_bank"))
                .addValue("p_prtnr_bank_type",insData.get("prtnr_bank_type"))
                .addValue("p_po_num", insData.get("po_num"))
                .addValue("p_po_item", insData.get("po_item"))
                .addValue("p_ref_keyp_",insData.get("ref_key1"))
                .addValue("p_ref_key2", insData.get("ref_key2"))
                .addValue("p_ref_key3", insData.get("ref_key3"))
                .addValue("p_int_order", insData.get("int_order"))
                .addValue("p_wbs_num",insData.get("wbs_num"))
                .addValue("p_cash_code", insData.get("cash_code"))
                .addValue("p_corp_pmt", insData.get("corp_pmt"))
                .addValue("p_dr_cr_ind",insData.get("dr_cr_ind"))
                .addValue("p_amt_with_base_lc", insData.get("amt_with_base_lc"))
                .addValue("p_amt_with_lc", insData.get("amt_with_lc"))
                .addValue("p_m_data_date",insData.get("m_data_date"))
                .addValue("out_msg", OracleTypes.VARCHAR);

        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);

        System.out.println("What is the error? : "+out);
        return out;
    }

    public List<Map<String, Object>> insertHrPayableHead(Map<String, String> insData){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("sap_hr_head_ins");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_comp_code", insData.get("comp_code"))
                .addValue("p_doc_no", insData.get("doc_no"))
                .addValue("p_fisc_year", insData.get("fisc_year"))
                .addValue("p_doc_type", insData.get("doc_type"))
                .addValue("p_doc_date", insData.get("doc_date"))
                .addValue("p_post_date", insData.get("post_date"))
                .addValue("p_entry_date", insData.get("entry_date"))
                .addValue("p_reference", insData.get("reference"))
                .addValue("p_rev_with", insData.get("rev_with"))
                .addValue("p_rev_year", insData.get("rev_year"))
                .addValue("p_doc_hdr_txt", insData.get("doc_hdr_txt"))
                .addValue("p_currency", insData.get("currency"))
                .addValue("p_exch_rate", insData.get("exch_rate"))
                .addValue("p_reference_key", insData.get("reference_key"))
                .addValue("p_pmt_ind", insData.get("pmt_ind"))
                .addValue("p_trans_type", insData.get("trans_type"))
                .addValue("p_spread_val", insData.get("spread_val"))
                .addValue("p_oss_id", insData.get("oss_id"))
                .addValue("p_group_id", insData.get("group_id"))
                .addValue("p_sumber_dana", insData.get("sumber_dana"))
                .addValue("p_tgl_rencana_byr", insData.get("tgl_rencana_byr"))
                .addValue("p_bank_byr", insData.get("bank_byr"))
                .addValue("p_curr_bayar", insData.get("curr_bayar"))
                .addValue("p_partial_ind", insData.get("partial_ind"))
                .addValue("p_amount_bayar", insData.get("amount_bayar"))
                .addValue("p_bank_benef", insData.get("bank_benef"))
                .addValue("p_no_rek_benef", insData.get("no_rek_benef"))
                .addValue("p_nama_benef", insData.get("nama_benef"))
                .addValue("p_verified_by", insData.get("verified_by"))
                .addValue("p_verified_on", insData.get("verified_on"))
                .addValue("out_msg", OracleTypes.VARCHAR);

        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        return out;
    }

    public List<Map<String, Object>> insertHrPayableItem(Map<String, String> insData){
        List<Map<String, Object>> result = new ArrayList<>();

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("sap_hr_item_ins");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_acct_type",insData.get("acct_type"))
                .addValue("p_amt_lc", insData.get("amt_lc"))
                .addValue("p_amt_tc",insData.get("amt_tc"))
                .addValue("p_amt_with_base_lc", insData.get("amt_with_base_lc"))
                .addValue("p_amt_with_base_tc",insData.get("amt_with_base_tc"))
                .addValue("p_amt_with_lc", insData.get("amt_with_lc"))
                .addValue("p_amt_with_tc",insData.get("amt_with_tc"))
                .addValue("p_assignment", insData.get("assignment"))
                .addValue("p_base_date",insData.get("base_date"))
                .addValue("p_bus_area", insData.get("bus_area"))
                .addValue("p_cash_code",insData.get("cash_code"))
                .addValue("p_comp_code", insData.get("comp_code"))
                .addValue("p_corp_pmt",insData.get("corp_pmt"))
                .addValue("p_cost_ctr", insData.get("cost_ctr"))
                .addValue("p_customer",insData.get("customer"))
                .addValue("p_doc_no", insData.get("doc_no"))
                .addValue("p_dr_cr_ind",insData.get("dr_cr_ind"))
                .addValue("p_due_on", insData.get("due_on"))
                .addValue("p_fisc_year",insData.get("fisc_year"))
                .addValue("p_gl_acct", insData.get("gl_acct"))
                .addValue("p_house_bank",insData.get("house_bank"))
                .addValue("p_int_order", insData.get("int_order"))
                .addValue("p_item_text",insData.get("item_text"))
                .addValue("p_line_item",insData.get("line_item"))
                .addValue("p_oi_ind",insData.get("oi_ind"))
                .addValue("p_pmt_block", insData.get("pmt_block"))
                .addValue("p_po_item",insData.get("po_item"))
                .addValue("p_po_num", insData.get("po_num"))
                .addValue("p_prtnr_bank_type",insData.get("prtnr_bank_type"))
                .addValue("p_ref_keyp", insData.get("ref_key1"))
                .addValue("p_ref_key2",insData.get("ref_key2"))
                .addValue("p_ref_key3",insData.get("ref_key3"))
                .addValue("p_spec_gl", insData.get("spec_gl"))
                .addValue("p_term_pmt",insData.get("term_pmt"))
                .addValue("p_tpba", insData.get("tpba"))
                .addValue("p_vendor",insData.get("vendor"))
                .addValue("p_wbs_num", insData.get("wbs_num"));

        result = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        return result;

    }
}
