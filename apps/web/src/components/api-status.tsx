import type { ResumoUsuario, SaudeApi } from "@acadflow/shared";
import { unstable_rethrow } from "next/navigation";
import { IconeAlerta, IconeGrafico, IconeLista, IconeLivro } from "@/components/ui/icones";
import { cartao } from "@/components/ui/estilos";
import { apiServidor } from "@/lib/api-servidor";

const INDICADORES: Record<keyof ResumoUsuario, { rotulo: string; icone: typeof IconeLivro; cor: string }> = {
  disciplinas: { rotulo: "Disciplinas", icone: IconeLivro, cor: "bg-azul-claro text-azul" },
  atividades: { rotulo: "Atividades", icone: IconeLista, cor: "bg-atencao-claro text-atencao-texto" },
  avaliacoes: { rotulo: "Avaliações", icone: IconeGrafico, cor: "bg-verde-claro text-verde-escuro" },
};

const plural = (n: number, singular: string, plural: string) => `${n} ${n === 1 ? singular : plural}`;

/** Verifica se a API está no ar e mostra os totais cadastrados. */
export async function ApiStatus() {
  let saude: SaudeApi | null = null;
  let resumo: ResumoUsuario | null = null;
  try {
    [saude, resumo] = await Promise.all([apiServidor<SaudeApi>("/health"), apiServidor<ResumoUsuario>("/resumo")]);
  } catch (erro) {
    // `redirect()` para o login também chega aqui como exceção e precisa seguir adiante.
    unstable_rethrow(erro);
  }

  if (!saude || !resumo) {
    return (
      <div
        data-testid="api-status"
        data-status="offline"
        className="flex items-center gap-3 rounded-2xl border border-alerta/25 bg-alerta-claro px-5 py-4 text-sm text-alerta-escuro"
      >
        <IconeAlerta className="size-5 shrink-0 text-alerta" />
        <p>
          API indisponível. Inicie-a com <code className="font-semibold">npm run dev:api</code>.
        </p>
      </div>
    );
  }

  const chaves = Object.keys(INDICADORES) as (keyof ResumoUsuario)[];
  return (
    <div data-testid="api-status" data-status="online" className="space-y-4">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-azul via-[#134a7c] to-verde p-6 text-white shadow-sm sm:p-8">
        <div className="relative z-10">
          <p className="text-sm text-white/75">Visão geral</p>
          <p className="mt-1 font-titulo text-4xl font-bold tracking-tight">
            {plural(resumo.atividades, "atividade", "atividades")}
          </p>
          <p className="mt-2 text-sm text-white/80">
            em {plural(resumo.disciplinas, "disciplina", "disciplinas")} ·{" "}
            {plural(resumo.avaliacoes, "nota registrada", "notas registradas")}
          </p>
        </div>
        <span aria-hidden="true" className="absolute -right-16 -top-20 size-64 rounded-full bg-white/10" />
      </section>

      <ul className="grid gap-4 sm:grid-cols-3">
        {chaves.map((chave) => {
          const { rotulo, icone: Icone, cor } = INDICADORES[chave];
          return (
            <li key={chave} data-testid={`resumo-${chave}`} className={`${cartao} p-5`}>
              <span className={`flex size-9 items-center justify-center rounded-full ${cor}`}>
                <Icone />
              </span>
              <span data-testid="resumo-total" className="mt-4 block font-titulo text-3xl font-bold text-azul">
                {resumo[chave]}
              </span>
              <span className="text-sm text-cinza">{rotulo}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
