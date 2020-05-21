package com.iconpln.liquiditas.core.service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

public class Sapmaster {
    private static final String TAG = Sapmaster.class.getName();
    private String intf = "";
//    private int xsap_client = 400; // dev
    private int xsap_client = 100; // uat/sit/prod
//    private int xsap_client = 890; // training

    public String ai(HashMap<String, Object> param) throws URISyntaxException,IOException {
        String url = AltConfig.get("http://10.1.80.123/sipat/public/api/prk-ao-nonpemeliharaan/2019/ujt1");
//        String response = SapHttp.executeGet(url, param);
        String response = ApacheHttp.executeGet(url, param);
        return  response;
    }

public String getdatasap(Map<String, Object> param) throws URISyntaxException,IOException {
//        String url = AltConfig.get("sap.url_customer");
        String url = AltConfig.get("sap.url")+"?sap-client="+xsap_client+"&interface=IFM079&customer="+param.get("customer")+"&comp_code="+param.get("comp_code")+"&date="+param.get("date");
//        String url = "http://10.1.6.103:8000/sap/bc/zmetallica_rest?sap_client=400&interface=IFM079&customer=ALL&comp_code=1000&date=20190930";
        String response = SapHttp.executeGet(url);
    return response;
}

    public String getDataCustomer(HashMap<String, Object> param) throws URISyntaxException,IOException {
        String url = AltConfig.get("sap.url")+"?sap_client="+xsap_client+"&interface=IFM079&customer="+param.get("customer")+"&comp_code="+param.get("comp_code")+(param.get("date").toString() == null || param.get("date").equals("") ? "":"&date="+param.get("date"));
        String response = SapHttp.executeGet(url);
        return response;
    }

    public String getDataVendor(HashMap<String, Object> param) throws URISyntaxException,IOException {
        System.out.println("param Date : "+param.get("date"));
        String url = AltConfig.get("sap.url")+"?sap-client="+xsap_client+"&interface=IFM077&vendor="+param.get("vendor")+"&comp_code="+param.get("comp_code")+(param.get("date").toString() == null || param.get("date").equals("") ? "" : "&date="+param.get("date"));
        String response = SapHttp.executeGet(url);
        return response;
    }

    public String getDataBank(HashMap<String, Object> param) throws URISyntaxException,IOException {
        String url = AltConfig.get("sap.url")+"?sap-client="+xsap_client+"&interface=IFM078&comp_code="+param.get("comp_code")+"&house_bank="+param.get("house_bank")+"&bank_country="+param.get("bank_country")+"&bank_key="+param.get("bank_key");
        String response = SapHttp.executeGet(url);
        return response;
    }

    public  String getDataApInvoice(HashMap<String, Object> param) throws URISyntaxException,IOException {
        this.intf = "IFM082";
        System.out.println("INI PARAMETER");
        System.out.println("comp_code : "+param.get("comp_code"));
        System.out.println("bus_area : "+param.get("bus_area"));
        System.out.println("doc_no : "+param.get("doc_no"));
        System.out.println("fiscal_year : "+param.get("fiscal_year"));
        System.out.println("date_from : "+param.get("date_from"));
        System.out.println("date_to : "+param.get("date_to"));
        String url = AltConfig.get("sap.url")+"?sap-client="+xsap_client+"&interface=IFM082&comp_code="+param.get("comp_code")+"&bus_area="+param.get("bus_area")+"&doc_no="+param.get("doc_no")+"&fiscal_year="+param.get("fiscal_year")+"&date_from="+param.get("date_from")+"&date_to="+param.get("date_to");
        String response = SapHttp.executeGet(url);
        System.out.println("SAP URL"+url);
        System.out.println("DIAZ GANTENG : "+response);
        return response;
    }

    public  String getDataHrPayable(HashMap<String, Object> param) throws URISyntaxException,IOException {
        this.intf = "IFM081";
        String url = AltConfig.get("sap.url")+"?sap-client="+xsap_client+"&interface=IFM081&comp_code="+param.get("comp_code")+"&bus_area="+param.get("bus_area")+"&doc_no="+param.get("doc_no")+"&fiscal_year="+param.get("fiscal_year")+"&date_from="+param.get("date_from")+"&date_to="+param.get("date_to");
        System.out.println("SAP URL"+url);
        String response = SapHttp.executeGet(url);
        return response;
    }

    public  String getDataPayment(HashMap<String, Object> param) throws URISyntaxException,IOException {
        this.intf = "IFM080";
        String url = AltConfig.get("sap.url")+"?sap-client="+xsap_client+"&interface=IFM080&comp_code="+param.get("comp_code")+"&bus_area="+param.get("bus_area")+"&doc_no="+param.get("doc_no")+"&fiscal_year="+param.get("fiscal_year")+"&date_from="+param.get("date_from")+"&date_to="+param.get("date_to");
        String response = SapHttp.executeGet(url);
        return response;
    }

    public  String getDataHrBillingReceipt(HashMap<String, Object> param) throws URISyntaxException,IOException {
        this.intf = "IFM083";
        String url = AltConfig.get("sap.url")+"?sap-client="+xsap_client+"&interface=IFM083&comp_code="+param.get("comp_code")+"&bus_area="+param.get("bus_area")+"&doc_no="+param.get("doc_no")+"&fiscal_year="+param.get("fiscal_year")+"&date_from="+param.get("date_from")+"&date_to="+param.get("date_to");
        String response = SapHttp.executeGet(url);
        return response;
    }
}