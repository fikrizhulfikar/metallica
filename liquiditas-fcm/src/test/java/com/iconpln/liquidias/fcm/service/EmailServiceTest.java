package com.iconpln.liquidias.fcm.service;

import com.iconpln.liquiditas.fcm.Application;
import com.iconpln.liquiditas.fcm.service.EmailService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
public class EmailServiceTest {

    @Autowired
    private EmailService emailService;

    @Test
    public void test() {
        try {
            emailService.sendEmail("diaz.setiawan@iconpln.co.id", "Ini email-ku, mana email-mu?", "Test");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
