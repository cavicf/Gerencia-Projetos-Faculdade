import type { Metadata } from "next";
import Link from "next/link";
import { TelaAcesso } from "@/components/layout/tela-acesso";
import { linkAcao } from "@/components/ui/estilos";
import { CadastroForm } from "@/features/auth/cadastro-form";

export const metadata: Metadata = { title: "Cadastre-se – AcadFlow" };

export default function CadastroPage() {
  return (
    <TelaAcesso titulo="Crie a sua conta" descricao="Cadastre-se para organizar as atividades das suas disciplinas.">
      <CadastroForm />
      <p className="mt-6 text-center text-sm text-cinza">
        Já tem conta?{" "}
        <Link href="/login" data-testid="link-login" className={linkAcao}>
          Entrar
        </Link>
      </p>
    </TelaAcesso>
  );
}
