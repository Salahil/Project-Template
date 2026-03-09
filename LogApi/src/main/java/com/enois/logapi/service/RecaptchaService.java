package com.enois.logapi.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class RecaptchaService {

    @Value("${google.recaptcha.secret}")
    private String secretKey;

    private static final String GOOGLE_RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean isValido(String responseToken) {
        RestTemplate restTemplate = new RestTemplate();
        String url = String.format("%s?secret=%s&response=%s", GOOGLE_RECAPTCHA_VERIFY_URL, secretKey, responseToken);
        
        try {
            Map<String, Object> response = restTemplate.postForObject(url, null, Map.class);
            return (Boolean) response.get("success");
        } catch (Exception e) {
            return false;
        }
    }
}