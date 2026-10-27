import { Suspense } from "react";
import { Carregando } from "@/components/ui/estado-vazio";
import { PageHeader } from "@/components/ui/page-header";
import { DisciplinaFormCarregado } from "@/features/disciplinas/disciplina-form-carregado";

export default function NovaDisciplinaPage() {
  return (
    <>
      <PageHeader titulo="Nova disciplina" />
      <Suspense fallback={<Carregando />}>
        <DisciplinaFormCarregado />
      </Suspense>
    </>
  );
}
