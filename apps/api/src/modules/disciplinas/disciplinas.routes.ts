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

disciplinasRoutes.get("/", async (_req, res) => {
  res.json(await listarDisciplinas());
});

disciplinasRoutes.get("/:id", async (req, res) => {
  res.json(await obterDisciplina(req.params.id));
});

disciplinasRoutes.post("/", async (req, res) => {
  res.status(201).json(await criarDisciplina(validar(disciplinaSchema, req.body)));
});

disciplinasRoutes.put("/:id", async (req, res) => {
  res.json(await atualizarDisciplina(req.params.id, validar(disciplinaSchema, req.body)));
});

disciplinasRoutes.delete("/:id", async (req, res) => {
  await excluirDisciplina(req.params.id);
  res.status(204).end();
});
