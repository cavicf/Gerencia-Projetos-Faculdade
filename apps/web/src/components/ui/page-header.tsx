interface PageHeaderProps {
  titulo: string;
  descricao?: string;
  acoes?: React.ReactNode;
}

export function PageHeader({ titulo, descricao, acoes }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-titulo text-[30px] font-bold leading-tight tracking-tight text-azul">{titulo}</h1>
        {descricao && <p className="mt-1 text-sm text-cinza">{descricao}</p>}
      </div>
      {acoes}
    </div>
  );
}
