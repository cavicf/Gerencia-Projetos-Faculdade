// Release 02 – Manter Avaliações (RF08): caso de teste CT-08 da MRB.
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { By, Select } from "selenium-webdriver";
import {
  ADMIN,
  alterarStatus,
  criarAtividade,
  criarDisciplina,
  excluirDisciplinas,
  SUFIXO,
} from "../support/api.mjs";
import {
  abrir,
  aguardar,
  aguardarAusencia,
  aguardarUrl,
  clicar,
  criarDriver,
  entrar,
  porTestId,
  preencher,
  selecionar,
  seletorTestId,
  textoEm,
  TIMEOUT,
} from "../support/driver.mjs";

const CODIGO = `AV${SUFIXO}`;
const linhaAvaliacao = (titulo) => `[data-testid="avaliacao-linha"][data-atividade="${titulo}"]`;
const linhaDesempenho = `[data-testid="desempenho-linha"][data-codigo="${CODIGO}"]`;

async function mediaDaDisciplina(driver) {
  return textoEm(await aguardar(driver, linhaDesempenho), "desempenho-media");
}

async function registrarNota(driver, { atividadeId, peso, nota }) {
  await abrir(driver, "/avaliacoes");
  await clicar(driver, "nova-avaliacao");
  await porTestId(driver, "avaliacao-form");
  if (atividadeId) await selecionar(driver, "atividadeId", atividadeId);
  await preencher(driver, "peso", peso);
  await preencher(driver, "nota", nota);
  await clicar(driver, "botao-salvar");
}

describe("CT-08: registro de nota e peso e cálculo de desempenho por disciplina", () => {
  let driver;
  const titulos = { prova: `Prova ${SUFIXO}`, trabalho: `Trabalho ${SUFIXO}`, pendente: `Lista ${SUFIXO}` };
  const ids = {};

  before(async () => {
    const disciplina = await criarDisciplina({ codigo: CODIGO, nome: "Desempenho" });
    for (const [chave, titulo] of Object.entries(titulos)) {
      ids[chave] = (await criarAtividade({ titulo, disciplinaId: disciplina.id })).id;
    }
    await alterarStatus(ids.prova, "concluida");
    await alterarStatus(ids.trabalho, "concluida");

    driver = await criarDriver();
    await entrar(driver, ADMIN);
  });

  after(async () => {
    await driver?.quit();
    await excluirDisciplinas(CODIGO); // remove em cascata as atividades e notas criadas
  });

  it("oferece apenas atividades concluídas e ainda sem nota", async () => {
    await abrir(driver, "/avaliacoes/nova");
    const opcoes = await new Select(await aguardar(driver, "#atividadeId")).getOptions();
    const valores = await Promise.all(opcoes.map((o) => o.getAttribute("value")));
    assert.ok(valores.includes(ids.prova));
    assert.ok(valores.includes(ids.trabalho));
    assert.ok(!valores.includes(ids.pendente), "atividade pendente não pode receber nota");
  });

  it("valida atividade, peso e nota", async () => {
    await registrarNota(driver, { peso: "", nota: "11" });
    await porTestId(driver, "form-erro");
    assert.equal(await (await porTestId(driver, "erro-atividadeId")).getText(), "Escolha a atividade.");
    assert.equal(await (await porTestId(driver, "erro-peso")).getText(), "Informe o peso.");
    assert.equal(await (await porTestId(driver, "erro-nota")).getText(), "A nota deve estar entre 0 e 10.");
  });

  it("registra notas e calcula a média ponderada da disciplina", async () => {
    await registrarNota(driver, { atividadeId: ids.prova, peso: "2", nota: "8" });
    await aguardarUrl(driver, /\/avaliacoes$/);
    await registrarNota(driver, { atividadeId: ids.trabalho, peso: "1", nota: "5" });
    await aguardarUrl(driver, /\/avaliacoes$/);

    const linha = await aguardar(driver, linhaAvaliacao(titulos.prova));
    assert.equal(await textoEm(linha, "avaliacao-peso"), "2");
    assert.equal(await textoEm(linha, "avaliacao-nota"), "8");
    // (8 × 2 + 5 × 1) / (2 + 1) = 7
    assert.equal(await mediaDaDisciplina(driver), "7");
  });

  it("altera a nota e recalcula a média", async () => {
    await abrir(driver, "/avaliacoes");
    await (await (await aguardar(driver, linhaAvaliacao(titulos.trabalho))).findElement(By.css(seletorTestId("botao-editar")))).click();
    await porTestId(driver, "avaliacao-form");
    await preencher(driver, "nota", "8");
    await clicar(driver, "botao-salvar");

    await aguardarUrl(driver, /\/avaliacoes$/);
    // (8 × 2 + 8 × 1) / 3 = 8
    await driver.wait(async () => (await mediaDaDisciplina(driver)) === "8", TIMEOUT);
  });

  it("impede reabrir uma atividade que já tem nota", async () => {
    await abrir(driver, "/atividades");
    const linha = await aguardar(driver, `[data-testid="atividade-linha"][data-titulo="${titulos.prova}"]`);
    await new Select(await linha.findElement(By.css(seletorTestId("atividade-status")))).selectByValue("pendente");
    await driver.wait(async () => (await linha.getText()).includes("Exclua a avaliação antes de reabri-la"), TIMEOUT);
  });

  it("exclui a nota somente após confirmação", async () => {
    await abrir(driver, "/avaliacoes");
    const botaoExcluir = async () =>
      (await aguardar(driver, linhaAvaliacao(titulos.trabalho))).findElement(By.css(seletorTestId("botao-excluir")));

    await (await botaoExcluir()).click();
    await clicar(driver, "cancelar-exclusao");
    await aguardar(driver, linhaAvaliacao(titulos.trabalho));

    await (await botaoExcluir()).click();
    await clicar(driver, "confirmar-exclusao");
    await aguardarAusencia(driver, linhaAvaliacao(titulos.trabalho));
    // Só resta a prova (nota 8).
    await driver.wait(async () => (await mediaDaDisciplina(driver)) === "8", TIMEOUT);
  });
});
