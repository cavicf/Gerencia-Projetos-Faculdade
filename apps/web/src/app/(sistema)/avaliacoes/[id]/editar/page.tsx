import { Suspense } from "react";
import { Carregando } from "@/components/ui/estado-vazio";
import { PageHeader } from "@/components/ui/page-header";
import { AvaliacaoFormCarregado } from "@/features/avaliacoes/avaliacao-form-carregado";

export default function EditarAvaliacaoPage({ params }: PageProps<"/avaliacoes/[id]/editar">) {
  return (
    <>
      <PageHeader titulo="Editar nota" />
      <Suspense fallback={<Carregando />}>
        <Formulario params={params} />
      </Suspense>
    </>
  );
}

async function Formulario({ params }: Pick<PageProps<"/avaliacoes/[id]/editar">, "params">) {
  const { id } = await params;
  return <AvaliacaoFormCarregado avaliacaoId={id} />;
}
