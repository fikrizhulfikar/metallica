package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.service.AltConfig;
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

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.util.HashMap;

public class ApacheHttp {

    public static String executeGet(String targetURL) throws URISyntaxException{
        HashMap<String, Object> params = new HashMap<>();
        return executeGet(targetURL, params);
    };

    public static String executeGet(String targetURL, HashMap<String, Object> params) throws URISyntaxException{

        try (CloseableHttpClient client = HttpClientBuilder.create().build()) {

            URIBuilder builder = new URIBuilder(targetURL);
            for (HashMap.Entry<String, Object> entry : params.entrySet()) {
                builder.setParameter(entry.getKey(), (String)entry.getValue());
            }

            HttpGet request = new HttpGet(builder.build());

            // add request header
            request.addHeader("User-Agent", "Mozilla/5.0");

            String userpass = AltConfig.get("alf.username") + ":" + AltConfig.get("alf.password");
            String basicAuth = "Basic " + javax.xml.bind.DatatypeConverter.printBase64Binary(userpass.getBytes());
            request.addHeader("Authorization", basicAuth);

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

    public static String executePut(String targetURL) throws URISyntaxException{
        HashMap<String, Object> params = new HashMap<>();
        return executePut(targetURL, params);
    };

    public static String executePut(String targetURL, HashMap<String, Object> params) throws URISyntaxException{

        try (CloseableHttpClient client = HttpClientBuilder.create().build()) {

            URIBuilder builder = new URIBuilder(targetURL);
            for (HashMap.Entry<String, Object> entry : params.entrySet()) {
                builder.setParameter(entry.getKey(), (String)entry.getValue());
            }

            HttpPut request = new HttpPut(builder.build());

            // add request header
            request.addHeader("User-Agent", "Mozilla/5.0");

            String userpass = AltConfig.get("alf.username") + ":" + AltConfig.get("alf.password");
            String basicAuth = "Basic " + javax.xml.bind.DatatypeConverter.printBase64Binary(userpass.getBytes());
            request.addHeader("Authorization", basicAuth);

            HttpResponse response = client.execute(request);

            System.out.println("\nSending 'PUT' request to URL : " + targetURL);
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

    public static String executeDelete(String targetURL) throws URISyntaxException{
        HashMap<String, Object> params = new HashMap<>();
        return executeDelete(targetURL, params);
    };

    public static String executeDelete(String targetURL, HashMap<String, Object> params) throws URISyntaxException{

        try (CloseableHttpClient client = HttpClientBuilder.create().build()) {

            URIBuilder builder = new URIBuilder(targetURL);
            for (HashMap.Entry<String, Object> entry : params.entrySet()) {
                builder.setParameter(entry.getKey(), (String)entry.getValue());
            }

            HttpDelete request = new HttpDelete(builder.build());

            // add request header
            request.addHeader("User-Agent", "Mozilla/5.0");

            String userpass = AltConfig.get("alf.username") + ":" + AltConfig.get("alf.password");
            String basicAuth = "Basic " + javax.xml.bind.DatatypeConverter.printBase64Binary(userpass.getBytes());
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
    public static String executePost(String targetURL) throws IOException{
        HashMap<String, Object> params = new HashMap<>();
        return executePost(targetURL, params);
    };

    public static String executePost(String targetURL, HashMap<String, Object> params) throws IOException{

        try(CloseableHttpClient client = HttpClientBuilder.create().build()) {

            HttpPost post = new HttpPost(targetURL);

            //add header
            post.setHeader("User-Agent", "Mozilla/5.0");

            String userpass = AltConfig.get("alf.username") + ":" + AltConfig.get("alf.password");
            String basicAuth = "Basic " + javax.xml.bind.DatatypeConverter.printBase64Binary(userpass.getBytes());
            post.setHeader("Authorization", basicAuth);

            JSONObject json = new JSONObject();
            for (HashMap.Entry<String, Object> entry : params.entrySet()){
                json.put(entry.getKey(), entry.getValue());
            }

            StringEntity se = new StringEntity(json.toString());
            se.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE, "application/json"));
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

            return result.toString();


        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }


}
