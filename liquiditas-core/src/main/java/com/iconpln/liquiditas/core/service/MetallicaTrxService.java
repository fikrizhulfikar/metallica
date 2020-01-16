package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.domain.Placement;
import com.iconpln.liquiditas.core.domain.PlacementAwal;
import com.iconpln.liquiditas.core.domain.RekapPembayaran;
import com.iconpln.liquiditas.core.domain.SumberPlacement;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.core.utils.PlsqlUtils;
import oracle.jdbc.OracleTypes;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.*;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.sql.Types;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by Mr.Diaz on 8/1/17.
 */
@Repository
public class MetallicaTrxService {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private PlsqlUtils plsqlUtils;

    private JdbcTemplate getJdbcTemplate() {
        return new JdbcTemplate(dataSource);
    }

    //    pembayaran
    public Map<String, Object>insPembayaran(
            String pIdMetallica, String pDocNo, String pDocDate, String pPmtProposalId,
            String pCompCode, String pFiscYear, String pLineNo, String pDebitCreditInd,
            String pGlAccount, String pAmount, String pExchangeRate, String pCurrency,
            String pPostingDate, String pBusinessArea, String pCashCode, String pSumberDana,
            String pAssignment, String pDocHdrText, String pRemarks
    ) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("metallica_trx_ins");
        Map<String, Object> out;
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_id_metallica", pIdMetallica)
                .addValue("p_doc_no", pDocNo)
                .addValue("p_doc_date", pDocDate)
                .addValue("p_pmt_proposal_id", pPmtProposalId)
                .addValue("p_comp_code", pCompCode)
                .addValue("p_fisc_year", pFiscYear)
                .addValue("p_line_no", pLineNo)
                .addValue("p_debit_credit_ind", pDebitCreditInd)
                .addValue("p_gl_account", pGlAccount)
                .addValue("p_amount", pAmount)
                .addValue("p_exchange_rate", pExchangeRate)
                .addValue("p_currency", pCurrency)
                .addValue("p_posting_date", pPostingDate)
                .addValue("p_business_area", pBusinessArea)
                .addValue("p_cash_code", pCashCode)
                .addValue("p_sumber_dana", pSumberDana)
                .addValue("p_assignment", pAssignment)
                .addValue("p_doc_hdr_text", pDocHdrText)
                .addValue("p_remarks", pRemarks)
                .addValue("out_msg", OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("data ins_trans_metallica : {}", out);
        return out;
    }


    //multiple edit
    public Map<String, Object> updateMultiplePembayaran(
            String pIdValas, String pTglJatuhTempo, String pBankPembayar, String pUpdateBy
    ) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("edit_all_data");
        Map<String, Object> out;
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_id_valas", pIdValas)
                .addValue("p_jatuh_tempo", pTglJatuhTempo)
                .addValue("p_bank", pBankPembayar)
                .addValue("p_update_by", pUpdateBy)
                .addValue("out_msg", OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("data ins_rekap_data : {}", out);
        return out;
    }

    public List<Map<String, Object>> getListPembayaranBelum(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pCurrency, String pUserId, String sortBy, String sortDir, String status, String statusTracking, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pCurrency : {}, " +
                        "pPembayaran : {}," +
                        "pStatusValas : {}," +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pStatus : {}," +
                        "pStatusTracking : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pCurrency, pUserId, sortBy, sortDir, pSearch);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("metallica_trx_get");

        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_currency", pCurrency, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_status", status, Types.VARCHAR)
                .addValue("p_status_tracking", statusTracking, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_metallica_trx : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getListPembayaranSudah(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pPembayaran, String pUserId, String sortBy, String sortDir, String pStatus, String pStatusTracking, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pCurrency : {}, " +
                        "pPembayaran : {}," +
                        "pStatusValas : {}," +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pStatus : {}," +
                        "pStatusTracking : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pCurrency, pPembayaran, pUserId, sortBy, sortDir, pSearch, pSearch);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_rekap_pembayaran_pss2");

        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_bank", pBank, Types.VARCHAR)
                .addValue("p_cur", pCurrency, Types.VARCHAR)
                .addValue("p_pembayaran", pPembayaran, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_status", pStatus, Types.VARCHAR)
                .addValue("p_status_tracking", pStatusTracking, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).debug("data get_rekap_pembayaran_pss2 : {}", resultset);
        return resultset;
    }

    /**
     *  (:P_START, :P_LENGTH, :P_TGL_AWAL, :P_TGL_AKHIR, :P_BANK, :P_CUR, :P_PEMBAYARAN, :P_USER_ID, :P_SORT_BY, :P_SORT_DIR, :P_STATUS, :P_STATUS_TRACKING, :P_SEARCH)
     */
    public List<Map<String, Object>> getRejectPembayaran(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCur, String pPembayaran, String pUserId, String pSortBy, String pSortDir, String pStatus, String pStatusTracking, String pSearch) {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pCurrency : {}, " +
                        "pPembayaran : {}," +
                        "pStatusValas : {}," +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pStatus : {}," +
                        "pStatusTracking : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pCur, pPembayaran, pUserId, pSortBy, pSortDir, pSearch, pStatusTracking, pSearch);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("GET_REJECT_PEMBAYARAN");

        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_bank", pBank, Types.VARCHAR)
                .addValue("p_cur", pCur, Types.VARCHAR)
                .addValue("p_pembayaran", pPembayaran, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", pSortBy, Types.VARCHAR)
                .addValue("p_sort_dir", pSortDir, Types.VARCHAR)
                .addValue("p_status", pStatus, Types.VARCHAR)
                .addValue("p_status_tracking", pStatusTracking, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);
        AppUtils.getLogger(this).debug("data GET_REJECT_PEMBAYARAN : {}", resultset);
        return resultset;
    }

    /**
     * FUNCTION ins_reject_laporan(p_id_valas IN VARCHAR2, p_reject_by IN VARCHAR2) RETURN VARCHAR2;
     **/
    public String insRejectLaporan(String pIdValas, String pRejectBy) {
        AppUtils.getLogger(this).debug("ins reject laporan = " +
                "pIdValas : {}, " +
                "pRejectBy : {}", pIdValas, pRejectBy);

        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_id_valas", pIdValas, Types.VARCHAR)
                .addValue("p_reject_by", pRejectBy, Types.VARCHAR);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("ins_reject_laporan");

        return simpleJdbcCall.executeFunction(String.class, params);
    }



    public List<Map<String, Object>> getListRealisasi(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pPembayaran, String pUserId, String sortBy, String sortDir, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pCurrency : {}, " +
                        "pPembayaran : {}," +
                        "pUserId : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pCurrency, pPembayaran, pUserId, pSearch);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_realisasi_pembayaran_pss");

        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_length", pLength);
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_bank", pBank);
        params.put("p_cur", pCurrency);
        params.put("p_pembayaran", pPembayaran);
        params.put("p_user_id", pUserId);
        params.put("p_sort_by", sortBy);
        params.put("p_sort_dir", sortDir.toUpperCase());
        params.put("p_search", pSearch);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_rekap_pembayaran_pss : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getAllpembayaran(String pStatusValas, String idUser, String pTglAwal, String pTglAkhir, String pBank, String pCurr, String pPembayaran) throws SQLException {

        AppUtils.getLogger(this).debug("PARAM SEARCH pStatusValas : {}", pStatusValas);
        AppUtils.getLogger(this).debug("PARAM SEARCH puserid : {}", idUser);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAwal : {}", pTglAwal);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAkhir : {}", pTglAkhir);
        AppUtils.getLogger(this).debug("PARAM SEARCH pBank : {}", pBank);
        AppUtils.getLogger(this).debug("PARAM SEARCH pCurr : {}", pCurr);
        AppUtils.getLogger(this).debug("PARAM SEARCH pPembayaran : {}", pPembayaran);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_all_pembayaran_by_status");


        Map<String, Object> params = new HashMap<>();
        params.put("p_status_valas", pStatusValas);
        params.put("p_userid", idUser);
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_bank", pBank);
        params.put("p_cur", pCurr);
        params.put("p_pembayaran", pPembayaran);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_all_pembayaran_by_status : {} and userid {}", resultset, idUser);
        return resultset;
    }


    public List<Map<String, Object>> getAllpembayaran2(String idUser, String pTglAwal, String pTglAkhir, String pBank, String pCurr, String pPembayaran) throws SQLException {

        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAwal : {}", pTglAwal);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAkhir : {}", pTglAkhir);
        AppUtils.getLogger(this).debug("PARAM SEARCH pBank : {}", pBank);
        AppUtils.getLogger(this).debug("PARAM SEARCH pCurr : {}", pCurr);
        AppUtils.getLogger(this).debug("PARAM SEARCH pPembayaran : {}", pPembayaran);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_all_pembayaran_by_status2");


        Map<String, Object> params = new HashMap<>();
        params.put("p_userid", idUser);
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_bank", pBank);
        params.put("p_cur", pCurr);
        params.put("p_pembayaran", pPembayaran);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_all_pembayaran_by_status2 : {} and userid {}", resultset, idUser);
        return resultset;
    }


    public List<Map<String, Object>> getPembayaranbyId(String pIdMetallica) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("metallica_trx_get_byid");

        Map<String, Object> params = new HashMap<>();
        params.put("p_id_metallica", pIdMetallica);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data metallica_trx_get_byid : {}", resultset);
        return resultset;
    }

    public Map<String, Object> deletePembayaran(String pIdMetallica) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("metallica_trx_del");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_metallica", pIdMetallica)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data metallica_trx_del : {}", out);
        return out;
    }

    public Map<String, Object> rejectPembayaran(String pIdValas, String pRejectBy) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("ins_reject_laporan");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_valas", pIdValas)
                .addValue("p_reject_by", pRejectBy)
                .addValue("out_msg", OracleTypes.VARCHAR);

        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_reject_laporan : {}", out);
        return out;
    }

    public Map<String, Object> updReverse(String pIdMetallica, String pStatusTracking) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("metallica_trx_reverse");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_metallica", pIdMetallica)
                .addValue("p_status_tracking", pStatusTracking)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data reverse_metallica_trx : {}", out);
        return out;
    }

        public Map<String, Object> updStatus(String pIdMetallica, String pStatusTracking) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("metallica_trx_upd_status");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_metallica", pIdMetallica)
                .addValue("p_status_tracking", pStatusTracking)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data upd_status_pembayaran : {}", out);
        return out;
    }

    public String getIdUpload() {
        AppUtils.getLogger(this).info("siapsiap");
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_valas")
                .withFunctionName("generate_id_upload");

        Map<String, Object> out = simpleJdbcCall.execute();
        AppUtils.getLogger(this).info("data getIdUpload : {}", out.get("return"));
        String idUpload = out.get("return").toString();
        return idUpload;
    }

    public Map<String, Object> uploadXls(InputStream path, String user, String jenisFile, String idDerivatif) throws ParseException, SQLException {
        Map<String, Object> out = null;
        Workbook workbook = null;
        Iterator<Row> rowIterator = null;
        Row row = null;
        Cell cell = null;
        Map<String, Object> param = new HashMap<>();
        String idUpload = getIdUpload();
        int i = 0;
        List<Map<String, Object>> failedList = new ArrayList<>();
        try {

            try {
                workbook = WorkbookFactory.create(path);
            } catch (InvalidFormatException e) {
                e.printStackTrace();
            }
            Sheet sheet = workbook.getSheetAt(0);
            rowIterator = sheet.iterator();
            Row row1 = sheet.getRow(1);
            List<String> list = new ArrayList<>();
            int x = 0;
            while (rowIterator.hasNext()) {
                row = rowIterator.next();
                Row rrow = sheet.getRow(row.getRowNum());
                int totalCell = sheet.getRow(0).getLastCellNum();
                if(!isRowEmpty(rrow, totalCell)){
                    System.out.println("ISROWEMPTY"+ isRowEmpty(rrow, totalCell));
                    for (int cellNum = 0; cellNum < totalCell; cellNum++) {

                        if (rrow.getCell(cellNum) == null) {
                            list.add(null);
                        } else if (rrow.getCell(cellNum).getCellType() == Cell.CELL_TYPE_NUMERIC) {
                            if (DateUtil.isCellDateFormatted(rrow.getCell(cellNum))) {
                                DateFormat format = new SimpleDateFormat("dd-MMMM-yyyy", Locale.ENGLISH);
                                AppUtils.getLogger(this).info("datatanggal {}: {}", rrow.getCell(cellNum).toString());
                                if (jenisFile.equals("4")) {
                                    list.add(new SimpleDateFormat("dd/MM/yyyy").format(format.parse(rrow.getCell(cellNum).toString())));
                                } else {
                                    list.add(new SimpleDateFormat("dd/MM/yyyy HH:mm").format(format.parse(rrow.getCell(cellNum).toString())));
                                }

                            } else {
                                list.add(rrow.getCell(cellNum).toString());
                                AppUtils.getLogger(this).info("datanumeric {}: {}", rrow.getCell(cellNum).toString(), row.getCell(cellNum).getCellType());
                            }
                        } else {
                            list.add(rrow.getCell(cellNum).toString());
                            AppUtils.getLogger(this).info("datastring {}: {}", rrow.getCell(cellNum).toString(), row.getCell(cellNum).getCellType());
                        }
                    }
                    AppUtils.getLogger(this).debug("nilaiX : {}", x);
                    if (x > 0 /*||
                        !list.get(0).toLowerCase().equals("tanggal deal") && !list.get(0).isEmpty()*/) {
                        SqlParameterSource inParent;
                        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate()).withCatalogName("pkg_valas");
                        if (jenisFile.equals("1")) {
                            simpleJdbcCall.withFunctionName("ins_rekap_temp");
                            AppUtils.getLogger(this).debug("jenisFile : {}", jenisFile + "insrekap");
                            inParent = new MapSqlParameterSource()
                                    .addValue("p_nomor", x)
                                    .addValue("p_id_upload", idUpload)
                                    .addValue("p_jenis_tagihan", list.get(0))
                                    .addValue("p_tipe_transaksi", list.get(1))
                                    .addValue("p_jenis_pembayaran", list.get(2))
                                    .addValue("p_tgl_jatuh_tempo", list.get(3))
                                    .addValue("p_vendor", list.get(4))
                                    .addValue("p_curr", list.get(5))
                                    .addValue("p_nilai_tagihan", list.get(6))
                                    .addValue("p_bank_tujuan", list.get(7))
                                    .addValue("p_bank_pembayar", list.get(8))
                                    .addValue("p_unit_penerima", list.get(9))
                                    .addValue("p_tgl_tagihan", list.get(10))//tgl tagihan diterima //
                                    .addValue("p_tgl_terima_invoice", list.get(11)) //tgl tagihan
                                    .addValue("p_no_tagihan", list.get(12))
                                    .addValue("p_no_notdin", list.get(13))
                                    .addValue("p_tgl_notdin", list.get(14))
                                    .addValue("p_deskripsi", list.get(15)) //keternagan
                                    .addValue("p_nominal_sblm_pajak", list.get(16))
                                    .addValue("p_pajak", list.get(17))
                                    .addValue("p_nominal_underlying", list.get(18))
                                    .addValue("p_nominal_tanpa_underlying", list.get(19))
                                    .addValue("p_kurs_jisdor", list.get(20))
                                    .addValue("p_spread", list.get(21))
                                    .addValue("p_status_valas", "")
                                    .addValue("p_create_by", user)
                                    .addValue("out_msg", OracleTypes.VARCHAR);
                        } else if (jenisFile.equals("2")) {
                            AppUtils.getLogger(this).debug("jenisFile {} : {}{}", jenisFile, "tripartit", list);
                            simpleJdbcCall.withFunctionName("ins_tripartite_to_temp");
                            inParent = new MapSqlParameterSource()
                                    .addValue("p_nomor", x)
                                    .addValue("p_id_upload", idUpload)
                                    .addValue("p_bank", list.get(5))
                                    .addValue("p_jatuh_tempo", list.get(2))
                                    .addValue("p_tgl_jatuh_tempo", list.get(2))
                                    .addValue("p_curr", list.get(6))
                                    .addValue("p_vendor", list.get(4))
                                    .addValue("p_jenis_pembayaran", list.get(1))
                                    .addValue("p_nominal_sblm_pajak", list.get(7))
                                    .addValue("p_pajak", list.get(8))
                                    .addValue("p_nominal_underlying", list.get(9))
                                    .addValue("p_nominal_tanpa_underlying", list.get(10))
                                    .addValue("p_kurs_jisdor", list.get(11))
                                    .addValue("p_spread", list.get(12))
                                    .addValue("p_no_invoice", list.get(15))
                                    .addValue("p_tgl_invoice", list.get(14))
                                    .addValue("p_no_notdin", list.get(16))
                                    .addValue("p_tgl_notdin", list.get(17))
                                    .addValue("p_status_tripartite", list.get(17))
//                                .addValue("p_status_tripartite", user)
                                    .addValue("p_create_by", user)
                                    .addValue("p_deskripsi", list.get(18))
                                    .addValue("p_tipe_transaksi", list.get(0))
                                    .addValue("p_tgl_terima_invoice", list.get(13))
                                    .addValue("out_msg", OracleTypes.VARCHAR);
                        } else if (jenisFile.equals("3")) {
                            if (idDerivatif.equals("1")) {
                                AppUtils.getLogger(this).debug("jenisFile {} : {}{}", jenisFile, "derifativ" + idDerivatif, list);
                                AppUtils.getLogger(this).debug("idproduct", idDerivatif);
                                simpleJdbcCall.withFunctionName("ins_derivatif_to_temp");
                                inParent = new MapSqlParameterSource()
                                        .addValue("p_nomor", x)
                                        .addValue("p_id_upload", idUpload)
                                        .addValue("p_id_product", idDerivatif)
                                        .addValue("p_bank", list.get(1))
                                        .addValue("p_tgl_deal", list.get(0))
                                        .addValue("p_tgl_jatuh_tempo", list.get(2))
                                        .addValue("p_curr", list.get(4))
                                        .addValue("p_tenor", list.get(3))
                                        .addValue("p_national_amount", list.get(5))
                                        .addValue("p_deal_rate", list.get(6))
                                        .addValue("p_forward_point", list.get(7))
                                        .addValue("p_kurs_jisdor1", list.get(8))
                                        .addValue("p_bunga_deposito", list.get(9))
                                        .addValue("p_sumber_dana", list.get(11))
                                        .addValue("p_peruntukan_dana", list.get(10))
                                        .addValue("p_fixing_rate", "")
                                        .addValue("p_swap_point", "")
                                        .addValue("p_strike_price1", list.get(9))
                                        .addValue("p_strike_price2", "")
                                        .addValue("p_settlement_rate", "")
                                        .addValue("p_status_derivatif", list.get(12))
//                                .addValue("p_status_tripartite", user)
                                        .addValue("p_create_by", user)
                                        .addValue("p_keterangan", "")
                                        .addValue("p_biaya_premi", "")
                                        .addValue("out_msg", OracleTypes.VARCHAR);
                            } else if (idDerivatif.equals("2")) {
                                AppUtils.getLogger(this).debug("jenisFile {} : {}{}", jenisFile, "derifativswap" + idDerivatif, list);
                                simpleJdbcCall.withFunctionName("ins_derivatif_to_temp");
                                inParent = new MapSqlParameterSource()
                                        .addValue("p_nomor", x)
                                        .addValue("p_id_upload", idUpload)
                                        .addValue("p_id_product", idDerivatif)
                                        .addValue("p_bank", list.get(0))
                                        .addValue("p_tgl_deal", list.get(1))
                                        .addValue("p_tgl_jatuh_tempo", list.get(2))
                                        .addValue("p_curr", list.get(4))
                                        .addValue("p_tenor", list.get(3))
                                        .addValue("p_national_amount", list.get(5))
                                        .addValue("p_fixing_rate", list.get(6))
                                        .addValue("p_swap_point", list.get(7))
                                        .addValue("p_bunga_deposito", list.get(8))
                                        .addValue("p_sumber_dana", list.get(9))
                                        .addValue("p_peruntukan_dana", list.get(10))
                                        .addValue("p_status_derivatif", list.get(11))
                                        .addValue("p_deal_rate", "")
                                        .addValue("p_forward_point", "")
                                        .addValue("p_kurs_jisdor1", "")
                                        .addValue("p_strike_price1", "")
                                        .addValue("p_strike_price2", "")
                                        .addValue("p_settlement_rate", "")
//                                .addValue("p_status_tripartite", user)
                                        .addValue("p_create_by", user)
                                        .addValue("p_keterangan", "")
                                        .addValue("p_biaya_premi", "")
                                        .addValue("out_msg", OracleTypes.VARCHAR);
                            } else if (idDerivatif.equals("5")) {
                                AppUtils.getLogger(this).debug("jenisFile {} : {}{}", jenisFile, "derifativccs" + idDerivatif, list);
                                jenisFile = idDerivatif;
                                simpleJdbcCall.withFunctionName("ins_derivatif_ccs_to_temp");
                                inParent = new MapSqlParameterSource()
                                        .addValue("p_nomor", x)
                                        .addValue("p_id_upload", idUpload)
                                        .addValue("p_id_product", idDerivatif)
                                        .addValue("p_bank", list.get(0))
                                        .addValue("p_tenor", list.get(1))
                                        .addValue("p_jatuh_tempo", list.get(2))
                                        .addValue("p_start_date", list.get(3))
                                        .addValue("p_end_date", list.get(4))
                                        .addValue("p_pay_date", list.get(5))
                                        .addValue("p_notional_usd", list.get(6))
                                        .addValue("p_libor", list.get(7))
                                        .addValue("p_receive_usd", list.get(8))
                                        .addValue("p_reset_date", list.get(9))
                                        .addValue("p_discount_usd", list.get(10))
                                        .addValue("p_suku_bunga_idr", list.get(11))
                                        .addValue("p_principal", list.get(12))
                                        .addValue("p_discount_idr", list.get(13))
                                        .addValue("p_create_date", "")
//                                .addValue("p_status_tripartite", user)
                                        .addValue("p_create_by", user)
                                        .addValue("out_msg", OracleTypes.VARCHAR);
                            } else {
                                AppUtils.getLogger(this).debug("jenisFile {} : {}{}", jenisFile, "derifativcso" + idDerivatif, list);
                                AppUtils.getLogger(this).debug("idproduct: {}", idDerivatif);
                                simpleJdbcCall.withFunctionName("ins_derivatif_to_temp");
                                inParent = new MapSqlParameterSource()
                                        .addValue("p_nomor", x)
                                        .addValue("p_id_upload", idUpload)
                                        .addValue("p_id_product", idDerivatif)
                                        .addValue("p_bank", list.get(0))
                                        .addValue("p_tgl_deal", list.get(1))
                                        .addValue("p_tgl_jatuh_tempo", list.get(2))
                                        .addValue("p_curr", list.get(4))
                                        .addValue("p_tenor", list.get(3))
                                        .addValue("p_national_amount", list.get(5))
                                        .addValue("p_strike_price1", list.get(6))
                                        .addValue("p_strike_price2", list.get(7))
                                        .addValue("p_settlement_rate", list.get(8))
                                        .addValue("p_biaya_premi", list.get(9))
                                        .addValue("p_bunga_deposito", list.get(10))
                                        .addValue("p_sumber_dana", list.get(11))
                                        .addValue("p_peruntukan_dana", list.get(12))
                                        .addValue("p_keterangan", list.get(13))
                                        .addValue("p_status_derivatif", list.get(14))
                                        .addValue("p_deal_rate", "")
                                        .addValue("p_forward_point", "")
                                        .addValue("p_kurs_jisdor1", "")
                                        .addValue("p_fixing_rate", "")
                                        .addValue("p_swap_point", "")
//                                .addValue("p_status_tripartite", user)
                                        .addValue("p_create_by", user)
                                        .addValue("out_msg", OracleTypes.VARCHAR);
                            }
                        } else {
                            AppUtils.getLogger(this).debug("jenisFile {} : {}{}", jenisFile, "deposito" + idDerivatif, list);
                            simpleJdbcCall.withFunctionName("ins_deposito_to_temp");
                            inParent = new MapSqlParameterSource()
                                    .addValue("p_nomor", x)
                                    .addValue("p_id_upload", idUpload)
                                    .addValue("p_bank", list.get(0))
                                    .addValue("p_curr", list.get(1))
                                    .addValue("p_no_account", list.get(2))
                                    .addValue("p_nominal", list.get(3))
                                    .addValue("p_interest", list.get(4))
                                    .addValue("p_tgl_penempatan", list.get(5))
                                    .addValue("p_jatuh_tempo", list.get(6))
                                    .addValue("p_tenor", list.get(7))
                                    .addValue("p_keterangan", list.get(8))
                                    .addValue("p_status_deposito", list.get(9))
                                    .addValue("p_create_by", user)
                                    .addValue("out_msg", OracleTypes.VARCHAR);
                            AppUtils.getLogger(this).debug("kolom p_tgl_penempatan: {}", list.get(5));
                            AppUtils.getLogger(this).debug("kolom p_jatuh_tempo: {}", inParent.getValue("p_jatuh_tempo"));
                        }
                        AppUtils.getLogger(this).info("data p_id_upload : {}", inParent.getValue("p_id_upload"));
//                    AppUtils.getLogger(this).info("data p_bank : {}", inParent.getValue("p_bank"));
//                    AppUtils.getLogger(this).info("data p_tipe_transaksi : {}", inParent.getValue("p_tipe_transaksi"));
                        out = simpleJdbcCall.execute(inParent);
                        AppUtils.getLogger(this).info("datatotemp : {}", out);

                    }
                    list.clear();
                    x++;
                }
            }

            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                    .withCatalogName("pkg_valas")
                    .withFunctionName("return_cursor");
            SqlParameterSource inParent = new MapSqlParameterSource()
                    .addValue("p_id_upload", idUpload)
                    .addValue("p_jenis_laporan", jenisFile);
            out = simpleJdbcCall.execute(inParent);
            AppUtils.getLogger(this).info("User : {}", user);
            AppUtils.getLogger(this).info("data ins tempt {} torekap id {}: {}", jenisFile, idUpload, out);
        } catch (IOException | NullPointerException e) {
            e.printStackTrace();
        }
        AppUtils.getLogger(this).info("data ins tempt {}", out);
        return out;
    }

    public Map<String, Object> getErrorData(String idUpload, String idJenis) throws SQLException {


        Map<String, Object> out = null;
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_valas")
                .withFunctionName("get_data_error");
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_id_upload", idUpload)
                .addValue("p_jenis_laporan", idJenis);

//        out = simpleJdbcCall.execute(inParent);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("errorData {}: {}", idUpload, out);
        return out;
    }

    //    derivatif
    public Map<String, Object> insDeviratif(
            String pIdProduct, String pIdDeviratif, String pTglDeal, String pBank,
            String pTglJatuhTempo, String pTenor, String pCurr, String pNationalAmount,
            String pDealRate, String pForwardPoint, String pKursJisdor1, String pBungaDeposito,
            String pSumberDana, String pPeruntukanDana, String pFixingRate,
            String pKursJisdor2, String pSwapPoint, String pStrikePrice,
            String pStrikePrice2, String pSettlementRate, String pKeterangan,
            String pStatusDeviratif, String pBiayaPremi, String pCreateBy
    ) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("ins_derivatif");

        AppUtils.getLogger(this).debug("pIdProduct : {} ", pIdProduct);
        AppUtils.getLogger(this).debug("pIdDeviratif : {} ", pIdDeviratif);
        AppUtils.getLogger(this).debug("pTglDeal : {} ", pTglDeal);
        AppUtils.getLogger(this).debug("pBank : {} ", pBank);
        AppUtils.getLogger(this).debug("pTglJatuhTempo : {} ", pTglJatuhTempo);
        AppUtils.getLogger(this).debug("pTenor : {} ", pTenor);
        AppUtils.getLogger(this).debug("pCurr : {} ", pCurr);
        AppUtils.getLogger(this).debug("pNationalAmount : {} ", pNationalAmount);
        AppUtils.getLogger(this).debug("pDealRate : {} ", pDealRate);
        AppUtils.getLogger(this).debug("pForwardPoint : {} ", pForwardPoint);
        AppUtils.getLogger(this).debug("pKursJisdor1 : {} ", pKursJisdor1);
        AppUtils.getLogger(this).debug("pBungaDeposito : {} ", pBungaDeposito);
        AppUtils.getLogger(this).debug("pPeruntukanDana : {} ", pPeruntukanDana);
        AppUtils.getLogger(this).debug("pFixingRate : {} ", pFixingRate);
        AppUtils.getLogger(this).debug("pSumberDana : {} ", pSumberDana);
        AppUtils.getLogger(this).debug("pKursJisdor2 : {} ", pKursJisdor2);
        AppUtils.getLogger(this).debug("pSwapPoint : {} ", pSwapPoint);
        AppUtils.getLogger(this).debug("pStrikePrice : {} ", pStrikePrice);
        AppUtils.getLogger(this).debug("pStrikePrice2 : {} ", pStrikePrice2);
        AppUtils.getLogger(this).debug("pSettlementRate : {} ", pSettlementRate);
        AppUtils.getLogger(this).debug("pKeterangan : {} ", pKeterangan);
        AppUtils.getLogger(this).debug("pStatusDeviratif : {} ", pStatusDeviratif);
        AppUtils.getLogger(this).debug("pBiayaPremi : {} ", pBiayaPremi);

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_product", pIdProduct)
                .addValue("p_id_derivatif", pIdDeviratif)
                .addValue("p_tgl_deal", pTglDeal)
                .addValue("p_bank", pBank)
                .addValue("p_tgl_jatuh_tempo", pTglJatuhTempo)
                .addValue("p_tenor", pTenor)
                .addValue("p_curr", pCurr)
                .addValue("p_national_amount", pNationalAmount)
                .addValue("p_deal_rate", pDealRate)
                .addValue("p_forward_point", pForwardPoint)
                .addValue("p_kurs_jisdor1", pKursJisdor1)
                .addValue("p_bunga_deposito", pBungaDeposito)
                .addValue("p_sumber_dana", pSumberDana)
                .addValue("p_peruntukan_dana", pPeruntukanDana)
                .addValue("p_fixing_rate", pFixingRate)
                .addValue("p_kurs_jisdor2", pKursJisdor2)
                .addValue("p_swap_point", pSwapPoint)
                .addValue("p_strike_price1", pStrikePrice)
                .addValue("p_strike_price2", pStrikePrice2)
                .addValue("p_settlement_rate", pSettlementRate)
                .addValue("p_keterangan", pKeterangan)
                .addValue("p_status_derivatif", pStatusDeviratif)
                .addValue("p_create_by", pCreateBy)
                .addValue("p_biaya_premi", pBiayaPremi)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_derivatif : {}", out);
        return out;
    }

    public List<Map<String, Object>> getListDeviratif(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pTenor, String pStatusDerivatif, String pSortBy, String pSortDir, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pCurrency : {}, " +
                        "pTenor : {}," +
                        "pStatusDerivatif : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pCurrency, pTenor, pStatusDerivatif, pSearch);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_derivatif_pss");

        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_length", pLength);
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_bank", pBank);
        params.put("p_cur", pCurrency);
        params.put("p_tenor", pTenor);
        params.put("p_id_product", pStatusDerivatif);
        params.put("p_sort_by", pSortBy);
        params.put("p_sort_dir", pSortDir.toUpperCase());
        params.put("p_search", pSearch);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_derivatif_pss : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getAllDerivatif(String pIdProduct, String pTglAwal, String pTglAkhir, String pBank, String pCurr, String pTenor) throws SQLException {

        AppUtils.getLogger(this).debug("PARAM SEARCH pIdProduct : {}", pIdProduct);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAwal : {}", pTglAwal);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAkhir : {}", pTglAkhir);
        AppUtils.getLogger(this).debug("PARAM SEARCH pBank : {}", pBank);
        AppUtils.getLogger(this).debug("PARAM SEARCH pCurr : {}", pCurr);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTenor : {}", pTenor);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_all_derivatif_by_product");

        Map<String, Object> params = new HashMap<>();
        params.put("p_id_product", pIdProduct);
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_bank", pBank);
        params.put("p_cur", pCurr);
        params.put("p_tenor", pTenor);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_all_derivatif_by_product : {}", resultset);
        return resultset;
    }

    public Map<String, Object> deleteDerivatifCcs(String pIdCcs) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("del_derivatif_ccs");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("P_ID_CCS", pIdCcs)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data del_derivatif_ccs : {}", out);
        return out;
    }


    public List<Map<String, Object>> getDerivatifCcsbyId(String pIdCcs) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_derivatif_ccs_byid");

        Map<String, Object> params = new HashMap<>();
        params.put("p_id_ccs", pIdCcs);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_derivatif_ccs_byid : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getDerivatifbyId(String pIdProduct, String pIdDerivatif) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_derivatif_byid");

        Map<String, Object> params = new HashMap<>();
        params.put("p_id_product", pIdProduct);
        params.put("p_id_derivatif", pIdDerivatif);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_derivatif_byid : {}", resultset);
        return resultset;
    }

    public Map<String, Object> deleteDerivatif(String pIdProduct, String pIdDerivatif) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("del_derivatif");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_product", pIdProduct)
                .addValue("p_id_derivatif", pIdDerivatif)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data del_derivatif : {}", out);
        return out;
    }

    //    deposito
    public Map<String, Object> insDeposito(
            String pIdDeposito, String pBank, String pCurr, String pNoAccount,
            String pNominal, String pInterest, String pTglpenempatan, String pTenor,
            String pTglJatuhTempo, String pKeterangan, String pStatusDeposito, String pCreateBy
    ) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("ins_deposito");

        AppUtils.getLogger(this).debug("pIdDeposito : {} ", pIdDeposito);
        AppUtils.getLogger(this).debug("pBank : {} ", pBank);
        AppUtils.getLogger(this).debug("pCurr : {} ", pCurr);
        AppUtils.getLogger(this).debug("pNoAccount : {} ", pNoAccount);
        AppUtils.getLogger(this).debug("pNominal : {} ", pNominal);
        AppUtils.getLogger(this).debug("pInterest : {} ", pInterest);
        AppUtils.getLogger(this).debug("pTglpenempatan : {} ", pTglpenempatan);
        AppUtils.getLogger(this).debug("pTenor : {} ", pTenor);
        AppUtils.getLogger(this).debug("pTglJatuhTempo : {} ", pTglJatuhTempo);
        AppUtils.getLogger(this).debug("pKeterangan : {} ", pKeterangan);
        AppUtils.getLogger(this).debug("pStatusDeposito : {} ", pStatusDeposito);
        AppUtils.getLogger(this).debug("pCreateBy : {} ", pCreateBy);

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_deposito", pIdDeposito)
                .addValue("p_bank", pBank)
                .addValue("p_curr", pCurr)
                .addValue("p_no_account", pNoAccount)
                .addValue("p_nominal", pNominal)
                .addValue("p_interest", pInterest)
                .addValue("p_tgl_penempatan", pTglpenempatan)
                .addValue("p_tenor", pTenor)
                .addValue("p_tgl_jatuh_tempo", pTglJatuhTempo)
                .addValue("p_keterangan", pKeterangan)
                .addValue("p_status_deposito", pStatusDeposito)
                .addValue("p_create_by", pCreateBy)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_deposito : {}", out);
        return out;
    }

    public List<Map<String, Object>> getListDeposito(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pTenor, String pKeterangan, String pSortBy, String pSortDir, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pCurrency : {}, " +
                        "pTenor : {}," +
                        "pKeterangan : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pCurrency, pTenor, pKeterangan, pSearch);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_deposito_pss");

        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_length", pLength);
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_bank", pBank);
        params.put("p_cur", pCurrency);
        params.put("p_tenor", pTenor);
        params.put("p_keterangan", pKeterangan);
        params.put("p_sort_by", pSortBy);
        params.put("p_sort_dir", pSortDir.toUpperCase());
        params.put("p_search", pSearch);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_deposito_pss : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getAllDeposito(String pTglAwal, String pTglAkhir, String pBank, String pCurr, String pTenor, String pKet) throws SQLException {

        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAwal : {}", pTglAwal);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAkhir : {}", pTglAkhir);
        AppUtils.getLogger(this).debug("PARAM SEARCH pBank : {}", pBank);
        AppUtils.getLogger(this).debug("PARAM SEARCH pCurr : {}", pCurr);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTenor : {}", pTenor);
        AppUtils.getLogger(this).debug("PARAM SEARCH pKet : {}", pKet);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_all_deposito");

        Map<String, Object> params = new HashMap<>();
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_bank", pBank);
        params.put("p_cur", pCurr);
        params.put("p_tenor", pTenor);
        params.put("p_keterangan", pKet);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_all_deposito : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getDepositobyId(String pIdDeposito) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_deposito_byid");

        Map<String, Object> params = new HashMap<>();
        params.put("p_id_deposito", pIdDeposito);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_deposito_byid : {}", resultset);
        return resultset;
    }

    public Map<String, Object> deleteDeposito(String pIdDeposito) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("del_deposito");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_deposito", pIdDeposito)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data del_deposito : {}", out);
        return out;
    }


    //    tripartite
    public Map<String, Object> insTripartite(
            String pIdTripartite, String pBank, String pTglJatuhTempo, String pCurr,
            String pVendor, String pJenisPembayaran, String pNominalSblmPajak, String pPajak,
            String pNominalunderlying, String pNominalTanpaUnderlying, String pKursJisdor, String pSpread,
            String pNoInvoice, String pTglInvoice, String pStatusTripartite, String pCreateby, String pTipeTransaksi,
            String pTglTerimaInvoice, String pNoNotdin, String pTglNotdin, String pDeskripsi
    ) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("ins_tripartite");

        AppUtils.getLogger(this).debug("pIdTripartite : {} ", pIdTripartite);
        AppUtils.getLogger(this).debug("pBank : {} ", pBank);
        AppUtils.getLogger(this).debug("pTglJatuhTempo : {} ", pTglJatuhTempo);
        AppUtils.getLogger(this).debug("pCurr : {} ", pCurr);
        AppUtils.getLogger(this).debug("pVendor : {} ", pVendor);
        AppUtils.getLogger(this).debug("pJenisPembayaran : {} ", pJenisPembayaran);
        AppUtils.getLogger(this).debug("pNominalSblmPajak : {} ", pNominalSblmPajak);
        AppUtils.getLogger(this).debug("pPajak : {} ", pPajak);
        AppUtils.getLogger(this).debug("pNominalunderlying : {} ", pNominalunderlying);
        AppUtils.getLogger(this).debug("pNominalTanpaUnderlying : {} ", pNominalTanpaUnderlying);
        AppUtils.getLogger(this).debug("pKursJisdor : {} ", pKursJisdor);
        AppUtils.getLogger(this).debug("pSpread : {} ", pSpread);
        AppUtils.getLogger(this).debug("pNoInvoice : {} ", pNoInvoice);
        AppUtils.getLogger(this).debug("pTglInvoice : {} ", pTglInvoice);
        AppUtils.getLogger(this).debug("pStatusTripartite : {} ", pStatusTripartite);
        AppUtils.getLogger(this).debug("pCreateby : {} ", pCreateby);
        AppUtils.getLogger(this).debug("pTipeTransaksi : {} ", pTipeTransaksi);

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_tripartite", pIdTripartite)
                .addValue("p_bank", pBank)
                .addValue("p_tgl_jatuh_tempo", pTglJatuhTempo)
                .addValue("p_curr", pCurr)
                .addValue("p_vendor", pVendor)
                .addValue("p_jenis_pembayaran", pJenisPembayaran)
                .addValue("p_nominal_sblm_pajak", pNominalSblmPajak)
                .addValue("p_pajak", pPajak)
                .addValue("p_nominal_underlying", pNominalunderlying)
                .addValue("p_nominal_tanpa_underlying", pNominalTanpaUnderlying)
                .addValue("p_kurs_jisdor", pKursJisdor)
                .addValue("p_spread", pSpread)
                .addValue("p_no_invoice", pNoInvoice)
                .addValue("p_tgl_invoice", pTglInvoice)
                .addValue("p_status_tripartite", pStatusTripartite)
                .addValue("p_create_by", pCreateby)
                .addValue("p_tipe_transaksi", pTipeTransaksi)
                .addValue("p_tgl_terima_invoice", pTglTerimaInvoice)
                .addValue("p_no_notdin", pNoNotdin)
                .addValue("p_tgl_notdin", pTglNotdin)
                .addValue("P_deskripsi", pDeskripsi)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_tripartite : {}", out);
        return out;
    }

    public List<Map<String, Object>> getListTripartite(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pJenisPembayaran, String pStatus, String username, String sortBy, String sortDir, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "status : {}, " +
                        "pJenisPembayaran : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pSearch : {},",


                pStart, pLength, pTglAwal, pTglAkhir, pBank, pStatus, pJenisPembayaran, sortBy, sortDir, pSearch);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_tripartite_pss");

        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_length", pLength);
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_bank", pBank);
        params.put("p_jenis_pembayaran", pJenisPembayaran);
        params.put("p_status", pStatus);
        params.put("p_user_id", username);
        params.put("p_sort_by", sortBy);
        params.put("p_sort_dir", sortDir);
        params.put("p_search", pSearch);

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_tripartite_pss : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getAllTripartite(String idUser, String pTglAwal, String pTglAkhir, String pBank, String pJenisPembayaran) throws SQLException {

        AppUtils.getLogger(this).debug("PARAM SEARCH idUser : {}", idUser);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAwal : {}", pTglAwal);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAkhir : {}", pTglAkhir);
        AppUtils.getLogger(this).debug("PARAM SEARCH pBank : {}", pBank);
        AppUtils.getLogger(this).debug("PARAM SEARCH pJenisPembayaran : {}", pJenisPembayaran);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_all_tripartite");

        Map<String, Object> params = new HashMap<>();
        params.put("p_userid", idUser);
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_bank", pBank);
        params.put("p_jenis_pembayaran", pJenisPembayaran);

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_all_tripartite : {} with userid {}", resultset, idUser);
        return resultset;
    }


    public List<Map<String, Object>> getAllDerivatifCcs(String pTglAwal, String pTglAkhir, String pBank, String pTenor) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_all_derivatif_ccs");

        Map<String, Object> params = new HashMap<>();
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_bank", pBank);
        params.put("p_tenor", pTenor);

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        return resultset;
    }

    public List<Map<String, Object>> getTripartitebyId(String pIdTripartite) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_tripartite_byid");

        Map<String, Object> params = new HashMap<>();
        params.put("p_id_tripartite", pIdTripartite);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_tripartite_byid : {}", resultset);
        return resultset;
    }

    public Map<String, Object> deleteTripartite(String pIdTripartite) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("del_tripartite");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_tripartite", pIdTripartite)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data del_tripartite : {}", out);
        return out;
    }

    //    kurs
    public Map<String, Object> getAllKurs() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_list_kurs");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("out_kurs_harian", OracleTypes.CURSOR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_list_kurs : {}", out);
        return out;
    }

    //    pembelian valas
    public Map<String, Object> insPembelianValas(
            String PidBeliValas, String pBankPengirim, String pbankPenerima, String pTglPosting,
            String pCurr, String pPembelian, String pKurs,
            String pNo, String pPay, String pDoc1, String pDoc2, String pCreateBy
    ) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("ins_beli_valas");

        AppUtils.getLogger(this).debug("PidBeliValas : {} ", PidBeliValas);
        AppUtils.getLogger(this).debug("pBankPengirim : {} ", pBankPengirim);
        AppUtils.getLogger(this).debug("pbankPenerima : {} ", pbankPenerima);
        AppUtils.getLogger(this).debug("pTglPosting : {} ", pTglPosting);
        AppUtils.getLogger(this).debug("pCurr : {} ", pCurr);
        AppUtils.getLogger(this).debug("pPembelian : {} ", pPembelian);
        AppUtils.getLogger(this).debug("pKurs : {} ", pKurs);
        AppUtils.getLogger(this).debug("pNo : {} ", pNo);
        AppUtils.getLogger(this).debug("pPay : {} ", pPay);
        AppUtils.getLogger(this).debug("pDoc1 : {} ", pDoc1);
        AppUtils.getLogger(this).debug("pDoc2 : {} ", pDoc2);
        AppUtils.getLogger(this).debug("pCreateBy : {} ", pCreateBy);

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_beli_valas", PidBeliValas)
                .addValue("p_bank_pengirim", pBankPengirim)
                .addValue("p_bank_penerima", pbankPenerima)
                .addValue("p_tgl_posting", pTglPosting)
                .addValue("p_curr", pCurr)
                .addValue("p_pembelian", pPembelian)
                .addValue("p_kurs", pKurs)
                .addValue("p_no", pNo)
                .addValue("p_pay", pPay)
                .addValue("p_doc1", pDoc1)
                .addValue("p_doc2", pDoc2)
                .addValue("p_create_by", pCreateBy)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_beli_valas : {}", out);
        return out;
    }

    public List<Map<String, Object>> getListPemebelianValas(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurr, String pDok1, String pDok2, String sortBy, String sortDir, String pSearch) throws SQLException {

        AppUtils.getLogger(this).debug("data get beli valas pss info = " +
                        "start : {}, " +
                        "length : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pCurr : {}," +
                        "pBank : {}, " +
                        "pDok1 : {}, " +
                        "pDok2 : {}, " +
                        "pSearch : {}, ",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pCurr, pDok1, pDok2, pSearch);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_beli_valas_pss");

        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_length", pLength);
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_bank", pBank);
        params.put("p_curr", pCurr);
        params.put("p_dok1", pDok1);
        params.put("p_dok2", pDok2);
        params.put("p_sort_by", sortBy);
        params.put("p_sort_dir", sortDir.toUpperCase());
        params.put("p_search", pSearch);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_beli_valas_pss : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getAllPembelianValas(String pTglAwal, String pTglAkhir, String pBank, String pCurr, String pDok1, String pDok2) throws SQLException {

        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAwal : {}", pTglAwal);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAkhir : {}", pTglAkhir);
        AppUtils.getLogger(this).debug("PARAM SEARCH pBank : {}", pBank);
        AppUtils.getLogger(this).debug("PARAM SEARCH pCurr : {}", pCurr);
        AppUtils.getLogger(this).debug("PARAM SEARCH pDok1 : {}", pDok1);
        AppUtils.getLogger(this).debug("PARAM SEARCH pDok2 : {}", pDok2);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_all_beli_valas");

        Map<String, Object> params = new HashMap<>();
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_bank", pBank);
        params.put("p_curr", pCurr);
        params.put("p_dok1", pDok1);
        params.put("p_dok2", pDok2);

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_all_beli_valas : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getPembelianValasById(String pIdBeliValas) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_beli_valas_byid");

        Map<String, Object> params = new HashMap<>();
        params.put("p_id_beli_valas", pIdBeliValas);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_beli_valas_byid : {}", resultset);
        return resultset;
    }

    public Map<String, Object> deletePembelianValas(String pIdBeliValas) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("del_beli_valas");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_beli_valas", pIdBeliValas)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data del_beli_valas : {}", out);
        return out;
    }

    //Tracking
    public Map<String, Object> getAllTracking(String pSearch) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_tracking_level1");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_search", pSearch);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_tracking_level1 : {}", out);
        return out;
    }

    public Map<String, Object> getDetailTracking(String pIdValas) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_tracking_level2");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_valas", pIdValas);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data get_tracking_level2 : {}", out);
        return out;

    }

    //Placement
    public Map<String, Object> getSumberPlacement() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("get_sumber_placement");

        Map<String, Object> out = simpleJdbcCall.execute();
        AppUtils.getLogger(this).info("data getSumberPlacement : {}", out);
        return out;
    }

    public List<SumberPlacement> findSumberPlacement() {
        return plsqlUtils.function("pkg_dashboard_idr",
                "get_sumber_placement",
                "",
                (resultSet, i) -> {
                    SumberPlacement sumberPlacement = new SumberPlacement();
                    sumberPlacement.setBank(resultSet.getString("BANK"));
                    sumberPlacement.setKmk(resultSet.getBigDecimal("KMK"));
                    sumberPlacement.setPotensi(resultSet.getBigDecimal("POTENSI"));
                    sumberPlacement.setReceipt(resultSet.getBigDecimal("RECEIPT"));
                    sumberPlacement.setSubsidi(resultSet.getBigDecimal("SUBSIDI"));
                    return sumberPlacement;
                },
                new MapSqlParameterSource()
        );
    }

    public Map<String, Object> getPlacementAwal(String tglAkhir) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("get_placement_awal");

        SqlParameterSource in = new MapSqlParameterSource();
//                .addValue("p_tanggal_akhir", tglAkhir);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data getPlacementAwal : {}", out);
        return out;
    }

    public List<PlacementAwal> findPlacementAwal() {
        return plsqlUtils.function("pkg_dashboard_idr",
                "get_placement_awal",
                "",
                (resultSet, i) -> {
                    PlacementAwal placementAwal = new PlacementAwal();
                    placementAwal.setIdJenis(resultSet.getString("ID_JENIS"));
                    placementAwal.setJenis(resultSet.getString("JENIS"));
                    placementAwal.setKodeBank(resultSet.getString("KODE_BANK"));
                    placementAwal.setTanggal(resultSet.getString("TANGGAL"));
                    placementAwal.setNamaBank(resultSet.getString("NAMA_BANK"));
                    placementAwal.setSaldoAwal(resultSet.getBigDecimal("SALDO_AWAL"));
                    placementAwal.setSaldoAkhir(resultSet.getString("SALDO_AKHIR"));
                    return placementAwal;
                },
                new MapSqlParameterSource()
        );
    }

    public Map<String, Object> getListPlacement() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("get_list_placement");

        Map<String, Object> out = simpleJdbcCall.execute();
        AppUtils.getLogger(this).info("data getListPlacement : {}", out);
        return out;
    }

    public List<Placement> findPlacement() {
        return plsqlUtils.function("pkg_dashboard_idr",
                "get_list_placement",
                "",
                (resultSet, i) -> {
                    Placement placement = new Placement();
                    placement.setIdJenis(resultSet.getString("ID_JENIS"));
                    placement.setJenis(resultSet.getString("JENIS"));
                    placement.setTanggal(resultSet.getString("TANGGAL"));
                    placement.setNamaBank(resultSet.getString("NAMA_BANK"));
                    placement.setKodeBank(resultSet.getString("KODE_BANK"));
                    placement.setReceipt(resultSet.getString("RECEIPT"));
                    placement.setKmk(resultSet.getString("KMK"));
                    placement.setSubsidi(resultSet.getString("SUBSIDI"));
                    return placement;
                },
                new MapSqlParameterSource()
        );
    }


    public Map<String, Object> getDetilSumberdana(String pJenis, String pJenisSumberDana) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("get_detil_sumberdana");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_jenis", pJenis)
                .addValue("p_jenis_sumberdana", pJenisSumberDana);
        Map<String, Object> out = simpleJdbcCall.execute(in);

        AppUtils.getLogger(this).info("data getDetilSumberdana : {}", out);
        return out;
    }

    public Map<String, Object> insPlacement(String pBank, String pReceipt, String pKmk, String pSubsidi) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("ins_placement");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_bank", pBank)
                .addValue("p_receipt", pReceipt)
                .addValue("p_kmk", pKmk)
                .addValue("p_subsidi", pSubsidi);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data insPlacement : {}", out);
        return out;
    }

    public Map<String, Object> insHistoryPlacementTmp(String pBankTujuan, String pJenis, String pJenisSumberDana, String pNilai, String pBankSumberDana, String pIdSession) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("ins_history_placement_tmp");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_bank_tujuan", pBankTujuan)
                .addValue("p_jenis", pJenis)
                .addValue("p_jenis_sumberdana", pJenisSumberDana)
                .addValue("p_bank_sumberdana", pBankSumberDana)
                .addValue("p_nilai", pNilai)
                .addValue("p_id_session", pIdSession);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data insHistoryPlacementTmp : {}", out);
        return out;
    }

    public Map<String, Object> insHistoryPlacementMain(String pJenis, String pJenisSumber, String pIdSession) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("ins_history_placement_main");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_jenis", pJenis)
                .addValue("p_jenis_sumber", pJenisSumber)
                .addValue("p_id_session", pIdSession);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_history_placement_main : {}", out);
        return out;
    }

    //PotensiPendapatan
    public Map<String, Object> getListPotensi() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("get_list_potensi");

        Map<String, Object> out = simpleJdbcCall.execute();

        AppUtils.getLogger(this).info("data getListPotensi : {}", out);
        return out;
    }

    public Map<String, Object> insSaldoPotensi(String pData) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("ins_saldo_potensi_new");
        SqlParameterSource in;
        Map<String, Object> out = null;
        System.out.println("pData: "+pData);
        JSONArray jsonArray = new JSONArray(pData);

        for (Object item : jsonArray){
            JSONObject obj = (JSONObject)item;
            System.out.println(obj);
            in = new MapSqlParameterSource()
                    .addValue("p_kode_bank", obj.get("kdbank"))
                    .addValue("p_h0", obj.get("potensi_h0"))
                    .addValue("p_h1", obj.get("potensi_h1"));
            out = simpleJdbcCall.execute(in);
            AppUtils.getLogger(this).info("data insSaldoPotensi {}: {}", obj.get("kdbank"), out);
        }
        return out;
    }

    //Penarikan Kmk dan Penerimaan subsidi
    public Map<String, Object> getListKmk() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("get_list_penarikan_kmk");

        Map<String, Object> out = simpleJdbcCall.execute();

        AppUtils.getLogger(this).info("data getListKmk : {}", out);
        return out;
    }

    public Map<String, Object> insSaldoKmk(String pKodeBank, String pJumlah) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("ins_saldo_penarikan_kmk");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_kode_bank", pKodeBank, Types.VARCHAR)
                .addValue("p_jumlah", pJumlah, Types.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data insSaldoKmk : {}", out);
        return out;
    }

    public Map<String, Object> getListSubsidi() throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("get_list_subsidi");

        Map<String, Object> out = simpleJdbcCall.execute();

        AppUtils.getLogger(this).info("data getListSubsidi : {}", out);
        return out;
    }

    public Map<String, Object> insSaldoPenerimaanSubsidi(String pKodeBank, String pJumlah) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_dashboard_idr")
                .withFunctionName("ins_saldo_subsidi");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_kode_bank", pKodeBank, Types.VARCHAR)
                .addValue("p_jumlah", pJumlah, Types.VARCHAR);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data insSaldoSubsidi : {}", out);
        return out;
    }

    public Map<String, Object> uploadFileRekap(String pIdValas, String pJenisFile, BigDecimal pFileSize, String pFileName, String pUpdateBy) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_valas")
                .withFunctionName("upload_file_rekap");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_valas", pIdValas)
                .addValue("p_jenis_file", pJenisFile)
                .addValue("p_file_size", pFileSize)
                .addValue("p_nama_file", pFileName)
                .addValue("p_update_by", pUpdateBy);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data uploadFileRekap : {}", out);
        return out;
    }

    public Map<String, Object> getFilesRekap(String pIdValas) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_valas")
                .withFunctionName("get_list_file_rekap");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_valas", pIdValas);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data getFilesRekap : {}", out);
        return out;
    }

    public Map<String, Object> uploadFileTripartite(String pIdValas, String pJenisFile, BigDecimal pFileSize, String pFileName, String pUpdateBy) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_valas")
                .withFunctionName("upload_file_tripartite");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_tripartite", pIdValas)
                .addValue("p_jenis_file", pJenisFile)
                .addValue("p_file_size", pFileSize)
                .addValue("p_nama_file", pFileName)
                .addValue("p_update_by", pUpdateBy);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data uploadFileTripartite : {}", out);
        return out;
    }

    public Map<String, Object> getFilesTripartite(String pIdValas) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_valas")
                .withFunctionName("get_list_file_tripartite");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_tripartite", pIdValas);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data getFilesTripartite : {}", out);
        return out;
    }

    public Map<String, Object> updKetLunas(String idValas, String pKeterangan, String pUpdateBy) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_valas")
                .withFunctionName("upd_ket_lunas");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_valas", idValas)
                .addValue("p_keterangan", pKeterangan)
                .addValue("p_update_by", pUpdateBy);
        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data updKetLunas : {}", out);
        return out;
    }

    public String getIdPembayaranByIdValas(String idValas) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_valas")
                .withFunctionName("get_id_pembayaran_by_id_valas");
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_id_valas", idValas);

        try {
            String data = simpleJdbcCall.executeFunction(String.class, inParent);
            return data;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String getIdPembayaranByIdTripartite(String idTripartite) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_valas")
                .withFunctionName("getIdPemByIdTri");
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_id_tripartite", idTripartite);

        try {
            String data = simpleJdbcCall.executeFunction(String.class, inParent);
            return data;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public Map<String, Object> deletePlacement() {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withProcedureName("del_placement");
        try {
            Map<String, Object> response = simpleJdbcCall.execute();
            response.put("message", "Data berhasil di-reset.");
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Data gagal di-reset.");
            return response;
        }
    }

    /**
     * Untuk kirim email ke user yang sudah jatuh tempo pembayaran (h-1 & h-0).
     *
     * @return returns emails.
     */
    public List<Map<String, Object>> getEmailJatuhTempo() {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_LMETALLICA_NOTIFICATION")
                .withFunctionName("get_emails");
        try {
            List<Map<String, Object>> out = simpleJdbcCall.executeFunction(ArrayList.class);
            return out;
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return new ArrayList<>();
        }
    }

    public List<RekapPembayaran> getRekapPembayaranByEmail(String email) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_LMETALLICA_NOTIFICATION")
                .withFunctionName("get_rekap_pembayaran_by_email");
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_email", email);
        try {
            List<Map<String, Object>> out = simpleJdbcCall.executeFunction(ArrayList.class, in);
            List<RekapPembayaran> rekapPembayarans = new ArrayList<>();
            out.stream().forEach(data -> {
                RekapPembayaran rekapPembayaran = new RekapPembayaran();
                if (data.get("ID_VENDOR") != null) {
                    rekapPembayaran.setIdVendor(data.get("ID_VENDOR").toString());
                }
                if (data.get("ID_JENIS_PEMBAYARAN") != null) {
                    rekapPembayaran.setIdJenisPembayaran(data.get("ID_JENIS_PEMBAYARAN").toString());
                }
                if (data.get("UNIT_ANGGARAN") != null) {
                    rekapPembayaran.setIdUnitAnggaran(data.get("UNIT_ANGGARAN").toString());
                }
//                if (data.get("POS_ANGGARAN") != null) {
//                    rekapPembayaran.setIdPosAnggaran(data.get("POS_ANGGARAN").toString());
//                }
//                if (data.get("SUB_POS_ANGGARAN") != null) {
//                    rekapPembayaran.setIdSubPosAnggaran(data.get("SUB_POS_ANGGARAN").toString());
//                }
                if (data.get("ID_UNIT") != null) {
                    rekapPembayaran.setIdUnit(data.get("ID_UNIT").toString());
                }
                if (data.get("CURRENCY") != null) {
                    rekapPembayaran.setCurrency(data.get("CURRENCY").toString());
                }
                if (data.get("TOTAL_TAGIHAN") != null) {
                    rekapPembayaran.setTotalTagihan(new BigDecimal(data.get("TOTAL_TAGIHAN").toString()));
                }
                if (data.get("TGL_JATUH_TEMPO") != null) {
                    rekapPembayaran.setTglJatuhTempo(data.get("TGL_JATUH_TEMPO").toString());
                }
                if (data.get("KODE_BANK_TUJUAN") != null) {
                    rekapPembayaran.setKodeBankTujuan(data.get("KODE_BANK_TUJUAN").toString());
                }
                if (data.get("KODE_BANK_PEMBAYAR") != null) {
                    rekapPembayaran.setKodeBankPembayar(data.get("KODE_BANK_PEMBAYAR").toString());
                }
                if (data.get("NO_TAGIHAN") != null) {
                    rekapPembayaran.setNoTagihan(data.get("NO_TAGIHAN").toString());
                }
                if (data.get("TGL_TAGIHAN") != null) {
                    rekapPembayaran.setTglTagihan(data.get("TGL_TAGIHAN").toString());
                }
                if (data.get("NO_NOTDIN") != null) {
                    rekapPembayaran.setNoNotDin(data.get("NO_NOTDIN").toString());
                }
                if (data.get("TGL_NOTDIN") != null) {
                    rekapPembayaran.setTglNotDin(data.get("TGL_NOTDIN").toString());
                }
                if (data.get("STATUS_VALAS") != null) {
                    rekapPembayaran.setStatusValas(data.get("STATUS_VALAS").toString());
                }
                if (data.get("COUNT_DOWN") != null) {
                    rekapPembayaran.setCountdown(data.get("COUNT_DOWN").toString());
                }
                if (data.get("DESKRIPSI") != null) {
                    rekapPembayaran.setDeskripsi(data.get("DESKRIPSI").toString());
                }
                if (data.get("TIPE_TRANSAKSI") != null) {
                    rekapPembayaran.setTipeTransaksi(data.get("TIPE_TRANSAKSI").toString());
                }
                if (data.get("TGL_TERIMA_INVOICE") != null) {
                    rekapPembayaran.setTglTerimaInvoice(data.get("TGL_TERIMA_INVOICE").toString());
                }
                if (data.get("TGL_LUNAS") != null) {
                    rekapPembayaran.setTglLunas(data.get("TGL_LUNAS").toString());
                }
                if (data.get("STATUS_TRACKING") != null) {
                    rekapPembayaran.setStatusTracking(data.get("STATUS_TRACKING").toString());
                }
                rekapPembayarans.add(rekapPembayaran);
            });
            return rekapPembayarans;
        } catch (Exception e) {
            AppUtils.getLogger(this).debug("Error: {} ", e.getMessage());
            return new ArrayList<>();
        }
    }

    public List<Map<String, Object>> getDerivatifCcsPss(int pStart, int pLength, String pTglAwal, String pTglAkhir, String pBank, String pTenor, String pSortBy, String pSortDir, String pSearch) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("get_derivatif_ccs_pss");
        Map<String, Object> params = new HashMap<>();
        params.put("p_start", pStart);
        params.put("p_length", pLength);
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_bank", pBank);
        params.put("p_tenor", pTenor);
        params.put("p_sort_by", pSortBy);
        params.put("p_sort_dir", pSortDir.toUpperCase());
        params.put("p_search", pSearch);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_derivatif_ccs_pss : {}", resultset);
        return resultset;
    }

    public Map<String, Object> insDerivatifCcs(
            String pIdCcs,
            String pStartDate,
            String pEndDate,
            String pPayDate,
            String pNotionalUsd,
            String pLibor,
            String pReceiveUsd,
            String pResetDate,
            String pDiscountUsd,
            String pReceiveIdr,
            String pDiscountIdr,
            String pSukuBungaIdr,
            String pPrincipal,
            String pCreateBy,
            String pBank,
            String pJatuhTempo,
            String pTenor
    ) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_VALAS")
                .withFunctionName("ins_derivatif_ccs");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_ccs", pIdCcs)
                .addValue("p_start_date", pStartDate)
                .addValue("p_end_date", pEndDate)
                .addValue("p_pay_date", pPayDate)
                .addValue("p_notional_usd", pNotionalUsd)
                .addValue("p_libor", pLibor)
                .addValue("p_receive_usd", pReceiveUsd)
                .addValue("p_reset_date", pResetDate)
                .addValue("p_discount_usd", pDiscountUsd)
                .addValue("p_receive_idr", pReceiveIdr)
                .addValue("p_discount_idr", pDiscountIdr)
                .addValue("p_suku_bunga_idr", pSukuBungaIdr)
                .addValue("p_principal", pPrincipal)
                .addValue("p_create_by", pCreateBy)
                .addValue("p_bank", pBank)
                .addValue("p_jatuh_tempo", pJatuhTempo)
                .addValue("p_tenor", pTenor)
                .addValue("out_msg", OracleTypes.INTEGER);

        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("data ins_tripartite : {}", out);
        return out;
    }

    /**
     * Rekap pembayaran
     * @param userId userId
     */
    public List<Map<String, Object>> getColumn(String userId) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("metallica_trx_get_column");
        Map<String, Object> params = new HashMap<>();
        params.put("p_user_id", userId);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);
        AppUtils.getLogger(this).info("data get_derivatif_ccs_pss : {}", resultset);
        return resultset;
    }

    /**
     * Rekap pembayaran
     */
    public String saveColumn(
            String userId,
            int nomor,
            int jenisPembayaran,
            int unitAnggaran,
            int posAnggaran,
            int subPosAnggaran,
            int jatuhTempo,
            int vendor,
            int currency,
            int nilaiTagihan,
            int namaKontrak,
            int bankTujuan,
            int bankPembayar,
            int tglTerimaTagihan,
            int tglTagihan,
            int noTagihan,
            int tglNotaDinas,
            int noNotaDinas,
            int tglPembayaran,
            int countdown,
            int status,
            int tipeTransaksi,
            int nominalSblmPajak,
            int pajak,
            int nominalStlhPajak,
            int nominalUnderlying,
            int nominalTanpaUnderlying,
            int kursJidor,
            int spread,
            int jenisTagihan,
            int kursTransaksi,
            int nominalPembayaranIdr,
            int updateDateTagihan,
            int createDateTagihan,
            int statusTagihan,
            int keterangan) {
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_user_id", userId, OracleTypes.VARCHAR)
                .addValue("p_nomor", nomor, OracleTypes.NUMBER)
                .addValue("p_jenis_pembayaran", jenisPembayaran, OracleTypes.NUMBER)
                .addValue("p_unit_anggaran", unitAnggaran, OracleTypes.NUMBER)
                .addValue("p_pos_anggaran", posAnggaran, OracleTypes.NUMBER)
                .addValue("p_sub_pos_anggaran", subPosAnggaran, OracleTypes.NUMBER)
                .addValue("p_jatuh_tempo", jatuhTempo, OracleTypes.NUMBER)
                .addValue("p_vendor", vendor, OracleTypes.NUMBER)

                .addValue("p_currency", currency, OracleTypes.NUMBER)
                .addValue("p_nilai_tagihan", nilaiTagihan, OracleTypes.NUMBER)
                .addValue("p_nama_kontrak", namaKontrak, OracleTypes.NUMBER)
                .addValue("p_bank_tujuan", bankTujuan, OracleTypes.NUMBER)
                .addValue("p_bank_pembayar", bankPembayar, OracleTypes.NUMBER)

                .addValue("p_tgl_terima_tagihan", tglTerimaTagihan, OracleTypes.NUMBER)
                .addValue("p_tgl_tagihan", tglTagihan, OracleTypes.NUMBER)
                .addValue("p_no_tagihan", noTagihan, OracleTypes.NUMBER)
                .addValue("p_tgl_nota_dinas", tglNotaDinas, OracleTypes.NUMBER)
                .addValue("p_no_nota_dinas", noNotaDinas, OracleTypes.NUMBER)

                .addValue("p_tgl_pembayaran", tglPembayaran, OracleTypes.NUMBER)
                .addValue("p_countdown", countdown, OracleTypes.NUMBER)
                .addValue("p_status", status, OracleTypes.NUMBER)
                .addValue("p_tipe_transaksi", tipeTransaksi, OracleTypes.NUMBER)
                .addValue("p_nominal_sblm_pajak", nominalSblmPajak, OracleTypes.NUMBER)
                .addValue("p_pajak", pajak, OracleTypes.NUMBER)
                .addValue("p_nominal_stlh_pajak", nominalStlhPajak, OracleTypes.NUMBER)
                .addValue("p_nominal_underlying", nominalUnderlying, OracleTypes.NUMBER)
                .addValue("p_nominal_tanpa_underlying", nominalTanpaUnderlying, OracleTypes.NUMBER)
                .addValue("p_kurs_jisdor", kursJidor, OracleTypes.NUMBER)
                .addValue("p_spread", spread, OracleTypes.NUMBER)
                .addValue("p_kurs_transaksi", kursTransaksi, OracleTypes.NUMBER)
                .addValue("p_nominal_pembayaran_idr", nominalPembayaranIdr, OracleTypes.NUMBER)
                .addValue("p_jenis_tagihan", jenisTagihan, OracleTypes.NUMBER)
                .addValue("p_update_date_tagihan", updateDateTagihan, OracleTypes.NUMBER)
                .addValue("p_create_date_tagihan", createDateTagihan, OracleTypes.NUMBER)
                .addValue("p_status_tagihan", statusTagihan, OracleTypes.NUMBER)
                .addValue("p_keterangan", keterangan, OracleTypes.NUMBER);
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_valas")
                .withFunctionName("save_column_rekap");
        return simpleJdbcCall.executeFunction(String.class, in);
    }

    public Map<String, Object> getNotificatonDetail(String pIdJenisPembayaran, String pIdVendor) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_LMETALLICA_NOTIFICATION")
                .withProcedureName("getNotificationDetail");

        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_jenis_pembayaran", pIdJenisPembayaran)
                .addValue("p_id_vendor", pIdVendor)
                .addValue("out_nama_jenis_pembayaran", OracleTypes.VARCHAR)
                .addValue("out_nama_vendor", OracleTypes.VARCHAR);

        Map<String, Object> out = simpleJdbcCall.execute(in);
        AppUtils.getLogger(this).info("getNotificationDetail : {}", out);
        return out;
    }

    public BigDecimal getTotalTagihan(String tglAwal,
                                      String tglAkhir,String bank,
                                      String cur,
                                      String pembayaran,
                                      String pStatus,
                                      String pStatusTracking,
                                      String userId,
                                      String search) {
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_tgl_awal", tglAwal, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", tglAkhir, OracleTypes.VARCHAR)
                .addValue("p_bank", bank, OracleTypes.VARCHAR)
                .addValue("p_cur", cur, OracleTypes.VARCHAR)
                .addValue("p_pembayaran", pembayaran, OracleTypes.VARCHAR)
                .addValue("p_status", pStatus, OracleTypes.VARCHAR)
                .addValue("p_status_tracking", pStatusTracking, OracleTypes.VARCHAR)
                .addValue("p_user_id", userId, OracleTypes.VARCHAR)
                .addValue("p_search", search, OracleTypes.VARCHAR);

        getJdbcTemplate().execute("alter session set NLS_NUMERIC_CHARACTERS = '.,'");

        BigDecimal result = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_valas")
                .withFunctionName("get_total_tagihan")
                .executeFunction(BigDecimal.class, in);
        return result;
    }

    public BigDecimal getTotalTagihan2(String tglAwal,
                                      String tglAkhir,
                                      String bank,
                                      String cur,
                                      String pembayaran,
                                      String pStatus,
                                      String pStatusTracking,
                                      String userId,
                                      String search) {
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_tgl_awal", tglAwal, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", tglAkhir, OracleTypes.VARCHAR)
                .addValue("p_bank", bank, OracleTypes.VARCHAR)
                .addValue("p_cur", cur, OracleTypes.VARCHAR)
                .addValue("p_pembayaran", pembayaran, OracleTypes.VARCHAR)
                .addValue("p_status", pStatus, OracleTypes.VARCHAR)
                .addValue("p_status_tracking", pStatusTracking, OracleTypes.VARCHAR)
                .addValue("p_user_id", userId, OracleTypes.VARCHAR)
                .addValue("p_search", search, OracleTypes.VARCHAR);

        getJdbcTemplate().execute("alter session set NLS_NUMERIC_CHARACTERS = '.,'");

        BigDecimal result = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_valas")
                .withFunctionName("get_total_tagihan2")
                .executeFunction(BigDecimal.class, in);
        return result;
    }

    public List<Map<String, Object>> getTotalPerCurrentcy(String pTglAwal,
                                                          String pTglAkhir,
                                                          String pBank,
                                                          String pCur,
                                                          String pPembayaran,
                                                          String pStatus,
                                                          String pStatusTracking,
                                                          String pUserId,
                                                          String pSearch) {
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_tgl_awal", pTglAkhir, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, OracleTypes.VARCHAR)
                .addValue("p_bank", pBank, OracleTypes.VARCHAR)
                .addValue("p_cur", pCur, OracleTypes.VARCHAR)
                .addValue("p_pembayaran", pPembayaran, OracleTypes.VARCHAR)
                .addValue("p_status", pStatus, OracleTypes.VARCHAR)
                .addValue("p_status_tracking", pStatusTracking, OracleTypes.VARCHAR)
                .addValue("p_user_id", pUserId, OracleTypes.VARCHAR)
                .addValue("p_search", pSearch, OracleTypes.VARCHAR);
        return new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_valas")
                .withFunctionName("get_total_percurrency")
                .executeFunction(ArrayList.class, in);
    }

    public List<Map<String, Object>> getTotalPerCurrentcy2(String pTglAwal,
                                                          String pTglAkhir,
                                                          String pBank,
                                                          String pCur,
                                                          String pPembayaran,
                                                          String pStatus,
                                                          String pStatusTracking,
                                                          String pUserId,
                                                          String pSearch) {
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_tgl_awal", pTglAkhir, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, OracleTypes.VARCHAR)
                .addValue("p_bank", pBank, OracleTypes.VARCHAR)
                .addValue("p_cur", pCur, OracleTypes.VARCHAR)
                .addValue("p_pembayaran", pPembayaran, OracleTypes.VARCHAR)
                .addValue("p_status", pStatus, OracleTypes.VARCHAR)
                .addValue("p_status_tracking", pStatusTracking, OracleTypes.VARCHAR)
                .addValue("p_user_id", pUserId, OracleTypes.VARCHAR)
                .addValue("p_search", pSearch, OracleTypes.VARCHAR);
        return new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_valas")
                .withFunctionName("get_total_percurrency2")
                .executeFunction(ArrayList.class, in);
    }

    public String cleansing(String idValas, String userId) {
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_valas", idValas, OracleTypes.VARCHAR)
                .addValue("p_user_id", userId, OracleTypes.VARCHAR);
        return new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_valas")
                .withFunctionName("cleansing")
                .executeFunction(String.class, in);
    }

    public String insReverseReject(String idValas, String updateBy) {
        //ins_reverse_reject
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_id_valas", idValas,OracleTypes.VARCHAR)
                .addValue("p_update_by", updateBy,OracleTypes.VARCHAR);
        return new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_valas")
                .withFunctionName("ins_reverse_reject")
                .executeFunction(String.class, in);
    }

    public boolean isRowEmpty(Row row, int rowSize){
        System.out.println("ROWSIZE ; "+rowSize);
        for(int x = 0; x < rowSize; x++){
            System.out.println("ISI ROW : "+ row.getCell(x));
            if(row.getCell(x) != null && row.getCell(x).toString().length() > 0){
                System.out.println("PANJANG :"+ row.getCell(x).toString().length());
                return false;
            }
        }
        return true;
    }

    public String getPerfectJsonString(String jsonString){
        jsonString = jsonString.replaceAll("\\[", "");
        jsonString = jsonString.replaceAll("\\]", "");
        jsonString = jsonString.replaceAll("},", "};");
        return jsonString;
    }
}
