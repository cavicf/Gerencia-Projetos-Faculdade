"use client";

import { SENHA_TAMANHO_MINIMO, type UsuarioEntrada } from "@acadflow/shared";
import Link from "next/link";
import { useState } from "react";
import { AlertaErro } from "@/components/ui/alerta-erro";
import { CampoForm } from "@/components/ui/campo-form";
import { botaoPrimario, campo } from "@/components/ui/estilos";
import { IconeCheck } from "@/components/ui/icones";
import { api, ApiError } from "@/lib/api";

/** RFS16 – cadastro de um novo aluno; e-mail único e senha com no mínimo 8 caracteres. */
export function CadastroForm() {
  const [dados, setDados] = useState<UsuarioEntrada>({ nome: "", email: "", senha: "" });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [cadastrado, setCadastrado] = useState(false);

  const alterar = (chave: keyof UsuarioEntrada) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDados({ ...dados, [chave]: e.target.value });

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErros({});
    setMensagem(null);
    try {
      await api("/auth/cadastro", { method: "POST", body: JSON.stringify(dados) });
      setCadastrado(true);
    } catch (erro) {
      setMensagem(erro instanceof ApiError ? erro.message : "Não foi possível concluir o cadastro.");
      setErros(erro instanceof ApiError ? (erro.campos ?? {}) : {});
    } finally {
      setSalvando(false);
    }
  }

  if (cadastrado) {
    return (
      <div data-testid="cadastro-sucesso" role="status" className="space-y-4">
        <p className="flex items-center gap-2.5 rounded-lg border border-verde/25 bg-verde-claro px-4 py-3 text-sm font-medium text-verde-escuro">
          <IconeCheck className="size-4 shrink-0" />
          Cadastro realizado com sucesso! Entre com o seu e-mail e a sua senha.
        </p>
        <Link href="/login" data-testid="ir-para-login" className={`${botaoPrimario} w-full`}>
          Ir para o login
        </Link>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={cadastrar} data-testid="cadastro-form" className="space-y-4">
      <AlertaErro mensagem={mensagem} />
      <CampoForm id="nome" rotulo="Nome" obrigatorio erro={erros.nome}>
        <input id="nome" name="nome" value={dados.nome} onChange={alterar("nome")} aria-invalid={!!erros.nome} className={campo} autoComplete="name" autoFocus />
      </CampoForm>
      <CampoForm id="email" rotulo="E-mail" obrigatorio erro={erros.email}>
        <input id="email" name="email" type="email" value={dados.email} onChange={alterar("email")} aria-invalid={!!erros.email} className={campo} autoComplete="email" placeholder="seu.email@unifei.edu.br" />
      </CampoForm>
      <CampoForm id="senha" rotulo="Senha" obrigatorio erro={erros.senha} dica={`Mínimo de ${SENHA_TAMANHO_MINIMO} caracteres.`}>
        <input id="senha" name="senha" type="password" value={dados.senha} onChange={alterar("senha")} aria-invalid={!!erros.senha} className={campo} autoComplete="new-password" />
      </CampoForm>
      <button type="submit" data-testid="botao-cadastrar" disabled={salvando} className={`${botaoPrimario} mt-2 w-full`}>
        {salvando ? "Cadastrando…" : "Cadastrar"}
      </button>
    </form>
  );
}
