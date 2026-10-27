import type { PRIORIDADES, STATUS_ATIVIDADE, TIPOS_ATIVIDADE } from "./constants";

export type TipoAtividade = (typeof TIPOS_ATIVIDADE)[number];
export type StatusAtividade = (typeof STATUS_ATIVIDADE)[number];
export type Prioridade = (typeof PRIORIDADES)[number];

/** Datas de calendário no formato `YYYY-MM-DD`; instantes em ISO 8601. */
export type DataISO = string;
export type DataHoraISO = string;

interface Registro {
  id: string;
  criadoEm: DataHoraISO;
  atualizadoEm: DataHoraISO;
}

/** RF14 / RF15 – Módulo 1: Controle de Acesso. Há um único usuário, o administrador, com acesso a tudo. */
export interface Usuario extends Registro {
  nome: string;
  email: string;
  /** Hash bcrypt da senha (RNF09). Nunca é enviado ao front-end. */
  senhaHash: string;
}

export type UsuarioPublico = Omit<Usuario, "senhaHash">;

/** Corpo de PUT `/usuarios/:id`. Senha vazia mantém a atual. */
export type UsuarioEntrada = Pick<Usuario, "nome" | "email"> & { senha: string };

/** Corpo de POST `/auth/login`. */
export interface Credenciais {
  email: string;
  senha: string;
}

/** Sessão aberta no login (RF15); o `id` é o token guardado no cookie. */
export interface Sessao extends Registro {
  usuarioId: string;
  expiraEm: DataHoraISO;
}

/** RF01–RF03 – Módulo 2: Gestão de Disciplinas. */
export interface Disciplina extends Registro {
  /** Único por semestre (RF01). */
  codigo: string;
  nome: string;
  professor: string;
  /** Semestre letivo, ex.: `2026.2`. */
  semestre: string;
}

/** RF02 – listagem com contagem de atividades vinculadas. */
export interface DisciplinaResumo extends Disciplina {
  atividadesPendentes: number;
  atividadesConcluidas: number;
}

/** Corpo de POST/PUT `/disciplinas`. */
export type DisciplinaEntrada = Pick<Disciplina, "codigo" | "nome" | "professor" | "semestre">;

/** RF04–RF07 – Módulo 3: Gestão de Atividades. */
export interface Atividade extends Registro {
  disciplinaId: string;
  titulo: string;
  descricao: string;
  tipo: TipoAtividade;
  dataEntrega: DataISO;
  status: StatusAtividade;
  prioridade: Prioridade;
  /** Preenchida automaticamente quando o status muda para `concluida` (RF05). */
  dataConclusao: DataHoraISO | null;
}

/** RF07 – atividade com o nome da disciplina, para listagens. */
export interface AtividadeDetalhada extends Atividade {
  disciplinaCodigo: string;
  disciplinaNome: string;
  /** Indica se já há nota registrada (RF08). */
  avaliada: boolean;
}

/** Corpo de POST/PUT `/atividades`. `tipo`, `descricao` e `prioridade` são opcionais (RF04/RF06). */
export type AtividadeEntrada = Pick<Atividade, "titulo" | "dataEntrega" | "disciplinaId"> &
  Partial<Pick<Atividade, "descricao" | "tipo" | "prioridade">>;

/** RF08 – nota e peso de uma atividade concluída. */
export interface Avaliacao extends Registro {
  atividadeId: string;
  peso: number;
  nota: number;
}

export interface AvaliacaoDetalhada extends Avaliacao {
  atividadeTitulo: string;
  disciplinaId: string;
  disciplinaCodigo: string;
  disciplinaNome: string;
}

/** Corpo de POST `/avaliacoes`. Em PUT a atividade não muda. */
export type AvaliacaoEntrada = Pick<Avaliacao, "atividadeId" | "peso" | "nota">;

/** RF08 – desempenho em uma disciplina: média ponderada das notas. */
export interface DesempenhoDisciplina {
  disciplinaId: string;
  disciplinaCodigo: string;
  disciplinaNome: string;
  avaliacoes: number;
  somaPesos: number;
  mediaPonderada: number;
}
