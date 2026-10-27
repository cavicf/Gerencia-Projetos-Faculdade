// Chamadas à API feitas por Server Components, repassando o cookie de sessão do navegador.
// Não importar em Client Components (usa `next/headers`).
import type { UsuarioPublico } from "@acadflow/shared";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { api, ApiError } from "./api";

export async function apiServidor<T>(caminho: string): Promise<T> {
  const cookie = (await cookies()).toString();
  try {
    return await api<T>(caminho, { headers: { cookie } });
  } catch (erro) {
    // Sessão ausente ou expirada (RF15): volta para o login.
    if (erro instanceof ApiError && erro.status === 401) redirect("/login");
    throw erro;
  }
}

/** Como `apiServidor`, mas exibe a página 404 quando o registro não existe. */
export async function apiServidorOu404<T>(caminho: string): Promise<T> {
  try {
    return await apiServidor<T>(caminho);
  } catch (erro) {
    if (erro instanceof ApiError && erro.status === 404) notFound();
    throw erro;
  }
}

/** Usuário da sessão; redireciona para o login se não houver. */
export function obterUsuarioAtual(): Promise<UsuarioPublico> {
  return apiServidor<UsuarioPublico>("/auth/sessao");
}

/** Usuário da sessão ou `null`, sem redirecionar (usado no cabeçalho, inclusive na tela de login). */
export async function obterUsuarioOpcional(): Promise<UsuarioPublico | null> {
  const cookie = (await cookies()).toString();
  try {
    return await api<UsuarioPublico>("/auth/sessao", { headers: { cookie } });
  } catch {
    return null;
  }
}
