package TavolaSoftware.TavolaApp; // O pacote pode ser diferente

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TavolaAppApplication { // <-- O nome da sua classe principal

    public static void main(String[] args) {
        // GARANTA QUE ESTA LINHA ESTEJA ASSIM:
        SpringApplication.run(TavolaAppApplication.class, args);
        
    }
}