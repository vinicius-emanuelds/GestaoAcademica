let editar = false;
let idTurma = null;

document.addEventListener("DOMContentLoaded", carregarTurmas);

async function carregarTurmas() {
  try {
    const response = await fetch("/api/turmas");
    if (!response.ok) throw new Error("Erro na API");

    const turmas = await response.json();
    const divCards = document.getElementById("cards_turmas");
    divCards.innerHTML = "";

    Object.values(turmas).forEach((item) => {
      const linha = `
                <div class="col-md-3">
                <div class="card card-class shadow-sm border-2" onclick="abrirModalDetalhesDaTurma(${item.id})">
                    <div class="d-flex align-items-center mb-2">
                    <i class="bg-primary rounded-circle text-white d-flex justify-content-center align-items-center bi bi-people avatar-icon me-3"></i>
                    <div>
                        <h6 class="fw-bold mb-0">${item.semestre}</h6>
                    </div>
                    </div>
                    <small class="text-muted">${item.disciplina.description}</small>
                    <div>
                    </div>
                    <small class="text-muted">Prof. ${item.professor.name}</small>
                    <div>
                    <a href="#" class="text-primary small">Ver Detalhes</a>
                    </div>
                </div>
                </div>
            `;
      divCards.innerHTML += linha;
    });

    if (turmas.length === 0) {
      divCards.innerHTML =
        '<tr><td colspan="7" class="text-center text-muted">Nenhuma turma cadastrada.</td></tr>';
    }
  } catch (error) {
    console.error("Erro:", error);
    document.getElementById("cards_turmas").innerHTML = `<div class="col-md-4">
      <div class="card card-class shadow-sm border-0">
        <div class="d-flex align-items-center mb-2">
          <i class="bi bi-person-circle avatar-icon me-3"></i>
          <div>
            <h6 class="fw-bold mb-0">Aguarde...</h6>
          </div>
          </div>
          <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
        <small class="text-muted">Aguarde...</small>
        <div>
          <a href="#" class="text-primary small"></a>
        </div>
      </div>
    </div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const turmaModalElement = document.getElementById("modalTurma");
  const turmaForm = document.getElementById("formTurma");

  if (!turmaModalElement) {
    console.error("Elemento do modal não encontrado.");
    return;
  }

  const turmaModal = new bootstrap.Modal(turmaModalElement, {
    backdrop: true,
    keyboard: true,
  });

  turmaForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!turmaForm.checkValidity()) {
      turmaForm.classList.add("was-validated");
      return;
    }

    turmaForm.classList.add("was-validated");

    const formData = new FormData(turmaForm);
    const formDataObject = Object.fromEntries(formData.entries());
    let response = null;

    try {
      if (editar === false && idTurma === null) {
        response = await fetch("/api/turmas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataObject),
        });
      } else {
        response = await fetch(`/api/turmas/${idTurma}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataObject),
        });
      }

      const data = await response.json();

      if (response.status === 200) {
        alert("Alterado com sucesso!");
        turmaModal.hide();
        turmaForm.reset();
        turmaForm.classList.remove("was-validated");
        carregarTurmas();
        editar = false;
        idTurma = null;
      } else if (response.status === 201) {
        alert("Cadastrado com sucesso!");
        turmaModal.hide();
        turmaForm.reset();
        turmaForm.classList.remove("was-validated");
        carregarTurmas();
      } else if (response.status === 400) {
        console.log(data.erro);
      } else if (response.status === 409) {
        alert(data.erro);
      } else {
        const error = await response.json();
        alert("Erro ao cadastrar: " + (error.status || "Erro desconhecido"));
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Ocorreu um erro. Tente novamente mais tarde.");
    }
  });

  turmaModalElement.addEventListener("hidden.bs.modal", function () {
    turmaForm.reset();
    turmaForm.classList.remove("was-validated");
  });
});

async function abrirModalNovaTurma() {
  const turmaModalElement = document.getElementById("modalTurma");

  const turmaModal =
    bootstrap.Modal.getInstance(turmaModalElement) ||
    new bootstrap.Modal(turmaModalElement);

  document.getElementById("formTurma").reset();
  document.getElementById("formTurma").classList.remove("was-validated");
  document.getElementById("tituloModal").textContent = "Nova Turma";

  getProfessores();
  getDisciplinas();

  turmaModal.show();
}

async function abrirModalDetalhesDaTurma(idTurma) {
  const turmaDetalhesModalElement =
    document.getElementById("modalDetalhesTurma");

  const turmaDetalhesModal =
    bootstrap.Modal.getInstance(turmaDetalhesModalElement) ||
    new bootstrap.Modal(turmaDetalhesModalElement);

  document.getElementById("detalheCodigoTurma").innerText = idTurma;

  const turma = await getTurma(idTurma);

  document.getElementById("detalheProfessor").innerText = turma.professor.name;
  document.getElementById("detalheDisciplina").innerText =
    turma.disciplina.description;

  await preencherAlunosTurma(idTurma);

  turmaDetalhesModal.show();
}

async function preencherAlunosTurma(idTurma) {
  const tbody = document.getElementById("listaAlunosTurma");
  const matriculas = await getMatriculasPorTurma(idTurma);

  if (matriculas.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="text-center text-muted"><i class="bi bi-inbox me-2"></i>Nenhum aluno matriculado nesta turma.</td></tr>';
  } else {
    document.getElementById("detalheTotalAlunos").innerText = matriculas.length;

    tbody.innerHTML = "";

    matriculas.forEach((matricula) => {
      const iniciais = matricula.aluno.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

      const linha = `
                <tr>
                    <td>
                        <div class="avatar bg-light text-primary">
                            ${iniciais}
                        </div>
                    </td>
                    <td class="fw-bold">${matricula.aluno.name}</td>
                    <td class="text-primary">${
                      matricula.aluno.registerNumber || "-"
                    }</td>
                    <td class="text-secondary">${
                      matricula.aluno.email || "-"
                    }</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-link text-danger" onclick="removerAlunoDaTurma(${
                          matricula.id
                        })" title="Remover da turma">
                            <i class="bi bi-person-dash"></i>
                        </button>
                    </td>
                </tr>
            `;
      tbody.innerHTML += linha;
    });
  }
}

async function getTurma(idTurma) {
  try {
    const response = await fetch(`/api/turmas/${idTurma}`);
    if (!response) throw new Error("Erro na API");

    const turma = await response.json();

    return turma;
  } catch (error) {
    console.log("ERRO: " + error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const alunoForm = document.getElementById("formAdicionarAlunoTurma");

  alunoForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!alunoForm.checkValidity()) {
      alunoForm.classList.add("was-validated");
      return;
    }
    postAluno();
  });
});

async function postAluno() {
  const alunoForm = document.getElementById("formAdicionarAlunoTurma");
  const alunoModalElement = document.getElementById("modalAdicionarAlunoTurma");

  const alunoModal =
    bootstrap.Modal.getInstance(alunoModalElement) ||
    new bootstrap.Modal(alunoModalElement);

  const idAluno = document.getElementById("selectAluno").value;
  const idTurma = parseInt(
    document.getElementById("detalheCodigoTurma").innerText
  );

  const formData = new FormData();
  formData.append("alunoId", idAluno);
  formData.append("turmaId", idTurma);
  const formDataObject = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/matriculas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDataObject),
    });

    const data = await response.json();

    if (response.status === 201) {
      alert("Matriculado com sucesso!");
      alunoModal.hide();
      alunoForm.reset();
      alunoForm.classList.remove("was-validated");
      await preencherAlunosTurma(idTurma);
    } else if (response.status === 400) {
      console.log(data.erro);
    } else if (response.status === 409) {
      alert(data.erro);
    } else {
      const error = await response.json();
      alert("Erro ao cadastrar: " + (error.status || "Erro desconhecido"));
    }
  } catch (error) {
    console.log("ERRO: " + error);
  }
}

async function abrirModalAdicionarAluno() {
  const alunoModalElement = document.getElementById("modalAdicionarAlunoTurma");
  const alunos = await getAlunos();
  const selectAlunos = document.getElementById("selectAluno");
  selectAlunos.innerHTML = '<option value="">Selecione um Aluno...</option>';

  alunos.forEach((aluno) => {
    const option = document.createElement("option");
    option.value = aluno.id;
    option.textContent = aluno.name;
    selectAlunos.appendChild(option);
  });
  const alunoModal = new bootstrap.Modal(alunoModalElement, {
    backdrop: true,
    keyboard: true,
  });

  document.getElementById("formAdicionarAlunoTurma").reset();
  document
    .getElementById("formAdicionarAlunoTurma")
    .classList.remove("was-validated");

  alunoModal.show();
}

async function getAlunos() {
  try {
    const response = await fetch(`/api/alunos`);
    if (!response) throw new Error("Erro na API");

    const alunos = await response.json();
    return alunos;
  } catch (error) {
    console.log("ERRO: " + error);
  }
  return null;
}

async function getMatriculasPorTurma(idTurma) {
  try {
    const response = await fetch(`/api/matriculas`);
    if (!response) throw new Error("Erro na API");

    let matriculas = await response.json();

    matriculas = matriculas.filter(
      (matricula) => matricula.turma.id === idTurma
    );

    return matriculas;
  } catch (error) {
    console.log("ERRO: " + error);
  }
  return null;
}

async function getProfessores() {
  try {
    let response = await fetch(`/api/professores`);
    if (!response.ok) throw new Error("Erro na API");

    const professores = await response.json();
    const selectProfessor = document.getElementById("professor");
    selectProfessor.innerHTML =
      '<option value="">Selecione um Professor...</option>';

    professores.forEach((professor) => {
      const option = document.createElement("option");
      option.value = professor.id;
      option.textContent = professor.name;
      selectProfessor.appendChild(option);
    });
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function getDisciplinas() {
  try {
    const response = await fetch(`/api/disciplinas`);
    if (!response.ok) throw new Error("Erro na API");

    const disciplinas = await response.json();
    const selectDisciplinas = document.getElementById("disciplina");
    selectDisciplinas.innerHTML =
      '<option value="">Selecione uma Disciplina...</option>';

    disciplinas.forEach((disciplina) => {
      const option = document.createElement("option");
      option.value = disciplina.id;
      option.textContent = disciplina.description;
      selectDisciplinas.appendChild(option);
    });
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function excluirTurma(id) {
  if (confirm("Deseja realmente excluir a turma " + id + "?")) {
    try {
      const response = await fetch(`/api/turmas/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Turma excluída com sucesso!");
        carregarTurmas();
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Ocorreu um erro. Tente novamente mais tarde.");
    }
  }
}

async function removerAlunoDaTurma(idMatricula) {
  if (confirm("Deseja realmente remover o aluno?")) {
    try {
      const response = await fetch(`/api/matriculas/${idMatricula}`, {
        method: "DELETE",
      });
      
      
      if (response.ok || response.status === 204) {
        alert("Desmatriculado com sucesso!");
        const idTurma = parseInt(document.getElementById("detalheCodigoTurma").innerText);
        await preencherAlunosTurma(idTurma);
      } else {
        alert(`Erro ${response.status}: Não foi possível remover`);
      }
    } catch (error) {
      alert("Ocorreu um erro. Tente novamente mais tarde.");
    }
  }
}

async function alterarTurma(id) {
  const turmaModalElement = document.getElementById("modalTurma");

  const turmaModal =
    bootstrap.Modal.getInstance(turmaModalElement) ||
    new bootstrap.Modal(turmaModalElement);

  document.getElementById("formProfessor").reset();
  document.getElementById("formProfessor").classList.remove("was-validated");
  document.getElementById("tituloModal").textContent = "Alterar Professor";

  try {
    const response = await fetch(`/api/turmas/${id}`);
    if (!response.ok) throw new Error("Erro na API");

    const turma = await response.json();

    if (turma) {
      document.getElementById("nome").value = turma.name;
      document.getElementById("cpf").value = turma.cpf;
      document.getElementById("email").value = turma.email;
    }
  } catch (error) {
    console.error("Erro:", error);
  }
  editar = true;
  idTurma = id;
  turmaModal.show();
}
