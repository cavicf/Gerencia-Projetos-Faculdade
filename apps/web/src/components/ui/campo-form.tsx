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
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-azul">
        {rotulo}
        {obrigatorio && <span className="text-alerta"> *</span>}
      </label>
      {children}
      {dica && !erro && <p className="text-xs text-cinza">{dica}</p>}
      {erro && (
        <p data-testid={`erro-${id}`} className="text-xs font-medium text-alerta">
          {erro}
        </p>
      )}
    </div>
  );
}
