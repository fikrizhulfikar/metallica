package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.core.utils.PlsqlUtils;
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

    public List<Map<String, Object>> getDetails(
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
}
