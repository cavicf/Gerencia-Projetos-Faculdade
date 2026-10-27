import type { Atividade, Avaliacao, Disciplina, Sessao, Usuario } from "@acadflow/shared";
import { JsonCollection } from "./json-store";

/** Coleções de dados do AcadFlow, cada uma em `data/db/<nome>.json`. */
export const db = {
  usuarios: new JsonCollection<Usuario>("usuarios"),
  sessoes: new JsonCollection<Sessao>("sessoes"),
  disciplinas: new JsonCollection<Disciplina>("disciplinas"),
  atividades: new JsonCollection<Atividade>("atividades"),
  avaliacoes: new JsonCollection<Avaliacao>("avaliacoes"),
};
