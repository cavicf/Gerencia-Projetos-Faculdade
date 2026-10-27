// Chamadas diretas à API para preparar e limpar os dados de cada teste,
// deixando o Selenium focado no fluxo que está sendo validado.

export const API_URL = process.env.API_URL ?? "http://localhost:3333";

/** Aluno base do seed (apps/api/data/seed/usuarios.json), dono dos dados mockados. */
export const ALUNO = { nome: "Aluno AcadFlow", email: "aluno@unifei.edu.br", senha: "12345678" };

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

let aluno;
/** Cliente autenticado como o aluno do seed, reaproveitado entre as chamadas. */
const comoAluno = async () => (aluno ??= await clienteComo(ALUNO));

/** Dados de um aluno novo, com e-mail único por execução. */
export const novoAluno = (apelido) => ({
  nome: `Aluno ${apelido}`,
  email: `selenium.${apelido}.${SUFIXO}@exemplo.com`.toLowerCase(),
  senha: "senha-de-teste",
});

/** RFS16 – cadastra o aluno pela API e devolve um cliente autenticado como ele. */
export async function cadastrarAluno(dados) {
  const resposta = await fetch(`${API_URL}/api/auth/cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (resposta.status !== 201) throw new Error(`Cadastro de ${dados.email} falhou: ${resposta.status}`);
  return clienteComo(dados);
}

/** RFS19 – exclui a conta (e os dados) do aluno, se ela ainda existir. Usado na limpeza dos testes. */
export async function excluirConta({ email, senha }) {
  const cliente = await clienteComo({ email, senha }).catch(() => null);
  await cliente?.chamar("DELETE", "/perfil", { senhaAtual: senha });
}

/** Exclui as disciplinas cujo código começa com o prefixo e, em cascata, suas atividades e notas. */
export async function excluirDisciplinas(prefixo) {
  for (const d of await listarDisciplinas()) {
    if (d.codigo.startsWith(prefixo)) await (await comoAluno()).chamar("DELETE", `/disciplinas/${d.id}`);
  }
}

export const criarDisciplina = async (dados) =>
  (await comoAluno()).chamar("POST", "/disciplinas", { professor: "Prof. Selenium", semestre: "2026.2", ...dados });

export const listarDisciplinas = async () => (await comoAluno()).chamar("GET", "/disciplinas");

export const criarAtividade = async (dados) =>
  (await comoAluno()).chamar("POST", "/atividades", { dataEntrega: "2026-12-01", ...dados });

export const obterAtividade = async (id) => (await comoAluno()).chamar("GET", `/atividades/${id}`);

export const listarAtividades = async (disciplinaId) =>
  (await comoAluno()).chamar("GET", `/atividades?disciplinaId=${disciplinaId}`);

export const alterarStatus = async (id, status) =>
  (await comoAluno()).chamar("PATCH", `/atividades/${id}/status`, { status });

export const criarAvaliacao = async (dados) => (await comoAluno()).chamar("POST", "/avaliacoes", dados);
