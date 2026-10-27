import Link from "next/link";
import { Suspense } from "react";
import { ApiStatus } from "@/components/api-status";
import { Carregando } from "@/components/ui/estado-vazio";
import { botaoPrimario, cartao } from "@/components/ui/estilos";
import { IconeMais } from "@/components/ui/icones";
import { PageHeader } from "@/components/ui/page-header";
import { NAVEGACAO } from "@/config/navegacao";

// Na Release 04 esta tela passa a ser a lista de próximos prazos (RF09).
export default function InicioPage() {
  return (
    <>
      <PageHeader
        titulo="Bem-vindo ao AcadFlow"
        descricao="Provas, trabalhos e tarefas de todas as disciplinas em um só lugar."
        // RNF02: cadastro de atividade em até 3 interações a partir da tela inicial.
        acoes={
          <Link href="/atividades/nova" data-testid="inicio-nova-atividade" className={botaoPrimario}>
            <IconeMais />
            Nova atividade
          </Link>
        }
      />

      <Suspense fallback={<Carregando />}>
        <ApiStatus />
      </Suspense>

      <section className="mt-8">
        <h2 className="mb-3 font-titulo text-lg font-semibold text-azul">Acesso rápido</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {NAVEGACAO.filter((item) => item.href !== "/").map(({ href, rotulo, icone: Icone }) => (
            <Link
              key={href}
              href={href}
              className={`${cartao} group flex items-center gap-3 p-4 font-semibold text-azul transition-colors hover:border-verde/60`}
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-fundo text-azul transition-colors group-hover:bg-verde-claro group-hover:text-verde-escuro">
                <Icone />
              </span>
              {rotulo}
              <span aria-hidden="true" className="ml-auto text-cinza transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
