// Release 02 – Manter Usuários (RF14): caso de teste CT-14 da MRB.
// O sistema tem um único usuário, o administrador: a tela permite apenas editá-lo.
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { By } from "selenium-webdriver";
import { ADMIN, restaurarAdmin } from "../support/api.mjs";
import {
  abrir,
  aguardar,
  aguardarUrl,
  clicar,
  criarDriver,
  entrar,
  porTestId,
  preencher,
  sair,
  seletorTestId,
  textoEm,
  TIMEOUT,
} from "../support/driver.mjs";

const linhaAdmin = `[data-testid="usuario-linha"][data-email="${ADMIN.email}"]`;
const NOVA_SENHA = "nova-senha-123";

async function editarAdmin(driver, { nome, email, senha }) {
  await abrir(driver, "/usuarios");
  await (await (await aguardar(driver, linhaAdmin)).findElement(By.css(seletorTestId("botao-editar")))).click();
  await porTestId(driver, "usuario-form");
  await preencher(driver, "nome", nome);
  await preencher(driver, "email", email);
  await preencher(driver, "senha", senha);
  await clicar(driver, "botao-salvar");
}

describe("CT-14: edição do usuário administrador", () => {
  let driver;

  before(async () => {
    // Também abre a sessão da API usada no `after`, antes de a senha mudar.
    await restaurarAdmin();
    driver = await criarDriver();
    await entrar(driver, ADMIN);
  });

  after(async () => {
    await driver?.quit();
    await restaurarAdmin();
  });

  it("lista apenas o admin, sem opções de cadastrar ou excluir usuários", async () => {
    await abrir(driver, "/usuarios");
    await aguardar(driver, linhaAdmin);
    const linhas = await driver.findElements(By.css(seletorTestId("usuario-linha")));
    const visiveis = (await Promise.all(linhas.map((l) => l.isDisplayed()))).filter(Boolean);
    assert.equal(visiveis.length, 1);
    assert.equal((await driver.findElements(By.css(seletorTestId("novo-usuario")))).length, 0);
    assert.equal((await driver.findElements(By.css(seletorTestId("botao-excluir")))).length, 0);
  });

  it("valida nome, e-mail e senha com menos de 8 caracteres", async () => {
    await editarAdmin(driver, { nome: "", email: "invalido", senha: "1234567" });
    await porTestId(driver, "form-erro");
    assert.equal(await (await porTestId(driver, "erro-nome")).getText(), "Informe o nome.");
    assert.equal(await (await porTestId(driver, "erro-email")).getText(), "Informe um e-mail válido.");
    assert.equal(await (await porTestId(driver, "erro-senha")).getText(), "A senha deve ter pelo menos 8 caracteres.");
  });

  it("altera o nome mantendo a senha quando o campo fica em branco", async () => {
    await editarAdmin(driver, { nome: "Admin Renomeado", email: ADMIN.email, senha: "" });
    await aguardarUrl(driver, /\/usuarios$/);
    await driver.wait(async () => (await textoEm(await aguardar(driver, linhaAdmin), "usuario-nome")) === "Admin Renomeado", TIMEOUT);

    // A senha original continua valendo.
    await sair(driver);
    await entrar(driver, ADMIN);
  });

  it("altera a senha, que passa a ser exigida no login", async () => {
    await editarAdmin(driver, { nome: ADMIN.nome, email: ADMIN.email, senha: NOVA_SENHA });
    await aguardarUrl(driver, /\/usuarios$/);

    await sair(driver);
    await abrir(driver, "/login");
    await preencher(driver, "email", ADMIN.email);
    await preencher(driver, "senha", ADMIN.senha);
    await clicar(driver, "botao-entrar");
    assert.equal(await (await porTestId(driver, "form-erro")).getText(), "E-mail ou senha inválidos.");

    await entrar(driver, { email: ADMIN.email, senha: NOVA_SENHA });
  });
});
