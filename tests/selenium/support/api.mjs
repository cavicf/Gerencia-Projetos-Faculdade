// Chamadas diretas à API para preparar e limpar os dados de cada teste,
// deixando o Selenium focado no fluxo que está sendo validado.

export const API_URL = process.env.API_URL ?? "http://localhost:3333";

/** Sufixo único por execução, para os testes não colidirem com dados de execuções anteriores. */
export const SUFIXO = Date.now().toString(36).slice(-5).toUpperCase();

async function chamar(metodo, caminho, corpo) {
  const resposta = await fetch(`${API_URL}/api${caminho}`, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  if (!resposta.ok) throw new Error(`${metodo} ${caminho} → ${resposta.status}: ${await resposta.text()}`);
  return resposta.status === 204 ? undefined : resposta.json();
}

export const criarDisciplina = (dados) =>
  chamar("POST", "/disciplinas", { professor: "Prof. Selenium", semestre: "2026.2", ...dados });

export const listarDisciplinas = () => chamar("GET", "/disciplinas");

export const criarAtividade = (dados) => chamar("POST", "/atividades", { dataEntrega: "2026-12-01", ...dados });

export const obterAtividade = (id) => chamar("GET", `/atividades/${id}`);

export const listarAtividades = (disciplinaId) => chamar("GET", `/atividades?disciplinaId=${disciplinaId}`);

export const alterarStatus = (id, status) => chamar("PATCH", `/atividades/${id}/status`, { status });

/** Remove as disciplinas (e, em cascata, as atividades) cujo código começa com o prefixo. */
export async function limparDisciplinas(prefixo) {
  const disciplinas = await listarDisciplinas();
  await Promise.all(
    disciplinas.filter((d) => d.codigo.startsWith(prefixo)).map((d) => chamar("DELETE", `/disciplinas/${d.id}`)),
  );
}
