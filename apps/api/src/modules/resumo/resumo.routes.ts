import type { ResumoUsuario } from "@acadflow/shared";
import { Router } from "express";
import { db } from "../../lib/db";

export const resumoRoutes = Router();

/** Totais do estudante atual — somente os registros dele (RNF10). Base para o painel do RF13. */
resumoRoutes.get("/", async (req, res) => {
  const doUsuario = (item: { usuarioId: string }) => item.usuarioId === req.usuarioId;
  const [disciplinas, atividades, avaliacoes] = await Promise.all([
    db.disciplinas.listar(doUsuario),
    db.atividades.listar(doUsuario),
    db.avaliacoes.listar(doUsuario),
  ]);
  res.json({
    disciplinas: disciplinas.length,
    atividades: atividades.length,
    avaliacoes: avaliacoes.length,
  } satisfies ResumoUsuario);
});
