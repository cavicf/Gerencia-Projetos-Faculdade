import { NOTA_MAXIMA } from "@acadflow/shared";
import { z } from "zod";

const peso = z
  .number({ error: "Informe o peso." })
  .positive("O peso deve ser maior que zero.")
  .max(100, "O peso deve ser no máximo 100.");

const nota = z
  .number({ error: "Informe a nota." })
  .min(0, `A nota deve estar entre 0 e ${NOTA_MAXIMA}.`)
  .max(NOTA_MAXIMA, `A nota deve estar entre 0 e ${NOTA_MAXIMA}.`);

/** RF08 – nota e peso de uma atividade concluída. */
export const novaAvaliacaoSchema = z.object({
  atividadeId: z.string({ error: "Escolha a atividade." }).min(1, "Escolha a atividade."),
  peso,
  nota,
});

/** Alteração: a atividade avaliada não muda. */
export const avaliacaoAlteradaSchema = z.object({ peso, nota });
