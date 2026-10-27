import { Suspense } from "react";
import { Carregando } from "@/components/ui/estado-vazio";
import { PageHeader } from "@/components/ui/page-header";
import { DisciplinaFormCarregado } from "@/features/disciplinas/disciplina-form-carregado";

export default function EditarDisciplinaPage({ params }: PageProps<"/disciplinas/[id]/editar">) {
  return (
    <>
      <PageHeader titulo="Editar disciplina" />
      <Suspense fallback={<Carregando />}>
        <Formulario params={params} />
      </Suspense>
    </>
  );
}

async function Formulario({ params }: Pick<PageProps<"/disciplinas/[id]/editar">, "params">) {
  const { id } = await params;
  return <DisciplinaFormCarregado disciplinaId={id} />;
}
