"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { botaoPerigo, botaoSecundario, linkPerigo } from "./estilos";

interface BotaoExcluirProps {
  /** Rota da API a ser chamada com DELETE, ex.: `/disciplinas/<id>`. */
  caminho: string;
  titulo: string;
  mensagem: React.ReactNode;
}

/** Botão "Excluir" que só remove o registro após confirmação explícita (RF03 / RF07). */
export function BotaoExcluir({ caminho, titulo, mensagem }: BotaoExcluirProps) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function confirmar() {
    setExcluindo(true);
    setErro(null);
    try {
      await api(caminho, { method: "DELETE" });
      setAberto(false);
      router.refresh();
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível excluir.");
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <>
      <button type="button" data-testid="botao-excluir" className={linkPerigo} onClick={() => setAberto(true)}>
        Excluir
      </button>

      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-exclusao"
            data-testid="dialogo-exclusao"
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <h2 id="titulo-exclusao" className="text-lg font-semibold text-slate-900">
              {titulo}
            </h2>
            <div className="mt-2 text-sm text-slate-600">{mensagem}</div>
            {erro && <p className="mt-3 text-sm text-red-700">{erro}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                data-testid="cancelar-exclusao"
                className={botaoSecundario}
                onClick={() => setAberto(false)}
                disabled={excluindo}
              >
                Cancelar
              </button>
              <button
                type="button"
                data-testid="confirmar-exclusao"
                className={botaoPerigo}
                onClick={confirmar}
                disabled={excluindo}
              >
                {excluindo ? "Excluindo…" : "Confirmar exclusão"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
