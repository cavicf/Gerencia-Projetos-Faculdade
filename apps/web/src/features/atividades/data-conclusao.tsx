"use client";

import { formatarDataHora } from "@/lib/formatar";

/** Formatado no navegador para usar o fuso horário do estudante. */
export function DataConclusao({ instante }: { instante: string }) {
  return (
    <p data-testid="data-conclusao" className="mt-1 text-[11px] text-cinza" suppressHydrationWarning>
      Concluída em {formatarDataHora(instante)}
    </p>
  );
}
