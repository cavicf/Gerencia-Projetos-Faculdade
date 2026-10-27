// Classes Tailwind compartilhadas pelos botões, campos, cartões e tabelas (Guia de Design AcadFlow).

const botaoBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde/40 disabled:opacity-60";

export const botaoPrimario = `${botaoBase} bg-verde text-white shadow-sm hover:bg-verde-escuro`;
export const botaoSecundario = `${botaoBase} border border-borda bg-white text-azul hover:bg-fundo`;
export const botaoPerigo = `${botaoBase} bg-alerta text-white shadow-sm hover:bg-alerta-escuro`;
export const linkAcao = "text-sm font-semibold text-verde hover:underline";

/** Botões só com ícone (editar e excluir) no fim das linhas e cartões. */
const botaoIconeBase =
  "inline-flex size-8 items-center justify-center rounded-lg text-cinza transition-colors focus-visible:outline-none focus-visible:ring-2";
export const botaoIcone = `${botaoIconeBase} hover:bg-azul-claro hover:text-azul focus-visible:ring-azul/30`;
export const botaoIconePerigo = `${botaoIconeBase} hover:bg-alerta-claro hover:text-alerta focus-visible:ring-alerta/30`;

export const campo =
  "w-full rounded-lg border border-borda bg-white px-3 py-2.5 text-sm text-azul placeholder:text-cinza/60 focus:border-verde focus:outline-none focus:ring-2 focus:ring-verde/20 aria-invalid:border-alerta aria-invalid:ring-alerta/20";

export const cartao = "rounded-2xl border border-borda bg-white shadow-[0_1px_3px_rgba(27,47,94,0.06)]";

export const etiqueta = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold";

export const tabela = {
  contorno: `${cartao} overflow-x-auto`,
  // Largura mínima: no celular a tabela rola de lado em vez de espremer as colunas.
  tabela: "w-full min-w-[860px] text-left text-sm",
  cabecalho: "border-b border-borda bg-fundo/60 text-[11px] font-semibold uppercase tracking-wide text-cinza",
  corpo: "divide-y divide-borda",
  linha: "transition-colors hover:bg-fundo/50",
};
