// Teste de fumaça: garante que front-end e API sobem e se comunicam.
// Pré-requisito: `npm run seed` e `npm run dev` rodando na raiz do repositório.
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { By } from "selenium-webdriver";
import { ADMIN } from "../support/api.mjs";
import {
  abrir,
  aguardarUrl,
  clicar,
  criarDriver,
  entrar,
  porTestId,
  seletorTestId,
  textoEm,
} from "../support/driver.mjs";

describe("Smoke – aplicação no ar", () => {
  let driver;

  before(async () => {
    driver = await criarDriver();
    await entrar(driver, ADMIN);
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

  it("mostra na tela inicial os mesmos totais das listagens", async () => {
    const contarLinhas = async (caminho, testId) => {
      await abrir(driver, caminho);
      await porTestId(driver, testId);
      const linhas = await driver.findElements(By.css(seletorTestId(testId)));
      const visiveis = await Promise.all(linhas.map((linha) => linha.isDisplayed()));
      return visiveis.filter(Boolean).length;
    };
    const total = async (chave) => {
      await abrir(driver, "/");
      return textoEm(await porTestId(driver, `resumo-${chave}`), "resumo-total");
    };

    assert.equal(await total("disciplinas"), String(await contarLinhas("/disciplinas", "disciplina-linha")));
    assert.equal(await total("atividades"), String(await contarLinhas("/atividades", "atividade-linha")));
    assert.equal(await total("avaliacoes"), String(await contarLinhas("/avaliacoes", "avaliacao-linha")));
  });

  it("navega até o módulo de Disciplinas pelo menu", async () => {
    await abrir(driver, "/");
    await clicar(driver, "nav-disciplinas");
    await aguardarUrl(driver, /\/disciplinas$/);
    await porTestId(driver, "nova-disciplina");
  });
});
