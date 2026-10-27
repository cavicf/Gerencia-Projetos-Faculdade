import { Router } from "express";
import { validar } from "../../lib/validacao";
import { atividadeSchema, statusSchema } from "./atividades.schema";
import {
  alterarStatus,
  atualizarAtividade,
  criarAtividade,
  excluirAtividade,
  listarAtividades,
  obterAtividade,
} from "./atividades.service";

export const atividadesRoutes = Router();

atividadesRoutes.get("/", async (req, res) => {
  const disciplinaId = typeof req.query.disciplinaId === "string" ? req.query.disciplinaId : undefined;
  res.json(await listarAtividades(req.usuario.id, disciplinaId));
});

atividadesRoutes.get("/:id", async (req, res) => {
  res.json(await obterAtividade(req.usuario.id, req.params.id));
});

atividadesRoutes.post("/", async (req, res) => {
  res.status(201).json(await criarAtividade(req.usuario.id, validar(atividadeSchema, req.body)));
});

atividadesRoutes.put("/:id", async (req, res) => {
  res.json(await atualizarAtividade(req.usuario.id, req.params.id, validar(atividadeSchema, req.body)));
});

atividadesRoutes.patch("/:id/status", async (req, res) => {
  const { status } = validar(statusSchema, req.body);
  res.json(await alterarStatus(req.usuario.id, req.params.id, status));
});

atividadesRoutes.delete("/:id", async (req, res) => {
  await excluirAtividade(req.usuario.id, req.params.id);
  res.status(204).end();
});
