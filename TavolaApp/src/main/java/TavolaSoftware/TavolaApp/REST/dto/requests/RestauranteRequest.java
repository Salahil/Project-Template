package TavolaSoftware.TavolaApp.REST.dto.requests;

import TavolaSoftware.TavolaApp.tools.Endereco;
import TavolaSoftware.TavolaApp.tools.HorarioFuncionamento;

import java.util.List;
import java.util.Set;

public class RestauranteRequest {
    // Campos do Usuario associado
    private String nomeUsuario;
    private String emailUsuario;
    private String senhaUsuario;
    private Endereco enderecoUsuario;
    private String telefoneUsuario;
    private String imagemUsuario;
    private String imagemPrincipal; // Imagem de fachada (Base64 ou nome do arquivo)

    // Campos específicos do Restaurante
    private String tipoCozinha;
    private String descricao;
    private List<String> imagens; // Galeria de imagens
    private List<HorarioFuncionamento> horariosFuncionamento;
    private Set<String> nomesServicos;
    private Integer limiteReservasDiarias;

    // Getters e Setters...
    public String getImagemUsuario() {return imagemUsuario;}
    public void setImagemUsuario(String img) {this.imagemUsuario = img;} 
    
    public String getNomeUsuario() { return nomeUsuario; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }

    public String getEmailUsuario() { return emailUsuario; }
    public void setEmailUsuario(String emailUsuario) { this.emailUsuario = emailUsuario; }

    public String getSenhaUsuario() { return senhaUsuario; }
    public void setSenhaUsuario(String senhaUsuario) { this.senhaUsuario = senhaUsuario; }

    public Endereco getEnderecoUsuario() { return enderecoUsuario; }
    public void setEnderecoUsuario(Endereco enderecoUsuario) { this.enderecoUsuario = enderecoUsuario; }

    public String getTelefoneUsuario() { return telefoneUsuario; }
    public void setTelefoneUsuario(String telefoneUsuario) { this.telefoneUsuario = telefoneUsuario; }

    public String getTipoCozinha() { return tipoCozinha; }
    public void setTipoCozinha(String tipoCozinha) { this.tipoCozinha = tipoCozinha; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getImagemPrincipal() { return imagemPrincipal; }
    public void setImagemPrincipal(String imagemPrincipal) { this.imagemPrincipal = imagemPrincipal; }

    public List<String> getImagens() { return imagens; }
    public void setImagens(List<String> imagens) { this.imagens = imagens; }

    public List<HorarioFuncionamento> getHorariosFuncionamento() { return horariosFuncionamento; }
    public void setHorariosFuncionamento(List<HorarioFuncionamento> horariosFuncionamento) { this.horariosFuncionamento = horariosFuncionamento; }

    public Set<String> getNomesServicos() { return nomesServicos; }
    public void setNomesServicos(Set<String> nomesServicos) { this.nomesServicos = nomesServicos; }
    
    public Integer getLimiteReservasDiarias() {return limiteReservasDiarias;}
    public void setLimiteReservasDiarias(Integer limiteReservasDiarias) {this.limiteReservasDiarias = limiteReservasDiarias;}
}