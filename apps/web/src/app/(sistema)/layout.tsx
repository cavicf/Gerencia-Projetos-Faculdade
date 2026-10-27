import Link from "next/link";
import { Suspense } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { Logo } from "@/components/layout/logo";
import { ItensMenu, MenuPrincipal } from "@/components/layout/menu-principal";

/** Telas do usuário logado: menu lateral azul-marinho, barra superior e conteúdo. */
export default function SistemaLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-screen md:pl-64">
      <aside className="md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col md:gap-8 md:bg-azul-escuro md:py-5">
        <Link href="/" className="mx-4 hidden rounded-xl bg-white px-4 py-3 shadow-sm md:block">
          <Logo className="h-auto w-full" preload />
        </Link>
        {/* A rota de edição tem parâmetro dinâmico: o item ativo só é conhecido na requisição. */}
        <Suspense fallback={<ItensMenu caminho={null} />}>
          <MenuPrincipal />
        </Suspense>
      </aside>

      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-8 md:px-8 md:pb-12">{children}</main>
    </div>
  );
}
