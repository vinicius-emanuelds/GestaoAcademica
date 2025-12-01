let editar = false;
let idDisciplina = null;

document.addEventListener("DOMContentLoaded", carregarDisciplinas);

async function carregarDisciplinas() {
  try {
    // 1. Chama a API (GET /api/professores)
    const response = await fetch("/api/disciplinas");
    if (!response.ok) throw new Error("Erro na API");

    const disciplinas = await response.json();
    const tbody = document.getElementById("listaDisciplinas");
    tbody.innerHTML = "";
    disciplinas.forEach((disciplina) => {
      const linha = `
                            <tr>
                            <td>${disciplina.id}</td>
                            <td>${disciplina.description}</td>
                            <td>${disciplina.credits}h/Semana</td>
                            <td class="text-center">
                                <a href="#" class="text-primary me-3"><i class="bi bi-pencil" onclick="alterarDisciplina(${
                                      disciplina.id
                                    })"></i></a>
                                <a href="#" class="text-danger"><i class="bi bi-trash" onclick="excluirDisciplina(${
                                      disciplina.id
                                    })"></i></a>
                            </td>
                        </tr>
                        `;
      tbody.innerHTML += linha;
    });

    if (disciplinas.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="7" class="text-center text-muted">Nenhuma disciplina cadastrada.</td></tr>';
    }
  } catch (error) {
    console.error("Erro:", error);
    document.getElementById("listaDisciplinas").innerHTML =
      '<tr><td colspan="7" class="text-center text-danger">Erro ao carregar dados. Verifique se o Backend está rodando.</td></tr>';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const disciplinaModalElement = document.getElementById("modalDisciplina");
  const disciplinaForm = document.getElementById("formDisciplina");

  if (!disciplinaModalElement) {
    console.error("Elemento do modal não encontrado.");
    return;
  }

  const disciplinaModal = new bootstrap.Modal(disciplinaModalElement, {
    backdrop: true,
    keyboard: true,
  });

  disciplinaForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!disciplinaForm.checkValidity()) {
      disciplinaForm.classList.add("was-validated");
      return;
    }

    disciplinaForm.classList.add("was-validated");

    const formData = new FormData(disciplinaForm);
    const formDataObject = Object.fromEntries(formData.entries());
    let response = null;

    try {
      if (editar === false && idDisciplina === null) {
        response = await fetch("/api/disciplinas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataObject),
        });
      } else {
        response = await fetch(`/api/disciplinas/${idDisciplina}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataObject),
        });
      }

      const data = await response.json();

      if (response.status === 200) {
        alert("Alterada com sucesso!");
        disciplinaModal.hide();
        disciplinaForm.reset();
        disciplinaForm.classList.remove("was-validated");
        carregarDisciplinas();
        editar = false;
        idDisciplina = null;
      } else if (response.status === 201) {
        alert("Cadastrada com sucesso!");
        disciplinaModal.hide();
        disciplinaForm.reset();
        disciplinaForm.classList.remove("was-validated");
        carregarDisciplinas();
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

  disciplinaModalElement.addEventListener("hidden.bs.modal", function () {
    disciplinaForm.reset();
    disciplinaForm.classList.remove("was-validated");
  });
});

function abrirModalNovaDisciplina() {
  const disciplinaModalElement = document.getElementById("modalDisciplina");

  const disciplinaModal =
    bootstrap.Modal.getInstance(disciplinaModalElement) ||
    new bootstrap.Modal(disciplinaModalElement);

  document.getElementById("formDisciplina").reset();
  document.getElementById("formDisciplina").classList.remove("was-validated");
  document.getElementById("tituloModal").textContent = "Nova Disciplina";

  disciplinaModal.show();
}

async function excluirDisciplina(id) {
  if (confirm("Deseja realmente excluir a disciplina ID " + id + "?")) {
    try {
      const response = await fetch(`/api/disciplinas/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Disciplina excluída com sucesso!");
        carregarDisciplinas();
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Ocorreu um erro. Tente novamente mais tarde.");
    }
  }
}

async function alterarDisciplina(id) {
  const disciplinaModalElement = document.getElementById("modalDisciplina");

  const disciplinaModal =
    bootstrap.Modal.getInstance(disciplinaModalElement) ||
    new bootstrap.Modal(disciplinaModalElement);

  document.getElementById("formDisciplina").reset();
  document.getElementById("formDisciplina").classList.remove("was-validated");
  document.getElementById("tituloModal").textContent = "Alterar Disciplina";

  try {
    const response = await fetch(`/api/disciplinas/${id}`);
    if (!response.ok) throw new Error("Erro na API");

    const disciplina = await response.json();

    if (disciplina) {
      document.getElementById("codigo").value = disciplina.code;
      document.getElementById("disciplina").value = disciplina.description;
      document.getElementById("cargaHoraria").value = disciplina.credits;
    }
  } catch (error) {
    console.error("Erro:", error);
  }
  editar = true;
  idDisciplina = id;
  disciplinaModal.show();
}
