import type { AtividadeDetalhada, AvaliacaoDetalhada } from "@acadflow/shared";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { linkAcao } from "@/components/ui/estilos";
import { apiServidor } from "@/lib/api-servidor";
import { AvaliacaoForm } from "./avaliacao-form";

/** No cadastro, lista as atividades concluídas ainda sem nota (RF08). */
export async function AvaliacaoFormCarregado({ avaliacaoId }: { avaliacaoId?: string }) {
  if (avaliacaoId) {
    const avaliacao = (await apiServidor<AvaliacaoDetalhada[]>("/avaliacoes")).find((av) => av.id === avaliacaoId);
    if (!avaliacao) notFound();
    return <AvaliacaoForm atividades={[]} avaliacao={avaliacao} />;
  }

  const atividades = (await apiServidor<AtividadeDetalhada[]>("/atividades")).filter(
    (a) => a.status === "concluida" && !a.avaliada,
  );
  if (atividades.length === 0) {
    return (
      <EstadoVazio>
        Não há atividades concluídas sem nota.{" "}
        <Link href="/atividades" className={linkAcao}>
          Conclua uma atividade
        </Link>{" "}
        para registrar a nota.
      </EstadoVazio>
    );
  }
  return <AvaliacaoForm atividades={atividades} />;
}
