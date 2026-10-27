import { Router } from "express";
import { validar } from "../../lib/validacao";
import { usuarioAlteradoSchema } from "./usuarios.schema";
import { atualizarUsuario, listarUsuarios, obterUsuario } from "./usuarios.service";

export const usuariosRoutes = Router();

// O sistema tem um único usuário, o administrador: não há cadastro nem exclusão, apenas edição.
usuariosRoutes.get("/", async (_req, res) => {
  res.json(await listarUsuarios());
});

usuariosRoutes.get("/:id", async (req, res) => {
  res.json(await obterUsuario(req.params.id));
});

usuariosRoutes.put("/:id", async (req, res) => {
  res.json(await atualizarUsuario(req.params.id, validar(usuarioAlteradoSchema, req.body)));
});
