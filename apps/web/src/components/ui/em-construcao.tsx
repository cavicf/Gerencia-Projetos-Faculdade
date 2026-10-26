interface EmConstrucaoProps {
  release: string;
  requisitos: string[];
}

/** Marcador de módulo planejado no cronograma e ainda não implementado. */
export function EmConstrucao({ release, requisitos }: EmConstrucaoProps) {
  return (
    <div
      data-testid="em-construcao"
      className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600"
    >
      Módulo previsto para a <strong>{release}</strong> ({requisitos.join(", ")}).
    </div>
  );
}
