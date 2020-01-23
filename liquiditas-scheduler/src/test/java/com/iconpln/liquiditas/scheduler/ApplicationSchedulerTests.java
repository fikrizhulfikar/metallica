package com.iconpln.liquiditas.scheduler;

import com.iconpln.liquiditas.core.utils.AppUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ApplicationSchedulerTests {

	@Test
	public void contextLoads() {
		AppUtils.getLogger(this).debug("RUN SERVICE TESTS");
	}

}
