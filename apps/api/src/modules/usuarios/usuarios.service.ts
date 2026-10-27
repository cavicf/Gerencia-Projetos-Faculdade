import type { PerfilEntrada, UsuarioEntrada, UsuarioPublico } from "@acadflow/shared";
import bcrypt from "bcryptjs";
import { paraPublico } from "../../lib/acesso";
import { db } from "../../lib/db";
import { conflito, dadosInvalidos, naoEncontrado } from "../../lib/errors";
import { agora } from "../../lib/validacao";

const RODADAS_BCRYPT = 10;

/** RFS16 – cria a conta; a senha é guardada somente como hash bcrypt (RNF09). */
export async function cadastrarUsuario(dados: UsuarioEntrada): Promise<UsuarioPublico> {
  await garantirEmailUnico(dados.email);
  const momento = agora();
  const usuario = await db.usuarios.inserir({
    nome: dados.nome,
    email: dados.email,
    senhaHash: await bcrypt.hash(dados.senha, RODADAS_BCRYPT),
    criadoEm: momento,
    atualizadoEm: momento,
  });
  return paraPublico(usuario);
}

/** RFS18 – altera nome, e-mail e, se informada, a senha, depois de conferir a senha atual. */
export async function atualizarPerfil(id: string, dados: PerfilEntrada): Promise<UsuarioPublico> {
  await conferirSenhaAtual(id, dados.senhaAtual);
  await garantirEmailUnico(dados.email, id);

  const usuario = await db.usuarios.atualizar(id, {
    nome: dados.nome,
    email: dados.email,
    ...(dados.novaSenha ? { senhaHash: await bcrypt.hash(dados.novaSenha, RODADAS_BCRYPT) } : {}),
    atualizadoEm: agora(),
  });
  return paraPublico(usuario!);
}

/**
 * RFS19 – remove a conta e, permanentemente, as disciplinas, atividades e avaliações do aluno,
 * além das sessões abertas. O e-mail fica livre para um novo cadastro.
 */
export async function excluirPerfil(id: string, senhaAtual: string): Promise<void> {
  await conferirSenhaAtual(id, senhaAtual);
  await db.avaliacoes.remover((av) => av.usuarioId === id);
  await db.atividades.remover((a) => a.usuarioId === id);
  await db.disciplinas.remover((d) => d.usuarioId === id);
  await db.sessoes.remover((s) => s.usuarioId === id);
  await db.usuarios.remover((u) => u.id === id);
}

async function conferirSenhaAtual(id: string, senha: string) {
  const usuario = await db.usuarios.buscar((u) => u.id === id);
  if (!usuario) throw naoEncontrado("Usuário não encontrado.");
  if (!(await bcrypt.compare(senha, usuario.senhaHash))) {
    throw dadosInvalidos({ senhaAtual: "Senha atual incorreta." });
  }
}

async function garantirEmailUnico(email: string, ignorarId?: string) {
  if (await db.usuarios.buscar((u) => u.id !== ignorarId && u.email === email)) {
    throw conflito("Este e-mail já está cadastrado.", { email: "Este e-mail já está cadastrado." });
  }
}
