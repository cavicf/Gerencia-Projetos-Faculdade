"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVEGACAO } from "@/config/navegacao";

/** Menu com o módulo atual destacado. */
export function MenuPrincipal() {
  return <ItensMenu caminho={usePathname()} />;
}

/**
 * Menu lateral no computador e barra fixa embaixo no celular (Guia de Design, seção 10).
 * Sem `caminho` (enquanto a rota ainda não foi resolvida), nenhum item aparece ativo.
 */
export function ItensMenu({ caminho }: { caminho: string | null }) {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-borda bg-white md:static md:border-0 md:bg-transparent"
    >
      <ul className="flex justify-around md:flex-col md:gap-1 md:px-3">
        {NAVEGACAO.map(({ href, rotulo, icone: Icone }) => {
          const ativo = caminho !== null && (href === "/" ? caminho === "/" : caminho.startsWith(href));
          return (
            <li key={href} className="flex-1 md:flex-none">
              <Link
                href={href}
                aria-current={ativo ? "page" : undefined}
                data-testid={`nav-${href.slice(1) || "inicio"}`}
                className={`flex flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors md:flex-row md:gap-3 md:rounded-lg md:px-3 md:py-2.5 md:text-sm ${
                  ativo
                    ? "text-verde md:bg-white/10 md:text-white"
                    : "text-cinza hover:text-azul md:text-white/70 md:hover:bg-white/5 md:hover:text-white"
                }`}
              >
                <Icone className={`size-5 md:size-4 ${ativo ? "md:text-verde" : ""}`} />
                <span className="md:flex-1">{rotulo}</span>
                {ativo && <span aria-hidden="true" className="hidden size-1.5 rounded-full bg-verde md:block" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
