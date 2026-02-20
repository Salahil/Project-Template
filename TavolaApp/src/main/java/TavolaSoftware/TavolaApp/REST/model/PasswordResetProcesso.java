// Em /model/SenhaResetProcesso.java
package TavolaSoftware.TavolaApp.REST.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "senha_reset_processos")
public class PasswordResetProcesso {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Hash do token que vai no cookie ('valToken')
    @Column(nullable = false)
    private String valTokenHash;

    // Hash do token que vai na URL (a 'id falsa')
    @Column(nullable = false, unique = true)
    private String urlTokenHash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    // Getters e Setters...
    
    public UUID getId() {return this.id;}
    
    
}