package com.poo.siga.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
public class Disciplina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull(message = "O código da disciplina é obrigatório")
    @Min(value = 1, message = "O código deve ser positivo")
    private Integer code;

    @NotBlank(message = "A descrição (nome) da disciplina é obrigatória")
    private String description;

    @Min(value = 1, message = "Mínimo de 1 crédito")
    private Integer credits;
}