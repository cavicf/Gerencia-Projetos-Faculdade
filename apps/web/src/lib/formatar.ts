/** `2026-10-22` → `22/10/2026` (sem conversão de fuso, a data é de calendário). */
export function formatarData(data: string): string {
  const [ano, mes, dia] = data.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

/** Instante ISO → `22/10/2026 14:30` no fuso do navegador. */
export function formatarDataHora(instante: string): string {
  return new Date(instante).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
