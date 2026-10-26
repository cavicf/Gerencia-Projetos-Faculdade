import type { ErroApi } from "@acadflow/shared";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

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
  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}/api${caminho}`, {
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
