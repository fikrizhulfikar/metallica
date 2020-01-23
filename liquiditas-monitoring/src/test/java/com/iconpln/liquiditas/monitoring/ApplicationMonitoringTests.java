package com.iconpln.liquiditas.monitoring;

import com.iconpln.liquiditas.core.utils.AppUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ApplicationMonitoringTests {

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Test
	public void contextLoads() {
		AppUtils.getLogger(this).debug("password : {}",passwordEncoder.encode("12345678"));
}

}
