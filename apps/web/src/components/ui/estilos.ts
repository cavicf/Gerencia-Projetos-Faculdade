// Classes Tailwind compartilhadas pelos botões e campos de formulário.

const botaoBase =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60";

export const botaoPrimario = `${botaoBase} bg-emerald-600 text-white hover:bg-emerald-700`;
export const botaoSecundario = `${botaoBase} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`;
export const botaoPerigo = `${botaoBase} bg-red-600 text-white hover:bg-red-700`;
export const linkAcao = "text-sm font-medium text-emerald-700 hover:underline";
export const linkPerigo = "text-sm font-medium text-red-700 hover:underline";

export const campo =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 aria-invalid:border-red-500";
