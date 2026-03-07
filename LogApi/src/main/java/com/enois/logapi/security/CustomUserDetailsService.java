package com.enois.logapi.security;

import com.enois.logapi.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository repository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // O Spring Security vai chamar este método passando o email enviado no Login
        return repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilizador não encontrado com o e-mail: " + email));
    }
}