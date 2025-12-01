package com.poo.siga.model;

import com.fasterxml.jackson.annotation.JsonIgnore; // <--- IMPORTANTE
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Year;
import java.util.List;
import java.util.Random;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class Aluno extends Pessoa {

    private String registerNumber;

    @JsonIgnore // <--- CORTA O LOOP AQUI
    @OneToMany(mappedBy = "aluno")
    private List<Matricula> historico;

    @PrePersist
    public void gerarRA() {
        String ano = String.valueOf(Year.now().getValue());
        String random = String.format("%04d", new Random().nextInt(10000));
        this.registerNumber = "RA" + ano + random;
    }
}