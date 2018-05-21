package com.iconpln.liquiditas.core;

import com.iconpln.liquiditas.core.service.ValasService;
import java.sql.SQLException;
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
    public void addKmk() throws SQLException {
        try {
            service.insSaldoKmk("B00058", "1");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

}
