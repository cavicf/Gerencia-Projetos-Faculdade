"use client";

import { SENHA_TAMANHO_MINIMO, type PerfilEntrada, type UsuarioPublico } from "@acadflow/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertaErro } from "@/components/ui/alerta-erro";
import { CampoForm } from "@/components/ui/campo-form";
import { botaoPrimario, campo, cartao } from "@/components/ui/estilos";
import { IconeCheck } from "@/components/ui/icones";
import { api, ApiError } from "@/lib/api";

/** RFS18 – alteração do perfil. Nova senha em branco mantém a atual; a senha atual confirma a alteração. */
export function PerfilForm({ usuario }: { usuario: UsuarioPublico }) {
  const router = useRouter();
  const [dados, setDados] = useState<PerfilEntrada>({
    nome: usuario.nome,
    email: usuario.email,
    novaSenha: "",
    confirmacaoSenha: "",
    senhaAtual: "",
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const alterar = (chave: keyof PerfilEntrada) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDados({ ...dados, [chave]: e.target.value });
    setSalvo(false);
  };

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErros({});
    setMensagem(null);
    try {
      await api("/perfil", { method: "PUT", body: JSON.stringify(dados) });
      setDados({ ...dados, novaSenha: "", confirmacaoSenha: "", senhaAtual: "" });
      setSalvo(true);
      router.refresh(); // atualiza o nome no cabeçalho
    } catch (erro) {
      setMensagem(erro instanceof ApiError ? erro.message : "Não foi possível salvar o perfil.");
      setErros(erro instanceof ApiError ? (erro.campos ?? {}) : {});
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form noValidate onSubmit={salvar} data-testid="perfil-form" className={`${cartao} space-y-5 p-6 sm:p-8`}>
      <AlertaErro mensagem={mensagem} />
      {salvo && (
        <p
          role="status"
          data-testid="perfil-salvo"
          className="flex items-center gap-2.5 rounded-lg border border-verde/25 bg-verde-claro px-4 py-3 text-sm font-medium text-verde-escuro"
        >
          <IconeCheck className="size-4 shrink-0" />
          Perfil atualizado com sucesso.
        </p>
      )}

      <CampoForm id="nome" rotulo="Nome" obrigatorio erro={erros.nome}>
        <input id="nome" name="nome" value={dados.nome} onChange={alterar("nome")} aria-invalid={!!erros.nome} className={campo} />
      </CampoForm>

      <CampoForm id="email" rotulo="E-mail" obrigatorio erro={erros.email}>
        <input id="email" name="email" type="email" value={dados.email} onChange={alterar("email")} aria-invalid={!!erros.email} className={campo} autoComplete="off" />
      </CampoForm>

      <div className="grid gap-5 sm:grid-cols-2">
        <CampoForm
          id="novaSenha"
          rotulo="Nova senha"
          erro={erros.novaSenha}
          dica={`Deixe em branco para manter a senha. Mínimo de ${SENHA_TAMANHO_MINIMO} caracteres.`}
        >
          <input id="novaSenha" name="novaSenha" type="password" value={dados.novaSenha} onChange={alterar("novaSenha")} aria-invalid={!!erros.novaSenha} className={campo} autoComplete="new-password" />
        </CampoForm>
        <CampoForm id="confirmacaoSenha" rotulo="Confirmação da nova senha" erro={erros.confirmacaoSenha}>
          <input id="confirmacaoSenha" name="confirmacaoSenha" type="password" value={dados.confirmacaoSenha} onChange={alterar("confirmacaoSenha")} aria-invalid={!!erros.confirmacaoSenha} className={campo} autoComplete="new-password" />
        </CampoForm>
      </div>

      <div className="-mx-6 flex flex-wrap items-end justify-between gap-4 border-t border-borda px-6 pt-5 sm:-mx-8 sm:px-8">
        <div className="min-w-56 flex-1">
          <CampoForm id="senhaAtual" rotulo="Senha atual" obrigatorio erro={erros.senhaAtual}>
            <input id="senhaAtual" name="senhaAtual" type="password" value={dados.senhaAtual} onChange={alterar("senhaAtual")} aria-invalid={!!erros.senhaAtual} className={campo} autoComplete="current-password" />
          </CampoForm>
        </div>
        <button type="submit" data-testid="botao-salvar" disabled={salvando} className={botaoPrimario}>
          {salvando ? "Salvando…" : "Salvar alterações"}
        </button>
      </div>
    </form>
  );
}
