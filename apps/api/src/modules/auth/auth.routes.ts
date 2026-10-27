import { COOKIE_SESSAO, type Credenciais } from "@acadflow/shared";
import { Router, type CookieOptions } from "express";
import { z } from "zod";
import { validar } from "../../lib/validacao";
import { autenticar, tokenDaRequisicao } from "../../middlewares/autenticacao";
import { entrar, sair } from "./auth.service";

export const authRoutes = Router();

const credenciaisSchema = z.object({
  email: z.string({ error: "Informe o e-mail." }).trim().min(1, "Informe o e-mail."),
  senha: z.string({ error: "Informe a senha." }).min(1, "Informe a senha."),
}) satisfies z.ZodType<Credenciais>;

const opcoesCookie: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

authRoutes.post("/login", async (req, res) => {
  const { usuario, sessao } = await entrar(validar(credenciaisSchema, req.body));
  res.cookie(COOKIE_SESSAO, sessao.id, { ...opcoesCookie, expires: new Date(sessao.expiraEm) });
  res.json(usuario);
});

authRoutes.post("/logout", async (req, res) => {
  const token = tokenDaRequisicao(req);
  if (token) await sair(token);
  res.clearCookie(COOKIE_SESSAO, opcoesCookie);
  res.status(204).end();
});

/** Usuário da sessão atual; 401 quando não há sessão válida. */
authRoutes.get("/sessao", autenticar, (req, res) => {
  res.json(req.usuario);
});
