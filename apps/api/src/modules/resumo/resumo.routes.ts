import type { ResumoUsuario } from "@acadflow/shared";
import { Router } from "express";
import { db } from "../../lib/db";

export const resumoRoutes = Router();

/** Totais de registros cadastrados. Base do RF13. */
resumoRoutes.get("/", async (_req, res) => {
  const [disciplinas, atividades, avaliacoes] = await Promise.all([
    db.disciplinas.contar(),
    db.atividades.contar(),
    db.avaliacoes.contar(),
  ]);
  const resumo: ResumoUsuario = { disciplinas, atividades, avaliacoes };
  res.json(resumo);
});
