let editar = false;
let idAluno = null;

document.addEventListener("DOMContentLoaded", carregarAlunos);

async function carregarAlunos() {
  try {
    // 1. Chama a API (GET /api/alunos)
    const response = await fetch("/api/alunos");
    if (!response.ok) throw new Error("Erro na API");

    const alunos = await response.json();
    const tbody = document.getElementById("listaAlunos");
    tbody.innerHTML = "";
    alunos.forEach((aluno) => {
      const iniciais = aluno.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

      const linha = `
                            <tr>
                                <td>${aluno.id}</td>
                                <td><div class="avatar bg-light text-primary fw-bold d-flex align-items-center justify-content-center rounded-circle" style="width: 40px; height: 40px;">${iniciais}</div></td>
                                <td class="fw-bold">${aluno.name}</td>
                                <td class="text-primary">${
                                  aluno.registerNumber || "Gerando..."
                                }</td>
                                <td class="text-secondary">${
                                  aluno.email || "-"
                                }</td>
                                <td><span class="badge bg-success">Ativo</span></td>
                                <td>
                                    <button class="btn btn-sm btn-link text-primary" onclick="alterarAluno(${
                                      aluno.id
                                    })"><i class="bi bi-pencil-square"></i></button>
                                    <button class="btn btn-sm btn-link text-danger" onclick="excluirAluno(${
                                      aluno.id
                                    })"><i class="bi bi-trash"></i></button>
                                </td>
                            </tr>
                        `;
      tbody.innerHTML += linha;
    });

    if (alunos.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="7" class="text-center text-muted">Nenhum aluno cadastrado.</td></tr>';
    }
  } catch (error) {
    console.error("Erro:", error);
    document.getElementById("listaAlunos").innerHTML =
      '<tr><td colspan="7" class="text-center text-danger">Erro ao carregar dados. Verifique se o Backend está rodando.</td></tr>';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const alunoModalElement = document.getElementById("modalAluno");
  const alunoForm = document.getElementById("formAluno");

  if (!alunoModalElement) {
    console.error("Elemento do modal não encontrado.");
    return;
  }

  const alunoModal = new bootstrap.Modal(alunoModalElement, {
    backdrop: true,
    keyboard: true,
  });

  alunoForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!alunoForm.checkValidity()) {
      alunoForm.classList.add("was-validated");
      return;
    }

    alunoForm.classList.add("was-validated");

    const formData = new FormData(alunoForm);
    const formDataObject = Object.fromEntries(formData.entries());
    let response = null;

    try {
      if (editar === false && idAluno === null) {
        response = await fetch("/api/alunos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataObject),
        });
      } else {
        response = await fetch(`/api/alunos/${idAluno}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataObject),
        });
      }

      const data = await response.json();

      if (response.status === 200) {
        alert("Alterado com sucesso!");
        alunoModal.hide();
        alunoForm.reset();
        alunoForm.classList.remove("was-validated");
        carregarAlunos();
        editar = false;
        idAluno = null;
      } else if (response.status === 201) {
        alert("Cadastrado com sucesso!");
        alunoModal.hide();
        alunoForm.reset();
        alunoForm.classList.remove("was-validated");
        carregarAlunos();
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

  // Limpar formulário quando modal for fechado
  alunoModalElement.addEventListener("hidden.bs.modal", function () {
    alunoForm.reset();
    alunoForm.classList.remove("was-validated");
  });
});

function abrirModalNovoAluno() {
  const alunoModalElement = document.getElementById("modalAluno");

  const alunoModal =
    bootstrap.Modal.getInstance(alunoModalElement) ||
    new bootstrap.Modal(alunoModalElement);

  document.getElementById("formAluno").reset();
  document.getElementById("formAluno").classList.remove("was-validated");
  document.getElementById("tituloModal").textContent = "Novo Aluno";

  alunoModal.show();
}

async function excluirAluno(id) {
  if (confirm("Deseja realmente excluir o aluno ID " + id + "?")) {
    try {
      const response = await fetch(`/api/alunos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Aluno excluído com sucesso!");
        carregarAlunos();
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Ocorreu um erro. Tente novamente mais tarde.");
    }
  }
}

async function alterarAluno(id) {
  const alunoModalElement = document.getElementById("modalAluno");

  const alunoModal =
    bootstrap.Modal.getInstance(alunoModalElement) ||
    new bootstrap.Modal(alunoModalElement);

  document.getElementById("formAluno").reset();
  document.getElementById("formAluno").classList.remove("was-validated");
  document.getElementById("tituloModal").textContent = "Alterar Aluno";

  try {
    const response = await fetch(`/api/alunos/${id}`);
    if (!response.ok) throw new Error("Erro na API");

    const aluno = await response.json();

    if (aluno) {
      document.getElementById("nome").value = aluno.name;
      document.getElementById("cpf").value = aluno.cpf;
      document.getElementById("email").value = aluno.email;
    }
  } catch (error) {
    console.error("Erro:", error);
  }
  editar = true;
  idAluno = id;
  alunoModal.show();
}
