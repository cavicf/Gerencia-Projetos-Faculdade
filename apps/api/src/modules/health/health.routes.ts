import type { SaudeApi } from "@acadflow/shared";
import { Router } from "express";
import { db } from "../../lib/db";

export const healthRoutes = Router();

healthRoutes.get("/", async (_req, res) => {
  const colecoes = Object.fromEntries(
    await Promise.all(Object.values(db).map(async (c) => [c.nome, await c.contar()] as const)),
  );
  res.json({ status: "ok", versao: "0.1.0", colecoes } satisfies SaudeApi);
});
