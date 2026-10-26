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

/** Registro pertencente a um estudante (RNF10 – isolamento por usuário). */
interface RegistroDoUsuario extends Registro {
  usuarioId: string;
}

/** RF14 / RF15 – Módulo 1: Controle de Acesso. */
export interface Usuario extends Registro {
  nome: string;
  email: string;
  /** Hash bcrypt da senha (RNF09). Nunca é enviado ao front-end. */
  senhaHash: string;
}

export type UsuarioPublico = Omit<Usuario, "senhaHash">;

/** RF01–RF03 – Módulo 2: Gestão de Disciplinas. */
export interface Disciplina extends RegistroDoUsuario {
  /** Único por estudante e semestre (RF01). */
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

/** RF04–RF07 – Módulo 3: Gestão de Atividades. */
export interface Atividade extends RegistroDoUsuario {
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
}

/** Corpo de POST/PUT `/disciplinas`. */
export type DisciplinaEntrada = Pick<Disciplina, "codigo" | "nome" | "professor" | "semestre">;

/** Corpo de POST/PUT `/atividades`. `tipo`, `descricao` e `prioridade` são opcionais (RF04/RF06). */
export type AtividadeEntrada = Pick<Atividade, "titulo" | "dataEntrega" | "disciplinaId"> &
  Partial<Pick<Atividade, "descricao" | "tipo" | "prioridade">>;

/** RF08 – nota e peso de uma atividade concluída (CRUD "Manter Avaliações", Release 02). */
export interface Avaliacao extends RegistroDoUsuario {
  atividadeId: string;
  peso: number;
  nota: number;
}
