package com.iconpln.liquiditas.core.service;

import com.iconpln.liquiditas.core.settings.RecaptchaSetting;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.core.utils.RecaptchaUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import spark.utils.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.util.stream.Collectors;

public class RecaptchaService {
    @Value("${google.recaptcha.key.secret}")
    private String recaptchaSecret;

    private static final String GOOGLE_CAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    @Autowired
    RestTemplateBuilder restTemplateBuilder;

    public String verifyRecaptcha(String ip, String recaptchaResponse){
        Map<String, String> body = new HashMap<>();
        body.put("secret", recaptchaSecret);
        body.put("response", recaptchaResponse);
        body.put("remoteip",ip);
        AppUtils.getLogger(this).info("Request Body for recaptcha : {}",body);
        ResponseEntity<Map> recaptchaResponseEntity = restTemplateBuilder.build()
                .postForEntity(GOOGLE_CAPTCHA_VERIFY_URL+"?secret={secret}&response={response}&remoteip={remoteip}", body, Map.class, body);
        AppUtils.getLogger(this).info("Response from recaptcha : {}",recaptchaResponseEntity);
        Map<String, Object> responseBody = recaptchaResponseEntity.getBody();
        boolean recaptchaSuccess = (Boolean) responseBody.get("success");
        if ( !recaptchaSuccess) {
            List<String> errorCodes =
                    (List)responseBody.get("error-codes");

            String errorMessage = errorCodes.stream()
                    .map(s -> RecaptchaUtils.RECAPTCHA_ERROR_CODE.get(s))
                    .collect(Collectors.joining(", "));

            return errorMessage;
        }else {
            return "OK";
        }
    }

    public ResponseEntity<?> captcha (HttpServletRequest request){
        String ip = request.getRemoteAddr();
        String captchaVerifyMessage = verifyRecaptcha(ip, request.getParameter("g-recaptcha-response"));
        if (StringUtils.isNotEmpty(captchaVerifyMessage)){
            Map<String, Object> response = new HashMap<>();
            response.put("message", captchaVerifyMessage);
            return ResponseEntity.badRequest()
                    .body(response);
        }
        return ResponseEntity.ok().build();
    }
}
