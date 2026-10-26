import type { Disciplina, DisciplinaEntrada, DisciplinaResumo } from "@acadflow/shared";
import { db } from "../../lib/db";
import { AppError, naoEncontrado } from "../../lib/errors";
import { agora } from "../../lib/validacao";

/** RF02 – disciplinas do estudante com a contagem de atividades pendentes e concluídas. */
export async function listarDisciplinas(usuarioId: string): Promise<DisciplinaResumo[]> {
  const [disciplinas, atividades] = await Promise.all([
    db.disciplinas.listar((d) => d.usuarioId === usuarioId),
    db.atividades.listar((a) => a.usuarioId === usuarioId),
  ]);

  return disciplinas
    .map((disciplina) => {
      const vinculadas = atividades.filter((a) => a.disciplinaId === disciplina.id);
      const atividadesConcluidas = vinculadas.filter((a) => a.status === "concluida").length;
      return { ...disciplina, atividadesConcluidas, atividadesPendentes: vinculadas.length - atividadesConcluidas };
    })
    .sort((a, b) => b.semestre.localeCompare(a.semestre) || a.nome.localeCompare(b.nome, "pt-BR"));
}

/** Busca uma disciplina do estudante; registros de outros usuários respondem 404 (RNF10). */
export async function obterDisciplina(usuarioId: string, id: string): Promise<Disciplina> {
  const disciplina = await db.disciplinas.buscar((d) => d.id === id && d.usuarioId === usuarioId);
  if (!disciplina) throw naoEncontrado("Disciplina não encontrada.");
  return disciplina;
}

export async function criarDisciplina(usuarioId: string, dados: DisciplinaEntrada): Promise<Disciplina> {
  await garantirCodigoUnico(usuarioId, dados);
  const momento = agora();
  return db.disciplinas.inserir({ ...dados, usuarioId, criadoEm: momento, atualizadoEm: momento });
}

export async function atualizarDisciplina(usuarioId: string, id: string, dados: DisciplinaEntrada): Promise<Disciplina> {
  await obterDisciplina(usuarioId, id);
  await garantirCodigoUnico(usuarioId, dados, id);
  return (await db.disciplinas.atualizar(id, { ...dados, atualizadoEm: agora() }))!;
}

/** RF03 – exclui a disciplina e, em cascata, suas atividades e as avaliações dessas atividades. */
export async function excluirDisciplina(usuarioId: string, id: string): Promise<void> {
  await obterDisciplina(usuarioId, id);
  const atividadeIds = new Set(
    (await db.atividades.listar((a) => a.disciplinaId === id && a.usuarioId === usuarioId)).map((a) => a.id),
  );
  await db.avaliacoes.remover((av) => atividadeIds.has(av.atividadeId));
  await db.atividades.remover((a) => atividadeIds.has(a.id));
  await db.disciplinas.remover((d) => d.id === id);
}

/** RF01 – não pode haver dois códigos iguais para o mesmo estudante no mesmo semestre. */
async function garantirCodigoUnico(usuarioId: string, dados: DisciplinaEntrada, ignorarId?: string) {
  const repetida = await db.disciplinas.buscar(
    (d) =>
      d.usuarioId === usuarioId &&
      d.id !== ignorarId &&
      d.semestre === dados.semestre &&
      d.codigo.toUpperCase() === dados.codigo.toUpperCase(),
  );
  if (repetida) {
    throw new AppError(409, "Já existe uma disciplina com este código neste semestre.", {
      codigo: `O código ${dados.codigo} já está cadastrado em ${dados.semestre}.`,
    });
  }
}
