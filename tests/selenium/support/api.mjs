// Chamadas diretas à API para preparar e limpar os dados de cada teste,
// deixando o Selenium focado no fluxo que está sendo validado.

export const API_URL = process.env.API_URL ?? "http://localhost:3333";

/** Único usuário do sistema, definido no seed (apps/api/data/seed/usuarios.json). */
export const ADMIN = { nome: "Administrador", email: "admin@unifei.edu.br", senha: "12345678" };

/** Sufixo único por execução, para os testes não colidirem com dados de execuções anteriores. */
export const SUFIXO = Date.now().toString(36).slice(-5).toUpperCase();

/** Cliente da API autenticado com o usuário informado (guarda o cookie de sessão). */
export async function clienteComo({ email, senha }) {
  const login = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  if (!login.ok) throw new Error(`Login de ${email} falhou: ${login.status}`);
  const cookie = login.headers.get("set-cookie").split(";")[0];

  /** Retorna `{ status, corpo }` sem lançar erro — útil para testar respostas de erro. */
  async function requisitar(metodo, caminho, corpo) {
    const resposta = await fetch(`${API_URL}/api${caminho}`, {
      method: metodo,
      headers: { "Content-Type": "application/json", cookie },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
    return { status: resposta.status, corpo: resposta.status === 204 ? undefined : await resposta.json() };
  }

  async function chamar(metodo, caminho, corpo) {
    const { status, corpo: resposta } = await requisitar(metodo, caminho, corpo);
    if (status >= 400) throw new Error(`${metodo} ${caminho} → ${status}: ${JSON.stringify(resposta)}`);
    return resposta;
  }

  return { requisitar, chamar };
}

let admin;
/** Cliente autenticado como o admin do seed, reaproveitado entre as chamadas. */
const comoAdmin = async () => (admin ??= await clienteComo(ADMIN));

/** Devolve o admin aos dados do seed (nome, e-mail e senha). */
export async function restaurarAdmin() {
  const [usuario] = await (await comoAdmin()).chamar("GET", "/usuarios");
  await (await comoAdmin()).chamar("PUT", `/usuarios/${usuario.id}`, ADMIN);
}

/** Exclui as disciplinas cujo código começa com o prefixo e, em cascata, suas atividades e notas. */
export async function excluirDisciplinas(prefixo) {
  for (const d of await listarDisciplinas()) {
    if (d.codigo.startsWith(prefixo)) await (await comoAdmin()).chamar("DELETE", `/disciplinas/${d.id}`);
  }
}

export const criarDisciplina = async (dados) =>
  (await comoAdmin()).chamar("POST", "/disciplinas", { professor: "Prof. Selenium", semestre: "2026.2", ...dados });

export const listarDisciplinas = async () => (await comoAdmin()).chamar("GET", "/disciplinas");

export const criarAtividade = async (dados) =>
  (await comoAdmin()).chamar("POST", "/atividades", { dataEntrega: "2026-12-01", ...dados });

export const obterAtividade = async (id) => (await comoAdmin()).chamar("GET", `/atividades/${id}`);

export const listarAtividades = async (disciplinaId) =>
  (await comoAdmin()).chamar("GET", `/atividades?disciplinaId=${disciplinaId}`);

export const alterarStatus = async (id, status) =>
  (await comoAdmin()).chamar("PATCH", `/atividades/${id}/status`, { status });

export const criarAvaliacao = async (dados) => (await comoAdmin()).chamar("POST", "/avaliacoes", dados);
