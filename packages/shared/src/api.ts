// Formato padrão das respostas de erro da API (RNF05: mensagens claras, sem detalhes técnicos).

export interface ErroApi {
  erro: {
    mensagem: string;
    /** Erros de validação por campo, quando houver. */
    campos?: Record<string, string>;
  };
}

/** Rota pública: informa apenas se a API está no ar, sem expor dados de usuários (RNF10). */
export interface SaudeApi {
  status: "ok";
  versao: string;
}

/** Totais exibidos na tela inicial (base do RF13). */
export interface ResumoUsuario {
  disciplinas: number;
  atividades: number;
  avaliacoes: number;
}
