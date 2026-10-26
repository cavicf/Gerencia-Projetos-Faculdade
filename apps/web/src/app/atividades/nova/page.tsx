import { Suspense } from "react";
import { Carregando } from "@/components/ui/estado-vazio";
import { PageHeader } from "@/components/ui/page-header";
import { AtividadeFormCarregado } from "@/features/atividades/atividade-form-carregado";

export default function NovaAtividadePage() {
  return (
    <>
      <PageHeader titulo="Nova atividade" />
      <Suspense fallback={<Carregando />}>
        <AtividadeFormCarregado />
      </Suspense>
    </>
  );
}
