"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconeSair } from "@/components/ui/icones";
import { api } from "@/lib/api";

/** RF15 – encerramento da sessão pelo próprio usuário. */
export function BotaoSair() {
  const router = useRouter();
  const [saindo, setSaindo] = useState(false);

  async function sair() {
    setSaindo(true);
    try {
      await api("/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      data-testid="botao-sair"
      onClick={sair}
      disabled={saindo}
      className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-cinza transition-colors hover:bg-alerta-claro hover:text-alerta disabled:opacity-60"
    >
      <IconeSair />
      Sair
    </button>
  );
}
