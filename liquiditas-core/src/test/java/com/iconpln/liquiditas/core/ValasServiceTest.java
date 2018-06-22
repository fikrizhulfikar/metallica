package com.iconpln.liquiditas.core;

import com.iconpln.liquiditas.core.domain.RekapPembayaran;
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
    private JdbcTemplate jdbcTemplate;

    @Test
    public void test() {
        try {
            List<Map<String, Object>> res = service.getDerivatifCcsPss(
                    1,
                    10,
                    "01/01/2017",
                    "01/01/2019",
                    "B00058",
                    "T001",
                    ""

            );
             res.stream().forEach(System.out::println);
        } catch (SQLException e) {
            e.printStackTrace();
        }
//        try {
//            service.insDerivatifCcs(
//                    "",
//                    "01/01/2017",
//                    "01/01/2019",
//                    "01/01/2018",
//                    "432498",
//                    "0985347",
//                    "43580923",
//                    "01/05/2018",
//                    "34534",
//                    "653453",
//                    "23432",
//                    "53453",
//                    "3654",
//                    "admin",
//                    "B00058",
//                    "01/03/2018",
//                    "T001"
//            );
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
    }

}
