import Link from "next/link";
import { Suspense } from "react";
import { Carregando } from "@/components/ui/estado-vazio";
import { botaoPrimario } from "@/components/ui/estilos";
import { PageHeader } from "@/components/ui/page-header";
import { AvaliacoesTabela } from "@/features/avaliacoes/avaliacoes-tabela";

export default function AvaliacoesPage() {
  return (
    <>
      <PageHeader
        titulo="Avaliações"
        descricao="Notas e pesos das atividades concluídas e o desempenho em cada disciplina."
        acoes={
          <Link href="/avaliacoes/nova" data-testid="nova-avaliacao" className={botaoPrimario}>
            Registrar nota
          </Link>
        }
      />
      <Suspense fallback={<Carregando />}>
        <AvaliacoesTabela />
      </Suspense>
    </>
  );
}
