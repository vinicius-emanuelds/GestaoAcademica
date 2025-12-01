package com.poo.siga.controller;

import com.poo.siga.model.Aluno;
import com.poo.siga.repository.AlunoRepository;
import jakarta.validation.Valid;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    private final AlunoRepository repository;

    public AlunoController(AlunoRepository repository) {
        this.repository = repository;
    }

    // 1. Listar
    @GetMapping
    public ResponseEntity<List<Aluno>> listar() {
        return ResponseEntity.ok(repository.findAll());
    }

    // 2. Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<Aluno> buscarPorId(@PathVariable Integer id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));
    }

    // 3. Salvar (Com validação de CPF e Email)
    @PostMapping
    public ResponseEntity<Aluno> salvar(@RequestBody @Valid Aluno aluno) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(aluno));
    }

    // 4. Atualizar
    @PutMapping("/{id}")
    public ResponseEntity<Aluno> atualizar(@PathVariable Integer id, @RequestBody @Valid Aluno dados) {
        Aluno aluno = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));
        
        aluno.setName(dados.getName());
        aluno.setEmail(dados.getEmail());
        aluno.setCpf(dados.getCpf());
        
        return ResponseEntity.ok(repository.save(aluno));
    }

    // 5. Excluir
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado");
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // --- RELATÓRIO: Histórico Escolar (Via JSON) ---
    @PostMapping("/relatorio/historico")
    public ResponseEntity<HistoricoDTO> gerarHistorico(@RequestBody FiltroHistoricoDTO filtro) {
        
        Aluno aluno = repository.findById(filtro.getAlunoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado"));

        HistoricoDTO relatorio = new HistoricoDTO();
        relatorio.setNomeAluno(aluno.getName());
        relatorio.setMatricula(aluno.getRegisterNumber());
        relatorio.setEmail(aluno.getEmail());
        
        if (aluno.getHistorico() != null) {
            List<ItemHistorico> itens = aluno.getHistorico().stream().map(mat -> {
                ItemHistorico item = new ItemHistorico();
                item.setDisciplina(mat.getTurma().getDisciplina().getDescription());
                item.setSemestre(mat.getTurma().getSemestre());
                item.setMedia(mat.getMedia());
                
                String status = "CURSANDO";
                if (mat.getMedia() != null) {
                    status = mat.getMedia() >= 6.0 ? "APROVADO" : "REPROVADO";
                }
                item.setStatus(status);
                
                return item;
            }).toList();
            relatorio.setNotas(itens);
        }
        return ResponseEntity.ok(relatorio);
    }

    // DTOs Locais
    @Data
    public static class FiltroHistoricoDTO {
        private Integer alunoId;
    }

    @Data
    public static class HistoricoDTO {
        private String nomeAluno;
        private String matricula;
        private String email;
        private List<ItemHistorico> notas;
    }

    @Data
    public static class ItemHistorico {
        private String disciplina;
        private String semestre;
        private Double media;
        private String status;
    }
}