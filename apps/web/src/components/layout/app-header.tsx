import Link from "next/link";
import { NAVEGACAO } from "@/config/navegacao";

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-xl font-bold text-slate-900">
          Acad<span className="text-emerald-600">Flow</span>
        </Link>
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
      </div>
    </header>
  );
}
