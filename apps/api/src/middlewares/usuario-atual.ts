import type { RequestHandler } from "express";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Id do estudante autenticado; toda consulta deve filtrar por ele (RNF10). */
      usuarioId: string;
    }
  }
}

/**
 * Estudante usado enquanto a autenticação (RF15) não existe.
 *
 * O cronograma coloca "Manter Usuários" na Release 02, mas os CRUDs da Release 01
 * já precisam gravar `usuarioId`. Até lá, toda requisição é atribuída a este
 * usuário do seed; na Release 02 este middleware passa a ler a sessão e a
 * responder 401 quando não houver usuário autenticado.
 */
export const USUARIO_DESENVOLVIMENTO_ID = "bc231e53-7352-4ca2-a676-852d4bd09f35";

export const usuarioAtual: RequestHandler = (req, _res, next) => {
  req.usuarioId = USUARIO_DESENVOLVIMENTO_ID;
  next();
};
