import type { ResumoUsuario } from "@acadflow/shared";
import { Router } from "express";
import { db } from "../../lib/db";

export const resumoRoutes = Router();

/** Totais de registros do aluno logado. Base do RF13. */
resumoRoutes.get("/", async (req, res) => {
  const doUsuario = ({ usuarioId }: { usuarioId: string }) => usuarioId === req.usuario.id;
  const [disciplinas, atividades, avaliacoes] = await Promise.all([
    db.disciplinas.listar(doUsuario),
    db.atividades.listar(doUsuario),
    db.avaliacoes.listar(doUsuario),
  ]);
  const resumo: ResumoUsuario = {
    disciplinas: disciplinas.length,
    atividades: atividades.length,
    avaliacoes: avaliacoes.length,
  };
  res.json(resumo);
});
