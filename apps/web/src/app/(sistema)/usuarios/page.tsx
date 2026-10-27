import { Suspense } from "react";
import { Carregando } from "@/components/ui/estado-vazio";
import { PageHeader } from "@/components/ui/page-header";
import { UsuariosTabela } from "@/features/usuarios/usuarios-tabela";

export default function UsuariosPage() {
  return (
    <>
      <PageHeader
        titulo="Usuários"
        descricao="O administrador tem acesso a todos os cadastros do sistema. Altere aqui o nome, o e-mail e a senha de acesso."
      />
      <Suspense fallback={<Carregando />}>
        <UsuariosTabela />
      </Suspense>
    </>
  );
}
