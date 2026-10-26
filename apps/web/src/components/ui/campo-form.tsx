interface CampoFormProps {
  id: string;
  rotulo: string;
  obrigatorio?: boolean;
  erro?: string;
  dica?: string;
  children: React.ReactNode;
}

/** Rótulo + controle + mensagem de erro do campo (RNF05). */
export function CampoForm({ id, rotulo, obrigatorio, erro, dica, children }: CampoFormProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {rotulo}
        {obrigatorio && <span className="text-red-600"> *</span>}
      </label>
      {children}
      {dica && !erro && <p className="text-xs text-slate-500">{dica}</p>}
      {erro && (
        <p data-testid={`erro-${id}`} className="text-xs text-red-700">
          {erro}
        </p>
      )}
    </div>
  );
}
