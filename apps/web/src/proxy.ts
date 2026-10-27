import { COOKIE_SESSAO } from "@acadflow/shared";
import { NextResponse, type NextRequest } from "next/server";

/** Telas acessíveis sem login: entrar e cadastrar-se (RFS16). */
const TELAS_PUBLICAS = ["/login", "/cadastro"];

/**
 * Verificação otimista (RF15): sem cookie de sessão, qualquer tela leva ao login.
 * A validação de verdade (sessão existente e não expirada) é feita pela API.
 */
export function proxy(request: NextRequest) {
  const temSessao = request.cookies.has(COOKIE_SESSAO);
  const telaPublica = TELAS_PUBLICAS.includes(request.nextUrl.pathname);

  if (!temSessao && !telaPublica) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Tudo, exceto a API (repassada pelo rewrite) e os arquivos estáticos do Next.js.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
