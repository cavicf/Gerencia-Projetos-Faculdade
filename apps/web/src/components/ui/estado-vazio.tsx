export function EstadoVazio({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-testid="estado-vazio"
      className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600"
    >
      {children}
    </div>
  );
}

export function Carregando() {
  return <p className="text-sm text-slate-500">Carregando…</p>;
}
