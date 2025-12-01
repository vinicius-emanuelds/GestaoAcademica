package com.poo.siga.controller;

import com.poo.siga.model.Professor;
import com.poo.siga.repository.ProfessorRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    private final ProfessorRepository repository;

    public ProfessorController(ProfessorRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<Professor>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Professor> buscarPorId(@PathVariable Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor não encontrado"));
    }

    @PostMapping
    public ResponseEntity<Professor> salvar(@RequestBody @Valid Professor professor) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(professor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Professor> atualizar(@PathVariable Integer id, @RequestBody @Valid Professor dados) {
        Professor professor = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor não encontrado"));
        
        professor.setName(dados.getName());
        professor.setEmail(dados.getEmail());
        professor.setCpf(dados.getCpf());
        
        return ResponseEntity.ok(repository.save(professor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        if (!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor não encontrado");
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}