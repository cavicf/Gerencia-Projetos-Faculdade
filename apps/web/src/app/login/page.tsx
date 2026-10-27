import type { Metadata } from "next";
import Link from "next/link";
import { TelaAcesso } from "@/components/layout/tela-acesso";
import { linkAcao } from "@/components/ui/estilos";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = { title: "Entrar – AcadFlow" };

export default function LoginPage() {
  return (
    <TelaAcesso titulo="Entrar no AcadFlow" descricao="Entre com o seu e-mail e a sua senha.">
      <LoginForm />
      <p className="mt-6 text-center text-sm text-cinza">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" data-testid="link-cadastro" className={linkAcao}>
          Cadastre-se
        </Link>
      </p>
    </TelaAcesso>
  );
}
