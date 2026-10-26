import type { SaudeApi } from "@acadflow/shared";
import { connection } from "next/server";
import { api } from "@/lib/api";

/** Verifica se a API e os arquivos de dados estão acessíveis. */
export async function ApiStatus() {
  await connection();

  let saude: SaudeApi | null = null;
  try {
    saude = await api<SaudeApi>("/health");
  } catch {
    // Exibido abaixo como "indisponível".
  }

  if (!saude) {
    return (
      <p data-testid="api-status" data-status="offline" className="text-sm text-red-700">
        API indisponível. Inicie-a com <code>npm run dev:api</code>.
      </p>
    );
  }

  return (
    <div data-testid="api-status" data-status="online" className="text-sm text-slate-700">
      <p className="font-medium text-emerald-700">API online (v{saude.versao})</p>
      <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Object.entries(saude.colecoes).map(([nome, total]) => (
          <li key={nome} className="rounded-md bg-slate-50 px-3 py-2">
            <span className="block text-xs uppercase text-slate-500">{nome}</span>
            <span className="text-lg font-semibold">{total}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
