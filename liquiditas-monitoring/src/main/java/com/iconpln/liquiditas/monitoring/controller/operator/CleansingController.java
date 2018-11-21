package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.ValasService;
import com.iconpln.liquiditas.monitoring.utils.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author liquiditas 2018/11/21
 */
@RestController
@RequestMapping("/api_cleansing")
public class CleansingController {

    @Autowired
    private ValasService valasService;

    @PostMapping("/cleansing")
    public String cleansing(@RequestParam("id_valas") String idValas) {
        return valasService.cleansing(idValas, WebUtils.getUsernameLogin());
    }

}
