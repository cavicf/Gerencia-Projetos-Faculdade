import { EmConstrucao } from "@/components/ui/em-construcao";
import { PageHeader } from "@/components/ui/page-header";

export default function AtividadesPage() {
  return (
    <>
      <PageHeader titulo="Atividades" descricao="Provas, trabalhos e tarefas das suas disciplinas." />
      <EmConstrucao release="Release 01" requisitos={["RF04", "RF05", "RF06", "RF07"]} />
    </>
  );
}
