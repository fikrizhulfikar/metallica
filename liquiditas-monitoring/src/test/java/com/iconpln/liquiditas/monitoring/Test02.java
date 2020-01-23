package com.iconpln.liquiditas.monitoring;

import com.iconpln.liquiditas.monitoring.utils.NamedIdentifier;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;

public class Test02 {

    @Test
    public void ini() throws JSONException {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("menu_id", NamedIdentifier.REKAP_PEMBAYARAN.getValue());
        jsonObject.put("data_id", "d");
        System.out.println(jsonObject);
    }

    @Test
    public void test(){
        String tes="\\\"asda\\\"";
        System.out.println(tes.replaceAll("\\\\\"", ""));

    }
}
