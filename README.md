# SIGA - Sistema Integrado de Gestão Acadêmica 📚

### Projeto da Disciplina: Programação Orientada a Objetos  
### Tema Escolhido: Aplicação RESTful com Spring Boot  
### Professor: Maromo

O **SIGA** é uma aplicação web **Fullstack** (Backend API + Frontend Thymeleaf) desenvolvida para atender aos requisitos da avaliação prática.  
O sistema implementa uma **API RESTful completa** para a gestão escolar, cobrindo operações CRUD para múltiplas entidades.

---

## 🎯 Objetivos do Projeto

- **API RESTful:** Implementação seguindo padrões REST.  
- **CRUD Completo:** Alunos, Professores, Turmas e Disciplinas.  
- **Documentação Automática:** Swagger/OpenAPI integrado.  
- **Arquitetura MVC:** Modelo, Visão e Controle bem definidos.

---

## 🚀 Tecnologias Utilizadas

- **Java 21 (LTS)**
- **Spring Boot 3**
  - Spring Web  
  - Spring Data JPA  
  - Thymeleaf  
  - Validation  
- **H2 Database**  
- **SpringDoc OpenAPI**  
- **Lombok**  
- **Maven (Wrapper incluído)**  

---

## 👥 Equipe de Desenvolvimento

- Marcelo Manara  
- Marcelo Belloto  
- Vinícius Emanuel  
- Lucas Vieira  

---

## 🛠️ Pré-requisitos

- **JDK 21 instalado**  
- **Git (opcional)**  
- O projeto inclui **Maven Wrapper (mvnw)**, dispensando instalação manual.

---

## ▶️ Guia de Instalação e Execução

### 1. Clonar o Repositório

```sh
git clone https://github.com/seu-usuario/siga.git

cd siga
```


### 2. Rodar a Aplicação

No terminal, dentro da pasta do projeto:

Windows:
```sh
./mvnw.cmd spring-boot:run
```

Linux / Mac:
```sh
./mvnw spring-boot:run
```

### 3. Acessar

- Sistema Web: http://localhost:8080

- Documentação da API (Swagger): http://localhost:8080/swagger-ui/index.html

---

# 📚 Estrutura da API (Endpoints)

A API fornece recursos para manipulação das principais entidades escolares. Abaixo, um resumo dos principais endpoints disponíveis:

## 📚 Estrutura da API (Endpoints)

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

Dica: Para testar as requisições (POST, PUT, DELETE) diretamente, utilize a interface do Swagger mencionada acima.


# 🗄️ Persistência de Dados (H2)

Para cumprir o requisito de persistência sem complicar o ambiente de desenvolvimento, utilizamos o H2 em modo arquivo.

- URL JDBC: ```jdbc:h2:file:./dados/sigaDB```
- Console de Gerenciamento: http://localhost:8080/h2-console
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
