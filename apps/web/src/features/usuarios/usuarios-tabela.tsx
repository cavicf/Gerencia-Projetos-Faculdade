import type { UsuarioPublico } from "@acadflow/shared";
import Link from "next/link";
import { linkAcao } from "@/components/ui/estilos";
import { apiServidor } from "@/lib/api-servidor";

/** RF14 – usuário administrador do sistema; só é possível editá-lo. */
export async function UsuariosTabela() {
  const usuarios = await apiServidor<UsuarioPublico[]>("/usuarios");

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Nome</th>
            <th className="px-4 py-3">E-mail</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {usuarios.map((u) => (
            <tr key={u.id} data-testid="usuario-linha" data-email={u.email}>
              <td data-testid="usuario-nome" className="px-4 py-3 font-medium text-slate-900">
                {u.nome}
              </td>
              <td className="px-4 py-3 text-slate-600">{u.email}</td>
              <td className="px-4 py-3 text-right">
                <Link href={`/usuarios/${u.id}/editar`} data-testid="botao-editar" className={linkAcao}>
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
