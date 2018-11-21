package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.ValasService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * @author liquiditas 2018/11/21
 */
@RestController
@RequestMapping("/api_cleansing")
public class CleansingController {

    @Autowired
    private ValasService valasService;

    @PostMapping("/cleansing")
    public String cleansing(@RequestParam("id_valas") String idValas) {
        return valasService.cleansing(idValas, WebUtils.getUsernameLogin());
    }

    @PostMapping("/multi_cleansing")
    public Map<String, Object> multiCleansing(@RequestParam("data") String data) {
        Map<String, Object> out = new HashMap<>();
        String jsonString = valasService.getPerfectJsonString(data);
        String[] listData = jsonString.split(";");
        JSONObject json ;


        for (String item : listData) {
            json = new JSONObject(item);
            Iterator<?> keys = json.keys();
            while (keys.hasNext()) {
                String key = (String) keys.next();
                String value = json.getString(key);

                if (!key.equals("x") && !key.equals("jenisPembayaran") && !key.equals("total") && !key.equals("currency")) {
                    try {
                        String response = valasService.cleansing(value, WebUtils.getUsernameLogin());
                        out.put("response", response);
                    } catch (Exception e) {
                        e.printStackTrace();
                        out = null;
                        break;
                    }
                }
            }
        }

        AppUtils.getLogger(this).debug("multiCleansing : {} ", out);
        return out;
    }

}
