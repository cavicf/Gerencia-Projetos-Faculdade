import { IconeGrafico, IconeLista, IconeLivro, IconePainel, IconeUsuario } from "@/components/ui/icones";

export interface ItemNavegacao {
  href: string;
  rotulo: string;
  icone: typeof IconePainel;
}

/** Módulos acessíveis a partir da tela inicial (RNF01). */
export const NAVEGACAO: ItemNavegacao[] = [
  { href: "/", rotulo: "Início", icone: IconePainel },
  { href: "/disciplinas", rotulo: "Disciplinas", icone: IconeLivro },
  { href: "/atividades", rotulo: "Atividades", icone: IconeLista },
  { href: "/avaliacoes", rotulo: "Avaliações", icone: IconeGrafico },
  { href: "/perfil", rotulo: "Meu perfil", icone: IconeUsuario },
];
