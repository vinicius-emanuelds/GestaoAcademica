package com.poo.siga.controller;

import com.poo.siga.model.Disciplina;
import com.poo.siga.repository.DisciplinaRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/disciplinas")
public class DisciplinaController {

    private final DisciplinaRepository repository;

    public DisciplinaController(DisciplinaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<Disciplina>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Disciplina> buscarPorId(@PathVariable Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Disciplina não encontrada"));
    }

    @PostMapping
    public ResponseEntity<Disciplina> salvar(@RequestBody @Valid Disciplina disciplina) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(disciplina));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Disciplina> atualizar(@PathVariable Integer id, @RequestBody @Valid Disciplina dados) {
        Disciplina disciplina = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Disciplina não encontrada"));
        
        disciplina.setDescription(dados.getDescription());
        disciplina.setCode(dados.getCode());
        disciplina.setCredits(dados.getCredits());
        
        return ResponseEntity.ok(repository.save(disciplina));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        if (!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Disciplina não encontrado");
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}