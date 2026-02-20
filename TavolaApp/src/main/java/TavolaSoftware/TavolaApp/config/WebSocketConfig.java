package TavolaSoftware.TavolaApp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // Habilita o nosso servidor de mensagens
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        /* Este é o "endpoint" de conexão do WebSocket. conecte-se ao ws para ouvir as mensagens 
         *  - TEMOS QUE ALTERAR DEPOIS O '*' PARA AS ORIGENS REAIS - 
         * */
        registry.addEndpoint("/ws").setAllowedOrigins("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
    	/*
    	 * define um canal, destinatários começando em /topic serão roteados
         * */
        registry.enableSimpleBroker("/topic");

        /* Define o prefixo para mensagens que são destinadas a métodos
         * anotados com @MessageMapping no backend (usaremos isso para o cliente "chamar o garçom").
         * */
        registry.setApplicationDestinationPrefixes("/app");
    }
}