// Formato padrão das respostas de erro da API (RNF05: mensagens claras, sem detalhes técnicos).

export interface ErroApi {
  erro: {
    mensagem: string;
    /** Erros de validação por campo, quando houver. */
    campos?: Record<string, string>;
  };
}

export interface SaudeApi {
  status: "ok";
  versao: string;
  colecoes: Record<string, number>;
}
