package com.poo.siga.controller;

import com.poo.siga.model.Disciplina;
import com.poo.siga.model.Professor;
import com.poo.siga.model.Turma;
import com.poo.siga.repository.DisciplinaRepository;
import com.poo.siga.repository.ProfessorRepository;
import com.poo.siga.repository.TurmaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/turmas")
public class TurmaController {

    private final TurmaRepository turmaRepository;
    private final ProfessorRepository professorRepository;
    private final DisciplinaRepository disciplinaRepository;

    public TurmaController(TurmaRepository turmaRepo, ProfessorRepository profRepo, DisciplinaRepository discRepo) {
        this.turmaRepository = turmaRepo;
        this.professorRepository = profRepo;
        this.disciplinaRepository = discRepo;
    }

    @GetMapping
    public ResponseEntity<List<Turma>> listar() {
        return ResponseEntity.ok(turmaRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Turma> buscarPorId(@PathVariable Integer id) {
        return turmaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Turma não encontrada"));
    }

    @PostMapping
    public ResponseEntity<Turma> criarTurma(@RequestBody TurmaDTO dados) {
        Professor professor = professorRepository.findById(dados.professorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor não encontrado"));
        Disciplina disciplina = disciplinaRepository.findById(dados.disciplinaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Disciplina não encontrada"));

        Turma turma = new Turma();
        turma.setSemestre(dados.semestre());
        turma.setProfessor(professor);
        turma.setDisciplina(disciplina);
        return ResponseEntity.status(HttpStatus.CREATED).body(turmaRepository.save(turma));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        if (!turmaRepository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Turma não encontrada");
        turmaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    public record TurmaDTO(String semestre, Integer professorId, Integer disciplinaId) {}
}