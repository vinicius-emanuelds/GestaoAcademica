package com.poo.siga.repository;

import com.poo.siga.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlunoRepository  extends JpaRepository<Aluno, Integer> {
    // .save(), .findAll(), .delete(), .findById()...
}
