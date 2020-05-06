package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.alt.AltDbo;
import com.iconpln.liquiditas.core.alt.AltHttpRequest;

public class DboInvoiceHeader extends AltDbo {
    public DboInvoiceHeader(){
        this(null);
    }

    public DboInvoiceHeader(AltHttpRequest request){
        super(request);

        this.table_name = "sap_invoice_header";
        this.table_fields.put("comp_code", "");
        this.table_fields.put("doc_no", "");
        this.table_fields.put("fisc_year", "");
        this.table_fields.put("doc_type", "");
        this.table_fields.put("doc_date", "");
        this.table_fields.put("post_date", "");
        this.table_fields.put("entry_date", "");
        this.table_fields.put("reference", "");
        this.table_fields.put("rev_with", "");
        this.table_fields.put("rev_year", "");
        this.table_fields.put("doc_hdr_txt", "");
        this.table_fields.put("currency", "");
        this.table_fields.put("exch_rate", "");
        this.table_fields.put("reference_key", "");
        this.table_fields.put("pmt_ind", "");
        this.table_fields.put("trans_type", "");
        this.table_fields.put("spread_val", "");
        this.table_fields.put("oss_id", "");
        this.table_fields.put("group_id", "");
        this.table_fields.put("sumber_dana", "");
        this.table_fields.put("tgl_rencana_byr", "");
        this.table_fields.put("bank_byr", "");
        this.table_fields.put("curr_bayar", "");
        this.table_fields.put("partial_ind", "");
        this.table_fields.put("amount_bayar", "");
        this.table_fields.put("bank_benef", "");
        this.table_fields.put("no_rek_benef", "");
        this.table_fields.put("nama_benef", "");
        this.table_fields.put("verified_by", "");
        this.table_fields.put("verified_on", "");
    }
}
