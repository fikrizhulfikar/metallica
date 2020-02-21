package com.iconpln.liquiditas.monitoring.controller.operator;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    private NotificationUtil notificationUtil;

    @Autowired
    private ResourceLoader resourceLoader;

    @RequestMapping(value = "/get_apinvoice", method = RequestMethod.POST)
    public String getApInvoice(
            @RequestParam(value = "pCompanyCode", defaultValue = "") String pCompanyCode,
            @RequestParam(value = "pBusArea", defaultValue = "") String pBusArea,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value ="pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value ="pDateFrom", defaultValue = "") String pDatefrom,
            @RequestParam(value = "pDateTo", defaultValue = "") String pDateTo
            ){
        try {
//            Map<String, String> param = new HashMap<>();

            Object res = sap.getApInvoice(pCompanyCode, pBusArea, pDocNo, pFiscYear, pDatefrom, pDateTo);
            // if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {

            //  }
            return res.toString();
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
//

            Map<String, Object> res = sap.getHrPayable(pCompanyCode, pBusArea, pDocNo, pFiscYear, pDatefrom, pDateTo);
             if (((BigDecimal) res.get("return")).equals(BigDecimal.ONE)) {

              }
            return res;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
