export function AlertaErro({ mensagem }: { mensagem: string | null }) {
  if (!mensagem) return null;
  return (
    <div role="alert" data-testid="form-erro" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {mensagem}
    </div>
  );
}
