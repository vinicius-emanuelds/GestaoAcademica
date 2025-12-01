package com.poo.siga.controller;

import com.poo.siga.model.Aluno;
import com.poo.siga.model.Matricula;
import com.poo.siga.model.Turma;
import com.poo.siga.repository.AlunoRepository;
import com.poo.siga.repository.MatriculaRepository;
import com.poo.siga.repository.TurmaRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/matriculas")
public class MatriculaController {

    private final MatriculaRepository matriculaRepository;
    private final AlunoRepository alunoRepository;
    private final TurmaRepository turmaRepository;

    public MatriculaController(MatriculaRepository matriculaRepo, AlunoRepository alunoRepo, TurmaRepository turmaRepo) {
        this.matriculaRepository = matriculaRepo;
        this.alunoRepository = alunoRepo;
        this.turmaRepository = turmaRepo;
    }

    // LISTAR
    @GetMapping
    public ResponseEntity<List<Matricula>> listar() {
        return ResponseEntity.ok(matriculaRepository.findAll());
    }

    // CRIAR (Agora via JSON)
    @PostMapping
    public ResponseEntity<Matricula> criarMatricula(@RequestBody @Valid NovaMatriculaDTO dados) {
        Aluno aluno = alunoRepository.findById(dados.getAlunoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));
        
        Turma turma = turmaRepository.findById(dados.getTurmaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Turma não encontrada"));

        // Validação extra: Evitar duplicidade (opcional, mas recomendada)
        // if (matriculaRepository.existsByAlunoAndTurma(aluno, turma)) { ... }

        Matricula novaMatricula = new Matricula();
        novaMatricula.setAluno(aluno);
        novaMatricula.setTurma(turma);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(matriculaRepository.save(novaMatricula));
    }

    // ATUALIZAR NOTAS
    @PutMapping("/{id}/notas")
    public ResponseEntity<Matricula> atualizarNotas(@PathVariable Integer id, @RequestBody @Valid NotasDTO notas) {
        Matricula matricula = matriculaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Matrícula não encontrada"));

        matricula.setP1(notas.getP1());
        matricula.setP2(notas.getP2());
        matricula.setP3(notas.getP3());
        matricula.calcularMedia();

        return ResponseEntity.ok(matriculaRepository.save(matricula));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        if (!matriculaRepository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Matrícula não encontrado");
        matriculaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // --- DTOs para Entrada de Dados ---
    
    @Data
    public static class NovaMatriculaDTO {
        @NotNull(message = "O ID do aluno é obrigatório")
        private Integer alunoId;
        
        @NotNull(message = "O ID da turma é obrigatório")
        private Integer turmaId;
    }

    @Data
    public static class NotasDTO {
        private Double p1;
        private Double p2;
        private Double p3;
    }
}