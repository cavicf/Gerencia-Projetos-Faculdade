// Valores permitidos definidos no DRE v1.0 e seus rótulos em português (RNF01).

export const TIPOS_ATIVIDADE = ["prova", "trabalho", "tarefa"] as const; // RF04
export const STATUS_ATIVIDADE = ["pendente", "em_andamento", "concluida"] as const; // RF05
export const PRIORIDADES = ["alta", "media", "baixa"] as const; // RF06

export const PRIORIDADE_PADRAO = "media" satisfies (typeof PRIORIDADES)[number]; // RF06
export const STATUS_INICIAL = "pendente" satisfies (typeof STATUS_ATIVIDADE)[number];
export const SENHA_TAMANHO_MINIMO = 8; // RFS16 / RFS18
export const DIAS_PROXIMOS_PRAZOS = 7; // RF09
export const NOTA_MAXIMA = 10; // RF08
export const COOKIE_SESSAO = "acadflow_sessao"; // RF15
export const DURACAO_SESSAO_HORAS = 8;

export const ROTULOS_TIPO: Record<(typeof TIPOS_ATIVIDADE)[number], string> = {
  prova: "Prova",
  trabalho: "Trabalho",
  tarefa: "Tarefa",
};

export const ROTULOS_STATUS: Record<(typeof STATUS_ATIVIDADE)[number], string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluida: "Concluída",
};

export const ROTULOS_PRIORIDADE: Record<(typeof PRIORIDADES)[number], string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};
