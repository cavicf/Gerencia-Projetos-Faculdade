import Link from "next/link";
import { Suspense } from "react";
import { ApiStatus } from "@/components/api-status";
import { botaoPrimario } from "@/components/ui/estilos";
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
            Nova atividade
          </Link>
        }
      />

      <section className="mb-8 grid gap-4 sm:grid-cols-4">
        {NAVEGACAO.filter((item) => item.href !== "/").map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border border-slate-200 bg-white p-5 font-medium text-slate-800 shadow-sm hover:border-emerald-500"
          >
            {item.rotulo}
          </Link>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase text-slate-500">Situação do sistema</h2>
        <Suspense fallback={<p className="text-sm text-slate-500">Verificando API…</p>}>
          <ApiStatus />
        </Suspense>
      </section>
    </>
  );
}
