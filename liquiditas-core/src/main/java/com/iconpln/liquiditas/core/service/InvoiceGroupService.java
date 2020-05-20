package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.core.utils.PlsqlUtils;
import oracle.jdbc.OracleTypes;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.*;

@Repository
public class InvoiceGroupService {
    @Autowired
    private DataSource dataSource;

    @Autowired
    private PlsqlUtils plsqlUtils;

    private JdbcTemplate getJdbcTemplate(){return new JdbcTemplate(dataSource);}

    public List<Map<String, Object>> getListInvoiceGroupHead(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pUserId, String sortBy, String sortDir, String pSearch) throws SQLException {
        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pUserId, sortBy, sortDir, pSearch);
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("group_head_get");
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_bank", pBank, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);

        List<Map<String, Object>> result = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);
        AppUtils.getLogger(this).info("data get_invoice_group_head : {}", result);
        return result;
    }

    public List<Map<String, Object>> getDataInvoiceBy(String pCompCode, String pDocNo, String pFiscYear, String pLineItem) throws SQLException {

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("invoice_group_get_data_by");

        Map<String, Object> params = new HashMap<>();
        params.put("p_comp_code", pCompCode);
        params.put("p_doc_no", pDocNo);
        params.put("p_fisc_year", pFiscYear);
        params.put("p_line_item", pLineItem);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_group_data_invoice_by : {}", resultset);
        return resultset;
    }

    public Map<String, Object> updateLunas(
            String pCompCode, String pDocNo, String pFiscYear, String pLineItem, String pJenisTransaksi,
            String pUserId, String pStatus
    ) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("group_upd_lunas2");
        Map<String, Object> out;
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_comp_code", pCompCode)
                .addValue("p_doc_no", pDocNo)
                .addValue("p_fisc_year", pFiscYear)
                .addValue("p_line_item", pLineItem)
                .addValue("p_jenis_transaksi", pJenisTransaksi)
                .addValue("p_user_id", pUserId)
                .addValue("p_status", pStatus)
                .addValue("out_msg", OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("update data lunas : {}", out);
        return out;
    }

    public List<Map<String, Object>> getListInvoiceGroupVerifiedHead(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pUserId, String sortBy, String sortDir, String pSearch) throws SQLException {
        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pUserId, sortBy, sortDir, pSearch);
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("group_head_get_verified");
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_bank", pBank, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);

        List<Map<String, Object>> result = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);
        AppUtils.getLogger(this).info("data get_invoice_group_head : {}", result);
        return result;
    }

    public List<Map<String, Object>> getListInvoiceGroupLunasHead(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pUserId, String sortBy, String sortDir, String pSearch) throws SQLException {
        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pUserId, sortBy, sortDir, pSearch);
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("group_head_get_lunas");
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_bank", pBank, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);

        List<Map<String, Object>> result = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);
        AppUtils.getLogger(this).info("data get_invoice_group_head : {}", result);
        return result;
    }

    public List<Map<String, Object>> getListInvoiceGroupHeadSiapBayar(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pUserId, String sortBy, String sortDir, String pSearch) throws SQLException {
        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pUserId, sortBy, sortDir, pSearch);
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("group_head_get_siap_bayar");
        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_bank", pBank, Types.VARCHAR)
                .addValue("p_user_id", pUserId, Types.VARCHAR)
                .addValue("p_sort_by", sortBy, Types.VARCHAR)
                .addValue("p_sort_dir", sortDir, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);

        List<Map<String, Object>> result = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);
        AppUtils.getLogger(this).info("data get_invoice_group_head_siap_bayar : {}", result);
        return result;
    }

    public List<Map<String, Object>> getColumn(String userId) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("group_get_column");
        Map<String, Object> params = new HashMap<>();
        params.put("p_user_id", userId);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);
        AppUtils.getLogger(this).info("data get_group_column_head : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getDetails2(
            Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pGroupId, String pSortBy, String pSortDir, String pUserId, String pSearch
    ){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("group_item_get");

        SqlParameterSource params = new MapSqlParameterSource()
                .addValue("p_start", pStart, Types.INTEGER)
                .addValue("p_length", pLength, Types.INTEGER)
                .addValue("p_tgl_awal", pTglAwal, Types.VARCHAR)
                .addValue("p_tgl_akhir", pTglAkhir, Types.VARCHAR)
                .addValue("p_bank", pBank, Types.VARCHAR)
                .addValue("p_id_group", pGroupId, Types.VARCHAR)
                .addValue("p_sort_by", pSortBy, Types.VARCHAR)
                .addValue("p_sort_dir", pSortDir, Types.VARCHAR)
                .addValue("p_user_id",pUserId, Types.VARCHAR)
                .addValue("p_search", pSearch, Types.VARCHAR);

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data pembelian_valas_trx_get : {}", resultset);
        AppUtils.getLogger(this).info("pIdGroup : {}",pGroupId);
//        System.out.println("Pembelian Valas Metallica : "+resultset);
        return resultset;
    }


    public List<Map<String, Object>> getDetails(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pCaraBayar, String pUserId, String sortBy, String sortDir, String status, String statusTracking, String pSearch, String pIdGroup) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pCurrency : {}, " +
                        "pCaraBayar : {}," +
                        "pStatusValas : {}," +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pStatus : {}," +
                        "pStatusTracking : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pCurrency, pCaraBayar, pUserId, sortBy, sortDir, pSearch);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("group_item_get");

        SqlParameterSource params = new MapSqlParameterSource()
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
                .addValue("p_id_group",pIdGroup)
                .addValue("p_search", pSearch, Types.VARCHAR);

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data invoice_get : {}", resultset);
        return resultset;
    }



    public static String inhousePayment (String timestamp, String signature, String body, String token) throws UnsupportedEncodingException {
        String result = null;
        HttpPost request = new HttpPost("http://10.14.204.15:8181/corpay/doPayment");
        request.addHeader("Content-Type","application/json");
        request.addHeader("api-key","s3cr3tk3y");
        request.addHeader("timestamp",timestamp);
        request.addHeader("signature",signature);
        request.addHeader("Authorization","Bearer "+ token);

        request.setEntity(new StringEntity(body));

        try{
            CloseableHttpClient httpClient = HttpClients.createDefault();
            CloseableHttpResponse response = httpClient.execute(request);
            result = EntityUtils.toString(response.getEntity());
        }catch (Exception e){
            //log.warning(e.getMessage());
        }
        return result;
    }

    public static String inhousePaymentRtgs (String timestamp, String signature, String body, String token) throws UnsupportedEncodingException {
        String result = null;
        HttpPost request = new HttpPost("http://10.14.204.15:8181/corpay/doPaymentRtgs");
        request.addHeader("Content-Type","application/json");
        request.addHeader("api-key","s3cr3tk3y");
        request.addHeader("timestamp",timestamp);
        request.addHeader("signature",signature);
        request.addHeader("Authorization","Bearer "+ token);

        request.setEntity(new StringEntity(body));

        try{
            CloseableHttpClient httpClient = HttpClients.createDefault();
            CloseableHttpResponse response = httpClient.execute(request);
            result = EntityUtils.toString(response.getEntity());
        }catch (Exception e){
            //log.warning(e.getMessage());
        }
        return result;
    }

    public static String inhousePaymentKliring (String timestamp, String signature, String body, String token) throws UnsupportedEncodingException {
        String result = null;
        HttpPost request = new HttpPost("http://10.14.204.15:8181/corpay/doPaymentKliring");
        request.addHeader("Content-Type","application/json");
        request.addHeader("api-key","s3cr3tk3y");
        request.addHeader("timestamp",timestamp);
        request.addHeader("signature",signature);
        request.addHeader("Authorization","Bearer "+ token);

        request.setEntity(new StringEntity(body));

        try{
            CloseableHttpClient httpClient = HttpClients.createDefault();
            CloseableHttpResponse response = httpClient.execute(request);
            result = EntityUtils.toString(response.getEntity());
        }catch (Exception e){
            //log.warning(e.getMessage());
        }
        return result;
    }


    public BigDecimal getTotalTagihan(String tglAwal,
                                      String tglAkhir,
                                      String bank,
                                      String userId,
                                      String search) {
        SqlParameterSource in = new MapSqlParameterSource()
                .addValue("p_tgl_awal", tglAwal, OracleTypes.VARCHAR)
                .addValue("p_tgl_akhir", tglAkhir, OracleTypes.VARCHAR)
                .addValue("p_user_id", userId, OracleTypes.VARCHAR)
                .addValue("p_bank", bank, OracleTypes.VARCHAR)
                .addValue("p_search", search, OracleTypes.VARCHAR);

        getJdbcTemplate().execute("alter session set NLS_NUMERIC_CHARACTERS = '.,'");

        BigDecimal result = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("pkg_corpay")
                .withFunctionName("get_total_tagihan_group")
                .executeFunction(BigDecimal.class, in);
        return result;
    }

    public static String interbankPayment (String timestamp, String signature, String body, String token) throws UnsupportedEncodingException {
        String result = null;
        HttpPost request = new HttpPost("http://10.14.204.15:8181/corpay/doPaymentInterBank");
        request.addHeader("Content-Type","application/json");
        request.addHeader("api-key","s3cr3tk3y");
        request.addHeader("timestamp",timestamp);
        request.addHeader("signature",signature);
        request.addHeader("Authorization","Bearer "+ token);

        request.setEntity(new StringEntity(body));

        try{
            CloseableHttpClient httpClient = HttpClients.createDefault();
            CloseableHttpResponse response = httpClient.execute(request);
            result = EntityUtils.toString(response.getEntity());
        }catch (Exception e){
            //log.warning(e.getMessage());
        }
        return result;
    }

    public static String doPayment (String pBank, String pRefNum, String pSource,String pBeneficiaryAccount,
                                    String pCurrency, String pAmount, String pRemark, String pFeeType) throws UnsupportedEncodingException {
        id.co.pln.iconplus.engine.services.Token token = new id.co.pln.iconplus.engine.services.Token();
        id.co.pln.iconplus.engine.services.Signature signature = new id.co.pln.iconplus.engine.services.Signature();
        String timestamp = null;

        Map<String, String> headerBody = new HashMap<String, String>();
        headerBody.put("bank",pBank);
        headerBody.put("referenceNumber",pRefNum);
        headerBody.put("sourceAccount", pSource);
        headerBody.put("beneficiaryAccount", pBeneficiaryAccount);
        headerBody.put("currency", pCurrency);
        headerBody.put("amount", pAmount);
        headerBody.put("remark", pRemark);
        headerBody.put("feeType", pFeeType);
        JSONObject bodyObject = new JSONObject(headerBody);
        String body = bodyObject.toString();

        Date newdate = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        timestamp = dateFormat.format(newdate.getTime());
        String token_str = token.getToken();
        String signature_str = signature.createSignature("s3cr3tk3y", body, timestamp);
        return inhousePayment(timestamp, signature_str, body, token_str);
    }

    public static String doPaymentRtgs (String pBank, String pRefNum, String pSource, String pBeneficiaryAccount,
                                        String pCurrency, String pAmount, String pRemark, String pBenefEmail,
                                        String pBenefName, String pBenefAddr1, String pBenefAddr2, String pDestinationBank,
                                        String pFeeType) throws UnsupportedEncodingException {
        id.co.pln.iconplus.engine.services.Token token = new id.co.pln.iconplus.engine.services.Token();
        id.co.pln.iconplus.engine.services.Signature signature = new id.co.pln.iconplus.engine.services.Signature();
        String timestamp = null;

        Map<String, String> headerBody = new HashMap<String, String>();
        headerBody.put("bank",pBank);
        headerBody.put("referenceNumber",pRefNum);
        headerBody.put("sourceAccount",pSource);
        headerBody.put("beneficiaryAccount",pBeneficiaryAccount);
        headerBody.put("currency",pCurrency);
        headerBody.put("amount",pAmount);
        headerBody.put("remark",pRemark);
        headerBody.put("beneficiaryEmailAddress",pBenefEmail);
        headerBody.put("beneficiaryName",pBenefName);
        headerBody.put("beneficiaryAddress1",pBenefAddr1);
        headerBody.put("beneficiaryAddress2",pBenefAddr2);
        headerBody.put("destinationBankCode",pDestinationBank);
        headerBody.put("feeType",pFeeType);


        JSONObject bodyObject = new JSONObject(headerBody);
        String body = bodyObject.toString();

        Date newdate = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        timestamp = dateFormat.format(newdate.getTime());
        String token_str = token.getToken();
        String signature_str = signature.createSignature("s3cr3tk3y", body, timestamp);
        return inhousePaymentRtgs(timestamp, signature_str, body, token_str);
    }

    public static String doPaymentKliring (String pBank, String pRefNum, String pSource, String pBeneficiaryAccount, String pCurrency,
                                           String pAmount, String pRemark, String pBenefEmail, String pBenefName,
                                           String pBenefAddr1, String pBenefAddr2, String pDestinationBank, String pFeeType) throws UnsupportedEncodingException {
        id.co.pln.iconplus.engine.services.Token token = new id.co.pln.iconplus.engine.services.Token();
        id.co.pln.iconplus.engine.services.Signature signature = new id.co.pln.iconplus.engine.services.Signature();
        String timestamp = null;

        Map<String, String> headerBody = new HashMap<String, String>();
        headerBody.put("bank", pBank);
        headerBody.put("referenceNumber", pRefNum);
        headerBody.put("sourceAccount", pSource);
        headerBody.put("beneficiaryAccount", pBeneficiaryAccount);
        headerBody.put("currency", pCurrency);
        headerBody.put("amount", pAmount);
        headerBody.put("remark",pRemark);
        headerBody.put("beneficiaryEmailAddress", pBenefEmail);
        headerBody.put("beneficiaryName", pBenefName);
        headerBody.put("beneficiaryAddress1",pBenefAddr1);
        headerBody.put("beneficiaryAddress2",pBenefAddr2);
        headerBody.put("destinationBankCode", pDestinationBank);
        headerBody.put("feeType", pFeeType);

        JSONObject bodyObject = new JSONObject(headerBody);
        String body = bodyObject.toString();

        Date newdate = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        timestamp = dateFormat.format(newdate.getTime());
        String token_str = token.getToken();
        String signature_str = signature.createSignature("s3cr3tk3y", body, timestamp);
        return inhousePaymentKliring(timestamp, signature_str, body, token_str);
    }

    public static String doInterbankPayment (String pBank, String pRefNum, String pAmount, String pBeneficiaryAccount,
                                             String pBenefName, String pDestinationBankCode, String pDestinationBank,
                                             String pRetrievalReff, String pSource, String pCurrency, String pCurrency2,
                                             String pRemark) throws UnsupportedEncodingException {
        id.co.pln.iconplus.engine.services.Token token = new id.co.pln.iconplus.engine.services.Token();
        id.co.pln.iconplus.engine.services.Signature signature = new id.co.pln.iconplus.engine.services.Signature();
        String timestamp = null;

        Map<String, String> headerBody = new HashMap<String, String>();
        headerBody.put("bank",pBank);
        headerBody.put("customerReferenceNumber",pRefNum);
        headerBody.put("amount",pAmount);
        headerBody.put("destinationAccountNumber",pBeneficiaryAccount);
        headerBody.put("destinationAccountName",pBenefName);
        headerBody.put("destinationBankCode",pDestinationBankCode);
        headerBody.put("destinationBankName",pDestinationBank);
        headerBody.put("retrievalReffNumber",pRetrievalReff);
        headerBody.put("sourceAccountNumber",pSource);
        headerBody.put("debitCurrency",pCurrency);
        headerBody.put("creditCurrency",pCurrency2);
        headerBody.put("remark",pRemark);

        JSONObject bodyObject = new JSONObject(headerBody);
        String body = bodyObject.toString();

        Date newdate = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        timestamp = dateFormat.format(newdate.getTime());
        String token_str = token.getToken();
        String signature_str = signature.createSignature("s3cr3tk3y", body, timestamp);
        return interbankPayment(timestamp, signature_str, body, token_str);
    }

    public String payment(String pMetodeBayar, String pBank, String pRefNum, String pSource, String pBeneficiaryAccount,
                          String pCurrency, String pAmount, String pRemark, String pBenefEmail,
                          String pBenefName, String pBenefAddr1, String pBenefAddr2, String pDestinationBank,
                          String pFeeType, String pCurrency2, String pRetrievalReff, String pDestinationBankCode ) throws IOException {
        String res = null;
        Date date = new Date();
        SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String refnum = format.format(date.getTime())+"101";

        if (pMetodeBayar.equals("INHOUSE")){
            res = doPayment( pBank, refnum, pSource, pBeneficiaryAccount, pCurrency,
                    pAmount, pRemark, pFeeType);
        }
        if (pMetodeBayar.equals("RTGS")){
            res = doPaymentRtgs (pBank, refnum, pSource, pBeneficiaryAccount,
                    pCurrency, pAmount, pRemark, pBenefEmail,
                    pBenefName, pBenefAddr1, pBenefAddr2, pDestinationBank,
                    pFeeType);
        }
        if (pMetodeBayar.equals("KLIRING")) {
            res = doPaymentKliring(pBank, refnum, pSource, pBeneficiaryAccount, pCurrency,
                    pAmount, pRemark, pBenefEmail, pBenefName,
                    pBenefAddr1, pBenefAddr2, pDestinationBank, pFeeType);
        }
        if (pMetodeBayar.equals("ONLINETRANSFER")) {
            res = doInterbankPayment ( pBank,  refnum,  pAmount,  pBeneficiaryAccount,
                    pBenefName,  pDestinationBankCode,  pDestinationBank,
                    pRetrievalReff,  pSource,  pCurrency,  pCurrency2,
                    pRemark);
        }
        return res;
    }

    public List<Map<String, Object>> getAllpembayaran(String idUser, String pTglAwal, String pTglAkhir, String pBank, String status, String statusTracking) throws SQLException {

        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAwal : {}", pTglAwal);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAkhir : {}", pTglAkhir);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_all_group_head_by_status");


        Map<String, Object> params = new HashMap<>();
        params.put("p_user_id", idUser);
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_bank", pBank);
        params.put("p_status", status);
        params.put("p_status_tracking", statusTracking);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_all_pembayaran_by_status1 : {} and userid {}", resultset, idUser);
        return resultset;
    }

    public List<Map<String, Object>> getAllpembayaran2(String idUser, String pTglAwal, String pTglAkhir, String pBank, String status, String statusTracking) throws SQLException {

        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAwal : {}", pTglAwal);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAkhir : {}", pTglAkhir);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_all_group_head_by_status2");


        Map<String, Object> params = new HashMap<>();
        params.put("p_user_id", idUser);
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_bank", pBank);
        params.put("p_status", status);
        params.put("p_status_tracking", statusTracking);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_all_pembayaran_by_status1 : {} and userid {}", resultset, idUser);
        return resultset;
    }

    public List<Map<String, Object>> getAllpembayaran3(String idUser, String pTglAwal, String pTglAkhir, String pBank, String status, String statusTracking) throws SQLException {

        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAwal : {}", pTglAwal);
        AppUtils.getLogger(this).debug("PARAM SEARCH pTglAkhir : {}", pTglAkhir);


        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("get_all_group_head_by_status3");


        Map<String, Object> params = new HashMap<>();
        params.put("p_user_id", idUser);
        params.put("p_tgl_awal", pTglAwal);
        params.put("p_tgl_akhir", pTglAkhir);
        params.put("p_bank", pBank);
        params.put("p_status", status);
        params.put("p_status_tracking", statusTracking);
        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data get_all_pembayaran_by_status1 : {} and userid {}", resultset, idUser);
        return resultset;
    }

    public Map<String, Object> updateStatus(String pIdMetallica, String pStatusTracking){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("group_verifikasi");
        Map<String, Object> out;
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_id_group", pIdMetallica)
                .addValue("p_status_tracking", pStatusTracking)
                .addValue("out_msg", OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("data update_status : {}", out);
        return out;
    }

    public Map<String, Object> updateReverse(String pIdMetallica, String pStatusTracking){
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("group_reverse");
        SqlParameterSource param = new MapSqlParameterSource()
                .addValue("p_id_group", pIdMetallica)
                .addValue("p_status_tracking", pStatusTracking)
                .addValue("out_msg", OracleTypes.VARCHAR);
        Map<String, Object> result = simpleJdbcCall.execute(param);

        AppUtils.getLogger(this).info("p_id_group : {}", pIdMetallica);
        AppUtils.getLogger(this).info("p_status_tracking : {}", pStatusTracking);

        AppUtils.getLogger(this).info("data pembelian_valas_trx_reverse : {}", result);
        return result;
    }

    public Map<String, Object> updateLunas(
            String pIdGroup
    ) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("group_upd_lunas");
        Map<String, Object> out;
        SqlParameterSource inParent = new MapSqlParameterSource()
//                .addValue("p_comp_code", pCompCode)
//                .addValue("p_doc_no", pDocNo)
//                .addValue("p_fisc_year", pFiscYear)
//                .addValue("p_line_item", pLineItem)
//                .addValue("p_jenis_transaksi", pJenisTransaksi)
//                .addValue("p_user_id", pUserId)
                .addValue("p_id_group", pIdGroup)
                .addValue("out_msg", OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("update data lunas : {}", out);
        return out;
    }

    public Map<String, Object> updateSiapBayar(
            String pIdGroupMetallica, String pIdGroup, String pCompCode, String pDocNo, String pFiscYear, String pLineItem, String pJenisTransaksi, String pUserId, String pOssId
    ) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("group_upd_siap_bayar");
        Map<String, Object> out;
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_comp_code", pCompCode)
                .addValue("p_doc_no", pDocNo)
                .addValue("p_fisc_year", pFiscYear)
                .addValue("p_line_item", pLineItem)
                .addValue("p_jenis_transaksi", pJenisTransaksi)
                .addValue("p_user_id", pUserId)
                .addValue("p_oss_id",pOssId)
                .addValue("p_group_id", pIdGroup)
                .addValue("p_id_group_metallica", pIdGroupMetallica)
                .addValue("out_msg", OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("update data lunas : {}", out);
        return out;
    }

    public Map<String, Object> updateGroupLunasGiro(
            String pCompCode, String pDocNo, String pFiscYear, String pLineItem, String pJenisTransaksi,
            String pUserId, String pOssId, String pGroupId
    ) throws SQLException {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("group_upd_lunas_giro");
        Map<String, Object> out;
        SqlParameterSource inParent = new MapSqlParameterSource()
                .addValue("p_comp_code", pCompCode)
                .addValue("p_doc_no", pDocNo)
                .addValue("p_fisc_year", pFiscYear)
                .addValue("p_line_item", pLineItem)
                .addValue("p_jenis_transaksi", pJenisTransaksi)
                .addValue("p_user_id", pUserId)
                .addValue("p_oss_id",pOssId)
                .addValue("p_group_id", pGroupId)
                .addValue("out_msg", OracleTypes.VARCHAR);
        out = simpleJdbcCall.execute(inParent);
        AppUtils.getLogger(this).info("update data lunas : {}", out);
        return out;
    }

    public List<Map<String, Object>> getDetailGroupLunas(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pCaraBayar, String pUserId, String sortBy, String sortDir, String status, String statusTracking, String pSearch, String pIdGroup) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pCurrency : {}, " +
                        "pCaraBayar : {}," +
                        "pStatusValas : {}," +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pStatus : {}," +
                        "pStatusTracking : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pCurrency, pCaraBayar, pUserId, sortBy, sortDir, pSearch);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("group_item_get_lunas");

        SqlParameterSource params = new MapSqlParameterSource()
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
                .addValue("p_id_group",pIdGroup)
                .addValue("p_search", pSearch, Types.VARCHAR);

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data invoice_get : {}", resultset);
        return resultset;
    }

    public List<Map<String, Object>> getDetailGroupSiapBayar(Integer pStart, Integer pLength, String pTglAwal, String pTglAkhir, String pBank, String pCurrency, String pCaraBayar, String pUserId, String sortBy, String sortDir, String status, String statusTracking, String pSearch, String pIdGroup) throws SQLException {

        AppUtils.getLogger(this).debug("data rekap search info = " +
                        "pStart : {}, " +
                        "pLength : {}, " +
                        "pTglAwal : {}, " +
                        "pTglAkhir : {}, " +
                        "pBank : {}, " +
                        "pCurrency : {}, " +
                        "pCaraBayar : {}," +
                        "pStatusValas : {}," +
                        "pUserId : {}," +
                        "pSortBy : {}," +
                        "pSortDir : {}," +
                        "pStatus : {}," +
                        "pStatusTracking : {}," +
                        "pSearch : {},",

                pStart, pLength, pTglAwal, pTglAkhir, pBank, pCurrency, pCaraBayar, pUserId, sortBy, sortDir, pSearch);

        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(getJdbcTemplate())
                .withCatalogName("PKG_CORPAY")
                .withFunctionName("group_item_get_siap_bayar");

        SqlParameterSource params = new MapSqlParameterSource()
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
                .addValue("p_id_group",pIdGroup)
                .addValue("p_search", pSearch, Types.VARCHAR);

        List<Map<String, Object>> resultset = (List<Map<String, Object>>) simpleJdbcCall.executeFunction(ArrayList.class, params);

        AppUtils.getLogger(this).info("data invoice_grou_get_siap_bayar : {}", resultset);
        return resultset;
    }

}
