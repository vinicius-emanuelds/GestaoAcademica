package com.poo.siga.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

@Data
@Entity
public class Matricula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "turma_id")
    private Turma turma;

    @DecimalMin(value = "0.0", message = "A nota mínima é 0")
    @DecimalMax(value = "10.0", message = "A nota máxima é 10")
    private Double p1;

    @DecimalMin(value = "0.0", message = "A nota mínima é 0")
    @DecimalMax(value = "10.0", message = "A nota máxima é 10")
    private Double p2;

    @DecimalMin(value = "0.0", message = "A nota mínima é 0")
    @DecimalMax(value = "10.0", message = "A nota máxima é 10")
    private Double p3;

    private Double media;

    public void calcularMedia() {
        double n1 = p1 != null ? p1 : 0.0;
        double n2 = p2 != null ? p2 : 0.0;
        double n3 = p3 != null ? p3 : 0.0;
        this.media = (n1 + n2 + n3) / 3.0;
    }
}