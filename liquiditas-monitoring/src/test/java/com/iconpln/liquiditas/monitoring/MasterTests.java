package com.iconpln.liquiditas.monitoring;

import com.iconpln.liquiditas.core.service.MasterService;
import com.iconpln.liquiditas.core.service.UserService;
import com.iconpln.liquiditas.core.utils.AppUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.SQLException;
import java.util.Map;

@RunWith(SpringRunner.class)
@SpringBootTest
public class MasterTests {


	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private MasterService masterService;

	@Autowired
	private UserService userService;

	@Test
	public void getListBank() throws SQLException {
		logger.info("RUN TEST GET BANK DATA");
		masterService.getListBank("FILTER","TUJUAN","REKAP");
	}

	@Test
	public void getCredential() throws SQLException {
		logger.info("RUN TEST GET CREDENTIAL");
		userService.loadByUsername("test_divkeu");
	}

	@Test
	public void getTime() throws SQLException {
		logger.info("RUN TEST GET TIME : {}", AppUtils.getDateTillSecondTrim().trim());

	}

	@Test
	public void compare() throws SQLException {
		Map<String,Object> res = masterService.insBankValasTmp("123","123","123","0", AppUtils.getDateTillSecondTrim());
		System.out.println("sts : "+res.get("return").toString() == "1");
		System.out.println("sts : "+res.get("return").toString().equals("1"));

		String sts = res.get("return").toString();
		System.out.println("sts2 : "+sts == "1");
		System.out.println("sts2 : "+sts.equals("1"));

	}

}
