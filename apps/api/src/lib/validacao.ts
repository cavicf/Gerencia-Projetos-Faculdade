import type { ZodType } from "zod";
import { dadosInvalidos } from "./errors";

/** Valida o corpo da requisição; em caso de erro lança 400 com a mensagem de cada campo (RNF05). */
export function validar<T>(schema: ZodType<T>, dados: unknown): T {
  const resultado = schema.safeParse(dados ?? {});
  if (resultado.success) return resultado.data;

  const campos: Record<string, string> = {};
  for (const issue of resultado.error.issues) {
    const campo = String(issue.path[0] ?? "geral");
    campos[campo] ??= issue.message;
  }
  throw dadosInvalidos(campos);
}

/** `YYYY-MM-DD` que corresponde a uma data real do calendário (rejeita 2026-02-30). */
export function dataValida(valor: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const data = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(data.getTime()) && data.toISOString().startsWith(valor);
}

export const agora = () => new Date().toISOString();
