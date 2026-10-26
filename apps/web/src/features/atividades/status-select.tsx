"use client";

import { ROTULOS_STATUS, STATUS_ATIVIDADE, type StatusAtividade } from "@acadflow/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError } from "@/lib/api";

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
      <select
        aria-label="Status da atividade"
        data-testid="atividade-status"
        value={atual}
        onChange={alterar}
        disabled={salvando}
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
      >
        {STATUS_ATIVIDADE.map((s) => (
          <option key={s} value={s}>
            {ROTULOS_STATUS[s]}
          </option>
        ))}
      </select>
      {erro && <p className="mt-1 text-xs text-red-700">{erro}</p>}
    </div>
  );
}
