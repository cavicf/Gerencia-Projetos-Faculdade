// Teste de fumaça: garante que front-end e API sobem e se comunicam.
// Pré-requisito: `npm run seed` e `npm run dev` rodando na raiz do repositório.
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { abrir, aguardarUrl, clicar, criarDriver, porTestId } from "../support/driver.mjs";

describe("Smoke – aplicação no ar", () => {
  let driver;

  before(async () => {
    driver = await criarDriver();
  });

  after(async () => {
    await driver?.quit();
  });

  it("exibe a tela inicial do AcadFlow com a API online", async () => {
    await abrir(driver, "/");
    assert.match(await driver.getTitle(), /AcadFlow/);

    const status = await porTestId(driver, "api-status");
    assert.equal(await status.getAttribute("data-status"), "online");
  });

  it("navega até o módulo de Disciplinas pelo menu", async () => {
    await abrir(driver, "/");
    await clicar(driver, "nav-disciplinas");
    await aguardarUrl(driver, /\/disciplinas$/);
    await porTestId(driver, "nova-disciplina");
  });
});
