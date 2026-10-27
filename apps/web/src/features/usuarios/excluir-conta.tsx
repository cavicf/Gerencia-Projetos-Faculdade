"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CampoForm } from "@/components/ui/campo-form";
import { botaoPerigo, botaoSecundario, campo, cartao } from "@/components/ui/estilos";
import { IconeLixeira } from "@/components/ui/icones";
import { api, ApiError } from "@/lib/api";

/**
 * RFS19 – exclusão da própria conta. Pede confirmação explícita e a senha atual; ao confirmar,
 * a API remove o usuário, as disciplinas, as atividades e as notas, e encerra a sessão.
 */
export function ExcluirConta() {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  function fechar() {
    setAberto(false);
    setSenhaAtual("");
    setErro(null);
  }

  async function confirmar(e: React.FormEvent) {
    e.preventDefault();
    setExcluindo(true);
    setErro(null);
    try {
      await api("/perfil", { method: "DELETE", body: JSON.stringify({ senhaAtual }) });
      router.replace("/login");
      router.refresh();
    } catch (falha) {
      setErro(
        falha instanceof ApiError ? (falha.campos?.senhaAtual ?? falha.message) : "Não foi possível excluir a conta.",
      );
      setExcluindo(false);
    }
  }

  return (
    <section className={`${cartao} flex flex-wrap items-center justify-between gap-4 p-6 sm:px-8`}>
      <div>
        <h2 className="font-titulo text-base font-semibold text-azul">Excluir conta</h2>
        <p className="mt-1 text-sm text-cinza">Remove a sua conta e todos os seus dados. Não é possível desfazer.</p>
      </div>
      <button type="button" data-testid="excluir-conta" className={botaoPerigo} onClick={() => setAberto(true)}>
        <IconeLixeira />
        Excluir conta
      </button>

      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-azul/40 p-4 backdrop-blur-sm">
          <form
            noValidate
            onSubmit={confirmar}
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-excluir-conta"
            data-testid="dialogo-excluir-conta"
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white text-left shadow-2xl"
          >
            <div className="flex gap-4 p-6">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-alerta-claro text-alerta">
                <IconeLixeira className="size-5" />
              </span>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 id="titulo-excluir-conta" className="font-titulo text-lg font-semibold text-azul">
                    Excluir a sua conta?
                  </h2>
                  <p className="mt-2 text-sm text-cinza">
                    Todas as suas <strong>disciplinas</strong>, <strong>atividades</strong> e <strong>notas</strong> serão
                    removidas permanentemente.
                  </p>
                </div>
                <CampoForm id="senhaExclusao" rotulo="Senha atual" obrigatorio erro={erro ?? undefined}>
                  <input
                    id="senhaExclusao"
                    name="senhaExclusao"
                    type="password"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    aria-invalid={!!erro}
                    className={campo}
                    autoComplete="current-password"
                    autoFocus
                  />
                </CampoForm>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-borda bg-fundo/60 px-6 py-4">
              <button type="button" data-testid="cancelar-exclusao" className={botaoSecundario} onClick={fechar} disabled={excluindo}>
                Cancelar
              </button>
              <button type="submit" data-testid="confirmar-exclusao" className={botaoPerigo} disabled={excluindo}>
                {excluindo ? "Excluindo…" : "Excluir conta"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
