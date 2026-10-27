import Link from "next/link";
import { Suspense } from "react";
import { obterUsuarioOpcional } from "@/lib/api-servidor";
import { BotaoSair } from "./botao-sair";
import { Logo } from "./logo";

/** Barra superior: logo (só no celular, onde não há menu lateral) e usuário logado. */
export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-borda bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-3 px-4 md:justify-end md:px-8">
        <Link href="/" className="md:hidden">
          <Logo className="h-9 w-auto" />
        </Link>
        <Suspense fallback={null}>
          <MenuDoUsuario />
        </Suspense>
      </div>
    </header>
  );
}

const iniciais = (nome: string) =>
  nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");

async function MenuDoUsuario() {
  const usuario = await obterUsuarioOpcional();
  if (!usuario) return null;

  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-azul to-verde font-titulo text-xs font-semibold text-white"
      >
        {iniciais(usuario.nome)}
      </span>
      <div className="hidden leading-tight sm:block">
        <span data-testid="usuario-logado" className="block text-sm font-semibold text-azul">
          {usuario.nome}
        </span>
        <span className="block text-xs text-cinza">{usuario.email}</span>
      </div>
      <span aria-hidden="true" className="mx-1 h-8 w-px bg-borda" />
      <BotaoSair />
    </div>
  );
}
