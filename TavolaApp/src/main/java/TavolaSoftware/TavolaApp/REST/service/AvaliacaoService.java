package TavolaSoftware.TavolaApp.REST.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import TavolaSoftware.TavolaApp.REST.dto.requests.AvaliacaoRequest;
import TavolaSoftware.TavolaApp.REST.dto.responses.AvaliacaoResponse; // Adicione
import TavolaSoftware.TavolaApp.REST.dto.responses.RestauranteAvaliacoesResponse; // Adicione
import TavolaSoftware.TavolaApp.REST.model.Avaliacao;
import TavolaSoftware.TavolaApp.REST.model.Cliente;
import TavolaSoftware.TavolaApp.REST.model.Reserva;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.repository.AvaliacaoRepository;
import TavolaSoftware.TavolaApp.REST.repository.ReservaRepository;
import TavolaSoftware.TavolaApp.REST.repository.RestauranteRepository;
import TavolaSoftware.TavolaApp.tools.Lexico;
import TavolaSoftware.TavolaApp.tools.StatusReserva;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException; // Adicione


@Service
public class AvaliacaoService {

    @Autowired private RestauranteRepository repoRestaurante;
    @Lazy @Autowired private RestauranteService restauranteService;
    @Autowired private ClienteService servCliente; 
    @Autowired private AvaliacaoRepository avaliacaoRepository;
    @Autowired private JavaMailSender mailSender;
    @Autowired private Lexico lexico;
    @Autowired private ReservaRepository reservaRepository; // <<< ADICIONAR INJEÇÃO

    
    @Value("${spring.mail.username}")
    private String emailRemetente;

    @Transactional
    public Avaliacao submeterMockAvaliacao(AvaliacaoRequest request, UUID restauranteId, String emailCliente, Reserva reserva) {
        
        int scoreFinal = formatarScore(request.getScore());
        String comentario = request.getComentario();

        Cliente cliente = servCliente.findByEmail(emailCliente)
                                        .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado para o email: " + emailCliente));

        Restaurante restaurante = repoRestaurante.findById(restauranteId)
                                                 .orElseThrow(() -> new IllegalArgumentException("Restaurante com ID " + restauranteId + " não encontrado."));
        
        // 1. Cria a nova avaliação, usando a reserva fornecida (não busca no banco)
        Avaliacao avaliacao = new Avaliacao(restaurante, cliente, scoreFinal, comentario, reserva);
        
        // 2. Associa a avaliação à reserva
        reserva.setAvaliacao(avaliacao);
        
        // 3. Analisa o sentimento
        String sentimentoAnalisado = lexico.analisarComentario(avaliacao.getComentario());
        avaliacao.setSentimento(sentimentoAnalisado);

        Avaliacao avaliacaoSalva = avaliacaoRepository.save(avaliacao);
        reservaRepository.save(reserva); // Salva a associação na reserva
        
        calcularMedia(restauranteId);
        
        return avaliacaoSalva;
    }
    
    @Transactional
    // <<< ASSINATURA ATUALIZADA >>>
    public Avaliacao avaliarRestaurante(AvaliacaoRequest request, UUID restauranteId, String emailCliente) {
        
        int scoreFinal = formatarScore(request.getScore());
        String comentario = request.getComentario();

        Cliente cliente = servCliente.findByEmail(emailCliente)
                                        .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado para o email: " + emailCliente));

        Restaurante restaurante = repoRestaurante.findById(restauranteId)
                                                 .orElseThrow(() -> new IllegalArgumentException("Restaurante com ID " + restauranteId + " não encontrado."));
        
        // --- LÓGICA ATUALIZADA (BUSCA AUTOMÁTICA) ---
        // Não precisamos mais do 'reservaId' vindo do request.
        
        // 1. Encontra a última reserva CONCLUÍDA e NÃO AVALIADA
        Reserva reservaParaAvaliar = reservaRepository.findFirstByClienteAndRestauranteAndStatusAndAvaliacaoIsNullOrderByDataReservaDescHoraReservaDesc(
            cliente, 
            restaurante, 
            StatusReserva.CONCLUIDA
        ).orElseThrow(() -> new IllegalStateException( // Erro 409 CONFLICT
            "Nenhuma reserva concluída pendente de avaliação foi encontrada para este restaurante."
        ));
        
        // 2. Cria a nova avaliação (não precisamos verificar se existe, pois a busca já fez isso)
        Avaliacao avaliacao = new Avaliacao(restaurante, cliente, scoreFinal, comentario, reservaParaAvaliar);
        
        // --- FIM DA LÓGICA ATUALIZADA ---

        // 3. Analisa o sentimento (lógica existente)
        String sentimentoAnalisado = lexico.analisarComentario(avaliacao.getComentario());
        avaliacao.setSentimento(sentimentoAnalisado);

        Avaliacao avaliacaoSalva = avaliacaoRepository.save(avaliacao);
        
        calcularMedia(restauranteId);
        
        return avaliacaoSalva;
    }

    @Transactional
    public double calcularMedia(UUID restauranteId) {
        List<Avaliacao> avaliacoes = avaliacaoRepository.findByRestauranteId(restauranteId);

        Restaurante restaurante = repoRestaurante.findById(restauranteId)
            .orElseThrow(() -> new IllegalArgumentException("Restaurante não encontrado para calcular média."));

        if (avaliacoes.isEmpty()) {
            restaurante.setMediaAvaliacao(0.0);
            restaurante.setTotalDeAvaliacoes(0);
            repoRestaurante.save(restaurante);
            return 0.0;
        }

        double somaScores = avaliacoes.stream().mapToDouble(Avaliacao::getScore).sum();
        double media = somaScores / avaliacoes.size();
        media = Math.round(media * 10.0) / 10.0;

        restaurante.setMediaAvaliacao(media);
        restaurante.setTotalDeAvaliacoes(avaliacoes.size());
        repoRestaurante.save(restaurante);
        return media;
    }

    private int formatarScore(double score) {
    	if (score < 1.0) return 1; 
        if (score > 5.0) return 5; 
        return (int) Math.round(score);
    }

    public void enviarEmailLembreteAvaliacao(Reserva reserva) {
        try {
            Cliente cliente = reserva.getCliente();
            Restaurante restaurante = reserva.getRestaurante();

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(emailRemetente, "Equipe Tavola");
            helper.setTo(cliente.getUsuario().getEmail());
            helper.setSubject("O que você achou do " + restaurante.getNome() + "?");

            String corpoEmail = criarCorpoEmailLembrete(cliente.getUsuario().getNome(), restaurante.getNome(), restaurante.getId());
            helper.setText(corpoEmail, true);

            mailSender.send(message);

        } catch (Exception e) {
            // Em um sistema real, aqui você logaria o erro em vez de apenas imprimir
            System.err.println("Erro ao enviar e-mail de lembrete de avaliação: " + e.getMessage());
        }
    }
    
    @Transactional(readOnly = true)
    public RestauranteAvaliacoesResponse getAvaliacoesDetalhadasPorRestaurante(UUID restauranteId) {
        // ... (busca restaurante - sem alterações)
        Restaurante restaurante = restauranteService.findEntityById(restauranteId)
            .orElseThrow(() -> new EntityNotFoundException("Restaurante não encontrado com ID: " + restauranteId));

        List<Avaliacao> avaliacoes = avaliacaoRepository.findDetalhadaByRestauranteId(restauranteId);

        List<AvaliacaoResponse> avaliacoesDto = avaliacoes.stream()
            .map(AvaliacaoResponse::new) // O construtor do DTO fará o resto
            .collect(Collectors.toList());

        return new RestauranteAvaliacoesResponse(restaurante, avaliacoesDto);
    }

    /**
     * Gera o corpo HTML para o e-mail de lembrete de avaliação.
     */
    private String criarCorpoEmailLembrete(String nomeCliente, String nomeRestaurante, UUID restauranteId) {
        // TODO: Substituir o link '#' pela URL real da tela do restaurante no frontend.
        // Ex: String linkParaAvaliar = "https://www.seusite.com/restaurantes/" + restauranteId;
        String linkParaAvaliar = "http://localhost:4200/home/agendamento-reservas-restaurante/" + restauranteId + "?verificarNotificacao=true";

        return """
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
              <meta charset="UTF-8"/>
              <title>Avalie sua Experiência - Tavola</title>
              <style>
                body{font-family:'Segoe UI',sans-serif;background-color:#f4f4f4;margin:0;padding:20px;}
                .email-container{max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 5px 15px rgba(0,0,0,.1);}
                .header{background:linear-gradient(135deg, #f5ba3f, #eeaa17);color:#fff;padding:40px;text-align:center;}
                .header h1{margin:0;font-size:28px;}
                .content{padding:40px;text-align:center;color:#555;line-height:1.7;}
                .content h2{color:#333;margin-bottom:15px;}
                .content p{margin-bottom:30px;}
                .cta-button{display:inline-block;background:#DA4A24;color:#ffffff !important;text-decoration:none;padding:15px 30px;border-radius:50px;font-weight:600;transition:all .3s ease;}
                .cta-button:hover{background:#c8411f;transform:translateY(-2px);}
                .footer{background:#f8f9fa;padding:20px;text-align:center;font-size:14px;color:#888;}
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="header"><h1>Sua Opinião é Importante!</h1></div>
                <div class="content">
                  <h2>Olá, %s!</h2>
                  <p>
                    Obrigado por visitar o <strong>%s</strong> através do Tavola.<br/>
                    Esperamos que sua experiência tenha sido incrível! Que tal compartilhar sua opinião para ajudar outros usuários?
                  </p>
                  <a href="%s" class="cta-button">Deixar uma Avaliação</a>
                </div>
                <div class="footer">Equipe Tavola 🍽️</div>
              </div>
            </body>
            </html>
            """.formatted(nomeCliente, nomeRestaurante, linkParaAvaliar);
    }
}