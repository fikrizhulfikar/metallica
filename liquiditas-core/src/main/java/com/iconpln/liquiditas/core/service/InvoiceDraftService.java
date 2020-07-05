package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.AppUtils;
import oracle.jdbc.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class InvoiceDraftService {
    @Autowired
    private DataSource dataSource;

    private JdbcTemplate getJdbcTemplate(){return new JdbcTemplate(dataSource);}

    public List<Map<String, Object>> getInvoiceDraftList(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pCaraBayar, String pUserId, String sortBy, String sortDir, String status, String statusTracking, String pSearch){
        List<Map<String, Object>> dataset  = new ArrayList<>();
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("invoice_get_status2");
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_bank", pBank, Types.VARCHAR)
                .addValue("p_cur", pCurrency, Types.VARCHAR)
                .addValue("p_cara_bayar", pCaraBayar, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_status", status, Types.VARCHAR)
                .addValue("p_status_tracking", statusTracking, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);
        AppUtils.getLogger(this).info("invoice_status2_params : {}",params);
        try{
           dataset  = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class,params);
           AppUtils.getLogger(this).info("get_list_invoice_status2 : {}",dataset);
        }catch (Exception e){
            e.printStackTrace();
        }
        return dataset;
    }

    public BigDecimal getTotalTagihan(String tglAwal,
                                      String tglAkhir,
                                      String currency,
                                      String caraBayar,
                                      String bank,
                                      String userId,
                                      String search) {
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_tgl_awal", tglAwal, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", tglAkhir, OracleTypes.VARCHAR)
                .addValue("p_currency", currency, OracleTypes.VARCHAR)
                .addValue("p_cara_bayar", caraBayar, OracleTypes.VARCHAR)
                .addValue("p_bank", bank, OracleTypes.VARCHAR)
                .addValue("p_user_id", userId, OracleTypes.VARCHAR)
                .addValue("p_search", search, OracleTypes.VARCHAR);

        getJdbcTemplate().execute("alter session set NLS_NUMERIC_CHARACTERS = '.,'");

        BigDecimal result = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_corpay")
                .withFunctionName("get_total_tagihan_status2")
                .executeFunction(BigDecimal.class, in);
        return result;
    }

    public List<Map<String, Object>> getAllpembayaranInvoiceDraft(String idUser, String pTglAwal, String pTglAkhir,  String pCurr, String pCaraBayar, String pBank, String status, String statusTracking) throws SQLException {

        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAwal : {}", pTglAwal);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAkhir : {}", pTglAkhir);
        AppUtils.getLogger(this).debug("PARAM SEARCH pCurr : {}", pCurr);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_all_status2_invoice");
        Map<String, Object> params = new HashMap<>();
        params.put("p_user_id", idUser);
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_currency", pCurr);
        params.put("p_cara_bayar", pCaraBayar);
        params.put("p_bank", pBank);
        params.put("p_status", status);
        params.put("p_status_tracking", statusTracking);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_all_status2_invoice : {} and userid {}", resultset, idUser);
        return resultset;
    }

    public List<Map<String, Object>> getColumn(String userId) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("invoice_get_column");
        Map<String, Object> params = new HashMap<>();
        params.put("p_user_id", userId);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);
        AppUtils.getLogger(this).info("data get_derivatif_ccs_pss : {}", resultset);
        return resultset;
    }

    public String saveColumn(
            String userId,
            int nomor,
            int ket,
            int comp_code,
            int doc_no,
            int fisc_year,
            int doc_type,
            int doc_date2,
            int post_date2,
            int entry_date2,
            int reference,
            int rev_with,
            int rev_year,
            int doc_hdr_txt,
            int currency,
            int exch_rate,
            int reference_key,
            int pmt_ind,
            int trans_type,
            int spread_val,
            int line_item,
            int oi_ind,
            int acct_type,
            int spec_gl,
            int bus_area,
            int tpba,
            int amt_lc,
            int amt_tc,
            int amt_with_base_tc,
            int amount,
            int amt_with_tc,
            int assignment,
            int item_text,
            int cost_ctr,
            int gl_acct,
            int customer,
            int vendor,
            int base_date,
            int term_pmt,
            int due_on,
            int pmt_block,
            int house_bank,
            int prtnr_bank_type,
            int bank_key,
            int bank_account,
            int account_holder,
            int po_num,
            int po_item,
            int ref_key1,
            int ref_key2,
            int ref_key3,
            int int_order,
            int wbs_num,
            int cash_code,
            int dr_cr_ind,
            int corp_pmt,
            int amt_with_base_lc,
            int amt_with_lc,
            int metode_pembayaran,
            int keterangan,
            int status_tracking,
            int no_rek_house_bank,
            int inq_customer_name,
            int inq_account_number,
            int retrieval_ref_number,
            int customer_ref_number,
            int confirmation_code,
            int tgl_act_bayar,
            int oss_id,
            int group_id,
            int sumber_dana,
            int tgl_rencana_bayar,
            int bank_byr,
            int curr_bayar,
            int partial_ind,
            int amount_bayar,
            int bank_benef,
            int no_rek_benef,
            int nama_benef,
            int verified_by,
            int verified_on,
            int tgl_tagihan_diterima,
            int no_giro) {
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_user_id", userId, OracleTypes.VARCHAR)
                .addValue("p_nomor",nomor, OracleTypes.NUMBER)
                .addValue("p_ket",ket, OracleTypes.NUMBER)
                .addValue("p_comp_code",comp_code, OracleTypes.NUMBER)
                .addValue("p_doc_no",doc_no, OracleTypes.NUMBER)
                .addValue("p_fisc_year",fisc_year, OracleTypes.NUMBER)
                .addValue("p_doc_type",doc_type, OracleTypes.NUMBER)
                .addValue("p_doc_date",doc_date2, OracleTypes.NUMBER)
                .addValue("p_post_date",post_date2, OracleTypes.NUMBER)
                .addValue("p_entry_date",entry_date2, OracleTypes.NUMBER)
                .addValue("p_reference",reference, OracleTypes.NUMBER)
                .addValue("p_rev_with",rev_with, OracleTypes.NUMBER)
                .addValue("p_rev_year",rev_year, OracleTypes.NUMBER)
                .addValue("p_doc_hdr_txt",doc_hdr_txt, OracleTypes.NUMBER)
                .addValue("p_currency",currency, OracleTypes.NUMBER)
                .addValue("p_exch_rate",exch_rate, OracleTypes.NUMBER)
                .addValue("p_reference_key",reference_key, OracleTypes.NUMBER)
                .addValue("p_pmt_ind",pmt_ind, OracleTypes.NUMBER)
                .addValue("p_trans_type",trans_type, OracleTypes.NUMBER)
                .addValue("p_spread_val",spread_val, OracleTypes.NUMBER)
                .addValue("p_line_item",line_item, OracleTypes.NUMBER)
                .addValue("p_oi_ind",oi_ind, OracleTypes.NUMBER)
                .addValue("p_acct_type",acct_type, OracleTypes.NUMBER)
                .addValue("p_spec_gl",spec_gl, OracleTypes.NUMBER)
                .addValue("p_bus_area",bus_area, OracleTypes.NUMBER)
                .addValue("p_tpba",tpba, OracleTypes.NUMBER)
                .addValue("p_amt_lc",amt_lc, OracleTypes.NUMBER)
                .addValue("p_amt_tc",amt_tc, OracleTypes.NUMBER)
                .addValue("p_amt_with_base_tc",amt_with_base_tc, OracleTypes.NUMBER)
                .addValue("p_amount",amount, OracleTypes.NUMBER)
                .addValue("p_amt_with_tc",amt_with_tc, OracleTypes.NUMBER)
                .addValue("p_assignment",assignment, OracleTypes.NUMBER)
                .addValue("p_item_text",item_text, OracleTypes.NUMBER)
                .addValue("p_cost_ctr",cost_ctr, OracleTypes.NUMBER)
                .addValue("p_gl_acct",gl_acct, OracleTypes.NUMBER)
                .addValue("p_customer_name",customer, OracleTypes.NUMBER)
                .addValue("p_vendor_name",vendor, OracleTypes.NUMBER)
                .addValue("p_base_date",base_date, OracleTypes.NUMBER)
                .addValue("p_term_pmt",term_pmt, OracleTypes.NUMBER)
                .addValue("p_due_on",due_on, OracleTypes.NUMBER)
                .addValue("p_pmt_block",pmt_block, OracleTypes.NUMBER)
                .addValue("p_house_bank",house_bank, OracleTypes.NUMBER)
                .addValue("p_prtnr_bank_type",prtnr_bank_type, OracleTypes.NUMBER)
                .addValue("p_bank_key",bank_key, OracleTypes.NUMBER)
                .addValue("p_bank_account",bank_account, OracleTypes.NUMBER)
                .addValue("p_account_holder",account_holder, OracleTypes.NUMBER)
                .addValue("p_po_num",po_num, OracleTypes.NUMBER)
                .addValue("p_po_item",po_item, OracleTypes.NUMBER)
                .addValue("p_ref_key1",ref_key1, OracleTypes.NUMBER)
                .addValue("p_ref_key2",ref_key2, OracleTypes.NUMBER)
                .addValue("p_ref_key3",ref_key3, OracleTypes.NUMBER)
                .addValue("p_int_order",int_order, OracleTypes.NUMBER)
                .addValue("p_wbs_num",wbs_num, OracleTypes.NUMBER)
                .addValue("p_cash_code",cash_code, OracleTypes.NUMBER)
                .addValue("p_dr_cr_ind",dr_cr_ind, OracleTypes.NUMBER)
                .addValue("p_corp_pmt",corp_pmt, OracleTypes.NUMBER)
                .addValue("p_amt_with_base_lc",amt_with_base_lc, OracleTypes.NUMBER)
                .addValue("p_amt_with_lc",amt_with_lc, OracleTypes.NUMBER)
                .addValue("p_metode_pembayaran",metode_pembayaran, OracleTypes.NUMBER)
                .addValue("p_keterangan",keterangan, OracleTypes.NUMBER)
                .addValue("p_status_tracking",status_tracking, OracleTypes.NUMBER)
                .addValue("p_no_rek_house_bank",no_rek_house_bank, OracleTypes.NUMBER)
                .addValue("p_inq_customer_name",inq_customer_name, OracleTypes.NUMBER)
                .addValue("p_inq_account_number",inq_account_number , OracleTypes.NUMBER)
                .addValue("p_retrieval_ref_number",retrieval_ref_number , OracleTypes.NUMBER)
                .addValue("p_customer_ref_number",customer_ref_number , OracleTypes.NUMBER)
                .addValue("p_confirmation_code", confirmation_code , OracleTypes.NUMBER)
                .addValue("p_tgl_act_bayar",tgl_act_bayar, OracleTypes.NUMBER)
                .addValue("p_oss_id",oss_id, OracleTypes.NUMBER)
                .addValue("p_group_id",group_id, OracleTypes.NUMBER)
                .addValue("p_sumber_dana",sumber_dana, OracleTypes.NUMBER)
                .addValue("p_tgl_rencana_bayar",tgl_rencana_bayar, OracleTypes.NUMBER)
                .addValue("p_bank_byr",bank_byr, OracleTypes.NUMBER)
                .addValue("p_curr_bayar",curr_bayar, OracleTypes.NUMBER)
                .addValue("p_partial_ind",partial_ind, OracleTypes.NUMBER)
                .addValue("p_amount_bayar",amount_bayar, OracleTypes.NUMBER)
                .addValue("p_bank_benef",bank_benef, OracleTypes.NUMBER)
                .addValue("p_no_rek_benef",no_rek_benef, OracleTypes.NUMBER)
                .addValue("p_nama_benef",nama_benef, OracleTypes.NUMBER)
                .addValue("p_verified_by", verified_by , OracleTypes.NUMBER)
                .addValue("p_verified_on", verified_on , OracleTypes.NUMBER)
                .addValue("p_tgl_tagihan_diterima",tgl_tagihan_diterima, OracleTypes.NUMBER)
                .addValue("p_no_giro", no_giro , OracleTypes.NUMBER);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("invoice_save_column");
        return simpleJdbcCall.executeFunction(String.class, in);
    }
}
