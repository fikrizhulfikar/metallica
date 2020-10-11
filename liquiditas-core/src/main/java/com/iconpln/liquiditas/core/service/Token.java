package id.co.pln.iconplus.engine.services;

import org.apache.commons.codec.binary.Base64;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class Token {

    private static final String corpay_ip = "10.1.80.210"; // <= production

    public static String getToken(){
        String usernameColonPassword = "CORPAY:C0RP4Y_M3t4LL1C4@2020";
        String basicAuthPayload = "Basic " + Base64.encodeBase64String(usernameColonPassword.getBytes());
        String token = null;

        BufferedReader httpResponseReader = null;
        try {
            // Connect to the web server endpoint
            URL serverUrl = new URL("http://"+corpay_ip+":8181/gettoken");
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
//                System.out.println(lineRead);
                result = lineRead;
            }
            JSONObject data = new JSONObject(result);
            token = data.getJSONObject("data").getString("token");
//            System.out.println(token);

        } catch (IOException | JSONException ioe) {
            ioe.printStackTrace();
        }
        return token;
    }
}
