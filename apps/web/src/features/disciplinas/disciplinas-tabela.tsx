import type { DisciplinaResumo } from "@acadflow/shared";
import Link from "next/link";
import { BotaoExcluir } from "@/components/ui/botao-excluir";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { botaoIcone, cartao, linkAcao } from "@/components/ui/estilos";
import { IconeLapis, IconeMais, IconeUsuario } from "@/components/ui/icones";
import { apiServidor } from "@/lib/api-servidor";
import { corDaDisciplina } from "@/lib/cores";

/** RF02 – cartões das disciplinas com a contagem de atividades pendentes e concluídas. */
export async function DisciplinasTabela() {
  const disciplinas = await apiServidor<DisciplinaResumo[]>("/disciplinas");

  if (disciplinas.length === 0) {
    return (
      <EstadoVazio>
        Nenhuma disciplina cadastrada.{" "}
        <Link href="/disciplinas/nova" className={linkAcao}>
          Cadastre a primeira
        </Link>
        .
      </EstadoVazio>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {disciplinas.map((d) => {
        const total = d.atividadesPendentes + d.atividadesConcluidas;
        return (
          <li
            key={d.id}
            data-testid="disciplina-linha"
            data-codigo={d.codigo}
            data-semestre={d.semestre}
            className={`${cartao} flex flex-col overflow-hidden`}
          >
            <span aria-hidden="true" className="h-1.5" style={{ backgroundColor: corDaDisciplina(d.id) }} />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-cinza">
                    {d.codigo} · {d.semestre}
                  </p>
                  <h2 data-testid="disciplina-nome" className="mt-1 font-titulo text-base font-semibold text-azul">
                    {d.nome}
                  </h2>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-cinza">
                    <IconeUsuario className="size-3.5 shrink-0" />
                    {d.professor}
                  </p>
                </div>
                <div className="flex shrink-0 gap-0.5">
                  <Link
                    href={`/disciplinas/${d.id}/editar`}
                    data-testid="botao-editar"
                    aria-label="Editar"
                    title="Editar"
                    className={botaoIcone}
                  >
                    <IconeLapis />
                  </Link>
                  <BotaoExcluir
                    caminho={`/disciplinas/${d.id}`}
                    titulo={`Excluir ${d.nome}?`}
                    mensagem={
                      total > 0 ? (
                        <p>
                          <strong>
                            {total} atividade{total > 1 ? "s" : ""} vinculada{total > 1 ? "s" : ""}
                          </strong>{" "}
                          a esta disciplina também {total > 1 ? "serão removidas" : "será removida"}, junto com
                          notas e pesos registrados. Esta ação não pode ser desfeita.
                        </p>
                      ) : (
                        <p>
                          As atividades vinculadas a esta disciplina também seriam removidas, mas ela não possui
                          nenhuma. Esta ação não pode ser desfeita.
                        </p>
                      )
                    }
                  />
                </div>
              </div>

              <dl className="mt-5 grid grid-cols-3 rounded-xl bg-fundo py-3 text-center">
                <div className="flex flex-col-reverse">
                  <dt className="text-[11px] text-cinza">Atividades</dt>
                  <dd className="font-titulo text-lg font-bold text-azul">{total}</dd>
                </div>
                <div className="flex flex-col-reverse">
                  <dt className="text-[11px] text-cinza">Pendentes</dt>
                  <dd data-testid="disciplina-pendentes" className="font-titulo text-lg font-bold text-atencao-texto">
                    {d.atividadesPendentes}
                  </dd>
                </div>
                <div className="flex flex-col-reverse">
                  <dt className="text-[11px] text-cinza">Concluídas</dt>
                  <dd data-testid="disciplina-concluidas" className="font-titulo text-lg font-bold text-verde">
                    {d.atividadesConcluidas}
                  </dd>
                </div>
              </dl>
            </div>
          </li>
        );
      })}

      <li>
        <Link
          href="/disciplinas/nova"
          className="flex h-full min-h-48 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-borda text-sm font-semibold text-cinza transition-colors hover:border-verde/50 hover:bg-white hover:text-verde"
        >
          <IconeMais className="size-6" />
          Adicionar disciplina
        </Link>
      </li>
    </ul>
  );
}
