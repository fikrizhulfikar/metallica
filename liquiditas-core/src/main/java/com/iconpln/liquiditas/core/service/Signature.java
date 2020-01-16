package id.co.pln.iconplus.engine.services;

import org.apache.commons.codec.binary.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.logging.Logger;

public class Signature {
    private static Logger log;
    public static String createSignature(String apikey, String body, String timestamp) {
        String hash = "";
        try {
            String key = apikey + timestamp;
            String signature = body;
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            hash = Base64.encodeBase64String(sha256_HMAC.doFinal(signature.getBytes()));
//            System.out.println("signature : " + hash);
        } catch (Exception e) {
            log.warning(e.getMessage());
        }
        return hash;
    }
}
