package com.iconpln.liquiditas.monitoring.controller.operator;

import com.iconpln.liquiditas.core.service.DashboardService;
import net.sf.jxls.transformer.XLSTransformer;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by israjhaliri on 8/28/17.
 */
@RestController
@RequestMapping("api_operator/api_report")
public class ReportController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private ResourceLoader resourceLoader;

    @RequestMapping(value = "/xls_example", method = RequestMethod.GET)
    public String export(HttpServletRequest request, HttpServletResponse response) {
        try {

            ServletOutputStream os = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition", "attachment; filename=\"report-example.xls\"");

            Map param = new HashMap();
            param.put("EXAMPLE", "israj.haliri@gmail.com");
            List<Map<String,Object>> listDetail = new ArrayList<>();
            Map detail = new HashMap();
            detail.put("VALUE","value detail No. 1");
            listDetail.add(detail);
            detail.put("VALUE","value detail No. 2");
            listDetail.add(detail);
            param.put("DETAILS",listDetail);


            XLSTransformer transformer = new XLSTransformer();
            InputStream streamTemplate = resourceLoader.getResource("classpath:/templates/report/report-example.xls").getInputStream();
            Workbook workbook = transformer.transformXLS(streamTemplate, param);
            workbook.write(os);
            os.flush();
            return null;
        }  catch (Exception e) {
            e.printStackTrace();
            return "Gagal Export Data :"+e.getMessage();
        }
    }

    @GetMapping(path = "/saldo_awal")
    public Map listDashboardSaldo(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboard(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }

    @GetMapping(path = "/saldo_realisasi")
    public Map listDashboardRealisasi(@RequestParam(value = "tanggal") String tanggal){
        List<Map<String, Object>> list = new ArrayList<>();

        try {
            list = dashboardService.getDashboardRealisasi(tanggal);
        }catch (Exception e){
            e.printStackTrace();
        }

        Map mapData = new HashMap();
        mapData.put("data", list);

        return mapData;
    }
}
