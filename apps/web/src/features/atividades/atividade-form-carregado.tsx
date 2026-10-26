import type { Atividade, DisciplinaResumo } from "@acadflow/shared";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { linkAcao } from "@/components/ui/estilos";
import { api, apiOuNulo } from "@/lib/api";
import { AtividadeForm } from "./atividade-form";

/** Busca as disciplinas (e a atividade, na edição) antes de exibir o formulário. */
export async function AtividadeFormCarregado({ atividadeId }: { atividadeId?: string }) {
  await connection();
  const [disciplinas, atividade] = await Promise.all([
    api<DisciplinaResumo[]>("/disciplinas"),
    atividadeId ? apiOuNulo<Atividade>(`/atividades/${atividadeId}`) : undefined,
  ]);
  if (atividade === null) notFound();

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
