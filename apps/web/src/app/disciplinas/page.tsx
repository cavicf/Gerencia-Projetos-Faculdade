import Link from "next/link";
import { Suspense } from "react";
import { Carregando } from "@/components/ui/estado-vazio";
import { botaoPrimario } from "@/components/ui/estilos";
import { PageHeader } from "@/components/ui/page-header";
import { DisciplinasTabela } from "@/features/disciplinas/disciplinas-tabela";

export default function DisciplinasPage() {
  return (
    <>
      <PageHeader
        titulo="Disciplinas"
        descricao="Disciplinas cursadas e a situação das atividades de cada uma."
        acoes={
          <Link href="/disciplinas/nova" data-testid="nova-disciplina" className={botaoPrimario}>
            Nova disciplina
          </Link>
        }
      />
      <Suspense fallback={<Carregando />}>
        <DisciplinasTabela />
      </Suspense>
    </>
  );
}
