import { SENHA_TAMANHO_MINIMO, type ExclusaoPerfil, type PerfilEntrada, type UsuarioEntrada } from "@acadflow/shared";
import { z } from "zod";

const MENSAGEM_SENHA_CURTA = `A senha deve ter pelo menos ${SENHA_TAMANHO_MINIMO} caracteres.`;

const nome = z
  .string({ error: "Informe o nome." })
  .trim()
  .min(1, "Informe o nome.")
  .max(120, "Use no máximo 120 caracteres.");

// E-mail comparado sempre em minúsculas.
const email = z
  .string({ error: "Informe o e-mail." })
  .trim()
  .toLowerCase()
  .pipe(z.email("Informe um e-mail válido."));

const senhaAtual = z.string({ error: "Informe a senha atual." }).min(1, "Informe a senha atual.");

/** RFS16 – cadastro: nome, e-mail único e senha com no mínimo 8 caracteres. */
export const cadastroSchema = z.object({
  nome,
  email,
  senha: z.string({ error: "Informe a senha." }).min(SENHA_TAMANHO_MINIMO, MENSAGEM_SENHA_CURTA),
}) satisfies z.ZodType<UsuarioEntrada>;

/** RFS18 – alteração do perfil: a senha atual confirma a operação; nova senha em branco mantém a atual. */
export const perfilSchema = z
  .object({
    nome,
    email,
    novaSenha: z
      .string()
      .default("")
      .refine((senha) => senha === "" || senha.length >= SENHA_TAMANHO_MINIMO, MENSAGEM_SENHA_CURTA),
    confirmacaoSenha: z.string().default(""),
    senhaAtual,
  })
  .refine((dados) => dados.novaSenha === dados.confirmacaoSenha, {
    path: ["confirmacaoSenha"],
    message: "A confirmação deve ser igual à nova senha.",
  }) satisfies z.ZodType<PerfilEntrada>;

/** RFS19 – exclusão da conta, confirmada pela senha atual. */
export const exclusaoPerfilSchema = z.object({ senhaAtual }) satisfies z.ZodType<ExclusaoPerfil>;
