package com.poo.siga.model;

import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Year;
import java.util.Random;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class Professor extends Pessoa {

    private String functionalNumber;

    @PrePersist
    public void gerarRF() {
        String ano = String.valueOf(Year.now().getValue());
        String random = String.format("%04d", new Random().nextInt(10000));
        this.functionalNumber = "RF" + ano + random;
    }
}