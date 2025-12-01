package com.poo.siga.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Login é obrigatório")
    @Column(unique = true)
    private String login;

    @NotBlank(message = "Senha é obrigatória")
    private String senha;
}