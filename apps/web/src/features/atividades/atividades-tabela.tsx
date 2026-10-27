import { ROTULOS_PRIORIDADE, ROTULOS_TIPO, type AtividadeDetalhada } from "@acadflow/shared";
import Link from "next/link";
import { BotaoExcluir } from "@/components/ui/botao-excluir";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { botaoIcone, etiqueta, linkAcao, tabela } from "@/components/ui/estilos";
import { IconeLapis } from "@/components/ui/icones";
import { apiServidor } from "@/lib/api-servidor";
import { COR_PRIORIDADE, corDaDisciplina } from "@/lib/cores";
import { formatarData } from "@/lib/formatar";
import { DataConclusao } from "./data-conclusao";
import { StatusSelect } from "./status-select";

/** Atividades em ordem de entrega, com status, prioridade e ações (RF04–RF07). */
export async function AtividadesTabela() {
  const atividades = await apiServidor<AtividadeDetalhada[]>("/atividades");

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
    <div className={tabela.contorno}>
      <table className={tabela.tabela}>
        <thead className={tabela.cabecalho}>
          <tr>
            <th className="px-5 py-3">Atividade</th>
            <th className="px-4 py-3">Disciplina</th>
            <th className="px-4 py-3">Entrega</th>
            <th className="px-4 py-3">Prioridade</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-5 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className={tabela.corpo}>
          {atividades.map((a) => (
            <tr key={a.id} data-testid="atividade-linha" data-titulo={a.titulo} className={tabela.linha}>
              <td className="px-5 py-3.5">
                <p className="font-semibold text-azul">{a.titulo}</p>
                <p className="text-xs text-cinza">{ROTULOS_TIPO[a.tipo]}</p>
              </td>
              <td data-testid="atividade-disciplina" className="px-4 py-3.5 text-azul">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: corDaDisciplina(a.disciplinaId) }}
                  />
                  <span>
                    {a.disciplinaCodigo} – {a.disciplinaNome}
                  </span>
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 text-azul">{formatarData(a.dataEntrega)}</td>
              <td className="px-4 py-3.5">
                <span
                  data-testid="atividade-prioridade"
                  className={`${etiqueta} ${COR_PRIORIDADE[a.prioridade].etiqueta}`}
                >
                  <span aria-hidden="true" className={`size-1.5 rounded-full ${COR_PRIORIDADE[a.prioridade].ponto}`} />
                  {ROTULOS_PRIORIDADE[a.prioridade]}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <StatusSelect atividadeId={a.id} status={a.status} />
                {a.dataConclusao && <DataConclusao instante={a.dataConclusao} />}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-0.5">
                  <Link
                    href={`/atividades/${a.id}/editar`}
                    data-testid="botao-editar"
                    aria-label="Editar"
                    title="Editar"
                    className={botaoIcone}
                  >
                    <IconeLapis />
                  </Link>
                  <BotaoExcluir
                    caminho={`/atividades/${a.id}`}
                    titulo={`Excluir "${a.titulo}"?`}
                    mensagem={
                      <p>A atividade e a nota registrada para ela serão removidas. Esta ação não pode ser desfeita.</p>
                    }
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
