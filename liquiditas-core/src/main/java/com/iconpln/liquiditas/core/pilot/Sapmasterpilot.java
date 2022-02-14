package com.iconpln.liquiditas.core.pilot;

import com.iconpln.liquiditas.core.Alt;
import com.iconpln.liquiditas.core.service.AltConfig;
import com.iconpln.liquiditas.core.service.SapHttp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

@Component
public class Sapmasterpilot {
    @Autowired
    SapHttp sapHttp;
    //dev
//    private String xsap_client= "400";

//    prod
    @Value("${xsap_client}")
    private String xsap_client;
    private static final Logger logger = LoggerFactory.getLogger(Sapmasterpilot.class);

    @Value("${sappilot.url}")
    private String base_Url;

    @Value("${sapvendorportal.url}")
    private String vendorPortalBaseUrl ;

    public Map<String, String> getDataInvoiceOSS(Map param) throws URISyntaxException {
        Map<String, String> result = new HashMap<>();
        String url = base_Url +"/zpc_rest?sap-client="+xsap_client+"&interface=IFM092&comp_code="+param.get("comp_code")+"&doc_no="+param.get("doc_no")+"&fiscal_year="+param.get("fiscal_year")+"&date_from="+param.get("date_from")+"&date_to="+param.get("date_to");
        String response = sapHttp.pilotExecuteGet(url);
        result.put("url",url);
        result.put("response",response);
        System.out.println("SAP Pilot Url : "+url);
        return result;
    }

    public Map<String, String> getInvoiceNonVendor(Map param) throws URISyntaxException {
        Map<String, String> result = new HashMap<>();
        String url = base_Url +"/zws_get_pay_req?sap-client="+xsap_client+"&interface=IFM107&comp_code="+param.get("comp_code")+"&DOC_NO="+param.get("doc_no")+"&fiscal_year="+param.get("fiscal_year")+"&date_to="+param.get("date_to")+"&date_from="+param.get("date_from");
        String response = sapHttp.pilotExecuteGet(url);
        result.put("url", url);
        result.put("response",response);
        logger.info("Invoice Non Vendor : {}",result);
        return result;
    }

    public Map<String, String> getRealisasiInvoice(Map <String, String> param) throws URISyntaxException{
        Map<String, String> result = new HashMap<>();
        String url = base_Url +"/zws_get_paytran?sap-client="+xsap_client+"&interface=IFM108&comp_code="+param.get("comp_code")+"&DOC_NO="+param.get("doc_no")+"&fiscal_year="+param.get("fiscal_year")+"&bus_area="+param.get("bus_area")+"&oss_id="+param.get("oss_id")+"&date_to="+param.get("date_to")+"&date_from="+param.get("date_from");
        String response = sapHttp.pilotExecuteGet(url);
        result.put("url", url);
        result.put("response",response);
        logger.info("Invoice Lunas Pilot : {}",result);
        return result;
    }

    public Map<String, String> getApInvoice(Map<String, String> param) throws URISyntaxException {
        Map<String, String> result = new HashMap<>();
        String url = base_Url + "/zmetallica_rest?sap-client="+xsap_client+"&interface=IFM082&comp_code="+param.get("comp_code")+"&bus_area="+param.get("bus_area")+"&doc_no="+param.get("doc_no")+"&fiscal_year="+param.get("fiscal_year")+"&date_from="+param.get("date_from")+"&date_to="+param.get("date_to");
        String response = sapHttp.pilotExecuteGet(url);
        result.put("url", url);
        result.put("response",response);
        logger.info("AP Invoice New : {}",result);
        return result;
    }

    public Map<String, String> getHrPayable(Map<String, String> param) throws URISyntaxException {
        Map<String, String> result = new HashMap<>();
        String url = base_Url + "/zmetallica_rest?sap-client="+xsap_client+"&interface=IFM081&comp_code="+param.get("comp_code")+"&bus_area="+param.get("bus_area")+"&doc_no="+param.get("doc_no")+"&fiscal_year="+param.get("fiscal_year")+"&date_from="+param.get("date_from")+"&date_to="+param.get("date_to");
        String response = sapHttp.pilotExecuteGet(url);
        result.put("url", url);
        result.put("response",response);
        logger.info("AP Invoice New : {}",result);
        return result;
    }

    public Map<String, String> getInvoiceVendorPortal(Map<String, String> params) throws URISyntaxException {
        Map<String, String> result = new HashMap<>();
        String url = vendorPortalBaseUrl + "invoice-payment/metallica?startDate="+params.get("dateFrom")+"&endDate="+params.get("dateTo");
        String response = sapHttp.pilotExecuteGetVndorPortal(url);
        result.put("url",url);
        result.put("response", response);
        logger.info("Invoice Vendor Portal (Draft) : {}",response);
        return result;
    }
}
