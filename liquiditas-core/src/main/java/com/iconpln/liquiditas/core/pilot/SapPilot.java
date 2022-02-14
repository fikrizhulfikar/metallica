package com.iconpln.liquiditas.core.pilot;

import com.iconpln.liquiditas.core.alt.AltException;
import com.iconpln.liquiditas.core.service.Sap;
import org.apache.chemistry.opencmis.commons.impl.json.parser.JSONParser;
import org.apache.chemistry.opencmis.commons.impl.json.JSONObject;
import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import spark.utils.IOUtils;

import javax.enterprise.inject.Any;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

@Repository
public class SapPilot {
    private static final Logger logger = LoggerFactory.getLogger(SapPilot.class);

    @Autowired
    private Sapmasterpilot sapmasterpilot;

    @Autowired
    private SapPilotService sapPilotService;

    private JSONParser parser = new JSONParser();
    private Map<String, String> param = new HashMap<>();
    private Map<String, Object> result = new HashMap<>();

    public Map<String, Object> getInvoiceOss (String pCompanyCode, String pBusArea, String pDocNo, String pFiscYear, String pDatefrom, String pDateTo) throws IOException, URISyntaxException, AltException {
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

            Map get_result = sapmasterpilot.getDataInvoiceOSS(param);

            JSONObject object = (JSONObject) parser.parse(get_result.get("response").toString());
            if(object.get("ERROR_CODE") == null){
                result.put("status",200);
                header_data = (object.get("HEADER_DATA") != null) ? object.get("HEADER_DATA").toString() : "";
                item_data = (object.get("ITEM_DATA") != null) ? object.get("ITEM_DATA").toString() : "" ;
            }else if(object.get("ERROR_CODE") != null){
                result.put("status",Integer.parseInt(object.get("ERROR_CODE").toString()));
                result.put("status_message",object.get("ERROR_MESSAGE").toString());
            }

            String list = "["+get_result.get("response").toString()+"]";
            System.out.println("List Invoice:"+list);
            out = sapPilotService.insertIntoLogIntegrationSapPilot("INVOICE_OSS",list,header_data,item_data,result.get("status").toString(),param.toString(),get_result.get("url").toString());

        }catch (Exception e){
            e.printStackTrace();
            result.put("status", 500);
            result.put("status_message", "Error On The Server");
        }
        result.put("description",out);
        return result;
    }

    //get pinbuk, valas, dan operasi khusus
    public Map<String, Object> getInvoiceNonVendor (String pCompanyCode, String pDocNo, String pFiscYear, String pBusArea, String pOssId, String pDatefrom, String pDateTo) throws IOException, URISyntaxException, AltException {
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
            param.put("oss_id",pOssId);

            Map<String, String> get_result = sapmasterpilot.getInvoiceNonVendor(param);

            JSONObject object = (JSONObject) parser.parse(get_result.get("response"));

            if(object.get("xdata") != null){
                JSONObject xdata =  (JSONObject) parser.parse(object.get("xdata").toString());
                header_data = (xdata.get("header") != null) ? xdata.get("header").toString() : "";
                item_data = (xdata.get("item") != null) ? xdata.get("item").toString() : "" ;
            }else if(object.get("ERROR_CODE") != null){
                result.put("status",Integer.parseInt(object.get("ERROR_CODE").toString()));
                result.put("status_message",object.get("ERROR_MESSAGE").toString());
            }
//
            String list = "["+object.toString()+"]";
            out = sapPilotService.insertIntoLogIntegrationSapPilot("PINBUK_OPSUS_PEMVAL",list,header_data,item_data,result.get("status").toString(),param.toString(),get_result.get("url").toString());
            logger.info("insert to clob {} :",out);
        }catch (Exception e){
            e.printStackTrace();
            result.put("status", 500);
            result.put("status_message", "Error On The Server");
        }
        result.put("description",out);
        return result;
    }

    public Map<String, Object> getInvoiceLunas (String pCompanyCode, String pDocNo, String pFiscYear, String pBusArea, String pOssId, String pDatefrom, String pDateTo) throws IOException, URISyntaxException, AltException {
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
            param.put("oss_id",pOssId);

            Map<String, String> get_result = sapmasterpilot.getRealisasiInvoice(param);
            org.json.JSONObject object = new org.json.JSONObject(get_result);
            Object item = object.get("response");

            if(item instanceof String){
                if(((String) item).charAt(0) == '['){
                    JSONArray jsonArray = new JSONArray(item.toString());
                    if(jsonArray.length() > 0){
                        result.put("status",200);
                        header_data = jsonArray.toString();
                        item_data = "" ;
                    }else {
                        result.put("status",444);
                        result.put("status_message","Unknown Error");
                    }
                }else {
                    org.json.JSONObject jsonObject = new org.json.JSONObject(item.toString());
                    if(jsonObject.get("ERROR_CODE") != null){
                        result.put("status",Integer.parseInt(jsonObject.get("ERROR_CODE").toString()));
                        result.put("status_message",jsonObject.get("ERROR_MESSAGE").toString());
                    }
                }
            }
//
            String list = "["+get_result.get("response")+"]";
            out = sapPilotService.insertIntoLogIntegrationSapPilot("REALISASI_INVOICE",list,header_data,item_data,result.get("status").toString(),param.toString(),get_result.get("url").toString());
            logger.info("insert to clob {} :",out);
        }catch (Exception e){
            e.printStackTrace();
            result.put("status", 500);
            result.put("status_message", "Error On The Server");
        }
        result.put("description",out);
        return result;
    }

    public Map<String, Object> getApInvoice (String pCompanyCode, String pDocNo, String pFiscYear, String pBusArea, String pDatefrom, String pDateTo) throws IOException, URISyntaxException, AltException {
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

            Map<String, String> get_result = sapmasterpilot.getApInvoice(param);

            JSONObject object = (JSONObject) parser.parse(get_result.get("response"));
            if(object.get("ERROR_CODE") == null){
                result.put("status",200);
                header_data = (object.get("HEADER_DATA") != null) ? object.get("HEADER_DATA").toString() : "";
                item_data = (object.get("ITEM_DATA") != null) ? object.get("ITEM_DATA").toString() : "" ;
            }else if(object.get("ERROR_CODE") != null){
                result.put("status",Integer.parseInt(object.get("ERROR_CODE").toString()));
                result.put("status_message",object.get("ERROR_MESSAGE").toString());
            }
//
            String list = "["+get_result.get("response")+"]";
            out = sapPilotService.insertIntoLogIntegrationSapPilot("AP_INVOICE",list,header_data,item_data,result.get("status").toString(),param.toString(),get_result.get("url").toString());
            logger.info("insert to clob {} :",out);
        }catch (Exception e){
            e.printStackTrace();
            result.put("status", 500);
            result.put("status_message", "Error On The Server");
        }
        result.put("description",out);
        return result;
    }

    public Map<String, Object> getHrPayable (String pCompanyCode, String pDocNo, String pFiscYear, String pBusArea, String pDatefrom, String pDateTo) throws IOException, URISyntaxException, AltException {
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

            Map<String, String> get_result = sapmasterpilot.getHrPayable(param);

            JSONObject object = (JSONObject) parser.parse(get_result.get("response"));
            if(object.get("ERROR_CODE") == null){
                result.put("status",200);
                header_data = (object.get("HEADER_DATA") != null) ? object.get("HEADER_DATA").toString() : "";
                item_data = (object.get("ITEM_DATA") != null) ? object.get("ITEM_DATA").toString() : "" ;
            }else if(object.get("ERROR_CODE") != null){
                result.put("status",Integer.parseInt(object.get("ERROR_CODE").toString()));
                result.put("status_message",object.get("ERROR_MESSAGE").toString());
            }
//
            String list = "["+get_result.get("response")+"]";
            out = sapPilotService.insertIntoLogIntegrationSapPilot("HR_PAYABLE",list,header_data,item_data,result.get("status").toString(),param.toString(),get_result.get("url").toString());
            logger.info("insert to clob {} :",out);
        }catch (Exception e){
            e.printStackTrace();
            result.put("status", 500);
            result.put("status_message", "Error On The Server");
        }
        result.put("description",out);
        return result;
    }

    public Map<String, Object> getInvoiceVendorPortal (String pDateFrom, String pDateTo) throws IOException, URISyntaxException, AltException {
        String header_data = "";
        String item_data = "";
        Map<String, Object> out = new HashMap<>();
        result.clear();
        try {
            param.clear();
            param.put("dateFrom",pDateFrom);
            param.put("dateTo",pDateTo);

            Map<String, String> get_result = sapmasterpilot.getInvoiceVendorPortal(param);

            JSONObject object = (JSONObject) parser.parse(get_result.get("response"));
            System.out.println("Response Portal"+object.toString());
            if(object.get("status").toString().equals("success")){
                org.apache.chemistry.opencmis.commons.impl.json.JSONArray arr = (org.apache.chemistry.opencmis.commons.impl.json.JSONArray) object.get("data");
                result.put("status",200);
                header_data = (arr.size() != 0) ? arr.toString() : "";
                item_data = "";
            }else {
                result.put("status",500);
                result.put("status_message",object.get("status").toString());
            }
//
            String list = object.get("data").toString();
            out = sapPilotService.insertIntoLogIntegrationSapPilot("VENDOR_PORTAL",list,header_data,item_data,result.get("status").toString(),param.toString(),get_result.get("url").toString());
            logger.info("insert to clob {} :",out);
        }catch (Exception e){
            e.printStackTrace();
            result.put("status", 500);
            result.put("status_message", "Error On The Server");
        }
        result.put("description",out);
        return result;
    }
}
