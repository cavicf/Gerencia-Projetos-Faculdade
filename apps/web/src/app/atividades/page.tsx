import Link from "next/link";
import { Suspense } from "react";
import { Carregando } from "@/components/ui/estado-vazio";
import { botaoPrimario } from "@/components/ui/estilos";
import { PageHeader } from "@/components/ui/page-header";
import { AtividadesTabela } from "@/features/atividades/atividades-tabela";

export default function AtividadesPage() {
  return (
    <>
      <PageHeader
        titulo="Atividades"
        descricao="Provas, trabalhos e tarefas das suas disciplinas, em ordem de entrega."
        acoes={
          <Link href="/atividades/nova" data-testid="nova-atividade" className={botaoPrimario}>
            Nova atividade
          </Link>
        }
      />
      <Suspense fallback={<Carregando />}>
        <AtividadesTabela />
      </Suspense>
    </>
  );
}
