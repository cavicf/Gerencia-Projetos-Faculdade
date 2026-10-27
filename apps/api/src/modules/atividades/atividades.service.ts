import { STATUS_INICIAL, type Atividade, type AtividadeDetalhada, type StatusAtividade } from "@acadflow/shared";
import type { z } from "zod";
import { db } from "../../lib/db";
import { conflito, dadosInvalidos, naoEncontrado } from "../../lib/errors";
import { agora } from "../../lib/validacao";
import type { atividadeSchema } from "./atividades.schema";

type DadosAtividade = z.output<typeof atividadeSchema>;

/** Atividades do aluno ordenadas por data de entrega, com a disciplina vinculada. */
export async function listarAtividades(usuarioId: string, disciplinaId?: string): Promise<AtividadeDetalhada[]> {
  const [atividades, disciplinas, avaliacoes] = await Promise.all([
    db.atividades.listar((a) => a.usuarioId === usuarioId && (!disciplinaId || a.disciplinaId === disciplinaId)),
    db.disciplinas.listar((d) => d.usuarioId === usuarioId),
    db.avaliacoes.listar((av) => av.usuarioId === usuarioId),
  ]);
  const porId = new Map(disciplinas.map((d) => [d.id, d]));
  const avaliadas = new Set(avaliacoes.map((av) => av.atividadeId));

  return atividades
    .map((a) => ({
      ...a,
      disciplinaCodigo: porId.get(a.disciplinaId)?.codigo ?? "",
      disciplinaNome: porId.get(a.disciplinaId)?.nome ?? "",
      avaliada: avaliadas.has(a.id),
    }))
    .sort((a, b) => a.dataEntrega.localeCompare(b.dataEntrega) || a.titulo.localeCompare(b.titulo, "pt-BR"));
}

/** Busca uma atividade do aluno; registros de outros usuários respondem 404 (RNF10). */
export async function obterAtividade(usuarioId: string, id: string): Promise<Atividade> {
  const atividade = await db.atividades.buscar((a) => a.id === id && a.usuarioId === usuarioId);
  if (!atividade) throw naoEncontrado("Atividade não encontrada.");
  return atividade;
}

/** RF04 / RF06 – toda atividade nasce pendente e vinculada a uma disciplina cadastrada. */
export async function criarAtividade(usuarioId: string, dados: DadosAtividade): Promise<Atividade> {
  await garantirDisciplina(usuarioId, dados.disciplinaId);
  const momento = agora();
  return db.atividades.inserir({
    ...dados,
    usuarioId,
    status: STATUS_INICIAL,
    dataConclusao: null,
    criadoEm: momento,
    atualizadoEm: momento,
  });
}

/** RF07 – altera os dados, inclusive a disciplina vinculada. */
export async function atualizarAtividade(usuarioId: string, id: string, dados: DadosAtividade): Promise<Atividade> {
  await obterAtividade(usuarioId, id);
  await garantirDisciplina(usuarioId, dados.disciplinaId);
  return (await db.atividades.atualizar(id, { ...dados, atualizadoEm: agora() }))!;
}

/** RF05 – registra a data de conclusão ao concluir e a limpa ao reabrir. */
export async function alterarStatus(usuarioId: string, id: string, status: StatusAtividade): Promise<Atividade> {
  const atual = await obterAtividade(usuarioId, id);
  if (status !== "concluida" && (await db.avaliacoes.buscar((av) => av.atividadeId === id))) {
    // RF08: nota só existe para atividade concluída.
    throw conflito("Esta atividade tem nota registrada. Exclua a avaliação antes de reabri-la.");
  }
  const momento = agora();
  const dataConclusao = status !== "concluida" ? null : atual.status === "concluida" ? atual.dataConclusao : momento;
  return (await db.atividades.atualizar(id, { status, dataConclusao, atualizadoEm: momento }))!;
}

/** RF07 – exclui a atividade e a avaliação vinculada a ela. */
export async function excluirAtividade(usuarioId: string, id: string): Promise<void> {
  await obterAtividade(usuarioId, id);
  await db.avaliacoes.remover((av) => av.atividadeId === id);
  await db.atividades.remover((a) => a.id === id);
}

/** A atividade só pode ser vinculada a uma disciplina do próprio aluno. */
async function garantirDisciplina(usuarioId: string, disciplinaId: string) {
  if (!(await db.disciplinas.buscar((d) => d.id === disciplinaId && d.usuarioId === usuarioId))) {
    throw dadosInvalidos({ disciplinaId: "Escolha uma disciplina cadastrada." });
  }
}
