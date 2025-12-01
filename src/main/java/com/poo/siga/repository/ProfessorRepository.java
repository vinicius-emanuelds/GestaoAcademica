package com.poo.siga.repository;

import com.poo.siga.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfessorRepository  extends JpaRepository<Professor, Integer> {
    // .save(), .findAll(), .delete(), .findById()...
}
