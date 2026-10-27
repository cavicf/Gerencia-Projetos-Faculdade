"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
      className="font-medium text-slate-600 hover:text-red-700"
    >
      Sair
    </button>
  );
}
