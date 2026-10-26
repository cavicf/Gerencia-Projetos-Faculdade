/** Erro de negócio com mensagem pronta para ser exibida ao estudante (RNF05). */
export class AppError extends Error {
  constructor(
    readonly status: number,
    mensagem: string,
    readonly campos?: Record<string, string>,
  ) {
    super(mensagem);
  }
}

export const naoEncontrado = (mensagem: string) => new AppError(404, mensagem);

export const dadosInvalidos = (campos: Record<string, string>) =>
  new AppError(400, "Verifique os campos informados.", campos);
