import type { UsuarioPublico } from "@acadflow/shared";
import { apiServidorOu404 } from "@/lib/api-servidor";
import { UsuarioForm } from "./usuario-form";

export async function UsuarioFormCarregado({ usuarioId }: { usuarioId: string }) {
  const usuario = await apiServidorOu404<UsuarioPublico>(`/usuarios/${usuarioId}`);
  return <UsuarioForm usuario={usuario} />;
}
