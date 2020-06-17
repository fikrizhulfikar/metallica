package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.AppUtils;
import oracle.jdbc.OracleTypes;
import org.json.JSONObject;
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
    private Map<String, Object> out = new HashMap<>();

    public Map insertToLogTable(){
        Map<String,Object> ok = new HashMap<>();
        return ok;
    }

    public Map<String, Object> insertApInvoiceHead(
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

        out = simpleJdbcCall.execute(param);
        if(!out.get("return").toString().equals("1")){
            System.out.println("masuk tabel penampung ap : Gagal");
            insertApInvoiceHeadGagal(
                    pCompCode, pDocNo, pFiscYear, pDocType, pDocDate, pPostDate, pEntryDate,
                    pReference, pRevWith, pRevYear, pDocHdrText, pCurrency, pExcRate,
                    pReferenceKey, pPmtInd, pTransType, pSpreadVal, pOssId, pGroupId, pSumberDana,
                    pTglRencanBayar, pBankBayar, pCurrBayar, pPartialInd, pAmountBayar, pBankBenef,
                    pNoRekBenef, pNamaBenef, pVerifiedBy, pVerifiedOn);
        }
        AppUtils.getLogger(this).info("insert ap_invoice_head data : {}",out);
        return out;
    }

    public Map<String, Object> insertApInvoiceItem(Map<String, String> insData){
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

        out = simpleJdbcCall.execute(param);
        AppUtils.getLogger(this).info("insert ap_invoice_item data : {}",out);
        return out;
    }

    public Map<String, Object> insertHrPayableHead(Map<String, String> insData){
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

        out = simpleJdbcCall.execute(param);
        if(!out.get("return").toString().equals("1")){
            System.out.println("masuk tabel penampung hr : Gagal");
            insertHrPayableHeadGagal(insData);
        }
        AppUtils.getLogger(this).info("insert hr_payable_head data : {}",out);
        return out;
    }

    public Map<String, Object> insertHrPayableItem(Map<String, String> insData){
        List<Map<String, Object>> result = new ArrayList<>();
//        System.out.println("Jancok kon cok! : "+insData);

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
                .addValue("p_m_data_date",insData.get("m_data_date"))
                .addValue("p_wbs_num", insData.get("wbs_num"));

        out = simpleJdbcCall.execute(param);
        AppUtils.getLogger(this).info("insert hr_payable_item data : {}",out);
        return out;
    }

// ==============================CUSTOMER====================================
    public Map<String, Object> insertCustomer(Map<String, String> insData){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("sap_ins_customer");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_customer_no", insData.get("customer_no"))
                .addValue("p_comp_code", insData.get("comp_code"))
                .addValue("p_cust_acc_grp", insData.get("cust_acc_grp"))
                .addValue("p_customer_name", insData.get("customer_name"))
                .addValue("p_street_no", insData.get("street_no"))
                .addValue("p_postal_code", insData.get("postal_code"))
                .addValue("p_city", insData.get("city"))
                .addValue("p_country", insData.get("country"))
                .addValue("p_customer_tax_no", insData.get("customer_tax_no"))
                .addValue("p_customer_vat_no", insData.get("customer_vat_no"))
                .addValue("p_customer_recon_acct", insData.get("customer_recon_acct"))
                .addValue("p_customer_mgmt_grp", insData.get("customer_mgmt_grp"))
                .addValue("p_customer_pmt_term", insData.get("customer_pmt_term"))
                .addValue("p_customer_pmt_method", insData.get("customer_pmt_method"))
                .addValue("p_customer_email", insData.get("customer_email"))
                .addValue("p_personnel_no","NULL")
                .addValue("out_msg", OracleTypes.VARCHAR);

        out =  simpleJdbcCall.execute(param);
        AppUtils.getLogger(this).info("insert customer main data : {}",out);
        return out;
    }

    public Map<String, Object> insertCustomerBank(Map<String, String> insData){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("sap_ins_customer_bank");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_customer_no",insData.get("customer_no"))
                .addValue("p_bank_country",insData.get("bank_country"))
                .addValue("p_bank_key", insData.get("bank_key"))
                .addValue("p_bank_account",insData.get("bank_account"))
                .addValue("p_partner_bank",insData.get("partner_bank"))
                .addValue("p_account_holder",insData.get("account_holder"))
                .addValue("out_msg",OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(param);
        AppUtils.getLogger(this).info("insert customer bank : {}",out);
        return out;
    }

    public Map<String, Object> insertCustomerWht(Map<String, String> insData){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTR")
                .withFunctionName("sap_ins_customer_wht");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_customer_no",insData.get("customer_no"))
                .addValue("p_comp_code",insData.get("comp_code"))
                .addValue("p_with_tax_type",insData.get("with_tax_type"))
                .addValue("p_with_tax_code",insData.get("with_tax_code"))
                .addValue("p_desc",insData.get("with_tax_type_desc"))
                .addValue("out_msg",OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(param);
        AppUtils.getLogger(this).info("insert customer wht data : {}",out);
        return out;
    }
    //===========================END OF CUSTOMER=============================

    //============================VENDOR=====================================
    public Map<String, Object> insertVendor(Map<String, String> insData){
        Map<String, Object> out;
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("sap_ins_vendor");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_vendor_no",insData.get("vendor_no"))
                .addValue("p_comp_code",insData.get("comp_code"))
                .addValue("p_vend_acc_grp",insData.get("vend_acc_grp"))
                .addValue("p_vendor_name",insData.get("vendor_name"))
                .addValue("p_street_no",insData.get("street_no"))
                .addValue("p_postal_code",insData.get("postal_code"))
                .addValue("p_city",insData.get("city"))
                .addValue("p_country",insData.get("country"))
                .addValue("p_tax_no",insData.get("vendor_tax_no"))
                .addValue("p_vat_no",insData.get("vendor_vat_no"))
                .addValue("p_recon_acct",insData.get("vendor_recon_acct"))
                .addValue("p_cash_mgmt_grp",insData.get("vendor_cash_mgmt_grp"))
                .addValue("p_pmt_term",insData.get("vendor_pmt_term"))
                .addValue("p_method",insData.get("vendor_pmt_method"))
                .addValue("p_mail",insData.get("vendor_mail"))
                .addValue("out_msg",OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(param);
        AppUtils.getLogger(this).info("insert vendor main data : {}",out);
        return out;
    }

    public Map<String, Object> insertVendorBank(Map<String, String> insData){
        Map<String, Object> out;
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("sap_ins_vendor_bank");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_vendor_no",insData.get("vendor_no"))
                .addValue("p_bank_country",insData.get("bank_country"))
                .addValue("p_bank_key",insData.get("bank_key"))
                .addValue("p_bank_account",insData.get("bank_account"))
                .addValue("p_partner_bank",insData.get("partner_bank_type"))
                .addValue("p_account_holder",insData.get("account_holder"))
                .addValue("out_msg",OracleTypes.VARCHAR);

        out = simpleJdbcCall.execute(param);
        AppUtils.getLogger(this).info("insert vendor bank : {}",out);
        return out;
    }

    public Map<String, Object> insertVendorWht(Map<String, String> insData){
        Map<String, Object> out;
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("sap_ins_vendor_wht");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_vendor_no",insData.get("vendor_no"))
                .addValue("p_comp_code",insData.get("comp_code"))
                .addValue("p_with_tax_type",insData.get("with_tax_type"))
                .addValue("p_with_tax_code",insData.get("with_tax_code"))
                .addValue("p_desc",insData.get("desc"))
                .addValue("out_msg",OracleTypes.VARCHAR);

        out = simpleJdbcCall.execute(param);
        AppUtils.getLogger(this).info("insert vendor wht :{}",out);
        return out;
    }
//    ================================END OF VENDOR==============================

    public Map<String, Object> insertPaymentHouseBank(Map<String, String> insData) {
        Map<String, Object> out;
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("sap_ins_house_bank");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_account_id", insData.get("account_id"))
                .addValue("p_bank_account", insData.get("bank_account"))
                .addValue("p_bank_control_key", insData.get("bank_control_key"))
                .addValue("p_bank_country", insData.get("bank_country"))
                .addValue("p_bank_key", insData.get("bank_key"))
                .addValue("p_comp_code", insData.get("comp_code"))
                .addValue("p_contact_person", insData.get("contact_person"))
                .addValue("p_currency", insData.get("currency"))
                .addValue("p_description", insData.get("description"))
                .addValue("p_gl_account", insData.get("gl_account"))
                .addValue("p_house_bank", insData.get("house_bank"))
                .addValue("p_telephone1", insData.get("telephone1"))
                .addValue("out_msg", OracleTypes.VARCHAR);

        out = simpleJdbcCall.execute(param);
        AppUtils.getLogger(this).info("insert payment house bank :{}", out);
        return out;
    }

    public Map<String, Object> insertGeneralBank(Map<String, String> insData) {
        Map<String, Object> out;
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_MASTER")
                .withFunctionName("sap_ins_general_bank");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_bank_country", insData.get("bank_country"))
                .addValue("p_bank_key", insData.get("bank_key"))
                .addValue("p_bank_name", insData.get("bank_name"))
                .addValue("p_bank_no", insData.get("bank_no"))
                .addValue("p_city", insData.get("city"))
                .addValue("p_street", insData.get("street"))
                .addValue("p_swift_code", insData.get("swift_code"))
                .addValue("out_msg", OracleTypes.VARCHAR);

        out = simpleJdbcCall.execute(param);
        AppUtils.getLogger(this).info("insert general bank :{}", out);
        return out;
    }

    public Map<String, Object> insertHrPayableHeadGagal(Map<String, String> insData){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("sap_hr_head_gagal");
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

        out = simpleJdbcCall.execute(param);
        AppUtils.getLogger(this).info("insert hr_payable_head data_gagal : {}",out);
        return out;
    }

    public Map<String, Object> insertApInvoiceHeadGagal(
            String pCompCode, String pDocNo, String pFiscYear, String pDocType, String pDocDate, String pPostDate, String pEntryDate,
            String pReference, String pRevWith, String pRevYear, String pDocHdrText, String pCurrency, String pExcRate,
            String pReferenceKey, String pPmtInd, String pTransType, String pSpreadVal, String pOssId, String pGroupId, String pSumberDana,
            String pTglRencanBayar, String pBankBayar, String pCurrBayar, String pPartialInd, String pAmountBayar, String pBankBenef,
            String pNoRekBenef, String pNamaBenef, String pVerifiedBy, String pVerifiedOn
    ){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("sap_invoice_head_gagal");
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

        out = simpleJdbcCall.execute(param);
        AppUtils.getLogger(this).info("insert ap_invoice_head data_gagal : {}",out);
        return out;
    }

    public Map<String, Object> insertIntoIntegrationLog(String pJenisData, String pKontenData, String pHeader, String pItem, String pStatusJson, String pParam, String pUrl){
        Map<String, Object> insert = new HashMap<>();
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("ins_log_sap_clob");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_jenis_data", pJenisData, OracleTypes.VARCHAR)
                .addValue("p_konten_data", pKontenData, OracleTypes.CLOB)
                .addValue("p_header", pHeader, OracleTypes.CLOB)
                .addValue("p_item", pItem, OracleTypes.CLOB)
                .addValue("p_status_json", pStatusJson, OracleTypes.VARCHAR)
                .addValue("p_param",pParam, OracleTypes.VARCHAR)
                .addValue("p_url", pUrl, OracleTypes.VARCHAR);
        try{
            insert = simpleJdbcCall.execute(param);
        }catch (Exception e){
            e.printStackTrace();
        }
        AppUtils.getLogger(this).info("insert_into_integration_log : {}",insert);
        return insert;
    }

}
