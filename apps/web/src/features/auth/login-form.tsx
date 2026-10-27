"use client";

import type { Credenciais } from "@acadflow/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertaErro } from "@/components/ui/alerta-erro";
import { CampoForm } from "@/components/ui/campo-form";
import { botaoPrimario, campo } from "@/components/ui/estilos";
import { api, ApiError } from "@/lib/api";

/** RF15 – acesso por e-mail e senha. */
export function LoginForm() {
  const router = useRouter();
  const [dados, setDados] = useState<Credenciais>({ email: "", senha: "" });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [entrando, setEntrando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setEntrando(true);
    setErros({});
    setMensagem(null);
    try {
      await api("/auth/login", { method: "POST", body: JSON.stringify(dados) });
      router.replace("/");
      router.refresh();
    } catch (erro) {
      setMensagem(erro instanceof ApiError ? erro.message : "Não foi possível entrar.");
      setErros(erro instanceof ApiError ? (erro.campos ?? {}) : {});
      setEntrando(false);
    }
  }

  return (
    <form noValidate onSubmit={entrar} data-testid="login-form" className="space-y-4">
      <AlertaErro mensagem={mensagem} />
      <CampoForm id="email" rotulo="E-mail" erro={erros.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          value={dados.email}
          onChange={(e) => setDados({ ...dados, email: e.target.value })}
          aria-invalid={!!erros.email}
          className={campo}
          placeholder="seu.email@unifei.edu.br"
          autoFocus
        />
      </CampoForm>
      <CampoForm id="senha" rotulo="Senha" erro={erros.senha}>
        <input
          id="senha"
          name="senha"
          type="password"
          autoComplete="current-password"
          value={dados.senha}
          onChange={(e) => setDados({ ...dados, senha: e.target.value })}
          aria-invalid={!!erros.senha}
          className={campo}
        />
      </CampoForm>
      <button type="submit" data-testid="botao-entrar" disabled={entrando} className={`${botaoPrimario} mt-2 w-full`}>
        {entrando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
