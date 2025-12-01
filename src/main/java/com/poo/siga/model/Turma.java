package com.poo.siga.model;

import com.fasterxml.jackson.annotation.JsonIgnore; // <--- IMPORTANTE
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String semestre;

    @ManyToOne
    @JoinColumn(name = "disciplina_id")
    private Disciplina disciplina;

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor professor;

    @JsonIgnore // <--- CORTA O LOOP AQUI TAMBÉM
    @OneToMany(mappedBy = "turma")
    private List<Matricula> matriculas;
}