import type { ResumoUsuario, SaudeApi } from "@acadflow/shared";
import { unstable_rethrow } from "next/navigation";
import { apiServidor } from "@/lib/api-servidor";

const ROTULOS: Record<keyof ResumoUsuario, string> = {
  disciplinas: "Disciplinas",
  atividades: "Atividades",
  avaliacoes: "Avaliações",
};

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
      <p data-testid="api-status" data-status="offline" className="text-sm text-red-700">
        API indisponível. Inicie-a com <code>npm run dev:api</code>.
      </p>
    );
  }

  const chaves = Object.keys(ROTULOS) as (keyof ResumoUsuario)[];
  return (
    <div data-testid="api-status" data-status="online" className="text-sm text-slate-700">
      <p className="font-medium text-emerald-700">API online (v{saude.versao})</p>
      <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {chaves.map((chave) => (
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
