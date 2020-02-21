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
                .withFunctionName("");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_comp_code", insData.get(""))
                .addValue("p_doc_no", insData.get(""))
                .addValue("p_fisc_year", insData.get(""))
                .addValue("p_doc_type", insData.get(""))
                .addValue("p_doc_date", insData.get(""))
                .addValue("p_post_date", insData.get(""))
                .addValue("p_entry_date", insData.get(""))
                .addValue("p_reference", insData.get(""))
                .addValue("p_rev_with", insData.get(""))
                .addValue("p_rev_year", insData.get(""))
                .addValue("p_doc_hdr_txt", insData.get(""))
                .addValue("p_currency", insData.get(""))
                .addValue("p_exch_rate", insData.get(""))
                .addValue("p_reference_key", insData.get(""))
                .addValue("p_pmt_ind", insData.get(""))
                .addValue("p_trans_type", insData.get(""))
                .addValue("p_spread_val", insData.get(""))
                .addValue("p_oss_id", insData.get(""))
                .addValue("p_group_id", insData.get(""))
                .addValue("p_sumber_dana", insData.get(""))
                .addValue("p_tgl_rencana_byr", insData.get(""))
                .addValue("p_bank_byr", insData.get(""))
                .addValue("p_curr_bayar", insData.get(""))
                .addValue("p_partial_ind", insData.get(""))
                .addValue("p_amount_bayar", insData.get(""))
                .addValue("p_bank_benef", insData.get(""))
                .addValue("p_no_rek_benef", insData.get(""))
                .addValue("p_nama_benef", insData.get(""))
                .addValue("p_verified_by", insData.get(""))
                .addValue("p_verified_on", insData.get(""))
                .addValue("out_msg", OracleTypes.VARCHAR);

        List<Map<String, Object>> out = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, param);
        return out;
    }

    public List<Map<String, Object>> insertHrPayableItem(Map<String, String> insData){
        List<Map<String, Object>> result = new ArrayList<>();

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("",insData.get("acct_type"))
                .addValue("", insData.get("amt_lc"))
                .addValue("",insData.get("amt_tc"))
                .addValue("", insData.get("amt_with_base_lc"))
                .addValue("",insData.get("amt_with_base_tc"))
                .addValue("", insData.get("amt_with_lc"))
                .addValue("",insData.get("amt_with_tc"))
                .addValue("", insData.get("assignment"))
                .addValue("",insData.get("base_date"))
                .addValue("", insData.get("bus_area"))
                .addValue("",insData.get("cash_code"))
                .addValue("", insData.get("comp_code"))
                .addValue("",insData.get("corp_pmt"))
                .addValue("", insData.get("cost_ctr"))
                .addValue("",insData.get("customer"))
                .addValue("", insData.get("doc_no"))
                .addValue("",insData.get("dr_cr_ind"))
                .addValue("", insData.get("due_on"))
                .addValue("",insData.get("fisc_year"))
                .addValue("", insData.get("gl_acct"))
                .addValue("",insData.get("house_bank"))
                .addValue("", insData.get("int_order"))
                .addValue("",insData.get("item_text"))
                .addValue("",insData.get("line_item"))
                .addValue("",insData.get("oi_ind"))
                .addValue("", insData.get("pmt_block"))
                .addValue("",insData.get("po_item"))
                .addValue("", insData.get("po_num"))
                .addValue("",insData.get("prtnr_bank_type"))
                .addValue("", insData.get("ref_key1"))
                .addValue("",insData.get("ref_key2"))
                .addValue("",insData.get("ref_key3"))
                .addValue("", insData.get("spec_gl"))
                .addValue("",insData.get("term_pmt"))
                .addValue("", insData.get("tpba"))
                .addValue("",insData.get("vendor"))
                .addValue("", insData.get("wbs_num"));
        return result;

    }
}
