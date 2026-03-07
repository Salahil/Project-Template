package com.enois.logapi.dto;

public class ApiResponse<T> {
    private boolean sucesso;
    private String mensagem;
    private T dados;


    public ApiResponse(T dados, String mensagem) {
        this.sucesso = true;
        this.mensagem = mensagem;
        this.dados = dados;
    }


    public ApiResponse(boolean sucesso, String mensagem) {
        this.sucesso = sucesso;
        this.mensagem = mensagem;
        this.dados = null;
    }


    public boolean isSucesso() { return sucesso; }
    public String getMensagem() { return mensagem; }
    public T getDados() { return dados; }
}