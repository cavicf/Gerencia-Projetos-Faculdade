import { PageHeader } from "@/components/ui/page-header";
import { DisciplinaForm } from "@/features/disciplinas/disciplina-form";

export default function NovaDisciplinaPage() {
  return (
    <>
      <PageHeader titulo="Nova disciplina" />
      <DisciplinaForm />
    </>
  );
}
