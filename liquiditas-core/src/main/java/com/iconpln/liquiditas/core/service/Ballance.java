package com.iconpln.liquiditas.core.service;


import org.apache.commons.codec.binary.Base64;
import org.json.JSONException;
import org.json.JSONObject;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

public class Ballance {
    private static Logger log;
    public static final String TAG = Ballance.class.getName();

    public static Object get(String pBank, String pSource, String pBeneficiary ) throws IOException {
        String signature = null;
        String token = null;

        Map<String, String> headerBody = new HashMap<String, String>();
        headerBody.put("bank",pBank);
        headerBody.put("sourceAccount",pSource);
        headerBody.put("beneficiaryAccount",pBeneficiary);
        JSONObject object = new JSONObject(headerBody);
        String body = object.toString();
        System.out.println(body);

        Date newdate = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        String timestamp = dateFormat.format(newdate.getTime());

        System.out.println(timestamp);
        signature =  createSignature("s3cr3tk3y", body, timestamp);
        token = getToken();
        return getBallance(timestamp, signature, body, token);
    }

    public static String createSignature(String apikey, String body, String timestamp) {
        String hash = "";
        try {
            String key = apikey + timestamp;
            String signature = body;
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            hash = Base64.encodeBase64String(sha256_HMAC.doFinal(signature.getBytes()));
            System.out.println("signature : " + hash);
        } catch (Exception e) {
            log.warning(e.getMessage());
        }
        return hash;
    }

    public static String getToken(){
        String usernameColonPassword = "CORPAY:CORPAY@2019";
        String basicAuthPayload = "Basic " + Base64.encodeBase64String(usernameColonPassword.getBytes());
        String token = null;

        BufferedReader httpResponseReader = null;
        try {
            // Connect to the web server endpoint
            URL serverUrl = new URL("http://10.14.204.15:8181/gettoken");
            HttpURLConnection urlConnection = (HttpURLConnection) serverUrl.openConnection();

            // Set HTTP method as GET
            urlConnection.setRequestMethod("GET");

            // Include the HTTP Basic Authentication payload
            urlConnection.addRequestProperty("Authorization", basicAuthPayload);

            // Read response from web server, which will trigger HTTP Basic Authentication request to be sent.
            httpResponseReader =
                    new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
            String lineRead;
            String result = "";
            while((lineRead = httpResponseReader.readLine()) != null) {
//              System.out.println(lineRead);
                result = lineRead;
            }
            JSONObject data = new JSONObject(result);
            token = data.getJSONObject("data").getString("token");
            System.out.println(token);

        } catch (IOException | JSONException ioe) {
            ioe.printStackTrace();
        }
        return token;
    }

    public static Object getBallance(String timestamp, String signature, String body, String token) throws UnsupportedEncodingException {
        String result = null;
        BufferedReader httpResponseReader = null;
//        HttpPost request = new HttpPost("http://10.14.204.15:8181/corpay/doGetBalance");
//        request.addHeader("Content-Type","application/json");
//        request.addHeader("api-key","s3cr3tk3y");
//        request.addHeader("timestamp",timestamp);
//        request.addHeader("signature",signature);
//
//        request.addHeader("Authorization","Bearer "+ token);
//
//        request.setEntity(new StringEntity(body));

        try{
            URL serverUrl = new URL("http://10.14.204.15:8181/corpay/doGetBalance");
            HttpURLConnection con = (HttpURLConnection) serverUrl.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("Content-Type", "application/json");
            con.setRequestProperty("api-key", "s3cr3tk3y");
            con.setRequestProperty("timestamp", "timestamp");
            con.setRequestProperty("signature", "signature");
//            CloseableHttpClient httpClient = HttpClients.createDefault();
//            CloseableHttpResponse response = httpClient.execute(request);
//            result = EntityUtils.toString(response.getEntity());
        }catch (Exception e){
            log.warning(e.getMessage());
        }

        return result;
    }
}
