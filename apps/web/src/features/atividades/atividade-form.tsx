"use client";

import {
  PRIORIDADE_PADRAO,
  PRIORIDADES,
  ROTULOS_PRIORIDADE,
  ROTULOS_TIPO,
  TIPOS_ATIVIDADE,
  type Atividade,
  type AtividadeEntrada,
  type DisciplinaResumo,
} from "@acadflow/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertaErro } from "@/components/ui/alerta-erro";
import { CampoForm } from "@/components/ui/campo-form";
import { botaoPrimario, botaoSecundario, campo } from "@/components/ui/estilos";
import { api, ApiError } from "@/lib/api";

interface AtividadeFormProps {
  disciplinas: Pick<DisciplinaResumo, "id" | "codigo" | "nome" | "semestre">[];
  /** Atividade em edição (RF07); ausente no cadastro (RF04). */
  atividade?: Atividade;
}

type Campos = Required<AtividadeEntrada>;

/**
 * RF04 / RF06 / RF07. Só título, data de entrega e disciplina são obrigatórios; tipo e
 * prioridade já vêm preenchidos para o cadastro caber em poucas interações (RNF02).
 */
export function AtividadeForm({ disciplinas, atividade }: AtividadeFormProps) {
  const router = useRouter();
  const [dados, setDados] = useState<Campos>({
    titulo: atividade?.titulo ?? "",
    descricao: atividade?.descricao ?? "",
    tipo: atividade?.tipo ?? "tarefa",
    dataEntrega: atividade?.dataEntrega ?? "",
    disciplinaId: atividade?.disciplinaId ?? (disciplinas.length === 1 ? disciplinas[0].id : ""),
    prioridade: atividade?.prioridade ?? PRIORIDADE_PADRAO,
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const alterar =
    (chave: keyof Campos) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setDados({ ...dados, [chave]: e.target.value });

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErros({});
    setMensagem(null);
    try {
      const corpo = JSON.stringify(dados);
      if (atividade) await api(`/atividades/${atividade.id}`, { method: "PUT", body: corpo });
      else await api("/atividades", { method: "POST", body: corpo });
      router.push("/atividades");
      router.refresh();
    } catch (erro) {
      if (erro instanceof ApiError) {
        setMensagem(erro.message);
        setErros(erro.campos ?? {});
      } else {
        setMensagem("Não foi possível salvar a atividade.");
      }
      setSalvando(false);
    }
  }

  return (
    <form noValidate onSubmit={salvar} data-testid="atividade-form" className="max-w-2xl space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      <AlertaErro mensagem={mensagem} />

      <CampoForm id="titulo" rotulo="Título" obrigatorio erro={erros.titulo}>
        <input id="titulo" name="titulo" value={dados.titulo} onChange={alterar("titulo")} aria-invalid={!!erros.titulo} className={campo} placeholder="Ex.: Prova 1" autoFocus />
      </CampoForm>

      <div className="grid gap-4 sm:grid-cols-2">
        <CampoForm id="disciplinaId" rotulo="Disciplina" obrigatorio erro={erros.disciplinaId}>
          <select id="disciplinaId" name="disciplinaId" value={dados.disciplinaId} onChange={alterar("disciplinaId")} aria-invalid={!!erros.disciplinaId} className={campo}>
            <option value="">Selecione…</option>
            {disciplinas.map((d) => (
              <option key={d.id} value={d.id}>
                {d.codigo} – {d.nome} ({d.semestre})
              </option>
            ))}
          </select>
        </CampoForm>

        <CampoForm id="dataEntrega" rotulo="Data de entrega" obrigatorio erro={erros.dataEntrega}>
          <input id="dataEntrega" name="dataEntrega" type="date" value={dados.dataEntrega} onChange={alterar("dataEntrega")} aria-invalid={!!erros.dataEntrega} className={campo} />
        </CampoForm>

        <CampoForm id="tipo" rotulo="Tipo" erro={erros.tipo}>
          <select id="tipo" name="tipo" value={dados.tipo} onChange={alterar("tipo")} className={campo}>
            {TIPOS_ATIVIDADE.map((t) => (
              <option key={t} value={t}>
                {ROTULOS_TIPO[t]}
              </option>
            ))}
          </select>
        </CampoForm>

        <CampoForm id="prioridade" rotulo="Prioridade" erro={erros.prioridade}>
          <select id="prioridade" name="prioridade" value={dados.prioridade} onChange={alterar("prioridade")} className={campo}>
            {PRIORIDADES.map((p) => (
              <option key={p} value={p}>
                {ROTULOS_PRIORIDADE[p]}
              </option>
            ))}
          </select>
        </CampoForm>
      </div>

      <CampoForm id="descricao" rotulo="Descrição" erro={erros.descricao}>
        <textarea id="descricao" name="descricao" value={dados.descricao} onChange={alterar("descricao")} rows={3} className={campo} />
      </CampoForm>

      <div className="flex justify-end gap-2 pt-2">
        <Link href="/atividades" className={botaoSecundario}>
          Cancelar
        </Link>
        <button type="submit" data-testid="botao-salvar" disabled={salvando} className={botaoPrimario}>
          {salvando ? "Salvando…" : "Salvar"}
        </button>
      </div>
    </form>
  );
}
