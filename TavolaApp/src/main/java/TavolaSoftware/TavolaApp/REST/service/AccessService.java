package TavolaSoftware.TavolaApp.REST.service;

import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import TavolaSoftware.TavolaApp.REST.dto.requests.GarcomLoginRequest;
import TavolaSoftware.TavolaApp.REST.dto.responses.LoginResponse;
import TavolaSoftware.TavolaApp.REST.model.Garcom;
import TavolaSoftware.TavolaApp.REST.model.PasswordResetToken;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.model.Usuario;
import TavolaSoftware.TavolaApp.REST.repository.GarcomRepository;
import TavolaSoftware.TavolaApp.REST.repository.PasswordResetTokenRepository;
import TavolaSoftware.TavolaApp.REST.repository.RestauranteRepository;
import TavolaSoftware.TavolaApp.REST.repository.UsuarioRepository;
import TavolaSoftware.TavolaApp.REST.security.JwtUtil;
import TavolaSoftware.TavolaApp.tools.TipoUsuario;
import TavolaSoftware.TavolaApp.tools.UploadUtils;

import java.security.SecureRandom;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AccessService {

    @Autowired private JavaMailSender mailSender;    
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private BCryptPasswordEncoder passwordEncoder;    
    @Autowired private PasswordResetTokenRepository passwordResetTokenRepository;    
    @Autowired private RestauranteRepository repoRestaurante;    
    @Autowired private GarcomRepository repoGarcom;    
    @Autowired private JwtUtil jwt;
    @Autowired private UploadUtils uplUtil; // <<< INJETAR O UPLOADUTILS
    
    @Value("${spring.mail.username}")
    private String emailRemetente;
    
    /**
     * Realiza o login de um funcionário (Garçom) com base no e-mail do restaurante.
     * @param request DTO contendo e-mail do restaurante, código e senha.
     * @return um LoginResponse com o token JWT.
     */
    @Transactional(readOnly = true)
    public LoginResponse loginGarcom(GarcomLoginRequest request) { //
        // 1. Encontra o restaurante
        Restaurante restaurante = repoRestaurante.findByUsuarioEmail(request.getEmailRestaurante()); //
        if (restaurante == null) {
            throw new RuntimeException("Credenciais inválidas."); //
        }

        // 2. Busca o garçom
        Garcom garcom = repoGarcom.findByRestauranteIdAndCodigoIdentidade(restaurante.getId(), request.getCodigoIdentidade()) //
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas.")); //

        // 4. Valida a senha (sim, o 3 sumiu, mas mantive sua numeração)
        if (!passwordEncoder.matches(request.getSenha(), garcom.getSenha())) { //
            throw new RuntimeException("Credenciais inválidas."); //
        }

        // 5. Gera o token
        String accessToken = jwt.generateFuncionarioToken( //
                restaurante.getEmail(), 
                garcom.getId(),
                restaurante.getId()
        );
        
        String urlImagemGarcom = uplUtil.construirUrlRelativa("garcons", garcom.getImagem()); //

        // <<< CORREÇÃO AQUI >>>
        // Adicionamos o 'restaurante.getId()' no final da chamada
        return new LoginResponse(
            accessToken,
            garcom.getNome(),
            TipoUsuario.FUNCIONARIO.toString(),
            garcom.getId(), // Este é o ID do Garçom
            restaurante.getEmail(),
            urlImagemGarcom,
            null, // Background (Garçom não tem)
            restaurante.getId() // <<< ID DO RESTAURANTE ADICIONADO
        );
        // --- FIM DA CORREÇÃO ---
    }

    @Transactional
    public void solicitarResetDeSenha(String email) {
        // --- CORREÇÃO AQUI ---
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isEmpty()) {
            System.out.println("Solicitação de reset para e-mail não cadastrado: " + email);
            return;
        }
        Usuario usuario = usuarioOpt.get();
        passwordResetTokenRepository.deleteByUsuarioId(usuario.getId());

        String token = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUsuario(usuario);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));
        resetToken.setTokenHash(new BCryptPasswordEncoder().encode(token));

        passwordResetTokenRepository.save(resetToken);

        String urlDeRedefinicao = "http://localhost:4200/redefinir-senha/" + token;

        enviarEmailResetSenha(usuario.getEmail(), usuario.getNome(), urlDeRedefinicao);
    }
    
    public String gerarCodigoDeVerificacao() {
        SecureRandom random = new SecureRandom();
        int numero = random.nextInt(999999);
        return new DecimalFormat("000000").format(numero);
    }
    
    public void enviarEmailResetSenha(String destinatario, String nomeUsuario, String urlDeRedefinicao) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailRemetente, "Equipe Tavola");
            helper.setTo(destinatario);
            helper.setSubject("Redefinição de Senha - Tavola");

            String corpoEmail = criarCorpoEmailResetSenha(nomeUsuario, urlDeRedefinicao);
            helper.setText(corpoEmail, true);

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar e-mail de redefinição: " + e.getMessage());
        }
    }

    // <<< MÉTODO DE ENVIO DE E-MAIL UNIFICADO >>>
    public void enviarEmailVerificacao(String destinatario, String nomeUsuario, String codigoVerificacao, String urlDeVerificacao) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailRemetente, "Equipe Tavola");
            helper.setTo(destinatario);
            helper.setSubject("Seu Código de Verificação Tavola");

            String corpoEmail = criarCorpoEmailUnificado(nomeUsuario, codigoVerificacao, urlDeVerificacao);
            helper.setText(corpoEmail, true);

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar e-mail de verificação: " + e.getMessage());
        }
    }
    
    @Transactional
    public void executarResetDeSenha(String token, String novaSenha) {
        for (PasswordResetToken pToken : passwordResetTokenRepository.findAll()) {
            if (new BCryptPasswordEncoder().matches(token, pToken.getTokenHash())) {
                
                if (pToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                    passwordResetTokenRepository.delete(pToken);
                    throw new RuntimeException("Token de redefinição de senha expirado.");
                }

                Usuario usuario = pToken.getUsuario();
                usuario.setSenha(passwordEncoder.encode(novaSenha));
                usuarioRepository.save(usuario);

                // Após a senha ser alterada com sucesso, enviamos o e-mail de alerta.
                enviarEmailAlertaAlteracaoSenha(usuario);

                passwordResetTokenRepository.delete(pToken);
                return; 
            }
        }
        
        throw new RuntimeException("Token de redefinição de senha inválido.");
    }
    
    public void enviarEmailAlertaAlteracaoSenha(Usuario usuario) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailRemetente, "Equipe Tavola (Segurança)");
            helper.setTo(usuario.getEmail());
            helper.setSubject("⚠️ Alerta de Segurança: Sua senha foi alterada");

            // O link de "Não fui eu" levará o usuário para a página inicial de "esqueci minha senha"
            String urlParaResetarNovamente = "http://localhost:4200/esqueci-senha";
            String corpoEmail = criarCorpoEmailAlertaSenha(usuario.getNome(), urlParaResetarNovamente);
            
            helper.setText(corpoEmail, true);

            mailSender.send(message);

        } catch (Exception e) {
            // É importante não quebrar a aplicação principal se o e-mail falhar.
            // Apenas logamos o erro.
            System.err.println("CRÍTICO: Falha ao enviar e-mail de ALERTA de alteração de senha para " + usuario.getEmail() + ": " + e.getMessage());
        }
    }

    // <<< TEMPLATE HTML UNIFICADO E CORRIGIDO >>>
    private String criarCorpoEmailUnificado(String nomeUsuario, String codigo, String urlVerificacao) {
        String htmlTemplate = """
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
              <meta charset="UTF-8"/>
              <title>Código de Verificação - Tavola</title>
              <style>
                *{margin:0;padding:0;box-sizing:border-box}
                body{
                  font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
                  background-color:#ebe8e2; /* << COR DE FUNDO CINZA-BEGE */
                  margin:0;padding:20px;min-height:100vh
                }
                .email-container{
                  max-width:600px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;
                  box-shadow:0 20px 40px rgba(0,0,0,.15)
                }
                .header{
                  background:linear-gradient(135deg,#f5ba3f 0%,#eeaa17 100%);
                  padding:40px 30px;text-align:center;position:relative
                }
                .header h1{
                  color:#fff;font-size:32px;font-weight:700;margin-bottom:10px;
                  text-shadow:0 2px 4px rgba(0,0,0,.2);position:relative;z-index:1
                }
                .content{padding:50px 40px;text-align:center}
                .greeting{font-size:24px;color:#333;margin-bottom:20px;font-weight:600}
                .message{font-size:16px;color:#666;line-height:1.6;margin-bottom:40px}
                .code-section{
                  background:linear-gradient(135deg,#f5ba3f 0%,#eeaa17 100%);
                  border-radius:15px;padding:30px;margin:30px 0;position:relative;overflow:hidden
                }
                .code-label{color:#fff;font-size:14px;font-weight:600;margin-bottom:15px;text-transform:uppercase;letter-spacing:1px}
                .code-box{
                  background:#fff;border-radius:10px;padding:20px;font-size:36px;font-weight:700;color:#DA4A24;
                  letter-spacing:8px;font-family:'Courier New',monospace;box-shadow:inset 0 2px 10px rgba(0,0,0,.1)
                }
                .expiry-info{
                  background:#fff3e0;border-left:4px solid #F6BD38;padding:20px;margin:30px 0;border-radius:0 10px 10px 0;
                  font-size:14px;color:#666
                }
                .cta-section{margin:40px 0}
                .cta-button{
                  display:inline-block;background:linear-gradient(135deg,#f5ba3f 0%,#eeaa17 100%);
                  color:#ffffff !important; /* <<< CORREÇÃO DA COR DO TEXTO DO BOTÃO */
                  text-decoration:none;
                  padding:18px 40px;border-radius:50px;font-size:16px;font-weight:600;text-transform:uppercase;letter-spacing:1px;
                  box-shadow:0 8px 25px rgba(218,74,36,.3);transition:all .3s ease;
                }
                .cta-button:hover{transform:translateY(-2px);box-shadow:0 12px 35px rgba(218,74,36,.4)}
                .footer{background:#f8f9fa;padding:30px;text-align:center;border-top:1px solid #eee}
                .footer-text{font-size:14px;color:#666;margin-bottom:15px}
                .brand-signature{font-size:16px;font-weight:600;color:#DA4A24}
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="header"><h1>TAVOLA</h1></div>
                <div class="content">
                  <h2 class="greeting">Olá, [NOME_USUARIO]! 👋</h2>
                  <p class="message">
                    Bem-vindo ao <strong>Tavola</strong>! Para acessar sua conta, utilize o código abaixo ou clique no botão:
                  </p>
                  <div class="code-section">
                    <div class="code-label">Seu Código de Verificação</div>
                    <div class="code-box">[CODIGO]</div>
                  </div>
                  <div class="expiry-info">
                    ⏰ <strong>Importante:</strong> Este código é válido por apenas <strong>10 minutos</strong>.
                  </div>
                  <div class="cta-section"> <a href="[URL_VERIFICACAO]" class="cta-button">Confirmar Código</a>
                  </div>
                </div>
                <div class="footer">
                  <p class="footer-text">Dúvidas? Entre em contato conosco.</p>
                  <div class="brand-signature">Com carinho,<br/><strong>Equipe Tavola</strong> 🍽️</div>
                </div>
              </div>
            </body>
            </html>""";
        return htmlTemplate
                .replace("[NOME_USUARIO]", nomeUsuario)
                .replace("[CODIGO]", codigo)
                .replace("[URL_VERIFICACAO]", urlVerificacao);
    }
    
    private String criarCorpoEmailResetSenha(String nomeUsuario, String urlRedefinicao) {
        String htmlTemplate = """
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
              <meta charset="UTF-8"/>
              <title>Redefinição de Senha - Tavola</title>
              <style>
                /* Estilos identicos ao seu template anterior para manter a consistência */
                *{margin:0;padding:0;box-sizing:border-box}
                body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#ebe8e2;margin:0;padding:20px;min-height:100vh}
                .email-container{max-width:600px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.15)}
                .header{background:linear-gradient(135deg,#f5ba3f 0%,#eeaa17 100%);padding:40px 30px;text-align:center;position:relative}
                .header h1{color:#fff;font-size:32px;font-weight:700;margin-bottom:10px;text-shadow:0 2px 4px rgba(0,0,0,.2);position:relative;z-index:1}
                .content{padding:50px 40px;text-align:center}
                .greeting{font-size:24px;color:#333;margin-bottom:20px;font-weight:600}
                .message{font-size:16px;color:#666;line-height:1.6;margin-bottom:40px}
                .expiry-info{background:#fff3e0;border-left:4px solid #F6BD38;padding:20px;margin:30px 0;border-radius:0 10px 10px 0;font-size:14px;color:#666}
                .cta-section{margin:40px 0}
                .cta-button{display:inline-block;background:linear-gradient(135deg,#f5ba3f 0%,#eeaa17 100%);color:#ffffff !important;text-decoration:none;padding:18px 40px;border-radius:50px;font-size:16px;font-weight:600;text-transform:uppercase;letter-spacing:1px;box-shadow:0 8px 25px rgba(218,74,36,.3);transition:all .3s ease;}
                .cta-button:hover{transform:translateY(-2px);box-shadow:0 12px 35px rgba(218,74,36,.4)}
                .footer{background:#f8f9fa;padding:30px;text-align:center;border-top:1px solid #eee}
                .footer-text{font-size:14px;color:#666;margin-bottom:15px}
                .brand-signature{font-size:16px;font-weight:600;color:#DA4A24}
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="header"><h1>TAVOLA</h1></div>
                <div class="content">
                  <h2 class="greeting">Olá, [NOME_USUARIO]! 👋</h2>
                  <p class="message">
                    Recebemos uma solicitação para redefinir a senha da sua conta. Se você não fez esta solicitação, pode ignorar este e-mail.<br/><br/>
                    Para continuar, clique no botão abaixo:
                  </p>
                  <div class="cta-section"> <a href="[URL_REDEFINICAO]" class="cta-button">Redefinir Minha Senha</a>
                  </div>
                  <div class="expiry-info">
                    ⏰ <strong>Atenção:</strong> Este link é de uso único e expira em <strong>30 minutos</strong>.
                  </div>
                </div>
                <div class="footer">
                  <p class="footer-text">Dúvidas? Entre em contato conosco.</p>
                  <div class="brand-signature">Com carinho,<br/><strong>Equipe Tavola</strong> 🍽️</div>
                </div>
              </div>
            </body>
            </html>""";
        return htmlTemplate
                .replace("[NOME_USUARIO]", nomeUsuario)
                .replace("[URL_REDEFINICAO]", urlRedefinicao);
    }
    
 // <<<<<<< NOVO MÉTODO 2: O template HTML para o e-mail de ALERTA >>>>>>>>>
    private String criarCorpoEmailAlertaSenha(String nomeUsuario, String urlRedefinicao) {
        String htmlTemplate = """
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
              <meta charset="UTF-8"/>
              <title>Alerta de Segurança - Tavola</title>
              <style>
                /* Estilos consistentes com seus outros e-mails */
                *{margin:0;padding:0;box-sizing:border-box}
                body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#ebe8e2;margin:0;padding:20px;min-height:100vh}
                .email-container{max-width:600px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,.15)}
                .header{background:linear-gradient(135deg,#e74c3c 0%,#c0392b 100%);padding:40px 30px;text-align:center;position:relative}
                .header h1{color:#fff;font-size:32px;font-weight:700;margin-bottom:10px;text-shadow:0 2px 4px rgba(0,0,0,.2);position:relative;z-index:1}
                .content{padding:50px 40px;text-align:center}
                .greeting{font-size:24px;color:#333;margin-bottom:20px;font-weight:600}
                .message{font-size:16px;color:#666;line-height:1.6;margin-bottom:40px}
                .cta-section{margin:40px 0}
                .cta-button{display:inline-block;background:linear-gradient(135deg,#e74c3c 0%,#c0392b 100%);color:#ffffff !important;text-decoration:none;padding:18px 40px;border-radius:50px;font-size:16px;font-weight:600;text-transform:uppercase;letter-spacing:1px;box-shadow:0 8px 25px rgba(192,57,43,.4);transition:all .3s ease;}
                .cta-button:hover{transform:translateY(-2px);box-shadow:0 12px 35px rgba(192,57,43,.5)}
                .footer{background:#f8f9fa;padding:30px;text-align:center;border-top:1px solid #eee}
                .footer-text{font-size:14px;color:#666;margin-bottom:15px}
                .brand-signature{font-size:16px;font-weight:600;color:#DA4A24}
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="header"><h1>TAVOLA</h1></div>
                <div class="content">
                  <h2 class="greeting">Olá, [NOME_USUARIO]!</h2>
                  <p class="message">
                    Este é um aviso de segurança para informar que a senha da sua conta Tavola foi alterada com sucesso.<br/><br/>
                    Se foi você quem fez esta alteração, nenhuma ação é necessária.<br/><br/>
                    <strong>Se você NÃO reconhece esta atividade, por favor, clique no botão abaixo imediatamente para proteger sua conta.</strong>
                  </p>
                  <div class="cta-section"> <a href="[URL_REDEFINICAO]" class="cta-button">Não fui eu! Proteger minha conta.</a>
                  </div>
                </div>
                <div class="footer">
                  <p class="footer-text">Este é um e-mail automático de segurança.</p>
                  <div class="brand-signature">Atenciosamente,<br/><strong>Equipe de Segurança Tavola</strong> 🛡️</div>
                </div>
              </div>
            </body>
            </html>""";
        return htmlTemplate
                .replace("[NOME_USUARIO]", nomeUsuario)
                .replace("[URL_REDEFINICAO]", urlRedefinicao);
    }
}

