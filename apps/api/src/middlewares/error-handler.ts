import type { ErroApi } from "@acadflow/shared";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../lib/errors";

export const rotaNaoEncontrada: RequestHandler = (_req, res) => {
  res.status(404).json({ erro: { mensagem: "Recurso não encontrado." } } satisfies ErroApi);
};

/** Converte qualquer erro em resposta JSON amigável, sem expor detalhes técnicos (RNF05). */
export const tratarErros: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ erro: { mensagem: err.message, campos: err.campos } } satisfies ErroApi);
    return;
  }
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ erro: { mensagem: "Requisição em formato inválido." } } satisfies ErroApi);
    return;
  }
  console.error(err);
  res.status(500).json({ erro: { mensagem: "Ocorreu um erro inesperado. Tente novamente." } } satisfies ErroApi);
};
