"use client";

import { SENHA_TAMANHO_MINIMO, type UsuarioEntrada, type UsuarioPublico } from "@acadflow/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertaErro } from "@/components/ui/alerta-erro";
import { CampoForm } from "@/components/ui/campo-form";
import { botaoPrimario, botaoSecundario, campo } from "@/components/ui/estilos";
import { api, ApiError } from "@/lib/api";

/** RF14 – alteração do usuário administrador. Senha em branco mantém a atual. */
export function UsuarioForm({ usuario }: { usuario: UsuarioPublico }) {
  const router = useRouter();
  const [dados, setDados] = useState<UsuarioEntrada>({
    nome: usuario.nome,
    email: usuario.email,
    senha: "",
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const alterar = (chave: keyof UsuarioEntrada) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDados({ ...dados, [chave]: e.target.value });

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErros({});
    setMensagem(null);
    try {
      await api(`/usuarios/${usuario.id}`, { method: "PUT", body: JSON.stringify(dados) });
      router.push("/usuarios");
      router.refresh();
    } catch (erro) {
      if (erro instanceof ApiError) {
        setMensagem(erro.message);
        setErros(erro.campos ?? {});
      } else {
        setMensagem("Não foi possível salvar o usuário.");
      }
      setSalvando(false);
    }
  }

  return (
    <form noValidate onSubmit={salvar} data-testid="usuario-form" className="max-w-xl space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      <AlertaErro mensagem={mensagem} />

      <CampoForm id="nome" rotulo="Nome" obrigatorio erro={erros.nome}>
        <input id="nome" name="nome" value={dados.nome} onChange={alterar("nome")} aria-invalid={!!erros.nome} className={campo} />
      </CampoForm>

      <CampoForm id="email" rotulo="E-mail" obrigatorio erro={erros.email}>
        <input id="email" name="email" type="email" value={dados.email} onChange={alterar("email")} aria-invalid={!!erros.email} className={campo} autoComplete="off" />
      </CampoForm>

      <CampoForm
        id="senha"
        rotulo="Nova senha"
        erro={erros.senha}
        dica={`Deixe em branco para manter a senha atual. Mínimo de ${SENHA_TAMANHO_MINIMO} caracteres.`}
      >
        <input id="senha" name="senha" type="password" value={dados.senha} onChange={alterar("senha")} aria-invalid={!!erros.senha} className={campo} autoComplete="new-password" />
      </CampoForm>

      <div className="flex justify-end gap-2 pt-2">
        <Link href="/usuarios" className={botaoSecundario}>
          Cancelar
        </Link>
        <button type="submit" data-testid="botao-salvar" disabled={salvando} className={botaoPrimario}>
          {salvando ? "Salvando…" : "Salvar"}
        </button>
      </div>
    </form>
  );
}
