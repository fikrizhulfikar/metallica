package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.CorpayService;
import com.iconpln.liquiditas.core.service.ValasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Created by Elvan.D on 1/23/2018
 */

@RestController
@RequestMapping("/api_operator/tracking")
public class TrackingController {

    @Autowired
    ValasService valasService;

    @Autowired
    CorpayService corpayService;


    @RequestMapping(value = "/get_data", method = RequestMethod.GET)
    @ResponseBody
    public Map getData(
            @RequestParam(value = "pSearch", defaultValue = "") String pSearch
    ) {
        try {
            return corpayService.getAllTracking(pSearch);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_detail_tracking", method = RequestMethod.GET)
    @ResponseBody
    public Map getDetailTracking(
            @RequestParam(value = "pCompCode", defaultValue = "") String pCompCode,
            @RequestParam(value = "pDocNo", defaultValue = "") String pDocNo,
            @RequestParam(value = "pFiscYear", defaultValue = "") String pFiscYear,
            @RequestParam(value = "pLineItem", defaultValue = "") String pLineItem,
            @RequestParam(value = "pOssId", defaultValue = "") String pOssId
    ) {
        try {
            return corpayService.getDetailTracking(pCompCode, pDocNo, pFiscYear, pLineItem, pOssId);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }
}
