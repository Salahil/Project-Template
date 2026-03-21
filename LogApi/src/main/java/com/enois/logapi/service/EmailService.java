package com.enois.logapi.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${app.frontend.url:https://localhost:4200}")
    private String frontendUrl;

    private void enviarEmail(String para, String assunto, String conteudoHtml) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(para);
            helper.setSubject(assunto);
            helper.setText(conteudoHtml, true);
            helper.setFrom("suporte@enois.com"); 

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Falha ao enviar e-mail: " + e.getMessage());
        }
    }

    public void enviarEmailRecuperacaoSenha(String email, String nome, String token) {
        String linkRecuperacao = frontendUrl + "/redefinir-senha?token=" + token;
        
        String html = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>"
                + "<h2 style='color: #333;'>Recuperação de Senha</h2>"
                + "<p>Olá, " + nome + "!</p>"
                + "<p>Recebemos um pedido para redefinir a tua senha. Se foste tu, clica no botão abaixo:</p>"
                + "<a href='" + linkRecuperacao + "' style='display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;'>Redefinir Minha Senha</a>"
                + "<p style='margin-top: 20px;'>Este link expira em 15 minutos.</p>"
                + "<p>Se não pediste para alterar a senha, podes ignorar este e-mail.</p>"
                + "</div>";

        enviarEmail(email, "Recuperação de Senha - LogAPI", html);
    }

    public void enviarCodigoMfa(String email, String nome, String codigo) {
        String html = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>"
                + "<h2 style='color: #333;'>Código de Verificação de Segurança</h2>"
                + "<p>Olá, " + nome + "!</p>"
                + "<p>Aqui está o teu código de acesso. Insere-o na aplicação para concluíres o login:</p>"
                + "<h1 style='color: #007bff; letter-spacing: 5px; text-align: center;'>" + codigo + "</h1>"
                + "<p style='margin-top: 20px;'>Este código expira em 5 minutos. Não o partilhes com ninguém.</p>"
                + "</div>";

        enviarEmail(email, "O teu código de login - LogAPI", html);
    }
}