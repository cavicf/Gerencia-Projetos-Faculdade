import { NOTA_MAXIMA, type AvaliacaoDetalhada, type DesempenhoDisciplina } from "@acadflow/shared";
import Link from "next/link";
import { BotaoExcluir } from "@/components/ui/botao-excluir";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { botaoIcone, cartao, linkAcao, tabela } from "@/components/ui/estilos";
import { IconeLapis } from "@/components/ui/icones";
import { apiServidor } from "@/lib/api-servidor";
import { corDaDisciplina } from "@/lib/cores";

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
        <h2 className="mb-3 font-titulo text-lg font-semibold text-azul">Desempenho por disciplina</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {desempenho.map((d) => {
            const cor = corDaDisciplina(d.disciplinaId);
            return (
              <li
                key={d.disciplinaId}
                data-testid="desempenho-linha"
                data-codigo={d.disciplinaCodigo}
                className={`${cartao} p-5`}
              >
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-cinza">
                  <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: cor }} />
                  {d.disciplinaCodigo}
                </p>
                <p className="mt-1 font-semibold text-azul">{d.disciplinaNome}</p>

                <p className="mt-4">
                  <span data-testid="desempenho-media" className="font-titulo text-3xl font-bold text-azul">
                    {formatarNumero(d.mediaPonderada)}
                  </span>
                  <span className="ml-1 text-xs text-cinza">média ponderada</span>
                </p>
                <div aria-hidden="true" className="mt-3 h-1.5 overflow-hidden rounded-full bg-cinza-claro">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.min(100, (d.mediaPonderada / NOTA_MAXIMA) * 100)}%`, backgroundColor: cor }}
                  />
                </div>
                <p className="mt-3 text-xs text-cinza">
                  {d.avaliacoes} {d.avaliacoes === 1 ? "avaliação" : "avaliações"} · soma dos pesos{" "}
                  {formatarNumero(d.somaPesos)}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 font-titulo text-lg font-semibold text-azul">Notas registradas</h2>
        <div className={tabela.contorno}>
          <table className={tabela.tabela}>
            <thead className={tabela.cabecalho}>
              <tr>
                <th className="px-5 py-3">Atividade</th>
                <th className="px-4 py-3">Disciplina</th>
                <th className="px-4 py-3 text-center">Peso</th>
                <th className="px-4 py-3 text-center">Nota</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className={tabela.corpo}>
              {avaliacoes.map((av) => (
                <tr key={av.id} data-testid="avaliacao-linha" data-atividade={av.atividadeTitulo} className={tabela.linha}>
                  <td className="px-5 py-3.5 font-semibold text-azul">{av.atividadeTitulo}</td>
                  <td className="px-4 py-3.5 text-azul">
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: corDaDisciplina(av.disciplinaId) }}
                      />
                      <span>
                        {av.disciplinaCodigo} – {av.disciplinaNome}
                      </span>
                    </span>
                  </td>
                  <td data-testid="avaliacao-peso" className="px-4 py-3.5 text-center text-cinza">
                    {formatarNumero(av.peso)}
                  </td>
                  <td data-testid="avaliacao-nota" className="px-4 py-3.5 text-center font-titulo font-bold text-azul">
                    {formatarNumero(av.nota)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-0.5">
                      <Link
                        href={`/avaliacoes/${av.id}/editar`}
                        data-testid="botao-editar"
                        aria-label="Editar"
                        title="Editar"
                        className={botaoIcone}
                      >
                        <IconeLapis />
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
