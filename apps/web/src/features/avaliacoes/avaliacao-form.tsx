"use client";

import { NOTA_MAXIMA, type AtividadeDetalhada, type AvaliacaoDetalhada } from "@acadflow/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertaErro } from "@/components/ui/alerta-erro";
import { CampoForm } from "@/components/ui/campo-form";
import { botaoPrimario, botaoSecundario, campo, cartao } from "@/components/ui/estilos";
import { api, ApiError } from "@/lib/api";

interface AvaliacaoFormProps {
  /** Atividades concluídas e ainda sem nota (cadastro). */
  atividades: Pick<AtividadeDetalhada, "id" | "titulo" | "disciplinaCodigo">[];
  /** Avaliação em edição; a atividade não pode ser trocada. */
  avaliacao?: AvaliacaoDetalhada;
}

/** Campo numérico vazio vai como `null`, para a API responder "Informe…" em vez de assumir zero. */
const paraNumero = (valor: string) => (valor.trim() === "" ? null : Number(valor.replace(",", ".")));

/** RF08 – registro da nota e do peso de uma atividade concluída. */
export function AvaliacaoForm({ atividades, avaliacao }: AvaliacaoFormProps) {
  const router = useRouter();
  const [atividadeId, setAtividadeId] = useState(avaliacao?.atividadeId ?? "");
  const [peso, setPeso] = useState(avaliacao ? String(avaliacao.peso) : "");
  const [nota, setNota] = useState(avaliacao ? String(avaliacao.nota) : "");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErros({});
    setMensagem(null);
    try {
      const valores = { peso: paraNumero(peso), nota: paraNumero(nota) };
      if (avaliacao) {
        await api(`/avaliacoes/${avaliacao.id}`, { method: "PUT", body: JSON.stringify(valores) });
      } else {
        await api("/avaliacoes", { method: "POST", body: JSON.stringify({ atividadeId, ...valores }) });
      }
      router.push("/avaliacoes");
      router.refresh();
    } catch (erro) {
      if (erro instanceof ApiError) {
        setMensagem(erro.message);
        setErros(erro.campos ?? {});
      } else {
        setMensagem("Não foi possível salvar a avaliação.");
      }
      setSalvando(false);
    }
  }

  return (
    <form noValidate onSubmit={salvar} data-testid="avaliacao-form" className={`${cartao} max-w-xl space-y-5 p-6 sm:p-8`}>
      <AlertaErro mensagem={mensagem} />

      {avaliacao ? (
        <p className="rounded-lg bg-fundo px-4 py-3 text-sm text-cinza">
          Atividade: <strong className="text-azul">{avaliacao.atividadeTitulo}</strong> ({avaliacao.disciplinaCodigo})
        </p>
      ) : (
        <CampoForm id="atividadeId" rotulo="Atividade concluída" obrigatorio erro={erros.atividadeId}>
          <select id="atividadeId" name="atividadeId" value={atividadeId} onChange={(e) => setAtividadeId(e.target.value)} aria-invalid={!!erros.atividadeId} className={campo}>
            <option value="">Selecione…</option>
            {atividades.map((a) => (
              <option key={a.id} value={a.id}>
                {a.titulo} — {a.disciplinaCodigo}
              </option>
            ))}
          </select>
        </CampoForm>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <CampoForm id="peso" rotulo="Peso" obrigatorio erro={erros.peso} dica="Ex.: 2 para uma prova que vale o dobro">
          <input id="peso" name="peso" type="number" inputMode="decimal" min="0" step="0.5" value={peso} onChange={(e) => setPeso(e.target.value)} aria-invalid={!!erros.peso} className={campo} />
        </CampoForm>
        <CampoForm id="nota" rotulo="Nota" obrigatorio erro={erros.nota} dica={`De 0 a ${NOTA_MAXIMA}`}>
          <input id="nota" name="nota" type="number" inputMode="decimal" min="0" max={NOTA_MAXIMA} step="0.1" value={nota} onChange={(e) => setNota(e.target.value)} aria-invalid={!!erros.nota} className={campo} />
        </CampoForm>
      </div>

      <div className="-mx-6 flex justify-end gap-2 border-t border-borda px-6 pt-5 sm:-mx-8 sm:px-8">
        <Link href="/avaliacoes" className={botaoSecundario}>
          Cancelar
        </Link>
        <button type="submit" data-testid="botao-salvar" disabled={salvando} className={botaoPrimario}>
          {salvando ? "Salvando…" : "Salvar"}
        </button>
      </div>
    </form>
  );
}
