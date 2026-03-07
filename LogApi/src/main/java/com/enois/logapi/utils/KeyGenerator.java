package com.enois.logapi.utils;

import java.io.FileOutputStream;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Base64;

public class KeyGenerator {

    public static void main(String[] args) {
        try {
            // 1. Gera o par de chaves RSA de 2048 bits
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
            keyGen.initialize(2048);
            KeyPair pair = keyGen.generateKeyPair();

            // 2. Define o caminho da pasta resources
            // Ajuste o caminho se necessário, mas geralmente é este:
            String path = "src/main/resources/";

            // 3. Salva a Private Key
            try (FileOutputStream fos = new FileOutputStream(path + "private_key.pem")) {
                fos.write("-----BEGIN PRIVATE KEY-----\n".getBytes());
                fos.write(Base64.getMimeEncoder().encode(pair.getPrivate().getEncoded()));
                fos.write("\n-----END PRIVATE KEY-----".getBytes());
            }

            // 4. Salva a Public Key
            try (FileOutputStream fos = new FileOutputStream(path + "public_key.pem")) {
                fos.write("-----BEGIN PUBLIC KEY-----\n".getBytes());
                fos.write(Base64.getMimeEncoder().encode(pair.getPublic().getEncoded()));
                fos.write("\n-----END PUBLIC KEY-----".getBytes());
            }

            System.out.println("✅ SUCESSO! Chaves geradas em: " + path);
            System.out.println("Agora dê Refresh na pasta resources e rode a aplicação.");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}