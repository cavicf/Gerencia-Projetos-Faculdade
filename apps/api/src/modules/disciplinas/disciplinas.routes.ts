import { Router } from "express";
import { validar } from "../../lib/validacao";
import { disciplinaSchema } from "./disciplinas.schema";
import {
  atualizarDisciplina,
  criarDisciplina,
  excluirDisciplina,
  listarDisciplinas,
  obterDisciplina,
} from "./disciplinas.service";

export const disciplinasRoutes = Router();

disciplinasRoutes.get("/", async (req, res) => {
  res.json(await listarDisciplinas(req.usuarioId));
});

disciplinasRoutes.get("/:id", async (req, res) => {
  res.json(await obterDisciplina(req.usuarioId, req.params.id));
});

disciplinasRoutes.post("/", async (req, res) => {
  res.status(201).json(await criarDisciplina(req.usuarioId, validar(disciplinaSchema, req.body)));
});

disciplinasRoutes.put("/:id", async (req, res) => {
  res.json(await atualizarDisciplina(req.usuarioId, req.params.id, validar(disciplinaSchema, req.body)));
});

disciplinasRoutes.delete("/:id", async (req, res) => {
  await excluirDisciplina(req.usuarioId, req.params.id);
  res.status(204).end();
});
