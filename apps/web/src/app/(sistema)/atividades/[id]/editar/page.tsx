import { Suspense } from "react";
import { Carregando } from "@/components/ui/estado-vazio";
import { PageHeader } from "@/components/ui/page-header";
import { AtividadeFormCarregado } from "@/features/atividades/atividade-form-carregado";

export default function EditarAtividadePage({ params }: PageProps<"/atividades/[id]/editar">) {
  return (
    <>
      <PageHeader titulo="Editar atividade" />
      <Suspense fallback={<Carregando />}>
        <Formulario params={params} />
      </Suspense>
    </>
  );
}

async function Formulario({ params }: Pick<PageProps<"/atividades/[id]/editar">, "params">) {
  const { id } = await params;
  return <AtividadeFormCarregado atividadeId={id} />;
}
