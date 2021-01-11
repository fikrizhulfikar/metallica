package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.DashboardService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping(path = "/api_operator/dashboard_evp")
public class DashboardEVPController {
    @Autowired
    DashboardService dashboardService;

    @GetMapping(path = "/get_data_rencana")
    public Map<String, Object> getRencanaPembayaranEVP(){
        try {
            return dashboardService.getDashboardRencanaEVP();
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

    @GetMapping(path = "/get_data_realisasi")
    public Map<String, Object> getRealisasiPembayaranEVP(){
        try {
            return dashboardService.getDashboardRealisasiEVP();
        } catch (Exception e) {
            AppUtils.getLogger(this).debug(e.getMessage());
            return null;
        }
    }

}
