package com.iconpln.liquiditas.core;

import com.iconpln.liquiditas.core.domain.RekapPembayaran;
import com.iconpln.liquiditas.core.service.DashboardService;
import com.iconpln.liquiditas.core.service.ValasService;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ValasServiceTest {

    @Autowired
    private ValasService service;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void test() {
        try {
            Map<String, Object> result = service.updStatus("REKAP/20180724-000000513", "2", "P00016","IDR","60000","ADMIN","TEST");
            System.out.println(result);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void getRejectPembayaranTest() {
        service.getRejectPembayaran(1, 10, "", "", "ALL", "ALL", "ALL", "admin", "REJECT_DATE", "ASC", "", "", "")
                .forEach(System.out::println);
    }
}
