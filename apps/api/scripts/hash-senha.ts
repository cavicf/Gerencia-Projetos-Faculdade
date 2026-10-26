// Gera o hash bcrypt de uma senha para criar usuários nos dados mockados (RNF09).
// Uso: npm run hash-senha -w @acadflow/api -- "minha-senha"
import bcrypt from "bcryptjs";

const senha = process.argv[2];
if (!senha) {
  console.error('Informe a senha: npm run hash-senha -w @acadflow/api -- "minha-senha"');
  process.exit(1);
}
console.log(await bcrypt.hash(senha, 10));
