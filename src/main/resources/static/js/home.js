document.addEventListener("DOMContentLoaded", async () => {
  const totalAlunos = document.getElementById("totalAlunos");
  const totalProfessores = document.getElementById("totalProfessores");
  const totalTurmas = document.getElementById("totalTurmas");
  const totalDisciplinas = document.getElementById("totalDisciplinas");

  try {
    const getAlunos = await fetch(`/api/alunos`);
    if (!getAlunos) throw new Error("Erro na requisição a API");
    const alunos = await getAlunos.json();
    totalAlunos.innerText = alunos.length;

    const getProfessores = await fetch(`/api/professores`);
    if (!getProfessores) throw new Error("Erro na requisição a API");
    const professores = await getProfessores.json();
    totalProfessores.innerText = professores.length;

    const getTurmas = await fetch(`/api/turmas`);
    if (!getTurmas) throw new Error("Erro na requisição a API");
    const turmas = await getTurmas.json();
    const turmasUnicas = new Map(
      turmas.map((turma) => [turma.semestre, turma])
    );
    totalTurmas.innerText = turmasUnicas.size;

    const getDisciplinas = await fetch(`/api/disciplinas`);
    if (!getDisciplinas) throw new Error("Erro na requisição a API");
    const disciplinas = await getDisciplinas.json();
    totalDisciplinas.innerText = disciplinas.length;
  } catch (error) {
    console.log("Erro: " + error);
  }
});

async function carregarGrafico() {
  try {
    const response = await fetch("/api/matriculas");
    if (!response.ok) throw new Error("Erro ao buscar notas");

    const notas = await response.json();

    const mediasPorTurma = calcularMediasPorTurma(notas);

    criarGrafico(mediasPorTurma);
  } catch (error) {
    console.error("Erro:", error);
    alert("Não foi possível carregar o gráfico");
  }
}

function calcularMediasPorTurma(notas) {
  const turmasMap = new Map();

  notas.forEach((nota) => {
    const turmaKey = `${nota.turma.disciplina.description} (${nota.turma.semestre})`;

    if (!turmasMap.has(turmaKey)) {
      turmasMap.set(turmaKey, {
        somaMedias: 0,
        quantidade: 0,
      });
    }

    const turmaData = turmasMap.get(turmaKey);
    turmaData.somaMedias += nota.media;
    turmaData.quantidade += 1;
  });

  const resultado = [];
  turmasMap.forEach((data, turmaKey) => {
    resultado.push({
      turma: turmaKey,
      mediaGeral: data.somaMedias / data.quantidade,
      quantidade: data.quantidade,
    });
  });

  return resultado;
}

function criarGrafico(mediasPorTurma) {
  const ctx = document.getElementById("graficoNotas");

  const labels = mediasPorTurma.map((item) => item.turma);
  const dados = mediasPorTurma.map((item) =>
    parseFloat(item.mediaGeral.toFixed(1))
  );

  const cores = dados.map((media) => {
    if (media >= 8) return "rgba(75, 192, 192, 0.7)";
    if (media >= 6) return "rgba(255, 206, 86, 0.7)";
    return "rgba(255, 99, 132, 0.7)";
  });

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Média da Turma",
          data: dados,
          backgroundColor: cores,
          borderColor: cores.map((c) => c.replace("0.7", "1")),
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false, // Remove a legenda
        },
        title: {
          display: false,
          text: "Média de Notas por Turma",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
        },
      },
    },
  });
}
carregarGrafico();
