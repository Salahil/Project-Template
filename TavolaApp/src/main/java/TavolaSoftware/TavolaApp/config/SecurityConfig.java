package TavolaSoftware.TavolaApp.config;

import TavolaSoftware.TavolaApp.REST.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200", "http://64.181.187.11")); //
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); //
        configuration.setAllowedHeaders(List.of("*")); //
        configuration.setAllowCredentials(true); //

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); //
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            
            // --- CORREÇÃO DE SEGURANÇA AQUI ---
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    // Rotas públicas (baseadas no seu JwtFilter e SecurityConfig)
                    "/auth/register",
                    "/auth/login",
                    "/auth/login/garcom",
                    "/auth/verificar",
                    "/auth/refresh",
                    "/auth/reenviar-codigo",
                    "/auth/esqueci-senha",
                    "/auth/mudar-senha/**", // A rota de reset com token
                    "/auth/cardapios/public/**",
                    "/auth/uploads/mock/**",
                    
                    // Rotas do Swagger e Arquivos
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/upl/**"
                ).permitAll()
                // ANTES: /auth/** era todo permitAll
                // AGORA: Qualquer outra requisição DEVE ser autenticada
                .anyRequest().authenticated()
            )
            // --- FIM DA CORREÇÃO ---

            .sessionManagement(sess ->
                sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) ->
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Não autorizado: " + authException.getMessage())
                )
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}