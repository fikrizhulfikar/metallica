package com.iconpln.liquiditas.core.pilot;

import com.iconpln.liquiditas.core.service.AltConfig;
import com.iconpln.liquiditas.core.service.SapHttp;
import org.springframework.stereotype.Component;

import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

@Component
public class Sapmasterpilot {
    private String xsap_client= "400";

    public Map<String, String> getDataInvoice(Map param) throws URISyntaxException {
        Map<String, String> result = new HashMap<>();
        String url = AltConfig.get("sappilot.url")+"?sap-client="+xsap_client+"&interface=IFM092&comp_code="+param.get("comp_code")+"&doc_no="+param.get("doc_no")+"&fiscal_year="+param.get("fiscal_year")+"&date_from="+param.get("date_from")+"&date_to="+param.get("date_to");
        String response = SapHttp.pilotExecuteGet(url);
        result.put("url",url);
        result.put("response",response);
        System.out.println("SAP Pilot Url : "+url);
        return result;
    }
}
