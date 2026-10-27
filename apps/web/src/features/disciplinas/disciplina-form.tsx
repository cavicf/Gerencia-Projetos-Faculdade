"use client";

import type { Disciplina, DisciplinaEntrada } from "@acadflow/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertaErro } from "@/components/ui/alerta-erro";
import { CampoForm } from "@/components/ui/campo-form";
import { botaoPrimario, botaoSecundario, campo, cartao } from "@/components/ui/estilos";
import { api, ApiError } from "@/lib/api";

interface DisciplinaFormProps {
  /** Disciplina em edição (RF03); ausente no cadastro (RF01). */
  disciplina?: Disciplina;
}

const VAZIA: DisciplinaEntrada = { codigo: "", nome: "", professor: "", semestre: "" };

export function DisciplinaForm({ disciplina }: DisciplinaFormProps) {
  const router = useRouter();
  const [dados, setDados] = useState<DisciplinaEntrada>(disciplina ?? VAZIA);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const alterar = (chave: keyof DisciplinaEntrada) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDados({ ...dados, [chave]: e.target.value });

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErros({});
    setMensagem(null);
    try {
      const corpo = JSON.stringify({
        codigo: dados.codigo,
        nome: dados.nome,
        professor: dados.professor,
        semestre: dados.semestre,
      });
      if (disciplina) await api(`/disciplinas/${disciplina.id}`, { method: "PUT", body: corpo });
      else await api("/disciplinas", { method: "POST", body: corpo });
      router.push("/disciplinas");
      router.refresh();
    } catch (erro) {
      if (erro instanceof ApiError) {
        setMensagem(erro.message);
        setErros(erro.campos ?? {});
      } else {
        setMensagem("Não foi possível salvar a disciplina.");
      }
      setSalvando(false);
    }
  }

  return (
    <form noValidate onSubmit={salvar} data-testid="disciplina-form" className={`${cartao} max-w-xl space-y-5 p-6 sm:p-8`}>
      <AlertaErro mensagem={mensagem} />

      <div className="grid gap-4 sm:grid-cols-2">
        <CampoForm id="codigo" rotulo="Código" obrigatorio erro={erros.codigo}>
          <input id="codigo" name="codigo" value={dados.codigo} onChange={alterar("codigo")} aria-invalid={!!erros.codigo} className={`${campo} uppercase`} placeholder="SDES06" />
        </CampoForm>
        <CampoForm id="semestre" rotulo="Semestre" obrigatorio erro={erros.semestre} dica="Formato AAAA.1 ou AAAA.2">
          <input id="semestre" name="semestre" value={dados.semestre} onChange={alterar("semestre")} aria-invalid={!!erros.semestre} className={campo} placeholder="2026.2" />
        </CampoForm>
      </div>

      <CampoForm id="nome" rotulo="Nome" obrigatorio erro={erros.nome}>
        <input id="nome" name="nome" value={dados.nome} onChange={alterar("nome")} aria-invalid={!!erros.nome} className={campo} placeholder="Gerência de Projetos de Software" />
      </CampoForm>

      <CampoForm id="professor" rotulo="Professor responsável" obrigatorio erro={erros.professor}>
        <input id="professor" name="professor" value={dados.professor} onChange={alterar("professor")} aria-invalid={!!erros.professor} className={campo} />
      </CampoForm>

      <div className="-mx-6 flex justify-end gap-2 border-t border-borda px-6 pt-5 sm:-mx-8 sm:px-8">
        <Link href="/disciplinas" className={botaoSecundario}>
          Cancelar
        </Link>
        <button type="submit" data-testid="botao-salvar" disabled={salvando} className={botaoPrimario}>
          {salvando ? "Salvando…" : "Salvar"}
        </button>
      </div>
    </form>
  );
}
