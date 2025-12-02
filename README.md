# SIGA - Sistema Integrado de Gestão Acadêmica 📚
![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white) ![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white) ![Thymeleaf](https://img.shields.io/badge/Thymeleaf-%23005F0F.svg?style=for-the-badge&logo=Thymeleaf&logoColor=white) ![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

> **Disciplina:** Programação Orientada a Objetos  
> **Tema:** Aplicação RESTful com Spring Boot  
> **Professor:** Marcos Roberto de Moraes (Maromo)

O **SIGA** é uma aplicação web **Fullstack** (Backend API + Frontend Thymeleaf) desenvolvida para a gestão escolar. O sistema implementa uma **API RESTful completa**, cobrindo operações CRUD para múltiplas entidades (Alunos, Professores, Turmas, Disciplinas e Notas).

---
## 👨‍💻  Equipe de Desenvolvimento
[Lucas Vieira](https://github.com/Lucas-WBB) •  [Marcelo Belloto](https://github.com/marcelo-belotto) •  [Marcelo Manara](https://github.com/ManaraMarcelo) • [Vinícius Emanuel](https://github.com/vinicius-emanuelds)

---

## 🎯 Objetivos do Projeto

- **API RESTful:** Implementação seguindo as melhores práticas e verbos HTTP.
- **CRUD Completo:** Gestão integral de entidades acadêmicas.
- **Documentação Automática:** Swagger/OpenAPI integrado para testes e visualização.
- **Arquitetura MVC:** Separação clara entre Modelo, Visão e Controle.

---

## 🚀 Tecnologias Utilizadas

- **Java 21 (LTS)**
- **Spring Boot 3**
  - Spring Web  
  - Spring Data JPA  
  - Thymeleaf  
  - Validation
- **Frontend:** Thymeleaf + Bootstrap (via CDN)
- **Banco de Dados:** H2 Database (Modo Arquivo)
- **Documentação:** SpringDoc OpenAPI (Swagger UI)
- **Ferramentas:** Maven, Git

---
## 🛠️ Instalação e Execução

### Pré-requisitos

- **JDK 21 instalado**  
- **Git (opcional)**  
- O projeto inclui **Maven Wrapper (mvnw)**, dispensando instalação manual.



### ▶️ Passo a Passo

#### 1. Clonar o Repositório

```sh
git clone https://github.com/vinicius-emanuelds/GestaoAcademica.git
```

#### 2. Rodar a Aplicação

No terminal, dentro da pasta do projeto:

Windows:
```sh
./mvnw.cmd spring-boot:run
```

Linux / Mac:
```sh
./mvnw spring-boot:run
```

**Linux / Mac:**
Caso tenha erro de permissão ("permission denied"), rode o comando de liberação primeiro:
```sh
chmod +x mvnw
./mvnw spring-boot:run
```

#### 3. Acessar
Acessar
- Sistema Web: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- Banco H2: http://localhost:8080/h2-console

---

## 📚 Estrutura da API (Endpoints)

A API fornece recursos para manipulação das principais entidades escolares. Abaixo, um resumo dos principais endpoints disponíveis. Para detalhes completos, consulte a documentação Swagger.

| Método | Endpoint                     | Descrição                           |
|--------|------------------------------|-------------------------------------|
| GET    | `/api/alunos`                | Lista todos os alunos               |
| POST   | `/api/alunos`                | Cadastra um novo aluno              |
| GET    | `/api/professores`           | Lista todos os professores          |
| POST   | `/api/professores`           | Cadastra um novo professor          |
| GET    | `/api/disciplinas`           | Lista todas as disciplinas          |
| POST   | `/api/disciplinas`           | Cadastra uma nova disciplina        |
| GET    | `/api/turmas`                | Lista as turmas disponíveis         |
| POST   | `/api/turmas`                | Cria uma turma (vínculo Prof/Disc)  |
| GET    | `/api/matriculas`            | Lista todas as matrículas           |
| PUT    | `/api/matriculas/{id}/notas` | Atualiza as notas de um aluno       |

> ⚠️ Dica: Para testar as requisições (POST, PUT, DELETE) diretamente, utilize a interface do Swagger.


# 🗄️ Configuração do Banco de Dados (H2)

Para cumprir o requisito de persistência sem complicar o ambiente de desenvolvimento, utilizamos o H2 em modo arquivo.

> Console de Gerenciamento: http://localhost:8080/h2-console

- URL JDBC: ```jdbc:h2:file:./dados/sigaDB```
- User: ```sa```
- Password: ```(vazio)```

# 📂 Arquitetura do Projeto

A estrutura de pastas segue as boas práticas do Spring Boot:
```sh
com.poo.siga  
├── config/       # Configurações (OpenAPI, CORS)
├── controller/   # Camada REST (Recebe as requisições HTTP)
├── model/        # Entidades JPA (Mapeamento do Banco)
├── repository/   # Interfaces de Acesso a Dados (Spring Data)
└── SigaApplication.java
```

# 📖 Manual do Usuário - SIGA
<details> <summary><strong>Clique para expandir o Manual Completo</strong></summary>

Bem-vindo ao **SIGA (Sistema Integrado de Gestão Acadêmica)**.  
Este manual guiará você pelas principais funcionalidades do sistema, desde o cadastro básico até o lançamento de notas.

---

## 1. Acesso ao Sistema

Abra seu navegador de preferência (Chrome, Firefox, Edge) e digite o endereço:

🔗 **http://localhost:8080**

Você verá a **Página Inicial (Dashboard)**, que serve como menu principal para todas as funcionalidades.

---

## 2. Fluxo de Cadastro Sugerido

Para garantir a integridade dos dados, recomendamos seguir a seguinte ordem de cadastros:

1. **Professores** – (Quem ensina?)  
2. **Disciplinas** – (O que é ensinado?)  
3. **Turmas** – (Onde e quando é ensinado?)  
4. **Alunos** – (Quem estuda?)  
5. **Notas** – (Avaliação do desempenho)  

---

## 3. Gerenciando Professores

Acesse o menu **Professores** na barra de navegação.

### 3.1. Cadastrar Novo Professor

1. Clique no botão **"Novo Professor"**.  
2. Preencha o formulário com:

   - **Nome:** Nome completo  
   - **Email:** Endereço de contato (ex: prof.carlos@escola.com)  
   - **CPF:** Documento válido  

3. Clique em **Salvar**.  
O novo professor aparecerá na listagem.

### 3.2. Editar ou Excluir

- **Editar:** Clique no ícone de lápis ao lado do nome.  
- **Excluir:** Clique no ícone de lixeira.  

⚠ **Atenção:** Professores vinculados a turmas ativas não podem ser excluídos.

---

## 4. Gerenciando Disciplinas

Acesse o menu **Disciplinas**.

### 4.1. Criar Disciplina

1. Clique em **"Nova Disciplina"**.  
2. Informe:

   - **Descrição:** Nome da matéria (ex: Matemática Básica)  
   - **Código:** Sigla interna (ex: MAT-101)  
   - **Créditos:** Carga horária ou peso (ex: 4)  

3. Confirme a operação.

---

## 5. Gerenciando Turmas

Acesse o menu **Turmas**.  
Esta etapa conecta professores e disciplinas.

### 5.1. Abrir Turma

1. Clique em **"Nova Turma"**.  
2. Selecione:

   - **Semestre:** (ex: 2024-1)  
   - **Professor:** Um professor já cadastrado  
   - **Disciplina:** A matéria desejada  

3. Salve.  
A nova turma estará disponível para receber alunos.

---

## 6. Gerenciando Alunos

Acesse o menu **Alunos**.

### 6.1. Matricular Novo Aluno

1. Clique em **"Novo Aluno"**.  
2. Preencha:

   - Nome  
   - Email  
   - CPF  
   - Número de Matrícula (ex: 20240001)

3. Salve o registro.

### 6.2. Histórico Escolar

Na lista de alunos, clique em **Detalhes/Histórico** (quando disponível)  
ou gere o relatório via API.

---

## 7. Lançamento de Notas

Acesse o menu **Notas** na barra lateral.  
Esta tela é utilizada para registrar o desempenho dos alunos nas avaliações.

### 7.1. Registrar P1, P2 e P3

1. Localize o aluno e a turma na listagem.  
2. Clique em **"Lançar Notas"**.  
3. Preencha:

   - **P1:** Nota da primeira prova (0–10)  
   - **P2:** Nota da segunda prova (0–10)  
   - **P3:** Nota opcional ou conforme regra da escola  

4. Clique em **Salvar/Atualizar**.

O sistema calculará automaticamente a **Média** e atualizará o **Status** (Aprovado/Reprovado).

---

## 8. Solução de Problemas Comuns

### ❌ Erro ao Excluir
Verifique se o item (Professor ou Disciplina) não está vinculado a uma Turma ou Matrícula.

### ⚠ Sistema não carrega
Confirme se o backend está rodando e se a porta **8080** está livre.

### 📁 Dados sumiram
Verifique se o arquivo `sigaDB.mv.db` está presente na pasta **dados/** do projeto.

---

# 📂 Exemplo de Cadastro de Novo Aluno

1. Na nossa página inicial, escolhemos ao lado esquerdo a opção `Alunos`.  
![IMAGEM HOME PAGE](https://github.com/vinicius-emanuelds/bugs-life/blob/main/poo/siga/imgs/Captura%20de%20Tela%202025-11-30%20às%2019.09.25.png)

2. Dentro da página de Alunos, escolhemos ao canto sinalizado em vermelho para adicionar um novo aluno.   
![IMAGEM HOME ALUNOS](https://github.com/vinicius-emanuelds/bugs-life/blob/main/poo/siga/imgs/Captura%20de%20Tela%202025-11-30%20às%2019.01.52.png)

3. No modal exibido, inserimos os dados pessoais do novo aluno para a adição.  
![IMAGEM ADD ALUNOS](https://github.com/vinicius-emanuelds/bugs-life/blob/main/poo/siga/imgs/Captura%20de%20Tela%202025-11-30%20às%2019.02.13.png)

4. Ao inserir corretamente os dados, uma mensagem de sucesso será exibida e seu novo aluno estará disponível na listagem de alunos.  
![IMAGEM ](https://github.com/vinicius-emanuelds/bugs-life/blob/main/poo/siga/imgs/Captura%20de%20Tela%202025-11-30%20às%2019.02.52.png)

5. Em amarelo vemos o novo aluno inserido. 
6. Para a adição de outros campos, o sistema é muito parecido mudando apenas os dados para a adição.
7. Para Professores por exemplo, vamos na aba `Professores` sinalizado em vermelho.  
![IMAGEM ](https://github.com/vinicius-emanuelds/bugs-life/blob/main/poo/siga/imgs/Captura%20de%20Tela%202025-11-30%20às%2019.03.04.png)

8. Inserimos os dados e adicionamos.  
![IMAGEM NOVO PROFESSOR](https://github.com/vinicius-emanuelds/bugs-life/blob/main/poo/siga/imgs/Captura%20de%20Tela%202025-11-30%20às%2019.03.48.png)

9. Mesma ideia para `Disciplinas` e outros. Sendo assim intuitivo e similar em simplicidade.    
![IMAGEM NOVA DISCIPLINA](https://github.com/vinicius-emanuelds/bugs-life/blob/main/poo/siga/imgs/Captura%20de%20Tela%202025-11-30%20às%2019.04.35.png)

## 👨‍💻 Suporte Técnico

Para dúvidas avançadas, entre em contato com a equipe de desenvolvimento:

- **Marcelo Manara**  
- **Marcelo Belloto**  
- **Vinícius Emanuel**  
- **Lucas Vieira**

---

## 📝 Backlog do Projeto (Histórico de Implementação)
Esta seção lista todas as tarefas planejadas e realizadas ao longo do desenvolvimento do SIGA.

```markdown
| ID   | Tarefa                                                                    | Módulo       | Prioridade | Status        |
|------|---------------------------------------------------------------------------|--------------|------------|---------------|
| B01  | Definir escopo, requisitos e arquitetura MVC                              | Planejamento | Alta       | Concluído     |
| B02  | Especificar modelo de dados (Aluno, Prof, Turma, Disc, Matrícula)         | Planejamento | Alta       | Concluído     |
| B03  | Criar projeto Spring Boot e configurar dependências (JPA, Web, H2)        | Setup        | Alta       | Concluído     |
| B04  | Criar entidade Aluno e AlunoRepository                                    | Aluno        | Alta       | Concluído     |
| B05  | Implementar AlunoController (CRUD completo)                               | Aluno        | Alta       | Concluído     |
| B06  | Implementar funcionalidade de Histórico Escolar (JSON)                    | Aluno        | Média      | Concluído     |
| B07  | Criar entidade Professor e ProfessorRepository                            | Professor    | Média      | Concluído     |
| B08  | Implementar ProfessorController (CRUD completo)                           | Professor    | Média      | Concluído     |
| B09  | Criar entidade Disciplina e DisciplinaRepository                          | Disciplina   | Média      | Concluído     |
| B10  | Implementar DisciplinaController (CRUD completo)                          | Disciplina   | Média      | Concluído     |
| B11  | Criar entidade Turma e TurmaRepository                                    | Turma        | Alta       | Concluído     |
| B12  | Implementar TurmaController (Vínculo Prof + Disc)                         | Turma        | Alta       | Concluído     |
| B13  | Criar entidade Matrícula (Aluno + Turma) e Repository                     | Matrícula    | Alta       | Concluído     |
| B14  | Implementar endpoint de Matrícula (Criar vínculo)                         | Matrícula    | Alta       | Concluído     |
| B15  | Implementar lançamento de Notas (P1, P2, P3) e cálculo de média           | Notas        | Alta       | Concluído     |
| B16  | Desenvolver telas Frontend com Thymeleaf (Home e Cadastros)               | Frontend     | Média      | Concluído     |
| B17  | Configurar Documentação Automática (Swagger UI)                           | Infra        | Alta       | Concluído     |
| B18  | Configurar persistência de dados em arquivo (H2)                          | Infra        | Alta       | Concluído     |
```

## 🙏 Agradecimentos
Este projeto é o resultado de muito trabalho em equipe e aprendizado contínuo. Nossos agradecimentos vão para:
* **Ao Prof. Maromo:** Pela mentoria técnica e por nos desafiar aula após aula.
* **À Equipe de Desenvolvimento:** Pela parceria na integração entre Backend (Spring Boot) e Frontend, superando desafios técnicos juntos.

