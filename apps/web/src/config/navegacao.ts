export interface ItemNavegacao {
  href: string;
  rotulo: string;
}

/** Módulos acessíveis a partir da tela inicial (RNF01). */
export const NAVEGACAO: ItemNavegacao[] = [
  { href: "/", rotulo: "Início" },
  { href: "/disciplinas", rotulo: "Disciplinas" },
  { href: "/atividades", rotulo: "Atividades" },
  { href: "/avaliacoes", rotulo: "Avaliações" },
];
