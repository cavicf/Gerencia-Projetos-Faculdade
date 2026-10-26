import type { ErroApi } from "@acadflow/shared";

/** Endereço da API usado pelo servidor do Next.js (o navegador passa pelo rewrite de `/api`). */
export const API_URL = process.env.API_URL ?? "http://localhost:3333";

/** Erro retornado pela API, já com a mensagem pronta para exibir ao estudante (RNF05). */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    mensagem: string,
    readonly campos?: Record<string, string>,
  ) {
    super(mensagem);
  }
}

/** Chamada à API REST do AcadFlow. Usada tanto em Server quanto em Client Components. */
export async function api<T>(caminho: string, init?: RequestInit): Promise<T> {
  const base = typeof window === "undefined" ? API_URL : "";
  let resposta: Response;
  try {
    resposta = await fetch(`${base}/api${caminho}`, {
      ...init,
      cache: "no-store",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError(0, "Não foi possível conectar ao servidor. Tente novamente em instantes.");
  }

  if (resposta.status === 204) return undefined as T;

  const corpo = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    const erro = (corpo as ErroApi | null)?.erro;
    throw new ApiError(resposta.status, erro?.mensagem ?? "Ocorreu um erro inesperado.", erro?.campos);
  }
  return corpo as T;
}

/** Busca um recurso; retorna `null` quando a API responde 404 (inexistente ou de outro usuário). */
export async function apiOuNulo<T>(caminho: string): Promise<T | null> {
  try {
    return await api<T>(caminho);
  } catch (erro) {
    if (erro instanceof ApiError && erro.status === 404) return null;
    throw erro;
  }
}
