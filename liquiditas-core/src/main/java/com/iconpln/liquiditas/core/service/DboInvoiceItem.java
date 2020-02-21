package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.alt.AltDbo;
import com.iconpln.liquiditas.core.alt.AltHttpRequest;

public class DboInvoiceItem extends AltDbo {
    public DboInvoiceItem (){
        this(null);
    }

    public DboInvoiceItem(AltHttpRequest request){
        super(request);

        this.table_name = "sap_invoice_item";
        this.table_fields.put("comp_code", "");
        this.table_fields.put("doc_no", "");
        this.table_fields.put("fisc_year", "");
        this.table_fields.put("line_item", "");
        this.table_fields.put("oi_ind", "");
        this.table_fields.put("acct_type", "");
        this.table_fields.put("spec_gl", "");
        this.table_fields.put("bus_area", "");
        this.table_fields.put("tpba", "");
        this.table_fields.put("amt_lc", "");
        this.table_fields.put("amt_tc", "");
        this.table_fields.put("amt_with_base_tc", "");
        this.table_fields.put("amt_with_tc", "");
        this.table_fields.put("assignment", "");
        this.table_fields.put("item_text", "");
        this.table_fields.put("cost_ctr", "");
        this.table_fields.put("gl_acct", "");
        this.table_fields.put("customer", "");
        this.table_fields.put("vendor", "");
        this.table_fields.put("base_date", "");
        this.table_fields.put("term_pmt", "");
        this.table_fields.put("due_on", "");
        this.table_fields.put("pmt_block", "");
        this.table_fields.put("house_bank", "");
        this.table_fields.put("prtnr_bank_type", "");
        this.table_fields.put("po_num", "");
        this.table_fields.put("po_item", "");
        this.table_fields.put("ref_key1", "");
        this.table_fields.put("ref_key2", "");
        this.table_fields.put("ref_key3", "");
        this.table_fields.put("int_order", "");
        this.table_fields.put("wbs_num", "");
        this.table_fields.put("cash_code", "");
        this.table_fields.put("corp_pmt", "");
        this.table_fields.put("dr_cr_ind", "");
        this.table_fields.put("amt_with_base_lc", "");
        this.table_fields.put("amt_with_lc", "");
        this.table_fields.put("m_data_date","");
        this.table_fields.put("flag_status","");
    }
}
