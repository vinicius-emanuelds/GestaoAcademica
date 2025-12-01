document.addEventListener("DOMContentLoaded", async () => {
  try {
    const getTurmas = await fetch("/api/turmas");
    if (!getTurmas.ok) throw new Error("Erro na requisição a API");

    const turmas = await getTurmas.json();
    const selectTurma = document.getElementById("selectTurma");

    const turmasUnicas = new Map(
      turmas.map((turma) => [turma.semestre, turma])
    );

    turmasUnicas.forEach((turma) => {
      const option = document.createElement("option");
      option.value = turma.id;
      option.textContent = turma.semestre;
      selectTurma.appendChild(option);
    });

    selectTurma.addEventListener("change", (e) => {
      atualizarDisciplinas(turmas);
    });
  } catch (error) {
    console.log(error);
  }

  document.querySelectorAll(`td input`).forEach((input) => {
    console.log(input);
    input.addEventListener("input", () => {
      const partes = input.value.split(".");
      if (partes[1] && partes[1].length > 1) {
        partes[1] = partes[1].slice(0, 1);
        input.value = partes.join(".");
      }
    });

    input.addEventListener("beforeinput", (event) => {
      if (event.data && /[eE+\-]/.test(event.data)) {
        event.preventDefault();
      }
    });

    input.addEventListener("blur", () => {
      const valor = input.value;
      if (valor === "" || Number(valor) > 10 || Number(valor) < 0) {
        this.textContent = valorOriginal;
      } else {
        this.textContent = valor;
      }
    });
  });
});

async function buscarMatriculas() {
  const listaMatriculas = document.getElementById("listaNotasDisciplina");
  const mensagemAlerta = document.getElementById("msgAlerta");
  const selectDisciplina = document.getElementById("selectDisciplina");
  const optionDisciplinaSelecionado =
    selectDisciplina.options[selectDisciplina.selectedIndex];
  const selectTurma = document.getElementById("selectTurma");
  const optionTurmaSelecionado = selectTurma.options[selectTurma.selectedIndex];

  if (
    optionDisciplinaSelecionado.value === "" &&
    optionTurmaSelecionado.value === ""
  ) {
    mensagemAlerta.classList.add(
      "alert",
      "alert-info",
      "d-flex",
      "align-items-center"
    );
    mensagemAlerta.innerHTML = `<i class="bi bi-info-circle me-2"></i>
            <small>Selecione uma Turma e Disciplina e clique em Buscar</small>`;
    listaMatriculas.innerHTML = "";
    return;
  }

  const response = await fetch(`/api/matriculas`);

  const matriculas = await response.json();

  const matriculasFiltradas = matriculas.filter(
    (matricula) =>
      matricula.turma.semestre === optionTurmaSelecionado.textContent &&
      matricula.turma.disciplina.id ===
        parseInt(optionDisciplinaSelecionado.value)
  );

  if (matriculasFiltradas.length === 0) {
    mensagemAlerta.classList.add(
      "alert",
      "alert-info",
      "d-flex",
      "align-items-center"
    );
    mensagemAlerta.innerHTML = `<i class="bi bi-info-circle me-2"></i>
                            <small>Nenhum aluno matriculado na disciplina</small>`;
    listaMatriculas.innerHTML = "";
    return;
  }

  if (response.ok) {
    mensagemAlerta.innerHTML = "";
    mensagemAlerta.classList.remove(
      "alert",
      "alert-info",
      "d-flex",
      "align-items-center"
    );
    listaMatriculas.innerHTML = "";
    matriculasFiltradas.forEach((matricula) => {
      listaMatriculas.innerHTML += `
                    <tr>
                        <td>${matricula.aluno.registerNumber}</td>

                        <td><strong>${matricula.aluno.name}</strong></td>
                        <td>${matricula.turma.disciplina.description}</td>

                        <td>
                        <input type="number" id="notaP1${matricula.id}" value="${
                          matricula.p1 === null ? "0" : matricula.p1
                        }"
                        max="10" min="0" step="0.1" style="max-width:45px">
                        </td>
                        <td>
                        <input type="number" id="notaP2${matricula.id}" value="${
                          matricula.p2 === null ? "0" : matricula.p2
                        }"
                        max="10" min="0" step="0.1" style="max-width:45px">
                        </td>
                        <td>
                        <input type="number" id="notaP3${matricula.id}" value="${
                          matricula.p3 === null ? "0" : matricula.p3
                        }"
                        max="10" min="0" step="0.1" style="max-width:45px">
                        </td>

                        <td><strong id="media${matricula.id}">${
                          matricula.media === null
                            ? "0"
                            : matricula.media.toFixed(1)
                        }</strong></td>

                        <td><span id="status${matricula.id}">${
                          matricula.media >= 6 && matricula.media != null
                            ? "Aprovado"
                            : "Reprovado"
                        }</span></td>
                        <td>
                            <button class="btn btn-link text-primary" onclick="salvarNota(${
                                matricula.id
                            })">Salvar <i class="bi bi-check"></i></button>
                        </td>
                    </tr>
                `;
    });
  }
}

async function salvarNota(matricula){
  const nota1 = parseFloat(document.getElementById(`notaP1${matricula}`).value);
  const nota2 = parseFloat(document.getElementById(`notaP2${matricula}`).value);
  const nota3 = parseFloat(document.getElementById(`notaP3${matricula}`).value);
  const status = document.getElementById(`status${matricula}`)
  const media = ((nota1+nota2+nota3)/3.0).toFixed(1);
  document.getElementById(`media${matricula}`).innerText = media;
  if (media < 6) {
    status.innerText = "Reprovado";
  }else{
    status.innerText = "Aprovado";
  }


  const formData = new FormData();
  formData.append("p1", nota1);
  formData.append("p2", nota2);
  formData.append("p3", nota3);
  const formDataObject = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`/api/matriculas/${matricula}/notas`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDataObject),
    });

    const data = await response.json();

    if (response.status === 200) {
      alert("Notas Salvas com sucesso!");
    } else if (response.status === 400) {
      console.log(data.erro);
    } else if (response.status === 409) {
      alert(data.erro);
    } else {
      const error = data;
      alert("Erro: " + (error.status || "Erro desconhecido"));
    }
    } catch (error) {
        console.log(error);
    }
}

function atualizarDisciplinas(listaDeDisciplinas) {
  const selectDisciplina = document.getElementById("selectDisciplina");
  const selectTurma = document.getElementById("selectTurma");
  const optionSelecionado = selectTurma.options[selectTurma.selectedIndex];

  selectDisciplina.innerHTML = `<option value="">Selecione uma Disciplina</option>`;

  const turmasFiltradas = listaDeDisciplinas.filter(
    (turma) => turma.semestre === optionSelecionado.textContent
  );

  const disciplinasUnicas = new Set();

  turmasFiltradas.forEach((turma) => {
    if (!disciplinasUnicas.has(turma.disciplina)) {
      disciplinasUnicas.add(turma.disciplina);

      const option = document.createElement("option");
      option.value = turma.disciplina.id;
      option.textContent = turma.disciplina.description;
      selectDisciplina.appendChild(option);
    }
  });
}
