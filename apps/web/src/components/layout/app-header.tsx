import Link from "next/link";
import { Suspense } from "react";
import { NAVEGACAO } from "@/config/navegacao";
import { obterUsuarioOpcional } from "@/lib/api-servidor";
import { BotaoSair } from "./botao-sair";

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-xl font-bold text-slate-900">
          Acad<span className="text-emerald-600">Flow</span>
        </Link>
        <Suspense fallback={null}>
          <MenuDoUsuario />
        </Suspense>
      </div>
    </header>
  );
}

/** Menu e usuário logado; vazio na tela de login. */
async function MenuDoUsuario() {
  const usuario = await obterUsuarioOpcional();
  if (!usuario) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <nav aria-label="Navegação principal">
        <ul className="flex flex-wrap gap-1 text-sm">
          {NAVEGACAO.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                data-testid={`nav-${item.href.slice(1) || "inicio"}`}
                className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100"
              >
                {item.rotulo}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex items-center gap-3 border-l border-slate-200 pl-3 text-sm">
        <span data-testid="usuario-logado" className="text-slate-700">
          {usuario.nome}
        </span>
        <BotaoSair />
      </div>
    </div>
  );
}
