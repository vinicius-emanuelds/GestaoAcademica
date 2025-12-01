package com.poo.siga.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("pageTitle", "Página Inicial");
        return "home";
    }
    @GetMapping("/professor")
    public String professor(Model model) {
        model.addAttribute("pageTitle", "Professores");
        return "professor";
    }
    @GetMapping("/aluno")
    public String aluno(Model model) {
        model.addAttribute("pageTitle", "Alunos");
        return "aluno";
    }
    @GetMapping("/turma")
    public String turma(Model model) {
        model.addAttribute("pageTitle", "Turmas");
        return "turma";
    }
    @GetMapping("/nota")
    public String nota(Model model) {
        model.addAttribute("pageTitle", "Notas");
        return "nota";
    }
    @GetMapping("/disciplina")
    public String disciplina(Model model) {
        model.addAttribute("pageTitle", "Disciplinas");
        return "disciplina";
    }
}
