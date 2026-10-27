import type { Disciplina } from "@acadflow/shared";
import { apiServidorOu404 } from "@/lib/api-servidor";
import { DisciplinaForm } from "./disciplina-form";

/** Carrega a disciplina, na edição, antes de exibir o formulário. */
export async function DisciplinaFormCarregado({ disciplinaId }: { disciplinaId?: string }) {
  const disciplina = disciplinaId ? await apiServidorOu404<Disciplina>(`/disciplinas/${disciplinaId}`) : undefined;
  return <DisciplinaForm disciplina={disciplina} />;
}
