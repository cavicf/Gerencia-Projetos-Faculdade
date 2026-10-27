import { Router } from "express";
import { validar } from "../../lib/validacao";
import { avaliacaoAlteradaSchema, novaAvaliacaoSchema } from "./avaliacoes.schema";
import {
  atualizarAvaliacao,
  calcularDesempenho,
  criarAvaliacao,
  excluirAvaliacao,
  listarAvaliacoes,
  obterAvaliacao,
} from "./avaliacoes.service";

export const avaliacoesRoutes = Router();

avaliacoesRoutes.get("/", async (_req, res) => {
  res.json(await listarAvaliacoes());
});

avaliacoesRoutes.get("/desempenho", async (_req, res) => {
  res.json(await calcularDesempenho());
});

avaliacoesRoutes.get("/:id", async (req, res) => {
  res.json(await obterAvaliacao(req.params.id));
});

avaliacoesRoutes.post("/", async (req, res) => {
  res.status(201).json(await criarAvaliacao(validar(novaAvaliacaoSchema, req.body)));
});

avaliacoesRoutes.put("/:id", async (req, res) => {
  res.json(await atualizarAvaliacao(req.params.id, validar(avaliacaoAlteradaSchema, req.body)));
});

avaliacoesRoutes.delete("/:id", async (req, res) => {
  await excluirAvaliacao(req.params.id);
  res.status(204).end();
});
