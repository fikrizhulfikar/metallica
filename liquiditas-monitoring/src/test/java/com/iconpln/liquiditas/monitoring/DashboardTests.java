package com.iconpln.liquiditas.monitoring;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iconpln.liquiditas.core.service.DashboardService;
import com.iconpln.liquiditas.core.service.ValasService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationHome;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DashboardTests {


    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private ValasService valasService;

    @Test
    public void getDataDashboard() throws SQLException {
        Map<String, Object> res = dashboardService.getHedging(((1 / 10) + 1), 10);
        logger.info("res : {}", res);
        List str = (List) res.get("return");
        logger.info("res : {}", str.get(0));
        ObjectMapper objectMapper = new ObjectMapper();
    }

    @Test
    public void tripartiteGetById() throws SQLException {
        valasService.getTripartitebyId("TRIPARTITE/20180118-000000001");
    }

     @Test
    public void getReportDetailPlacement() throws SQLException {
      Map<String, Object> param = dashboardService.getReportDetailPlacement("1");
         System.out.println("HASIL : "+param.toString());
    }

    @Test
    public void homeDir() throws SQLException {
        ApplicationHome home = new ApplicationHome(ApplicationMonitoring.class);
        String rootPath = home.getDir().getPath();
        System.out.println("HASIL "+rootPath);
    }
}
