package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.ValasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public Map getData(
            @RequestParam(value = "pNoTagihan", defaultValue = "") String pNoTagihan
    ) {
        try {
            return valasService.getAllTracking(pNoTagihan);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
