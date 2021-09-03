package com.iconpln.liquiditas.monitoring;


//import jdk.nashorn.internal.parser.JSONParser;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.params.HttpParams;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
//import sun.misc.IOUtils;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

@RestController
public class Test3 {
    private static final String sap_client = "100";
    public static void main(String[] args) throws JSONException, IOException, URISyntaxException {
        // make a function to get json string
        // make a variable to strore json string
        // convert json string to json object
        // get each element of json object with loop
        // insert into table for each of element

        String response = getMastserBank("1000", "ALL", "ALL", "ALL");
        JSONArray array = new JSONArray();
//        JSONParser parser = new JSONParser();
//        array = (JSONArray) parser.parse();
        System.out.println(response);
    }

    public static String getApInvoice(String comp_code, String bus_area, String doc_no, String fiscal_year, String date_from, String date_to) throws URISyntaxException, IOException {
        CloseableHttpClient httpClient = HttpClients.createDefault();
        URI uri = new URIBuilder("http://10.1.6.103:8000/sap/bc/zmetallica_rest")
                    .setParameter("sap_client", sap_client)
                    .setParameter("interface","IFM081")
                    .setParameter("comp_code", comp_code)
                    .setParameter("bus_area",bus_area)
                    .setParameter("doc_no", doc_no)
                    .setParameter("fiscal_year", fiscal_year)
                    .setParameter("date_from", date_from)
                    .setParameter("date_to", date_to)
                    .setUserInfo("TESTINTF","interface123!")
                    .build();
        HttpGet request = new HttpGet(uri);
        CloseableHttpResponse response = httpClient.execute(request);

        return response.getStatusLine().toString();
    }

    @RequestMapping(value = "/getBank", method = RequestMethod.GET)
    public static String getMastserBank(String comp_code, String bank_country, String house_bank, String bank_key) throws URISyntaxException, IOException {
        CloseableHttpClient httpClient = HttpClients.createDefault();
        URI uri = new URIBuilder("http://10.1.6.101:8000/sap/bc/zmetallica_rest")
                .setParameter("sap_client", sap_client)
                .setParameter("interface","IFM078")
                .setParameter("comp_code", comp_code)
                .setParameter("bank_country",bank_country)
                .setParameter("house_bank", house_bank)
                .setParameter("bank_key", bank_key)
                .setUserInfo("TESTINTF","interface123!")
                .build();
        HttpGet request = new HttpGet(uri);
                request.addHeader("accept","application/json");
        HttpResponse response = httpClient.execute(request);

        return EntityUtils.toString(response.getEntity());
    }
}