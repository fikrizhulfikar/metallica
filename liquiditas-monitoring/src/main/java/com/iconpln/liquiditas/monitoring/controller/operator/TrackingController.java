package com.iconpln.liquiditas.monitoring.controller.operator;

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


    @RequestMapping(value = "/get_data", method = RequestMethod.GET)
    @ResponseBody
    public Map getData(
            @RequestParam(value = "pSearch", defaultValue = "") String pSearch
    ) {
        try {
            return valasService.getAllTracking(pSearch);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/get_detail_tracking", method = RequestMethod.GET)
    @ResponseBody
    public Map getDetailTracking(
            @RequestParam(value = "pIdValas", defaultValue = "") String pIdValas
    ) {
        try {
            return valasService.getDetailTracking(pIdValas);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }
}
