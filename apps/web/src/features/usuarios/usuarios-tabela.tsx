import type { UsuarioPublico } from "@acadflow/shared";
import Link from "next/link";
import { botaoIcone, tabela } from "@/components/ui/estilos";
import { IconeLapis } from "@/components/ui/icones";
import { apiServidor } from "@/lib/api-servidor";

/** RF14 – usuário administrador do sistema; só é possível editá-lo. */
export async function UsuariosTabela() {
  const usuarios = await apiServidor<UsuarioPublico[]>("/usuarios");

  return (
    <div className={tabela.contorno}>
      <table className={tabela.tabela}>
        <thead className={tabela.cabecalho}>
          <tr>
            <th className="px-5 py-3">Nome</th>
            <th className="px-4 py-3">E-mail</th>
            <th className="px-5 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className={tabela.corpo}>
          {usuarios.map((u) => (
            <tr key={u.id} data-testid="usuario-linha" data-email={u.email} className={tabela.linha}>
              <td className="px-5 py-3.5">
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-azul to-verde font-titulo text-[11px] font-semibold text-white"
                  >
                    {u.nome.trim().charAt(0).toUpperCase()}
                  </span>
                  <span data-testid="usuario-nome" className="font-semibold text-azul">
                    {u.nome}
                  </span>
                </span>
              </td>
              <td className="px-4 py-3.5 text-cinza">{u.email}</td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end">
                  <Link
                    href={`/usuarios/${u.id}/editar`}
                    data-testid="botao-editar"
                    aria-label="Editar"
                    title="Editar"
                    className={botaoIcone}
                  >
                    <IconeLapis />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
