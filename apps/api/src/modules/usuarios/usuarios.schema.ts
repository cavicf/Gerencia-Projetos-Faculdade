import { SENHA_TAMANHO_MINIMO } from "@acadflow/shared";
import { z } from "zod";

/** RF14 – alteração do usuário: e-mail válido e senha com no mínimo 8 caracteres (vazia mantém a atual). */
export const usuarioAlteradoSchema = z.object({
  nome: z
    .string({ error: "Informe o nome." })
    .trim()
    .min(1, "Informe o nome.")
    .max(120, "Use no máximo 120 caracteres."),
  // E-mail comparado sempre em minúsculas.
  email: z
    .string({ error: "Informe o e-mail." })
    .trim()
    .toLowerCase()
    .pipe(z.email("Informe um e-mail válido.")),
  senha: z
    .string()
    .default("")
    .refine(
      (senha) => senha === "" || senha.length >= SENHA_TAMANHO_MINIMO,
      `A senha deve ter pelo menos ${SENHA_TAMANHO_MINIMO} caracteres.`,
    ),
});
