import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = { title: "Entrar – AcadFlow" };

export default function LoginPage() {
  return (
    <div className="mx-auto mt-8 max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Entrar no AcadFlow</h1>
      <p className="mb-6 mt-1 text-sm text-slate-600">Entre com o e-mail e a senha do administrador.</p>
      <LoginForm />
    </div>
  );
}
