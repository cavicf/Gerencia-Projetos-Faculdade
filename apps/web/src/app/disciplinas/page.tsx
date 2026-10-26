import { EmConstrucao } from "@/components/ui/em-construcao";
import { PageHeader } from "@/components/ui/page-header";

export default function DisciplinasPage() {
  return (
    <>
      <PageHeader titulo="Disciplinas" descricao="Disciplinas cursadas no semestre." />
      <EmConstrucao release="Release 01" requisitos={["RF01", "RF02", "RF03"]} />
    </>
  );
}
