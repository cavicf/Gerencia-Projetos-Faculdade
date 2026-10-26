import type { DisciplinaResumo } from "@acadflow/shared";
import Link from "next/link";
import { connection } from "next/server";
import { BotaoExcluir } from "@/components/ui/botao-excluir";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { linkAcao } from "@/components/ui/estilos";
import { api } from "@/lib/api";

/** RF02 – lista de disciplinas com a contagem de atividades pendentes e concluídas. */
export async function DisciplinasTabela() {
  await connection();
  const disciplinas = await api<DisciplinaResumo[]>("/disciplinas");

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
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Código</th>
            <th className="px-4 py-3">Nome</th>
            <th className="px-4 py-3">Professor</th>
            <th className="px-4 py-3">Semestre</th>
            <th className="px-4 py-3 text-center">Pendentes</th>
            <th className="px-4 py-3 text-center">Concluídas</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {disciplinas.map((d) => {
            const total = d.atividadesPendentes + d.atividadesConcluidas;
            return (
              <tr key={d.id} data-testid="disciplina-linha" data-codigo={d.codigo} data-semestre={d.semestre}>
                <td className="px-4 py-3 font-mono text-xs">{d.codigo}</td>
                <td data-testid="disciplina-nome" className="px-4 py-3 font-medium text-slate-900">
                  {d.nome}
                </td>
                <td className="px-4 py-3 text-slate-600">{d.professor}</td>
                <td className="px-4 py-3 text-slate-600">{d.semestre}</td>
                <td data-testid="disciplina-pendentes" className="px-4 py-3 text-center">
                  {d.atividadesPendentes}
                </td>
                <td data-testid="disciplina-concluidas" className="px-4 py-3 text-center">
                  {d.atividadesConcluidas}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <Link href={`/disciplinas/${d.id}/editar`} data-testid="botao-editar" className={linkAcao}>
                      Editar
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
                            a esta disciplina também {total > 1 ? "serão removidas" : "será removida"}, junto com notas
                            e pesos registrados. Esta ação não pode ser desfeita.
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
