package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.ValasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Created by israj on 10/4/2016.
 */
@RestController
@RequestMapping("/api_operator/kurs")
public class KursController {

    @Autowired
    ValasService valasService;

    @RequestMapping(value = "/get_data", method = RequestMethod.GET)
    public Map getData() {
        try {
            return valasService.getAllKurs();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }
}
