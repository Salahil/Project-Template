package TavolaSoftware.TavolaApp.REST.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import TavolaSoftware.TavolaApp.tools.Endereco;
import TavolaSoftware.TavolaApp.tools.HorarioFuncionamento;

@Entity
@Table(name = "restaurante_table")
public class Restaurante {

    @Id
    private UUID id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // A relação agora é com Ambiente, não mais com a antiga classe Mesas
    @OneToMany(mappedBy = "restaurante", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ambiente> ambientes = new ArrayList<>(); // <<< MUDANÇA

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "restaurante_horarios_funcionamento",
                     joinColumns = @JoinColumn(name = "restaurante_id", referencedColumnName = "usuario_id"))
    private List<HorarioFuncionamento> horariosFuncionamento = new ArrayList<>();

    @Column(name = "cozinha_restaurante")
    private String tipoCozinha;
    
    @Lob
    @Column(name = "descricao_restaurante")
    private String descricao;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "restaurante_imagens", 
                     joinColumns = @JoinColumn(name = "restaurante_id", referencedColumnName = "usuario_id"))
    @Column(name = "imagens_restaurante")
    private List<String> imagens = new ArrayList<>();
    
    @Column(name = "imagem_principal_restaurante")
    private String imagemPrincipal; // Armazena o nome do arquivo (ex: uuid.jpg)

    @OneToMany(mappedBy = "restaurante", cascade = CascadeType.ALL)
    private List<Cardapio> cardapio = new ArrayList<>();

    @Column(name = "media_avaliacao_restaurante")
    private double mediaAvaliacao = 0;
    
    @Column(name = "total_avaliacao_restaurante")
    private int totalDeAvaliacoes = 0;
    
    @OneToMany(mappedBy = "restaurante", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Avaliacao> avaliacoes = new ArrayList<>();
    
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "restaurante_servicos",
        joinColumns = @JoinColumn(name = "restaurante_id", referencedColumnName = "usuario_id"),
        inverseJoinColumns = @JoinColumn(name = "servico_id")
    )
    private Set<Servico> servicos = new HashSet<>();
    
    @Column(name = "limite_reservas_diarias")
    private Integer limiteReservasDiarias; // Usamos Integer para que possa ser nulo (sem limite)

    // Getters e Setters
    
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    // Getter e Setter para a lista de ambientes
    public List<Ambiente> getAmbientes() { return ambientes; } // <<< MUDANÇA
    public void setAmbientes(List<Ambiente> ambientes) {  // <<< MUDANÇA
        this.ambientes.clear();
        if (ambientes != null) {
            this.ambientes.addAll(ambientes);
            this.ambientes.forEach(a -> a.setRestaurante(this));
        }
    }

    // Método de ajuda para adicionar um ambiente
    public void addAmbiente(Ambiente ambiente) { // <<< MUDANÇA
        if (this.ambientes == null) {
            this.ambientes = new ArrayList<>();
        }
        this.ambientes.add(ambiente);
        ambiente.setRestaurante(this);
    }


    public List<HorarioFuncionamento> getHorariosFuncionamento() { return horariosFuncionamento; }
    public void setHorariosFuncionamento(List<HorarioFuncionamento> horariosFuncionamento) { this.horariosFuncionamento = horariosFuncionamento; }
    public String getTipoCozinha() { return tipoCozinha; }
    public void setTipoCozinha(String tipoCozinha) { this.tipoCozinha = tipoCozinha; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public List<String> getImagens() { return imagens; }
    public void setImagens(List<String> imagens) { this.imagens = imagens; }
    public List<Cardapio> getCardapio() { return cardapio; }
    public void setCardapio(List<Cardapio> cardapio) { this.cardapio = cardapio; }
    public double getMediaAvaliacao() { return mediaAvaliacao; }
    public void setMediaAvaliacao(double mediaAvaliacao) { this.mediaAvaliacao = mediaAvaliacao; }
    public int getTotalDeAvaliacoes() { return totalDeAvaliacoes; }
    public void setTotalDeAvaliacoes(int totalDeAvaliacoes) { this.totalDeAvaliacoes = totalDeAvaliacoes; }
    public List<Avaliacao> getAvaliacoes() { return avaliacoes; }
    public void setAvaliacoes(List<Avaliacao> avaliacoes) { /* ... */ }
    public void addAvaliacao(Avaliacao avaliacao) { /* ... */ }
    public Set<Servico> getServicos() { return servicos; }
    public void setServicos(Set<Servico> servicos) { this.servicos = servicos; }
    public String getEmail() { return usuario != null ? usuario.getEmail() : null; }
    public String getNome() { return usuario != null ? usuario.getNome() : null; }
    public Endereco getEndereco() { return usuario != null ? usuario.getEndereco() : null; }
    public void setEndereco(Endereco endereco) { if (usuario != null) { usuario.setEndereco(endereco); } }
    public void setNome(String nome) { if (usuario != null) { usuario.setNome(nome); } }
    public String getEnderecoResumido() { if (this.usuario == null) { return "Endereço não informado";} return this.usuario.getEnderecoResumido();}
    public Integer getLimiteReservasDiarias() {return limiteReservasDiarias;}
    public void setLimiteReservasDiarias(Integer limiteReservasDiarias) {this.limiteReservasDiarias = limiteReservasDiarias;}
    public String getImagemPrincipal() { return imagemPrincipal; }
    public void setImagemPrincipal(String imagemPrincipal) { this.imagemPrincipal = imagemPrincipal; }
    
}