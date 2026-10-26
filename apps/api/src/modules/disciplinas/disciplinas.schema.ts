import type { DisciplinaEntrada } from "@acadflow/shared";
import { z } from "zod";

const obrigatorio = (rotulo: string, max: number) =>
  z
    .string({ error: `Informe ${rotulo}.` })
    .trim()
    .min(1, `Informe ${rotulo}.`)
    .max(max, `Use no máximo ${max} caracteres.`);

/** RF01 – código, nome, professor responsável e semestre letivo. */
export const disciplinaSchema = z.object({
  codigo: obrigatorio("o código", 20).transform((codigo) => codigo.toUpperCase()),
  nome: obrigatorio("o nome", 120),
  professor: obrigatorio("o professor responsável", 120),
  semestre: z
    .string({ error: "Informe o semestre." })
    .trim()
    .regex(/^\d{4}\.[12]$/, "Informe o semestre no formato AAAA.1 ou AAAA.2 (ex.: 2026.2)."),
}) satisfies z.ZodType<DisciplinaEntrada>;
