import type { UsuarioPublico } from "@acadflow/shared";
import { Suspense } from "react";
import { Carregando } from "@/components/ui/estado-vazio";
import { PageHeader } from "@/components/ui/page-header";
import { ExcluirConta } from "@/features/usuarios/excluir-conta";
import { PerfilForm } from "@/features/usuarios/perfil-form";
import { apiServidor } from "@/lib/api-servidor";

export default function PerfilPage() {
  return (
    <>
      <PageHeader titulo="Meu perfil" descricao="Altere o seu nome, e-mail e senha de acesso ou exclua a sua conta." />
      <Suspense fallback={<Carregando />}>
        <Perfil />
      </Suspense>
    </>
  );
}

async function Perfil() {
  const usuario = await apiServidor<UsuarioPublico>("/perfil");
  return (
    <div className="max-w-xl space-y-6">
      <PerfilForm usuario={usuario} />
      <ExcluirConta />
    </div>
  );
}
