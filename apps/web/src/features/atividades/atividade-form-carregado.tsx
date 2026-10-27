import type { Atividade, DisciplinaResumo } from "@acadflow/shared";
import Link from "next/link";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { linkAcao } from "@/components/ui/estilos";
import { apiServidor, apiServidorOu404 } from "@/lib/api-servidor";
import { AtividadeForm } from "./atividade-form";

/** Busca as disciplinas (e a atividade, na edição) antes de exibir o formulário. */
export async function AtividadeFormCarregado({ atividadeId }: { atividadeId?: string }) {
  const [disciplinas, atividade] = await Promise.all([
    apiServidor<DisciplinaResumo[]>("/disciplinas"),
    atividadeId ? apiServidorOu404<Atividade>(`/atividades/${atividadeId}`) : undefined,
  ]);

  if (disciplinas.length === 0) {
    return (
      <EstadoVazio>
        Toda atividade pertence a uma disciplina.{" "}
        <Link href="/disciplinas/nova" className={linkAcao}>
          Cadastre uma disciplina
        </Link>{" "}
        primeiro.
      </EstadoVazio>
    );
  }

  return <AtividadeForm disciplinas={disciplinas} atividade={atividade} />;
}
