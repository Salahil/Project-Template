package TavolaSoftware.TavolaApp.REST.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String path = request.getServletPath();
        // Log inicial para cada requisição que passa pelo filtro
        System.out.println("[JwtFilter] Recebida requisição para o path: " + path + " Método: " + request.getMethod());

        if (
        		path.equals("/auth/reenviar-codigo") ||
        		path.equals("/auth/esqueci-senha") ||
        	    path.equals("/auth/register") ||
        	    path.equals("/swagger-ui.html") ||
        	    path.equals("/auth/verificar") ||
        	    path.equals("/auth/refresh") ||
        	    path.equals("/auth/login") ||
        	    path.equals("/auth/login/garcom") ||
        	    path.startsWith("/auth/cardapios/public/") ||
        		path.startsWith("/auth/mudar-senha") ||
        	    path.startsWith("/v3/api-docs") ||
        	    path.startsWith("/auth/uploads/mock") ||
        	    path.startsWith("/swagger-ui") ||
        	    path.startsWith("/upl")
        	    
        	) {
        	    System.out.println("[JwtFilter] Path público (ou ignorado pelo filtro), pulando autenticação JWT: " + path);
        	    filterChain.doFilter(request, response);
        	    return;
        	}

        System.out.println("[JwtFilter] Path requer autenticação: " + path);
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("[JwtFilter] Cabeçalho Authorization ausente ou não começa com 'Bearer ' para o path: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);
        System.out.println("[JwtFilter] Token extraído do cabeçalho: " + token);

        if (jwtUtil.isTokenValid(token)) { //
            String username = jwtUtil.parseToken(token).getSubject(); //
            System.out.println("[JwtFilter] Token VÁLIDO para o usuário: " + username + " no path: " + path);

            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // --- CORREÇÃO AQUI ---
                // Antes: new UsernamePasswordAuthenticationToken(username, null, null)
                // Agora: Guardamos o 'token' nas credenciais para o PedidoService usar
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        username, token, null // <<< MUDANÇA (de null para token)
                );
                // --- FIM DA CORREÇÃO ---

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication); //
                System.out.println("[JwtFilter] Contexto de segurança populado para: " + username);
            } else {
                 System.out.println("[JwtFilter] Contexto de segurança já continha autenticação para: " + SecurityContextHolder.getContext().getAuthentication().getName());
            }
        } else {
            System.out.println("[JwtFilter] Token INVÁLIDO (segundo jwtUtil.isTokenValid) para o path: " + path); //
            SecurityContextHolder.clearContext(); //
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token JWT inválido ou expirado"); //
            return; // Interrompe a cadeia de filtros
        }
        
        System.out.println("[JwtFilter] Prosseguindo com a cadeia de filtros para o path: " + path);
        filterChain.doFilter(request, response);
    }
}