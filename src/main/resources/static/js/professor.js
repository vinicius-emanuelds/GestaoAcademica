let editar = false;
let idProfessor = null;

document.addEventListener("DOMContentLoaded", carregarProfessores);

async function carregarProfessores() {
  try {
    // 1. Chama a API (GET /api/professores)
    const response = await fetch("/api/professores");
    if (!response.ok) throw new Error("Erro na API");

    const professores = await response.json();
    

    const tbody = document.getElementById("listaProfessores");
    tbody.innerHTML = "";
    professores.forEach((professor) => {
      const iniciais = professor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

      const linha = `
                            <tr>
                                <td>${professor.id}</td>
                                <td><div class="avatar bg-light text-primary fw-bold d-flex align-items-center justify-content-center rounded-circle" style="width: 40px; height: 40px;">${iniciais}</div></td>
                                <td class="fw-bold">${professor.name}</td>
                                <td class="text-primary">
                                    Nenhuma Disciplina Cadastrada!
                                </td>
                                <td class="text-secondary">${
                                  professor.email || "-"
                                }</td>
                                <td><span class="badge bg-success">Ativo</span></td>
                                <td class="text-center">
                                    <button class="btn btn-sm btn-link text-primary" onclick="alterarProfessor(${
                                      professor.id
                                    })"><i class="bi bi-pencil-square"></i></button>
                                    <button class="btn btn-sm btn-link text-danger" onclick="excluirProfessor(${
                                      professor.id
                                    })"><i class="bi bi-trash"></i></button>
                                </td>
                            </tr>
                        `;
      tbody.innerHTML += linha;
    });

    if (professores.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="7" class="text-center text-muted">Nenhum professor cadastrado.</td></tr>';
    }
  } catch (error) {
    console.error("Erro:", error);
    document.getElementById("listaProfessores").innerHTML =
      '<tr><td colspan="7" class="text-center text-danger">Erro ao carregar dados. Verifique se o Backend está rodando.</td></tr>';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const professorModalElement = document.getElementById("modalProfessor");
  const professorForm = document.getElementById("formProfessor");

  if (!professorModalElement) {
    console.error("Elemento do modal não encontrado.");
    return;
  }

  const professorModal = new bootstrap.Modal(professorModalElement, {
    backdrop: true,
    keyboard: true,
  });

  professorForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!professorForm.checkValidity()) {
      professorForm.classList.add("was-validated");
      return;
    }

    professorForm.classList.add("was-validated");

    const formData = new FormData(professorForm);
    const formDataObject = Object.fromEntries(formData.entries());
    let response = null;

    try {
      if (editar === false && idProfessor === null) {
        response = await fetch("/api/professores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataObject),
        });
      } else {
        response = await fetch(`/api/professores/${idProfessor}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataObject),
        });
      }

      const data = await response.json();

      if (response.status === 200) {
        alert("Alterado com sucesso!");
        professorModal.hide();
        professorForm.reset();
        professorForm.classList.remove("was-validated");
        carregarProfessores();
        editar = false;
        idProfessor = null;
      } else if (response.status === 201) {
        alert("Cadastrado com sucesso!");
        professorModal.hide();
        professorForm.reset();
        professorForm.classList.remove("was-validated");
        carregarProfessores();
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

  professorModalElement.addEventListener("hidden.bs.modal", function () {
    professorForm.reset();
    professorForm.classList.remove("was-validated");
  });
});

function abrirModalNovoProfessor() {
  const professorModalElement = document.getElementById("modalProfessor");

  const professorModal =
    bootstrap.Modal.getInstance(professorModalElement) ||
    new bootstrap.Modal(professorModalElement);

  document.getElementById("formProfessor").reset();
  document.getElementById("formProfessor").classList.remove("was-validated");
  document.getElementById("tituloModal").textContent = "Novo Professor";

  professorModal.show();
}

async function excluirProfessor(id) {
  if (confirm("Deseja realmente excluir o professor ID " + id + "?")) {
    try {
      const response = await fetch(`/api/professores/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Professor excluído com sucesso!");
        carregarProfessores();
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Ocorreu um erro. Tente novamente mais tarde.");
    }
  }
}

async function alterarProfessor(id) {
  const professorModalElement = document.getElementById("modalProfessor");

  const professorModal =
    bootstrap.Modal.getInstance(professorModalElement) ||
    new bootstrap.Modal(professorModalElement);

  document.getElementById("formProfessor").reset();
  document.getElementById("formProfessor").classList.remove("was-validated");
  document.getElementById("tituloModal").textContent = "Alterar Professor";

  try {
    const response = await fetch(`/api/professores/${id}`);
    if (!response.ok) throw new Error("Erro na API");

    const professor = await response.json();

    if (professor) {
      document.getElementById("nome").value = professor.name;
      document.getElementById("cpf").value = professor.cpf;
      document.getElementById("email").value = professor.email;
    }
  } catch (error) {
    console.error("Erro:", error);
  }
  editar = true;
  idProfessor = id;
  professorModal.show();
}
