import { Logo } from "@/components/layout/logo";
import { IconeCalendario, IconeGrafico, IconeLista } from "@/components/ui/icones";

// Só o que o sistema já oferece (Releases 01 e 02).
const BENEFICIOS = [
  { icone: IconeCalendario, texto: "Todas as entregas em um só lugar" },
  { icone: IconeLista, texto: "Prioridade e status de cada atividade" },
  { icone: IconeGrafico, texto: "Notas e média por disciplina" },
];

interface TelaAcessoProps {
  titulo: string;
  descricao: string;
  children: React.ReactNode;
}

/** Telas públicas (entrar e cadastrar-se): painel de apresentação à esquerda e formulário à direita. */
export function TelaAcesso({ titulo, descricao, children }: TelaAcessoProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-azul via-[#134a7c] to-verde px-16 py-12 text-white xl:px-24 lg:flex lg:flex-col lg:justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
          UNIFEI · Gerenciador de atividades
        </p>

        <div className="relative z-10 max-w-md">
          <h2 className="font-titulo text-[42px] font-bold leading-[1.1] tracking-tight">
            Seu semestre,
            <br />
            sem prazos perdidos.
          </h2>
          <ul className="mt-8 space-y-4">
            {BENEFICIOS.map(({ icone: Icone, texto }) => (
              <li key={texto} className="flex items-center gap-3 text-sm text-white/90">
                <span className="flex size-8 items-center justify-center rounded-full bg-white/15">
                  <Icone className="size-4" />
                </span>
                {texto}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/60">Equipe CRLJ · Gerência de Projetos 2026</p>
        <span aria-hidden="true" className="absolute -bottom-24 -right-24 size-80 rounded-full bg-white/10" />
      </section>

      <section className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mx-auto w-64 rounded-xl bg-white px-4 py-3 shadow-sm">
            <Logo className="h-auto w-full" preload />
          </div>
          <div className="mt-10">
            <h1 className="font-titulo text-2xl font-bold tracking-tight text-azul">{titulo}</h1>
            <p className="mb-6 mt-1 text-sm text-cinza">{descricao}</p>
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}
