import { COOKIE_SESSAO, type UsuarioPublico } from "@acadflow/shared";
import type { Request, RequestHandler } from "express";
import { paraPublico } from "../lib/acesso";
import { db } from "../lib/db";
import { naoAutenticado } from "../lib/errors";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Usuário autenticado; preenchido por `autenticar` (RF15). */
      usuario: UsuarioPublico;
    }
  }
}

/** Lê o token de sessão do cabeçalho `Cookie`. */
export function tokenDaRequisicao(req: Request): string | undefined {
  for (const parte of req.headers.cookie?.split(";") ?? []) {
    const [nome, ...valor] = parte.trim().split("=");
    if (nome === COOKIE_SESSAO) return decodeURIComponent(valor.join("="));
  }
  return undefined;
}

/** RF15 – nenhuma funcionalidade é acessível sem uma sessão válida. */
export const autenticar: RequestHandler = async (req, _res, next) => {
  const token = tokenDaRequisicao(req);
  const agora = new Date().toISOString();
  const sessao = token ? await db.sessoes.buscar((s) => s.id === token && s.expiraEm > agora) : undefined;
  const usuario = sessao ? await db.usuarios.buscar((u) => u.id === sessao.usuarioId) : undefined;
  if (!usuario) throw naoAutenticado();

  req.usuario = paraPublico(usuario);
  next();
};
