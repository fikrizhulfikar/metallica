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
