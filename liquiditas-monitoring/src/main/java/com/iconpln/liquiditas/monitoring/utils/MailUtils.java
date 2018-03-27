package com.iconpln.liquiditas.monitoring.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import javax.mail.internet.MimeMessage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

@Component
public class MailUtils {

    @Autowired
    JavaMailSender javaMailSender;

    public void sendEmail(String to, String body, String subject) throws Exception {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setTo(to);
        helper.setText(body);
        helper.setSubject(subject);
        javaMailSender.send(message);
    }

    public void sendEmailWithAttachment(String to, String body, String subject) throws Exception {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setTo(to);
        helper.setText(body);
        helper.setSubject(subject);
        File file = new File("");
        helper.addAttachment(file.getName(), file);

        javaMailSender.send(message);
    }

}
