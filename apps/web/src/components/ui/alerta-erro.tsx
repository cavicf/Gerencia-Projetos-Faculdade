import { IconeAlerta } from "./icones";

export function AlertaErro({ mensagem }: { mensagem: string | null }) {
  if (!mensagem) return null;
  return (
    <div
      role="alert"
      data-testid="form-erro"
      className="flex items-center gap-2.5 rounded-lg border border-alerta/25 bg-alerta-claro px-4 py-3 text-sm font-medium text-alerta-escuro"
    >
      <IconeAlerta className="size-4 shrink-0 text-alerta" />
      {mensagem}
    </div>
  );
}
