package com.iconpln.liquiditas.core.pilot;

import com.iconpln.liquiditas.core.alt.AltException;
import com.iconpln.liquiditas.core.service.Sap;
import org.apache.chemistry.opencmis.commons.impl.json.parser.JSONParser;
import org.apache.chemistry.opencmis.commons.impl.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import spark.utils.IOUtils;

import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

@Repository
public class SapPilot {

    @Autowired
    private SapPilotService sapPilotService;

    JSONParser parser = new JSONParser();
    Map<String, String> param = new HashMap<>();
    Map result = new HashMap();

    public Map<String, Object> getInvoice (String pCompanyCode, String pBusArea, String pDocNo, String pFiscYear, String pDatefrom, String pDateTo) throws IOException, URISyntaxException, AltException {
        String header_data = "";
        String item_data = "";
        Map<String, Object> out = new HashMap<>();
        result.clear();
        try {
            param.clear();
            param.put("comp_code",pCompanyCode);
            param.put("bus_area",pBusArea);
            param.put("doc_no",pDocNo);
            param.put("fiscal_year",pFiscYear);
            param.put("date_from",pDatefrom);
            param.put("date_to",pDateTo);

            Sapmasterpilot sapmasterpilot = new Sapmasterpilot();
//
//            ClassLoader classLoader = Sap.class.getClassLoader();
//            InputStream inputStream = classLoader.getResourceAsStream("files/ap.json");
//            assert inputStream != null;
//            String res = IOUtils.toString(inputStream);
            Map get_result = sapmasterpilot.getDataInvoice(param);

//            JSONObject object = (JSONObject) parser.parse(res);
            JSONObject object = (JSONObject) parser.parse(get_result.get("response").toString());
            if(object.get("ERROR_CODE") == null){
                result.put("status",200);
                header_data = (object.get("HEADER_DATA") != null) ? object.get("HEADER_DATA").toString() : "";
                item_data = (object.get("ITEM_DATA") != null) ? object.get("ITEM_DATA").toString() : "" ;
            }else if(object.get("ERROR_CODE") != null){
                result.put("status",Integer.parseInt(object.get("ERROR_CODE").toString()));
                result.put("status_message",object.get("ERROR_MESSAGE").toString());
            }

//            String list = "["+res+"]";
            String list = "["+get_result.get("response").toString()+"]";
            System.out.println("List Invoice:"+list);
            out = sapPilotService.insertIntoLogIntegrationSapPilot("INVOICE",list,header_data,item_data,result.get("status").toString(),param.toString(),get_result.get("url").toString());

        }catch (Exception e){
            e.printStackTrace();
            result.put("status", 500);
            result.put("status_message", "Error On The Server");
        }
        result.put("description",out);
        return result;
    }
}
