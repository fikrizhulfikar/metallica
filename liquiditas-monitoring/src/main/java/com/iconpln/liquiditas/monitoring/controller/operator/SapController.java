package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.pilot.SapPilot;
import com.iconpln.liquiditas.core.service.Sap;
import com.iconpln.liquiditas.core.utils.AppUtils;
import com.iconpln.liquiditas.monitoring.utils.NotificationUtil;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.io.ResourceLoader;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by israj on 10/4/2016.
 */


@RestController
@RequestMapping("/api_master/integrasi_sap")
public class SapController {

    @Autowired
     Sap sap;

    @Autowired
    private SapPilot sapPilot;

    @Autowired
    private NotificationUtil notificationUtil;

    @Autowired
    private ResourceLoader resourceLoader;

    @RequestMapping(value = "/get_apinvoice", method = RequestMethod.POST)
    public Map<String, Object> getApInvoice(
            @RequestParam(value = "pCompanyCode", defaultValue = "") String pCompanyCode,
            @RequestParam(value = "pBusArea", defaultValue = "") String pBusArea,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value ="pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value ="pDateFrom", defaultValue = "") String pDatefrom,
            @RequestParam(value = "pDateTo", defaultValue = "") String pDateTo
            ){
        try {
//            Map<String, String> param = new HashMap<>();

            Map<String, Object> res = sap.getApInvoice(pCompanyCode, pBusArea, pDocNo, pFiscYear, pDatefrom, pDateTo);
            // if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {

            //  }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_hr_payable", method = RequestMethod.POST)
    public Map<String, Object> getHrPayable(
            @RequestParam(value = "pCompanyCode", defaultValue = "") String pCompanyCode,
            @RequestParam(value = "pBusArea", defaultValue = "") String pBusArea,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value ="pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value ="pDateFrom", defaultValue = "") String pDatefrom,
            @RequestParam(value = "pDateTo", defaultValue = "") String pDateTo
    ){
        try {
            Map<String, Object> res = sap.getHrPayable(pCompanyCode, pBusArea, pDocNo, pFiscYear, pDatefrom, pDateTo);
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/get_customer")
    public Map getMasterCustomer(
            @RequestParam(value = "pDate") String date,
            @RequestParam(value = "pCustomerNo") String customer,
            @RequestParam(value = "pCompCode") String comp_code
    ){
        try {
            Map<String, Object> result= sap.getCustomer(date, customer, comp_code);
            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/get_vendor")
    public Map<String, Object> getMasterVendor(
            @RequestParam(value = "pDate") String date,
            @RequestParam(value = "pVendorNo") String vendor,
            @RequestParam(value = "pCompCode") String comp_code
    ){
        try {
            Map<String, Object> result = sap.getVendor(date, vendor, comp_code);
            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/get_payment_house_bank")
    public Map<String, Object> getMasterPaymentHouseBank(
            @RequestParam(value = "pCompCode") String comp_code,
            @RequestParam(value = "pHouseBank") String house_bank,
            @RequestParam(value = "pBankCountry") String bank_country,
            @RequestParam(value = "pBankKey") String bank_key
    ){
        try {
            Map<String, Object> result = sap.getPaymentHouaseBank(comp_code, house_bank, bank_country,bank_key);
            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/get_general_bank")
    public Map<String, Object> getMasterGeneralBank(
            @RequestParam(value = "pCompCode") String comp_code,
            @RequestParam(value = "pHouseBank") String house_bank,
            @RequestParam(value = "pBankCountry") String bank_country,
            @RequestParam(value = "pBankKey") String bank_key
    ){
        try {
            Map<String, Object> result = sap.getGeneralHouseBank(comp_code, house_bank, bank_country,bank_key);
            return result;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/get_invoice_pilot")
    public Map<String, Object> getInvoicePilot(
            @RequestParam(value = "pCompanyCode", defaultValue = "") String pCompanyCode,
            @RequestParam(value = "pBusArea", defaultValue = "") String pBusArea,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value ="pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value ="pDateFrom", defaultValue = "") String pDatefrom,
            @RequestParam(value = "pDateTo", defaultValue = "") String pDateTo
    ){
        try {
//            Map<String, String> param = new HashMap<>();

            Map<String, Object> res = sapPilot.getInvoice(pCompanyCode, pBusArea, pDocNo, pFiscYear, pDatefrom, pDateTo);
            // if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {

            //  }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/get_invoice_nonvendor_pilot")
    public Map<String, Object> getInvoiceNonVendorPilot(
            @RequestParam(value = "pCompanyCode", defaultValue = "") String pCompanyCode,
            @RequestParam(value = "pBusArea", defaultValue = "") String pBusArea,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value ="pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value ="pDateFrom", defaultValue = "") String pDatefrom,
            @RequestParam(value = "pDateTo", defaultValue = "") String pDateTo,
            @RequestParam(value = "pOssId", defaultValue = "") String pOssId
    ){
        try {
//            Map<String, String> param = new HashMap<>();

            Map<String, Object> res = sapPilot.getInvoiceNonVendor(pCompanyCode, pDocNo, pFiscYear, pBusArea, pOssId, pDatefrom, pDateTo);
            // if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {

            //  }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/get_invoice_lunas_pilot")
    public Map<String, Object> getInvoiceLunasPilot(
            @RequestParam(value = "pCompanyCode", defaultValue = "") String pCompanyCode,
            @RequestParam(value = "pBusArea", defaultValue = "") String pBusArea,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value ="pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value ="pDateFrom", defaultValue = "") String pDatefrom,
            @RequestParam(value = "pDateTo", defaultValue = "") String pDateTo,
            @RequestParam(value = "pOssId", defaultValue = "") String pOssId
    ){
        try {
//            Map<String, String> param = new HashMap<>();

            Map<String, Object> res = sapPilot.getInvoiceLunas(pCompanyCode, pDocNo, pFiscYear, pBusArea, pOssId, pDatefrom, pDateTo);
            // if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {

            //  }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/get_apinvoice_new")
    public Map<String, Object> getApInvoiceNew(
            @RequestParam(value = "pCompanyCode", defaultValue = "") String pCompanyCode,
            @RequestParam(value = "pBusArea", defaultValue = "") String pBusArea,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pFiscalYear", defaultValue = "") String pFiscalYear,
            @RequestParam(value = "pDateFrom", defaultValue = "") String pDateFrom,
            @RequestParam(value = "pDateTo", defaultValue = "") String pDateTo,
            @RequestParam(value = "pOssId", defaultValue = "") String pOssId
    ){
        try {
            Map<String, Object> res = sapPilot.getApInvoice(pCompanyCode, pDocNo, pFiscalYear, pBusArea, pDateFrom, pDateTo);
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/get_hrpayable_new")
    public Map<String, Object> getHrPayableNew(
            @RequestParam(value = "pCompanyCode", defaultValue = "") String pCompanyCode,
            @RequestParam(value = "pBusArea", defaultValue = "") String pBusArea,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pFiscalYear", defaultValue = "") String pFiscalYear,
            @RequestParam(value = "pDateFrom", defaultValue = "") String pDateFrom,
            @RequestParam(value = "pDateTo", defaultValue = "") String pDateTo
    ){
        try {
            Map<String, Object> res = sapPilot.getHrPayable(pCompanyCode, pDocNo, pFiscalYear, pBusArea, pDateFrom, pDateTo);
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/get_invoice_vendor_portal")
    public Map<String, Object> getInvoiceVendorPortal(
            @RequestParam(value = "pDate", defaultValue = "") String pDate
    ){
        try {
            Map<String, Object> res = sapPilot.getInvoiceVendorPortal(pDate);
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
