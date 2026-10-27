import { Suspense } from "react";
import { Carregando } from "@/components/ui/estado-vazio";
import { PageHeader } from "@/components/ui/page-header";
import { UsuarioFormCarregado } from "@/features/usuarios/usuario-form-carregado";

export default function EditarUsuarioPage({ params }: PageProps<"/usuarios/[id]/editar">) {
  return (
    <>
      <PageHeader titulo="Editar usuário" />
      <Suspense fallback={<Carregando />}>
        <Formulario params={params} />
      </Suspense>
    </>
  );
}

async function Formulario({ params }: Pick<PageProps<"/usuarios/[id]/editar">, "params">) {
  const { id } = await params;
  return <UsuarioFormCarregado usuarioId={id} />;
}
