import {
  PRIORIDADE_PADRAO,
  PRIORIDADES,
  STATUS_ATIVIDADE,
  TIPOS_ATIVIDADE,
  type AtividadeEntrada,
} from "@acadflow/shared";
import { z } from "zod";
import { dataValida } from "../../lib/validacao";

/** RF04 – título, data de entrega e disciplina obrigatórios; RF06 – prioridade padrão "média". */
export const atividadeSchema = z.object({
  titulo: z
    .string({ error: "Informe o título." })
    .trim()
    .min(1, "Informe o título.")
    .max(150, "Use no máximo 150 caracteres."),
  descricao: z.string().trim().max(1000, "Use no máximo 1000 caracteres.").default(""),
  tipo: z.enum(TIPOS_ATIVIDADE, { error: "Escolha prova, trabalho ou tarefa." }).default("tarefa"),
  dataEntrega: z
    .string({ error: "Informe a data de entrega." })
    .min(1, "Informe a data de entrega.")
    .refine(dataValida, "Informe uma data de entrega válida."),
  disciplinaId: z.string({ error: "Escolha a disciplina." }).min(1, "Escolha a disciplina."),
  prioridade: z
    .enum(PRIORIDADES, { error: "Escolha a prioridade alta, média ou baixa." })
    .default(PRIORIDADE_PADRAO),
}) satisfies z.ZodType<AtividadeEntrada>;

/** RF05 – alteração de status. */
export const statusSchema = z.object({
  status: z.enum(STATUS_ATIVIDADE, { error: "Escolha pendente, em andamento ou concluída." }),
});
