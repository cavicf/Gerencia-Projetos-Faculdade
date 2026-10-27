import type { Avaliacao, AvaliacaoDetalhada, AvaliacaoEntrada, DesempenhoDisciplina } from "@acadflow/shared";
import { db } from "../../lib/db";
import { conflito, dadosInvalidos, naoEncontrado } from "../../lib/errors";
import { agora } from "../../lib/validacao";

/** RF08 – avaliações com a atividade e a disciplina vinculadas. */
export async function listarAvaliacoes(): Promise<AvaliacaoDetalhada[]> {
  const [avaliacoes, atividades, disciplinas] = await Promise.all([
    db.avaliacoes.listar(),
    db.atividades.listar(),
    db.disciplinas.listar(),
  ]);
  const atividadePorId = new Map(atividades.map((a) => [a.id, a]));
  const disciplinaPorId = new Map(disciplinas.map((d) => [d.id, d]));

  return avaliacoes
    .map((av) => {
      const atividade = atividadePorId.get(av.atividadeId);
      const disciplina = atividade ? disciplinaPorId.get(atividade.disciplinaId) : undefined;
      return {
        ...av,
        atividadeTitulo: atividade?.titulo ?? "",
        disciplinaId: disciplina?.id ?? "",
        disciplinaCodigo: disciplina?.codigo ?? "",
        disciplinaNome: disciplina?.nome ?? "",
      };
    })
    .sort(
      (a, b) =>
        a.disciplinaCodigo.localeCompare(b.disciplinaCodigo) ||
        a.atividadeTitulo.localeCompare(b.atividadeTitulo, "pt-BR"),
    );
}

/** RF08 – "acompanhar seu desempenho em cada disciplina": média ponderada Σ(nota·peso) / Σpeso. */
export async function calcularDesempenho(): Promise<DesempenhoDisciplina[]> {
  const porDisciplina = new Map<string, DesempenhoDisciplina & { somaNotasPonderadas: number }>();
  for (const av of await listarAvaliacoes()) {
    const grupo = porDisciplina.get(av.disciplinaId) ?? {
      disciplinaId: av.disciplinaId,
      disciplinaCodigo: av.disciplinaCodigo,
      disciplinaNome: av.disciplinaNome,
      avaliacoes: 0,
      somaPesos: 0,
      somaNotasPonderadas: 0,
      mediaPonderada: 0,
    };
    grupo.avaliacoes += 1;
    grupo.somaPesos += av.peso;
    grupo.somaNotasPonderadas += av.nota * av.peso;
    porDisciplina.set(av.disciplinaId, grupo);
  }

  return [...porDisciplina.values()].map(({ somaNotasPonderadas, ...grupo }) => ({
    ...grupo,
    mediaPonderada: Math.round((somaNotasPonderadas / grupo.somaPesos) * 100) / 100,
  }));
}

export async function obterAvaliacao(id: string): Promise<Avaliacao> {
  const avaliacao = await db.avaliacoes.buscar((av) => av.id === id);
  if (!avaliacao) throw naoEncontrado("Avaliação não encontrada.");
  return avaliacao;
}

/** RF08 – só atividades concluídas recebem nota, e cada atividade tem no máximo uma avaliação. */
export async function criarAvaliacao(dados: AvaliacaoEntrada): Promise<Avaliacao> {
  const atividade = await db.atividades.buscar((a) => a.id === dados.atividadeId);
  if (!atividade) throw dadosInvalidos({ atividadeId: "Escolha uma atividade cadastrada." });
  if (atividade.status !== "concluida") {
    throw dadosInvalidos({ atividadeId: "Só é possível registrar nota de atividades concluídas." });
  }
  if (await db.avaliacoes.buscar((av) => av.atividadeId === atividade.id)) {
    throw conflito("Esta atividade já possui nota registrada.", { atividadeId: "Esta atividade já possui nota registrada." });
  }

  const momento = agora();
  return db.avaliacoes.inserir({
    atividadeId: atividade.id,
    peso: dados.peso,
    nota: dados.nota,
    criadoEm: momento,
    atualizadoEm: momento,
  });
}

export async function atualizarAvaliacao(id: string, dados: Pick<Avaliacao, "peso" | "nota">): Promise<Avaliacao> {
  await obterAvaliacao(id);
  return (await db.avaliacoes.atualizar(id, { peso: dados.peso, nota: dados.nota, atualizadoEm: agora() }))!;
}

export async function excluirAvaliacao(id: string): Promise<void> {
  await obterAvaliacao(id);
  await db.avaliacoes.remover((av) => av.id === id);
}
