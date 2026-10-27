import { COOKIE_SESSAO } from "@acadflow/shared";
import { Router } from "express";
import { validar } from "../../lib/validacao";
import { opcoesCookie } from "../auth/auth.routes";
import { exclusaoPerfilSchema, perfilSchema } from "./usuarios.schema";
import { atualizarPerfil, excluirPerfil } from "./usuarios.service";

/** "Meu perfil": o aluno só vê e altera a própria conta (RNF10). */
export const perfilRoutes = Router();

perfilRoutes.get("/", (req, res) => {
  res.json(req.usuario);
});

perfilRoutes.put("/", async (req, res) => {
  res.json(await atualizarPerfil(req.usuario.id, validar(perfilSchema, req.body)));
});

perfilRoutes.delete("/", async (req, res) => {
  const { senhaAtual } = validar(exclusaoPerfilSchema, req.body);
  await excluirPerfil(req.usuario.id, senhaAtual);
  res.clearCookie(COOKIE_SESSAO, opcoesCookie);
  res.status(204).end();
});
