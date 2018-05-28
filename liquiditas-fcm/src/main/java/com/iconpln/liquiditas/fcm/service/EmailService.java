package com.iconpln.liquiditas.fcm.service;

import java.io.File;
import javax.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Email service.
 * @author Langkuy <contact@ardikars.com>
 */
@Service("emailService")
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendEmail(String to, String body, String subject) throws Exception {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setTo(to);
        helper.setText(body);
        helper.setSubject(subject);
        javaMailSender.send(message);
    }

    public void sendEmailWithAttachment(String to, String body, String subject, String path) throws Exception {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setTo(to);
        helper.setText(body);
        helper.setSubject(subject);
        File file = new File(path);
        helper.addAttachment(file.getName(), file);
        javaMailSender.send(message);
    }

}
