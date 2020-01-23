package com.iconpln.liquiditas.core;

import com.iconpln.liquiditas.core.utils.AppUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.SQLException;

@RunWith(SpringRunner.class)
@SpringBootTest
public class AplicationCoreTests {

	@Value("${spring.profiles.active}")
	String profile;

	@Value("${spring.datasource.url}")
	String url;

	@Value("${spring.datasource.username}")
	String username;

	@Value("${spring.datasource.password}")
	String password;

	@Test
	public void contextLoads() throws SQLException {
		AppUtils.getLogger(this).info("TESTING CORE WAS RUNNING WITH PROFILE : {}",profile);
		AppUtils.getLogger(this).info("TESTING CORE WAS RUNNING URL PROFILE : {}",url);
		AppUtils.getLogger(this).info("TESTING CORE WAS RUNNING USERNAME PROFILE : {}",username);
		AppUtils.getLogger(this).info("TESTING CORE WAS RUNNING PASSWORD PROFILE : {}",password);
	}

}
