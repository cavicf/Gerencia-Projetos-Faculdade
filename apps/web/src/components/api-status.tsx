import type { ResumoUsuario, SaudeApi } from "@acadflow/shared";
import { connection } from "next/server";
import { api } from "@/lib/api";

const ROTULOS: Record<keyof ResumoUsuario, string> = {
  disciplinas: "Disciplinas",
  atividades: "Atividades",
  avaliacoes: "Avaliações",
};

/** Verifica se a API está no ar e mostra os totais do estudante atual. */
export async function ApiStatus() {
  await connection();

  let saude: SaudeApi | null = null;
  let resumo: ResumoUsuario | null = null;
  try {
    [saude, resumo] = await Promise.all([api<SaudeApi>("/health"), api<ResumoUsuario>("/resumo")]);
  } catch {
    // Exibido abaixo como "indisponível".
  }

  if (!saude || !resumo) {
    return (
      <p data-testid="api-status" data-status="offline" className="text-sm text-red-700">
        API indisponível. Inicie-a com <code>npm run dev:api</code>.
      </p>
    );
  }

  return (
    <div data-testid="api-status" data-status="online" className="text-sm text-slate-700">
      <p className="font-medium text-emerald-700">API online (v{saude.versao})</p>
      <ul className="mt-2 grid grid-cols-3 gap-2">
        {(Object.keys(ROTULOS) as (keyof ResumoUsuario)[]).map((chave) => (
          <li key={chave} data-testid={`resumo-${chave}`} className="rounded-md bg-slate-50 px-3 py-2">
            <span className="block text-xs uppercase text-slate-500">{ROTULOS[chave]}</span>
            <span data-testid="resumo-total" className="text-lg font-semibold">
              {resumo[chave]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
