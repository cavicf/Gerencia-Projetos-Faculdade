import type { Usuario, UsuarioPublico } from "@acadflow/shared";

export function paraPublico({ senhaHash: _senhaHash, ...usuario }: Usuario): UsuarioPublico {
  return usuario;
}
