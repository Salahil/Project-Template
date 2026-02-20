package TavolaSoftware.TavolaApp.REST.dto.responses;

import TavolaSoftware.TavolaApp.REST.model.Avaliacao;
import TavolaSoftware.TavolaApp.REST.model.Restaurante;
import TavolaSoftware.TavolaApp.REST.model.Usuario;
import TavolaSoftware.TavolaApp.tools.Endereco;
import TavolaSoftware.TavolaApp.tools.HorarioFuncionamento;

import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.time.LocalDate;


public class RestauranteResponse {

    private UUID id;
    private String nome;
    private String email;
    private String telefone;
    private Endereco endereco;
    private String tipoCozinha;
    private String descricao;
    private String imagemPrincipal; // Imagem de fachada (URL completa)
    private List<String> imagens; // Galeria (URLs completas)
    private double mediaAvaliacao;
    private int totalDeAvaliacoes;
    private List<SimpleAvaliacaoResponse> avaliacoes;
    private List<HorarioFuncionamentoDTO> horariosFuncionamento;
    private Set<String> servicos;
    private Integer limiteReservasDiarias;
    private List<LocalDate> datasLotadas;
    private String imagemUsuario;
    private String imagemPrincipalUsuario; // Era imagemBackgroundUsuario
    private boolean favorito;
    private double valorMedioPorPessoa;
    
    public RestauranteResponse() {
    }

    public RestauranteResponse(Restaurante restaurante) {
        this.id = restaurante.getId();
        if (restaurante.getUsuario() != null) {
            Usuario usuario = restaurante.getUsuario();
            this.nome = usuario.getNome();
            this.email = usuario.getEmail();
            this.endereco = usuario.getEndereco();
            this.telefone = usuario.getTelefone();
            
            // (As URLs da imagemUsuario e imagemPrincipalUsuario são montadas no Service)
        }
        this.tipoCozinha = restaurante.getTipoCozinha();
        this.descricao = restaurante.getDescricao();
        
        // --- CONSTRUTOR ATUALIZADO ---
        // Pega o nome do arquivo da fachada. A URL é montada no Service.
        this.imagemPrincipal = restaurante.getImagemPrincipal(); 
        
        // Pega a galeria. As URLs são montadas no Service.
        this.imagens = restaurante.getImagens() != null ? new ArrayList<>(restaurante.getImagens()) : new ArrayList<>();
        
        this.mediaAvaliacao = restaurante.getMediaAvaliacao();
        this.totalDeAvaliacoes = restaurante.getTotalDeAvaliacoes();
        this.limiteReservasDiarias = restaurante.getLimiteReservasDiarias();

        if (limiteReservasDiarias == null) {
        	limiteReservasDiarias = 0;
        }
        if (restaurante.getAvaliacoes() != null) {
            this.avaliacoes = restaurante.getAvaliacoes().stream()
                                  .map(SimpleAvaliacaoResponse::new)
                                  .collect(Collectors.toList());
        } else {
            this.avaliacoes = new ArrayList<>();
        }

        if (restaurante.getHorariosFuncionamento() != null) {
            this.horariosFuncionamento = restaurante.getHorariosFuncionamento().stream()
                                            .map(HorarioFuncionamentoDTO::new)
                                            .collect(Collectors.toList());
        } else {
            this.horariosFuncionamento = new ArrayList<>();
        }
        
        if (restaurante.getServicos() != null) {
            this.servicos = restaurante.getServicos().stream()
                                .map(servico -> servico.getNome())
                                .collect(Collectors.toSet());
        } else {
            this.servicos = Set.of();
        }
    }

    // --- Getters e Setters ---
    
    public boolean isFavorito() {return favorito;}
    public void setFavorito(boolean favorito) {this.favorito = favorito;}

    public double getValorMedioPorPessoa() {return valorMedioPorPessoa;}
    public void setValorMedioPorPessoa(double valorMedioPorPessoa) {this.valorMedioPorPessoa = valorMedioPorPessoa;}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }

    public String getTipoCozinha() { return tipoCozinha; }
    public void setTipoCozinha(String tipoCozinha) { this.tipoCozinha = tipoCozinha; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    // --- GETTER E SETTER ADICIONADOS ---
    public String getImagemPrincipal() { return imagemPrincipal; }
    public void setImagemPrincipal(String imagemPrincipal) { this.imagemPrincipal = imagemPrincipal; }
    // --- FIM DOS GETTERS E SETTERS ---

    public List<String> getImagens() { return imagens; }
    public void setImagens(List<String> imagens) { this.imagens = imagens; }
    
    public String getImagemUsuario() { return imagemUsuario; }
    public void setImagemUsuario(String imagemUsuario) { this.imagemUsuario = imagemUsuario; }

    // --- MÉTODOS ATUALIZADOS ---
    public String getImagemPrincipalUsuario() { return imagemPrincipalUsuario; }
    public void setImagemPrincipalUsuario(String imagemPrincipalUsuario) { this.imagemPrincipalUsuario = imagemPrincipalUsuario; }
    // --- FIM DA ATUALIZAÇÃO --- (O método getImagemBackgroundUsuario() foi removido/renomeado)

    // ... (restante dos getters/setters e classes internas) ...
    
    public double getMediaAvaliacao() { return mediaAvaliacao; }
    public void setMediaAvaliacao(double mediaAvaliacao) { this.mediaAvaliacao = mediaAvaliacao; }

    public int getTotalDeAvaliacoes() { return totalDeAvaliacoes; }
    public void setTotalDeAvaliacoes(int totalDeAvaliacoes) { this.totalDeAvaliacoes = totalDeAvaliacoes; }

    public List<SimpleAvaliacaoResponse> getAvaliacoes() { return avaliacoes; }
    public void setAvaliacoes(List<SimpleAvaliacaoResponse> avaliacoes) { this.avaliacoes = avaliacoes; }

    public List<HorarioFuncionamentoDTO> getHorariosFuncionamento() { return horariosFuncionamento; }
    public void setHorariosFuncionamento(List<HorarioFuncionamentoDTO> horariosFuncionamento) { this.horariosFuncionamento = horariosFuncionamento; }

    public Set<String> getServicos() { return servicos; }
    public void setServicos(Set<String> servicos) { this.servicos = servicos; }

    public Integer getLimiteReservasDiarias() {return limiteReservasDiarias;}
    public void setLimiteReservasDiarias(Integer limiteReservasDiarias) {this.limiteReservasDiarias = limiteReservasDiarias;}

    public List<LocalDate> getDatasLotadas() {return datasLotadas;}
    public void setDatasLotadas(List<LocalDate> datasLotadas) {this.datasLotadas = datasLotadas;}
    
 /*--------------------------------------------------------------------------------------------------------------------------------------*/   
    
    public static class SimpleAvaliacaoResponse {
        // ... (sem alterações)
        private int score;
        private String comentario;
        private String nomeCliente;
        public SimpleAvaliacaoResponse(Avaliacao avaliacao) {
            this.score = avaliacao.getScore();
            this.comentario = avaliacao.getComentario();
            if (avaliacao.getCliente() != null && avaliacao.getCliente().getUsuario() != null) {
                this.nomeCliente = avaliacao.getCliente().getUsuario().getNome();
            } else {
                this.nomeCliente = "Anônimo";
            }
        }
        public int getScore() { return score; }
        public String getComentario() { return comentario; }
        public String getNomeCliente() { return nomeCliente; }
    }
    
    public static class HorarioFuncionamentoDTO {
        // ... (sem alterações)
        private String diaSemana;
        private String abertura;
        private String fechamento;
        public HorarioFuncionamentoDTO(HorarioFuncionamento hf) {
            this.diaSemana = hf.getDiaSemana();
            this.abertura = hf.getAbertura();
            this.fechamento = hf.getFechamento();
        }
        public String getDiaSemana() { return diaSemana; }
        public String getAbertura() { return abertura; }
        public String getFechamento() { return fechamento; }
    }
}