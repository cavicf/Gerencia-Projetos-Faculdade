// Release 01 – Manter Atividades Acadêmicas (RF04–RF07): casos de teste CT-04 a CT-07 da MRB.
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { By, Select } from "selenium-webdriver";
import {
  ADMIN,
  criarAtividade,
  criarDisciplina,
  excluirDisciplinas,
  obterAtividade,
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
  preencherData,
  selecionar,
  seletorTestId,
  textoEm,
  TIMEOUT,
  valorSelecionado,
} from "../support/driver.mjs";

const PREFIXO = `AT${SUFIXO}`;
const linha = (titulo) => `[data-testid="atividade-linha"][data-titulo="${titulo}"]`;

async function acaoNaLinha(driver, titulo, testId) {
  await (await (await aguardar(driver, linha(titulo))).findElement(By.css(seletorTestId(testId)))).click();
}

describe("Manter Atividades Acadêmicas", () => {
  let driver;
  let disciplinaA;
  let disciplinaB;

  before(async () => {
    disciplinaA = await criarDisciplina({ codigo: `${PREFIXO}A`, nome: "Disciplina A" });
    disciplinaB = await criarDisciplina({ codigo: `${PREFIXO}B`, nome: "Disciplina B" });
    driver = await criarDriver();
    await entrar(driver, ADMIN);
  });

  after(async () => {
    await driver?.quit();
    await excluirDisciplinas(PREFIXO); // remove em cascata as atividades criadas
  });

  describe("CT-04: cadastro com validação de campos obrigatórios", () => {
    it("cadastra uma atividade a partir da tela inicial em até 3 interações (RNF02)", async () => {
      const titulo = `Prova 1 ${SUFIXO}`;
      await abrir(driver, "/");
      await clicar(driver, "inicio-nova-atividade"); // 1. abrir o cadastro
      await porTestId(driver, "atividade-form");
      await preencher(driver, "titulo", titulo); // 2. preencher os obrigatórios
      await selecionar(driver, "disciplinaId", disciplinaA.id);
      await preencherData(driver, "dataEntrega", "2026-11-20");
      await selecionar(driver, "tipo", "prova");
      await clicar(driver, "botao-salvar"); // 3. salvar

      await aguardarUrl(driver, /\/atividades$/);
      const registro = await aguardar(driver, linha(titulo));
      assert.match(await textoEm(registro, "atividade-disciplina"), new RegExp(`${PREFIXO}A`));
      assert.match(await registro.getText(), /20\/11\/2026/);
      assert.match(await registro.getText(), /Prova/);
    });

    it("informa título, data de entrega e disciplina obrigatórios", async () => {
      await abrir(driver, "/atividades/nova");
      await porTestId(driver, "atividade-form");
      await clicar(driver, "botao-salvar");

      await porTestId(driver, "form-erro");
      assert.equal(await (await porTestId(driver, "erro-titulo")).getText(), "Informe o título.");
      assert.equal(await (await porTestId(driver, "erro-dataEntrega")).getText(), "Informe a data de entrega.");
      assert.equal(await (await porTestId(driver, "erro-disciplinaId")).getText(), "Escolha a disciplina.");
      assert.match(await driver.getCurrentUrl(), /\/atividades\/nova$/);
    });
  });

  describe("CT-05: transição de status e registro automático da data de conclusão", () => {
    it("registra a data ao concluir e a remove ao reabrir", async () => {
      const titulo = `Lista ${SUFIXO}`;
      const atividade = await criarAtividade({ titulo, disciplinaId: disciplinaA.id });
      assert.equal(atividade.status, "pendente");

      await abrir(driver, "/atividades");
      const statusDaLinha = async () =>
        (await aguardar(driver, linha(titulo))).findElement(By.css(seletorTestId("atividade-status")));

      await new Select(await statusDaLinha()).selectByValue("concluida");
      await aguardar(driver, `${linha(titulo)} ${seletorTestId("data-conclusao")}`);
      const concluida = await obterAtividade(atividade.id);
      assert.equal(concluida.status, "concluida");
      assert.ok(concluida.dataConclusao, "dataConclusao deve ser preenchida");

      await new Select(await statusDaLinha()).selectByValue("pendente");
      await aguardarAusencia(driver, `${linha(titulo)} ${seletorTestId("data-conclusao")}`);
      const reaberta = await obterAtividade(atividade.id);
      assert.equal(reaberta.status, "pendente");
      assert.equal(reaberta.dataConclusao, null);
    });

    it("permite marcar como em andamento", async () => {
      const titulo = `Seminario ${SUFIXO}`;
      const atividade = await criarAtividade({ titulo, disciplinaId: disciplinaA.id });

      await abrir(driver, "/atividades");
      const select = await (await aguardar(driver, linha(titulo))).findElement(By.css(seletorTestId("atividade-status")));
      await new Select(select).selectByValue("em_andamento");
      await driver.wait(async () => (await obterAtividade(atividade.id)).status === "em_andamento", TIMEOUT);
    });
  });

  describe("CT-06: atribuição de prioridade e padrão 'média'", () => {
    it("usa prioridade média quando o estudante não escolhe", async () => {
      const titulo = `Tarefa padrao ${SUFIXO}`;
      await abrir(driver, "/atividades/nova");
      await porTestId(driver, "atividade-form");
      // Prioridade em botões (Guia de Design): a opção marcada é um radio visualmente oculto.
      assert.ok(await driver.findElement(By.css("#prioridade-media")).isSelected());

      await preencher(driver, "titulo", titulo);
      await selecionar(driver, "disciplinaId", disciplinaA.id);
      await preencherData(driver, "dataEntrega", "2026-11-21");
      await clicar(driver, "botao-salvar");

      await aguardarUrl(driver, /\/atividades$/);
      assert.equal(await textoEm(await aguardar(driver, linha(titulo)), "atividade-prioridade"), "Média");
    });

    it("grava a prioridade escolhida", async () => {
      const titulo = `Tarefa urgente ${SUFIXO}`;
      await abrir(driver, "/atividades/nova");
      await porTestId(driver, "atividade-form");
      await preencher(driver, "titulo", titulo);
      await selecionar(driver, "disciplinaId", disciplinaA.id);
      await preencherData(driver, "dataEntrega", "2026-11-22");
      await clicar(driver, "prioridade-alta");
      await clicar(driver, "botao-salvar");

      await aguardarUrl(driver, /\/atividades$/);
      assert.equal(await textoEm(await aguardar(driver, linha(titulo)), "atividade-prioridade"), "Alta");
    });
  });

  describe("CT-07: alteração de disciplina vinculada e exclusão mediante confirmação", () => {
    it("altera os dados e troca a disciplina da atividade", async () => {
      const titulo = `Relatorio ${SUFIXO}`;
      const novoTitulo = `Relatorio final ${SUFIXO}`;
      await criarAtividade({ titulo, disciplinaId: disciplinaA.id });

      await abrir(driver, "/atividades");
      await acaoNaLinha(driver, titulo, "botao-editar");
      await porTestId(driver, "atividade-form");
      assert.equal(await valorSelecionado(driver, "disciplinaId"), disciplinaA.id);

      await preencher(driver, "titulo", novoTitulo);
      await selecionar(driver, "disciplinaId", disciplinaB.id);
      await clicar(driver, "botao-salvar");

      await aguardarUrl(driver, /\/atividades$/);
      const registro = await aguardar(driver, linha(novoTitulo));
      assert.match(await textoEm(registro, "atividade-disciplina"), new RegExp(`${PREFIXO}B`));
      await aguardarAusencia(driver, linha(titulo));
    });

    it("só exclui após confirmação", async () => {
      const titulo = `Excluir ${SUFIXO}`;
      await criarAtividade({ titulo, disciplinaId: disciplinaA.id });

      await abrir(driver, "/atividades");
      await acaoNaLinha(driver, titulo, "botao-excluir");
      await clicar(driver, "cancelar-exclusao");
      await aguardarAusencia(driver, seletorTestId("dialogo-exclusao"));
      await aguardar(driver, linha(titulo));

      await acaoNaLinha(driver, titulo, "botao-excluir");
      await clicar(driver, "confirmar-exclusao");
      await aguardarAusencia(driver, linha(titulo));
    });
  });
});
