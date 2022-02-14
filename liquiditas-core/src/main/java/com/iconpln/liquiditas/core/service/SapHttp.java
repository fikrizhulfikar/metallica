package com.iconpln.liquiditas.core.service;


import com.iconpln.liquiditas.core.service.AltConfig;
import org.apache.commons.codec.binary.Base64;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicHeader;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.xml.bind.DatatypeConverter;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.HashMap;

@Component
public class SapHttp {

    @Value("${sappilot.username}")
    private String pilot_username;

    @Value("${sappilot.password}")
    private String pilot_password;

    public String executeGet(String targetURL) throws URISyntaxException{
        HashMap<String, Object> params = new HashMap<>();
        return executeGet(targetURL, params);
    };

    public String executeGet(String targetURL, HashMap<String, Object> params) throws URISyntaxException{

        try (CloseableHttpClient client = HttpClientBuilder.create().build()) {

            URIBuilder builder = new URIBuilder(targetURL);
            for (HashMap.Entry<String, Object> entry : params.entrySet()) {
                builder.setParameter(entry.getKey(), (String)entry.getValue());
            }

            HttpGet request = new HttpGet(builder.build());

            // add request header
            request.addHeader("User-Agent", "Mozilla/5.0");
            String userpass = pilot_username + ":" + pilot_password;
            String basicAuth = "Basic " + DatatypeConverter.printBase64Binary(userpass.getBytes());
            request.addHeader("Authorization", basicAuth);

            System.out.println("Authentication for GET SAP : "+userpass);
            HttpResponse response = client.execute(request);

            System.out.println("\nSending 'GET' request to URL : " + targetURL);
//            System.out.println("Response Code : " + response.getStatusLine().getStatusCode());

            BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

            StringBuffer result = new StringBuffer();
            String line = "";
            while ((line = rd.readLine()) != null) {
                result.append(line);
            }

            return result.toString();

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }

    }

    public String pilotExecuteGet(String targetURL) throws URISyntaxException{
        HashMap<String, Object> params = new HashMap<>();
        return pilotExecuteGet(targetURL, params);
    };

    public String pilotExecuteGet(String targetURL, HashMap<String, Object> params) throws URISyntaxException{

        try (CloseableHttpClient client = HttpClientBuilder.create().build()) {

            URIBuilder builder = new URIBuilder(targetURL);
            for (HashMap.Entry<String, Object> entry : params.entrySet()) {
                builder.setParameter(entry.getKey(), (String)entry.getValue());
            }

            HttpGet request = new HttpGet(builder.build());

            // add request header
            request.addHeader("User-Agent", "Mozilla/5.0");
//            String userpass = AltConfig.get("sappilot.username") + ":" + AltConfig.get("sappilot.password");
            String userpass = pilot_username + ":" + pilot_password;
            String basicAuth = "Basic " + DatatypeConverter.printBase64Binary(userpass.getBytes());
            request.addHeader("Authorization", basicAuth);

            System.out.println("Authentication for GET SAP PILOT : "+userpass);
            HttpResponse response = client.execute(request);

            System.out.println("\nSending 'GET' request to URL : " + targetURL);
//            System.out.println("Response Code : " + response.getStatusLine().getStatusCode());

            BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

            StringBuffer result = new StringBuffer();
            String line = "";
            while ((line = rd.readLine()) != null) {
                result.append(line);
            }

            return result.toString();

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }

    }

    public String executePut(String targetURL) throws URISyntaxException{
        HashMap<String, Object> params = new HashMap<>();
        return executePut(targetURL, params);
    };

    public String executePut(String targetURL, HashMap<String, Object> params) throws URISyntaxException{

        try (CloseableHttpClient client = HttpClientBuilder.create().build()) {

            URIBuilder builder = new URIBuilder(targetURL);
//            for (HashMap.Entry<String, Object> entry : params.entrySet()) {
//                builder.setParameter(entry.getKey(), (String)entry.getValue());
//            }

            HttpPut request = new HttpPut(builder.build());

            // add request header
            request.addHeader("User-Agent", "Mozilla/5.0");

            String userpass = AltConfig.get("sap.username") + ":" + AltConfig.get("sap.password");
            String basicAuth = "Basic " + DatatypeConverter.printBase64Binary(userpass.getBytes());
            request.addHeader("Authorization", basicAuth);

            JSONObject json = new JSONObject();
            for (HashMap.Entry<String, Object> entry : params.entrySet()){
                json.put(entry.getKey(), entry.getValue());
            }
            json.put("DocEntry", "");

            StringEntity se = new StringEntity(json.toString());
            se.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE, "application/json"));
            se.setContentType("application/json");
            request.setEntity(se);
            String stringEntity = EntityUtils.toString(request.getEntity());


            HttpResponse response = client.execute(request);

            System.out.println("\nSending 'PUT' request to URL : " + targetURL);
            System.out.println("Parameters : " + request.getEntity());
            System.out.println("JSON: " + stringEntity);
            System.out.println("Response : " + response.getStatusLine());


            BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

            StringBuffer result = new StringBuffer();
            String line = "";
            while ((line = rd.readLine()) != null) {
                result.append(line);
            }

            return result.toString();

        } catch (IOException | JSONException e) {
            e.printStackTrace();
            return null;
        }

    }

    public String pilotExecuteGetVndorPortal(String targetURL) throws URISyntaxException{
        HashMap<String, Object> params = new HashMap<>();
        return pilotExecuteGetVndorPortal(targetURL, params);
    };

    public String pilotExecuteGetVndorPortal(String targetURL, HashMap<String, Object> params) throws URISyntaxException{

        try (CloseableHttpClient client = HttpClientBuilder.create().build()) {
            String token = getToken();
            URIBuilder builder = new URIBuilder(targetURL);
            for (HashMap.Entry<String, Object> entry : params.entrySet()) {
                builder.setParameter(entry.getKey(), (String)entry.getValue());
            }

            HttpGet request = new HttpGet(builder.build());

            // add request header
            request.addHeader("User-Agent", "Mozilla/5.0");
//            String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoiMyIsInVuaXF1ZV9uYW1lIjoic2FwX3ZpbSIsIlVzZXJBZ2VudCI6IiIsIklwQWRkcmVzcyI6IiIsIm5iZiI6MTY0Mzk1NzUwNiwiZXhwIjoxNjQzOTU4NDA2LCJpYXQiOjE2NDM5NTc1MDYsImlzcyI6IlBMTiBWZW5kb3IgUG9ydGFsIEFwcHMiLCJhdWQiOiJQTE4gVmVuZG9yIFBvcnRhbCBBdWRpZW5jZSJ9.mNW2-P53PnN2mArZ80Y75P6jM0yfCebc5KOoZO4LE_0";
            String tokenAuth = "Bearer " + token;
            request.addHeader("Authorization", tokenAuth);

//            System.out.println("Authentication for GET SAP PILOT : "+userpass);
            HttpResponse response = client.execute(request);

            System.out.println("\nSending 'GET' request to URL : " + targetURL);
            System.out.println("Response Code : " + response.getStatusLine().getStatusCode());

            BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

            StringBuffer result = new StringBuffer();
            String line = "";
            while ((line = rd.readLine()) != null) {
                result.append(line);
            }

            return result.toString();

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }

    }

    public String executeDelete(String targetURL) throws URISyntaxException{
        HashMap<String, Object> params = new HashMap<>();
        return executeDelete(targetURL, params);
    };

    public String executeDelete(String targetURL, HashMap<String, Object> params) throws URISyntaxException{

        try (CloseableHttpClient client = HttpClientBuilder.create().build()) {

            URIBuilder builder = new URIBuilder(targetURL);
            for (HashMap.Entry<String, Object> entry : params.entrySet()) {
                builder.setParameter(entry.getKey(), (String)entry.getValue());
            }

            HttpDelete request = new HttpDelete(builder.build());

            // add request header
            request.addHeader("User-Agent", "Mozilla/5.0");

            String userpass = AltConfig.get("sap.username") + ":" + AltConfig.get("sap.password");
            String basicAuth = "Basic " + DatatypeConverter.printBase64Binary(userpass.getBytes());
            request.addHeader("Authorization", basicAuth);

            HttpResponse response = client.execute(request);

            System.out.println("\nSending 'DELETE' request to URL : " + targetURL);
            System.out.println("Response Code : " + response.getStatusLine().getStatusCode());

            BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

            StringBuffer result = new StringBuffer();
            String line = "";
            while ((line = rd.readLine()) != null) {
                result.append(line);
            }

            return result.toString();

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }

    }

    // HTTP POST request
    public String executePost(String targetURL) throws IOException{
        HashMap<String, Object> params = new HashMap<>();
        return executePost(targetURL, params);
    };

    public String executePost(String targetURL, HashMap<String, Object> params) throws IOException{

        try(CloseableHttpClient client = HttpClientBuilder.create().build()) {


            HttpPost post = new HttpPost(targetURL);

            //add header
            post.setHeader("User-Agent", "Mozilla/5.0");

            String userpass = AltConfig.get("sap.username") + ":" + AltConfig.get("sap.password");
            String basicAuth = "Basic " + DatatypeConverter.printBase64Binary(userpass.getBytes());
            post.setHeader("Authorization", basicAuth);

            JSONObject json = new JSONObject();
            for (HashMap.Entry<String, Object> entry : params.entrySet()){
                json.put(entry.getKey(), entry.getValue());
            }

            StringEntity se = null;
            if(targetURL.contains("oJournalVoucher")){
                JSONArray tempJsonArray = new JSONArray();
                tempJsonArray.put(json);
                se = new StringEntity(tempJsonArray.toString());
            }else{
                se = new StringEntity(json.toString());
            }

            se.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE, "application/json"));
            se.setContentType("application/json");
            post.setEntity(se);
            String stringEntity = EntityUtils.toString(post.getEntity());

            HttpResponse response = client.execute(post);
            System.out.println("\nSending 'POST' request to URL : " + targetURL);
            System.out.println("Parameters : " + post.getEntity());
            System.out.println("JSON: " + stringEntity);
            System.out.println("Response : " + response.getStatusLine());

            BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

            StringBuffer result = new StringBuffer();
            String line = "";
            while ((line = rd.readLine()) != null) {
                result.append(line);
            }

            System.out.println(result.toString());
            return result.toString();


        } catch (IOException | JSONException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String getToken(){
        String token = null;
        BufferedReader httpResponseReader = null;
        try {
            // Connect to the web server endpoint
            URL serverUrl = new URL("https://vendorinvoice.pln.co.id/api/usermanagement/token");
            HttpURLConnection urlConnection = (HttpURLConnection) serverUrl.openConnection();

            // Set HTTP method as POST
            urlConnection.setRequestMethod("POST");
            // Add two header, username and password
            urlConnection.setRequestProperty("username","sap_vim");
            urlConnection.setRequestProperty("password","P@ssw0rd123#");

            // Read response from web server, which will trigger HTTP Basic Authentication request to be sent.
            httpResponseReader =
                    new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
            String lineRead;
            String result = "";
            while((lineRead = httpResponseReader.readLine()) != null) {
                result = lineRead;
            }
            JSONObject data = new JSONObject(result);
            token = data.getJSONObject("data").getString("accessToken");
        } catch (IOException | JSONException ioe) {
            ioe.printStackTrace();
        }
        return token;
    }
}
