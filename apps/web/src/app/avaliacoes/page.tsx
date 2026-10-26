import { EmConstrucao } from "@/components/ui/em-construcao";
import { PageHeader } from "@/components/ui/page-header";

export default function AvaliacoesPage() {
  return (
    <>
      <PageHeader titulo="Avaliações" descricao="Notas e pesos das atividades concluídas." />
      <EmConstrucao release="Release 02" requisitos={["RF08"]} />
    </>
  );
}
