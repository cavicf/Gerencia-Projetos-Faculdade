// Cores puramente visuais: identificam cada disciplina e cada status/prioridade em todo o sistema.
import type { Prioridade, StatusAtividade } from "@acadflow/shared";

const CORES_DISCIPLINA = ["#1b2f5e", "#2f9e52", "#e9a93a", "#5b8db8", "#d9473b", "#7c5cbf", "#1f8a8a"];

/** Mesma disciplina sempre com a mesma cor, derivada do id (não é gravada na API). */
export function corDaDisciplina(disciplinaId: string): string {
  let soma = 0;
  for (const caractere of disciplinaId) soma = (soma * 31 + caractere.charCodeAt(0)) >>> 0;
  return CORES_DISCIPLINA[soma % CORES_DISCIPLINA.length];
}

export const COR_PRIORIDADE: Record<Prioridade, { etiqueta: string; ponto: string }> = {
  alta: { etiqueta: "bg-alerta-claro text-alerta", ponto: "bg-alerta" },
  media: { etiqueta: "bg-atencao-claro text-atencao-texto", ponto: "bg-atencao" },
  baixa: { etiqueta: "bg-cinza-claro text-cinza", ponto: "bg-cinza" },
};

export const COR_STATUS: Record<StatusAtividade, string> = {
  concluida: "bg-verde-claro text-verde-escuro",
  em_andamento: "bg-azul-claro text-azul",
  pendente: "bg-cinza-claro text-cinza",
};
