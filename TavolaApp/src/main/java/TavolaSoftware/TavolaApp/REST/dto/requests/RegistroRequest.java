package TavolaSoftware.TavolaApp.REST.dto.requests;

import TavolaSoftware.TavolaApp.tools.Endereco;
import TavolaSoftware.TavolaApp.tools.HorarioFuncionamento;
import TavolaSoftware.TavolaApp.tools.TipoUsuario;
// import TavolaSoftware.TavolaApp.REST.model.Mesas; // <<< REMOVIDO

import java.util.List;
import java.util.Set;

public class RegistroRequest {
    // Campos do Usuario
    private String nome;
    private String email;
    private String senha;
    private Endereco endereco;
    private TipoUsuario tipo;
    private String telefone;

    // Campos específicos do Restaurante
    private String tipoCozinha;
    private String descricao;
    private List<HorarioFuncionamento> horaFuncionamento;
    private Set<String> nomesServicos;

    // Getters e Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }

    public TipoUsuario getTipo() { return tipo; }
    public void setTipo(TipoUsuario tipo) { this.tipo = tipo; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getTipoCozinha() { return tipoCozinha; }
    public void setTipoCozinha(String tipoCozinha) { this.tipoCozinha = tipoCozinha; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public List<HorarioFuncionamento> getHoraFuncionamento() { return horaFuncionamento; }
    public void setHoraFuncionamento(List<HorarioFuncionamento> horaFuncionamento) { this.horaFuncionamento = horaFuncionamento; }

    public Set<String> getNomesServicos() { return nomesServicos; }
    public void setNomesServicos(Set<String> nomesServicos) { this.nomesServicos = nomesServicos; }

    // <<< GETTERS E SETTERS de 'quantidadeMesas' e 'mesas' REMOVIDOS >>>
}