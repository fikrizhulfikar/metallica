package com.iconpln.liquiditas.monitoring;

import com.iconpln.liquiditas.core.service.ValasService;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.Map;
import java.util.function.BiConsumer;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ValasTests {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private ValasService valasService;

	@Test
	public void getRekapTest() throws SQLException {
		logger.info("RUN TEST GET REKAP DATA");
//		valasService.getListPembayaran(1,100,"18/08/2017","19/08/2017","ALL","EUR","ALL","0", WebUtils.getUsernameLogin());
	}

	@Test
	public void deleteRekapTest() throws SQLException {
		logger.info("RUN TEST DELETE REKAP DATA");
		valasService.deletePembayaran("REKAP/20170823-000000001", "admin");
	}

	@Test
	public void semberPlacement() throws SQLException {
		Map mp = valasService.getSumberPlacement();
		logger.info("SUMBER AWAL : {}", mp.toString());

	}

	@Test
	public void userDir() throws SQLException {
		System.out.println("USER DIR : "+ Locale.getDefault());
	}

	@Test
	public void local()  {
		System.out.println("USER DIR : "+ Locale.getDefault());
	}

	@Test
	public void date()  {
		Date dt = new Date();
		Calendar c = Calendar.getInstance();
		c.setTime(dt);
		c.add(Calendar.DATE, 1);
		dt = c.getTime();
		System.out.println(dt.getDate() +"/"+ dt.getMonth() +"/"+ dt.getYear());
	}

	@Test
	public void getListPembayaran() {
//		try {
//		try {
//			valasService.getListPembayaranSudah(1, 10, "01/01/2018", "01/05/2019"
//					, "ALL", "ALL", "ALL"
//					, "admin", "JENIS_PEMBAYARAN", "DESC", ""
//					, "").forEach(stringObjectMap -> {
//						stringObjectMap.forEach(new BiConsumer<String, Object>() {
//							@Override
//							public void accept(String s, Object o) {
//								System.out.println("Key: " + s);
//								System.out.println("Val: " + o);
//							}
//						});
//			});
//		} catch (SQLException e) {
//			e.printStackTrace();
//		}
//		} catch (SQLException e) {
//			e.printStackTrace();
//		}
	}

	@Test
	public void getRekapPembayaranByEmail() {
		valasService.getRekapPembayaranByEmail("heri.siswanto@pln.co.id").forEach(System.out::println);
	}

}
