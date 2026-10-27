import type { Disciplina, DisciplinaEntrada, DisciplinaResumo } from "@acadflow/shared";
import { db } from "../../lib/db";
import { conflito, naoEncontrado } from "../../lib/errors";
import { agora } from "../../lib/validacao";

/** RF02 – disciplinas com a contagem de atividades pendentes e concluídas. */
export async function listarDisciplinas(): Promise<DisciplinaResumo[]> {
  const [disciplinas, atividades] = await Promise.all([db.disciplinas.listar(), db.atividades.listar()]);

  return disciplinas
    .map((disciplina) => {
      const vinculadas = atividades.filter((a) => a.disciplinaId === disciplina.id);
      const atividadesConcluidas = vinculadas.filter((a) => a.status === "concluida").length;
      return { ...disciplina, atividadesConcluidas, atividadesPendentes: vinculadas.length - atividadesConcluidas };
    })
    .sort((a, b) => b.semestre.localeCompare(a.semestre) || a.nome.localeCompare(b.nome, "pt-BR"));
}

export async function obterDisciplina(id: string): Promise<Disciplina> {
  const disciplina = await db.disciplinas.buscar((d) => d.id === id);
  if (!disciplina) throw naoEncontrado("Disciplina não encontrada.");
  return disciplina;
}

/** RF01 – cadastra a disciplina. */
export async function criarDisciplina(dados: DisciplinaEntrada): Promise<Disciplina> {
  await garantirCodigoUnico(dados);
  const momento = agora();
  return db.disciplinas.inserir({ ...dados, criadoEm: momento, atualizadoEm: momento });
}

/** RF03 – altera os dados da disciplina. */
export async function atualizarDisciplina(id: string, dados: DisciplinaEntrada): Promise<Disciplina> {
  await obterDisciplina(id);
  await garantirCodigoUnico(dados, id);
  return (await db.disciplinas.atualizar(id, { ...dados, atualizadoEm: agora() }))!;
}

/** RF03 – exclui a disciplina e, em cascata, suas atividades e as avaliações dessas atividades. */
export async function excluirDisciplina(id: string): Promise<void> {
  await obterDisciplina(id);
  const atividadeIds = new Set((await db.atividades.listar((a) => a.disciplinaId === id)).map((a) => a.id));
  await db.avaliacoes.remover((av) => atividadeIds.has(av.atividadeId));
  await db.atividades.remover((a) => atividadeIds.has(a.id));
  await db.disciplinas.remover((d) => d.id === id);
}

/** RF01 – não pode haver dois códigos iguais no mesmo semestre. */
async function garantirCodigoUnico(dados: Pick<Disciplina, "codigo" | "semestre">, ignorarId?: string) {
  const repetida = await db.disciplinas.buscar(
    (d) =>
      d.id !== ignorarId && d.semestre === dados.semestre && d.codigo.toUpperCase() === dados.codigo.toUpperCase(),
  );
  if (repetida) {
    throw conflito("Já existe uma disciplina com este código neste semestre.", {
      codigo: `O código ${dados.codigo} já está cadastrado em ${dados.semestre}.`,
    });
  }
}
