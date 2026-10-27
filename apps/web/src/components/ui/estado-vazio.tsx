export function EstadoVazio({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-testid="estado-vazio"
      className="rounded-2xl border-2 border-dashed border-borda bg-white/60 p-10 text-center text-sm text-cinza"
    >
      {children}
    </div>
  );
}

export function Carregando() {
  return <p className="text-sm text-cinza">Carregando…</p>;
}
