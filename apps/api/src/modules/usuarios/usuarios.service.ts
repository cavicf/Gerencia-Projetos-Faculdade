import type { UsuarioEntrada, UsuarioPublico } from "@acadflow/shared";
import bcrypt from "bcryptjs";
import { paraPublico } from "../../lib/acesso";
import { db } from "../../lib/db";
import { naoEncontrado } from "../../lib/errors";
import { agora } from "../../lib/validacao";

const RODADAS_BCRYPT = 10;

export async function listarUsuarios(): Promise<UsuarioPublico[]> {
  return (await db.usuarios.listar()).map(paraPublico);
}

export async function obterUsuario(id: string): Promise<UsuarioPublico> {
  const usuario = await db.usuarios.buscar((u) => u.id === id);
  if (!usuario) throw naoEncontrado("Usuário não encontrado.");
  return paraPublico(usuario);
}

/** RF14 – altera nome, e-mail e, se informada, a senha (guardada somente como hash bcrypt – RNF09). */
export async function atualizarUsuario(id: string, dados: UsuarioEntrada): Promise<UsuarioPublico> {
  await obterUsuario(id);

  const usuario = await db.usuarios.atualizar(id, {
    nome: dados.nome,
    email: dados.email,
    ...(dados.senha ? { senhaHash: await bcrypt.hash(dados.senha, RODADAS_BCRYPT) } : {}),
    atualizadoEm: agora(),
  });
  return paraPublico(usuario!);
}
