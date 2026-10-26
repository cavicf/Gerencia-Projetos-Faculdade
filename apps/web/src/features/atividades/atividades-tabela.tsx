import { ROTULOS_PRIORIDADE, ROTULOS_TIPO, type AtividadeDetalhada, type Prioridade } from "@acadflow/shared";
import Link from "next/link";
import { connection } from "next/server";
import { BotaoExcluir } from "@/components/ui/botao-excluir";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { linkAcao } from "@/components/ui/estilos";
import { api } from "@/lib/api";
import { formatarData } from "@/lib/formatar";
import { DataConclusao } from "./data-conclusao";
import { StatusSelect } from "./status-select";

const COR_PRIORIDADE: Record<Prioridade, string> = {
  alta: "bg-red-100 text-red-800",
  media: "bg-amber-100 text-amber-800",
  baixa: "bg-slate-100 text-slate-700",
};

/** Atividades do estudante em ordem de entrega, com status, prioridade e ações (RF04–RF07). */
export async function AtividadesTabela() {
  await connection();
  const atividades = await api<AtividadeDetalhada[]>("/atividades");

  if (atividades.length === 0) {
    return (
      <EstadoVazio>
        Nenhuma atividade cadastrada.{" "}
        <Link href="/atividades/nova" className={linkAcao}>
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
            <th className="px-4 py-3">Entrega</th>
            <th className="px-4 py-3">Atividade</th>
            <th className="px-4 py-3">Disciplina</th>
            <th className="px-4 py-3">Prioridade</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {atividades.map((a) => (
            <tr key={a.id} data-testid="atividade-linha" data-titulo={a.titulo}>
              <td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatarData(a.dataEntrega)}</td>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900">{a.titulo}</p>
                <p className="text-xs text-slate-500">{ROTULOS_TIPO[a.tipo]}</p>
              </td>
              <td data-testid="atividade-disciplina" className="px-4 py-3 text-slate-600">
                {a.disciplinaCodigo} – {a.disciplinaNome}
              </td>
              <td className="px-4 py-3">
                <span
                  data-testid="atividade-prioridade"
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${COR_PRIORIDADE[a.prioridade]}`}
                >
                  {ROTULOS_PRIORIDADE[a.prioridade]}
                </span>
              </td>
              <td className="px-4 py-3">
                <StatusSelect atividadeId={a.id} status={a.status} />
                {a.dataConclusao && <DataConclusao instante={a.dataConclusao} />}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-3">
                  <Link href={`/atividades/${a.id}/editar`} data-testid="botao-editar" className={linkAcao}>
                    Editar
                  </Link>
                  <BotaoExcluir
                    caminho={`/atividades/${a.id}`}
                    titulo={`Excluir "${a.titulo}"?`}
                    mensagem={<p>A atividade e a nota registrada para ela serão removidas. Esta ação não pode ser desfeita.</p>}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
