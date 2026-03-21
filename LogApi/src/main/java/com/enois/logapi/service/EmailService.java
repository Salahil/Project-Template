package com.enois.logapi.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmail(String para, String assunto, String conteudoHtml) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(para);
            helper.setSubject(assunto);
            helper.setText(conteudoHtml, true); // O 'true' indica que é HTML
            helper.setFrom("suporte@enois.com"); // Nome da tua futura empresa

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Falha ao enviar e-mail: " + e.getMessage());
        }
    }
}