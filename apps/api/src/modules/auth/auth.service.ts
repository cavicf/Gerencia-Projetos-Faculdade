import { DURACAO_SESSAO_HORAS, type Credenciais, type Sessao, type UsuarioPublico } from "@acadflow/shared";
import bcrypt from "bcryptjs";
import { paraPublico } from "../../lib/acesso";
import { db } from "../../lib/db";
import { AppError } from "../../lib/errors";
import { agora } from "../../lib/validacao";

/** RF15 – valida e-mail e senha e abre uma sessão. */
export async function entrar({ email, senha }: Credenciais): Promise<{ usuario: UsuarioPublico; sessao: Sessao }> {
  const usuario = await db.usuarios.buscar((u) => u.email === email.trim().toLowerCase());
  // Mesma mensagem para e-mail inexistente e senha errada: não revela quais e-mails existem.
  if (!usuario || !(await bcrypt.compare(senha, usuario.senhaHash))) {
    throw new AppError(401, "E-mail ou senha inválidos.");
  }

  const momento = agora();
  await db.sessoes.remover((s) => s.expiraEm <= momento);
  const expiraEm = new Date(Date.now() + DURACAO_SESSAO_HORAS * 60 * 60 * 1000).toISOString();
  const sessao = await db.sessoes.inserir({ usuarioId: usuario.id, expiraEm, criadoEm: momento, atualizadoEm: momento });
  return { usuario: paraPublico(usuario), sessao };
}

/** RF15 – encerra a sessão: o token deixa de valer mesmo que o cookie seja reaproveitado. */
export async function sair(token: string): Promise<void> {
  await db.sessoes.remover((s) => s.id === token);
}
