import type { SaudeApi } from "@acadflow/shared";
import { Router } from "express";

export const healthRoutes = Router();

// Pública: não pode revelar quantos registros existem de outros usuários (RNF10).
healthRoutes.get("/", (_req, res) => {
  res.json({ status: "ok", versao: "0.1.0" } satisfies SaudeApi);
});
