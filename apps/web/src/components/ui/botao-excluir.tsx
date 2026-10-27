"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { botaoIconePerigo, botaoPerigo, botaoSecundario } from "./estilos";
import { IconeLixeira } from "./icones";

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
      <button
        type="button"
        data-testid="botao-excluir"
        aria-label="Excluir"
        title="Excluir"
        className={botaoIconePerigo}
        onClick={() => setAberto(true)}
      >
        <IconeLixeira />
      </button>

      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-azul/40 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-exclusao"
            data-testid="dialogo-exclusao"
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white text-left shadow-2xl"
          >
            <div className="flex gap-4 p-6">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-alerta-claro text-alerta">
                <IconeLixeira className="size-5" />
              </span>
              <div>
                <h2 id="titulo-exclusao" className="font-titulo text-lg font-semibold text-azul">
                  {titulo}
                </h2>
                <div className="mt-2 text-sm text-cinza">{mensagem}</div>
                {erro && <p className="mt-3 text-sm font-medium text-alerta">{erro}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-borda bg-fundo/60 px-6 py-4">
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
