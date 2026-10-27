// Release 02 – Autenticação (RF15): caso de teste CT-15 da MRB.
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { ADMIN, API_URL } from "../support/api.mjs";
import { abrir, aguardarUrl, clicar, criarDriver, entrar, porTestId, preencher, sair } from "../support/driver.mjs";

describe("CT-15: autenticação, encerramento de sessão e rotas protegidas", () => {
  let driver;

  before(async () => {
    driver = await criarDriver();
  });

  after(async () => {
    await driver?.quit();
  });

  it("redireciona para o login quem não está autenticado", async () => {
    await sair(driver);
    await abrir(driver, "/disciplinas");
    await aguardarUrl(driver, /\/login$/);
    await porTestId(driver, "login-form");
  });

  it("recusa senha errada com mensagem genérica", async () => {
    await abrir(driver, "/login");
    await preencher(driver, "email", ADMIN.email);
    await preencher(driver, "senha", "senha-errada");
    await clicar(driver, "botao-entrar");
    assert.equal(await (await porTestId(driver, "form-erro")).getText(), "E-mail ou senha inválidos.");
  });

  it("autentica o admin e mostra o usuário logado com acesso a todos os módulos", async () => {
    await entrar(driver, ADMIN);
    assert.equal(await (await porTestId(driver, "usuario-logado")).getText(), ADMIN.nome);
    for (const modulo of ["disciplinas", "atividades", "avaliacoes", "usuarios"]) await porTestId(driver, `nav-${modulo}`);
  });

  it("encerra a sessão e volta a exigir login", async () => {
    await clicar(driver, "botao-sair");
    await aguardarUrl(driver, /\/login$/);
    await abrir(driver, "/atividades");
    await aguardarUrl(driver, /\/login$/);
  });

  it("a API recusa requisições sem sessão", async () => {
    const resposta = await fetch(`${API_URL}/api/disciplinas`);
    assert.equal(resposta.status, 401);
  });
});
