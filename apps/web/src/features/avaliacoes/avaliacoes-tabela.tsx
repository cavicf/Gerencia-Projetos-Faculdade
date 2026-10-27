import type { AvaliacaoDetalhada, DesempenhoDisciplina } from "@acadflow/shared";
import Link from "next/link";
import { BotaoExcluir } from "@/components/ui/botao-excluir";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { linkAcao } from "@/components/ui/estilos";
import { apiServidor } from "@/lib/api-servidor";

const formatarNumero = (valor: number) => valor.toLocaleString("pt-BR", { maximumFractionDigits: 2 });

/** RF08 – desempenho por disciplina (média ponderada) e notas registradas. */
export async function AvaliacoesTabela() {
  const [avaliacoes, desempenho] = await Promise.all([
    apiServidor<AvaliacaoDetalhada[]>("/avaliacoes"),
    apiServidor<DesempenhoDisciplina[]>("/avaliacoes/desempenho"),
  ]);

  if (avaliacoes.length === 0) {
    return (
      <EstadoVazio>
        Nenhuma nota registrada.{" "}
        <Link href="/avaliacoes/nova" className={linkAcao}>
          Registre a primeira
        </Link>
        .
      </EstadoVazio>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase text-slate-500">Desempenho por disciplina</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Disciplina</th>
                <th className="px-4 py-3 text-center">Avaliações</th>
                <th className="px-4 py-3 text-center">Soma dos pesos</th>
                <th className="px-4 py-3 text-center">Média ponderada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {desempenho.map((d) => (
                <tr key={d.disciplinaId} data-testid="desempenho-linha" data-codigo={d.disciplinaCodigo}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {d.disciplinaCodigo} – {d.disciplinaNome}
                  </td>
                  <td className="px-4 py-3 text-center">{d.avaliacoes}</td>
                  <td className="px-4 py-3 text-center">{formatarNumero(d.somaPesos)}</td>
                  <td data-testid="desempenho-media" className="px-4 py-3 text-center font-semibold">
                    {formatarNumero(d.mediaPonderada)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase text-slate-500">Notas registradas</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Atividade</th>
                <th className="px-4 py-3">Disciplina</th>
                <th className="px-4 py-3 text-center">Peso</th>
                <th className="px-4 py-3 text-center">Nota</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {avaliacoes.map((av) => (
                <tr key={av.id} data-testid="avaliacao-linha" data-atividade={av.atividadeTitulo}>
                  <td className="px-4 py-3 font-medium text-slate-900">{av.atividadeTitulo}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {av.disciplinaCodigo} – {av.disciplinaNome}
                  </td>
                  <td data-testid="avaliacao-peso" className="px-4 py-3 text-center">
                    {formatarNumero(av.peso)}
                  </td>
                  <td data-testid="avaliacao-nota" className="px-4 py-3 text-center">
                    {formatarNumero(av.nota)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link href={`/avaliacoes/${av.id}/editar`} data-testid="botao-editar" className={linkAcao}>
                        Editar
                      </Link>
                      <BotaoExcluir
                        caminho={`/avaliacoes/${av.id}`}
                        titulo={`Excluir a nota de "${av.atividadeTitulo}"?`}
                        mensagem={<p>A nota e o peso desta atividade serão removidos. A atividade continua cadastrada.</p>}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
