"use client";

import { ROTULOS_STATUS, STATUS_ATIVIDADE, type StatusAtividade } from "@acadflow/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconeSeta } from "@/components/ui/icones";
import { api, ApiError } from "@/lib/api";
import { COR_STATUS } from "@/lib/cores";

interface StatusSelectProps {
  atividadeId: string;
  status: StatusAtividade;
}

/** RF05 – troca rápida do status direto na lista. */
export function StatusSelect({ atividadeId, status }: StatusSelectProps) {
  const router = useRouter();
  const [atual, setAtual] = useState(status);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function alterar(e: React.ChangeEvent<HTMLSelectElement>) {
    const novo = e.target.value as StatusAtividade;
    const anterior = atual;
    setAtual(novo);
    setSalvando(true);
    setErro(null);
    try {
      await api(`/atividades/${atividadeId}/status`, { method: "PATCH", body: JSON.stringify({ status: novo }) });
      router.refresh();
    } catch (e) {
      setAtual(anterior);
      setErro(e instanceof ApiError ? e.message : "Não foi possível alterar o status.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      <div className="relative inline-flex">
        <select
          aria-label="Status da atividade"
          data-testid="atividade-status"
          value={atual}
          onChange={alterar}
          disabled={salvando}
          className={`cursor-pointer appearance-none rounded-full py-1 pl-3 pr-7 text-xs font-semibold transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-verde/40 disabled:opacity-60 ${COR_STATUS[atual]}`}
        >
          {STATUS_ATIVIDADE.map((s) => (
            <option key={s} value={s}>
              {ROTULOS_STATUS[s]}
            </option>
          ))}
        </select>
        <IconeSeta className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 opacity-70" />
      </div>
      {erro && <p className="mt-1 text-xs font-medium text-alerta">{erro}</p>}
    </div>
  );
}
