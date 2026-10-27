import { Suspense } from "react";
import { Carregando } from "@/components/ui/estado-vazio";
import { PageHeader } from "@/components/ui/page-header";
import { AvaliacaoFormCarregado } from "@/features/avaliacoes/avaliacao-form-carregado";

export default function NovaAvaliacaoPage() {
  return (
    <>
      <PageHeader titulo="Registrar nota" />
      <Suspense fallback={<Carregando />}>
        <AvaliacaoFormCarregado />
      </Suspense>
    </>
  );
}
