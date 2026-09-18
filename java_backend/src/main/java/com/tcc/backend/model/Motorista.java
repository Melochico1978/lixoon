package com.tcc.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "motoristas")
public class Motorista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    
    private String email;
    
    private String telefone;
    
    @Column(name = "veiculo_id")
    private Long veiculoId;
    
    private String status;
    
    private String observacao;
}
