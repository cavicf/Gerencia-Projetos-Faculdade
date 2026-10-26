import type { Disciplina } from "@acadflow/shared";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Carregando } from "@/components/ui/estado-vazio";
import { PageHeader } from "@/components/ui/page-header";
import { DisciplinaForm } from "@/features/disciplinas/disciplina-form";
import { apiOuNulo } from "@/lib/api";

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
  const disciplina = await apiOuNulo<Disciplina>(`/disciplinas/${id}`);
  if (!disciplina) notFound();
  return <DisciplinaForm disciplina={disciplina} />;
}
