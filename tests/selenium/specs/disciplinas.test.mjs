// Release 01 – Manter Disciplinas (RF01–RF03): casos de teste CT-01, CT-02 e CT-03 da MRB.
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import {
  ADMIN,
  alterarStatus,
  criarAtividade,
  criarDisciplina,
  excluirDisciplinas,
  listarAtividades,
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
  textoEm,
} from "../support/driver.mjs";

const PREFIXO = `SD${SUFIXO}`;
const linha = (codigo, semestre = "2026.2") =>
  `[data-testid="disciplina-linha"][data-codigo="${codigo}"][data-semestre="${semestre}"]`;

async function cadastrarPelaTela(driver, { codigo, nome, professor, semestre }) {
  await abrir(driver, "/disciplinas");
  await clicar(driver, "nova-disciplina");
  await porTestId(driver, "disciplina-form");
  await preencher(driver, "codigo", codigo);
  await preencher(driver, "nome", nome);
  await preencher(driver, "professor", professor);
  await preencher(driver, "semestre", semestre);
  await clicar(driver, "botao-salvar");
}

describe("Manter Disciplinas", () => {
  let driver;

  before(async () => {
    driver = await criarDriver();
    await entrar(driver, ADMIN);
  });

  after(async () => {
    await driver?.quit();
    await excluirDisciplinas(PREFIXO); // remove em cascata as atividades criadas
  });

  describe("CT-01: cadastro e validação de código único por semestre", () => {
    const codigo = `${PREFIXO}A`;

    it("cadastra uma disciplina e a exibe na listagem", async () => {
      await cadastrarPelaTela(driver, {
        codigo: codigo.toLowerCase(),
        nome: "Testes Automatizados",
        professor: "Prof. Selenium",
        semestre: "2026.2",
      });

      await aguardarUrl(driver, /\/disciplinas$/);
      const registro = await aguardar(driver, linha(codigo));
      assert.equal(await textoEm(registro, "disciplina-nome"), "Testes Automatizados");
    });

    it("impede código repetido no mesmo semestre", async () => {
      await cadastrarPelaTela(driver, { codigo, nome: "Outra", professor: "Prof. X", semestre: "2026.2" });

      const erro = await porTestId(driver, "erro-codigo");
      assert.match(await erro.getText(), /já está cadastrado em 2026\.2/);
      assert.match(await driver.getCurrentUrl(), /\/disciplinas\/nova$/);
    });

    it("permite o mesmo código em outro semestre", async () => {
      await cadastrarPelaTela(driver, { codigo, nome: "Testes Automatizados", professor: "Prof. Selenium", semestre: "2027.1" });

      await aguardarUrl(driver, /\/disciplinas$/);
      await aguardar(driver, linha(codigo, "2027.1"));
    });

    it("exige todos os campos e o formato do semestre", async () => {
      await cadastrarPelaTela(driver, { codigo: "", nome: "", professor: "", semestre: "26/2" });

      await porTestId(driver, "form-erro");
      for (const campo of ["codigo", "nome", "professor"]) {
        assert.match(await (await porTestId(driver, `erro-${campo}`)).getText(), /Informe/);
      }
      assert.match(await (await porTestId(driver, "erro-semestre")).getText(), /AAAA\.1 ou AAAA\.2/);
    });
  });

  describe("CT-02: listagem e contagem de atividades vinculadas", () => {
    it("mostra a quantidade de atividades pendentes e concluídas", async () => {
      const codigo = `${PREFIXO}B`;
      const disciplina = await criarDisciplina({ codigo, nome: "Contagem" });
      const atividades = await Promise.all(
        ["Lista 1", "Lista 2", "Lista 3"].map((titulo) => criarAtividade({ titulo, disciplinaId: disciplina.id })),
      );
      await alterarStatus(atividades[0].id, "concluida");
      await alterarStatus(atividades[1].id, "em_andamento");

      await abrir(driver, "/disciplinas");
      const registro = await aguardar(driver, linha(codigo));
      assert.equal(await textoEm(registro, "disciplina-pendentes"), "2");
      assert.equal(await textoEm(registro, "disciplina-concluidas"), "1");
    });
  });

  describe("CT-03: edição e remoção com confirmação e exclusão em cascata", () => {
    it("altera os dados de uma disciplina", async () => {
      const codigo = `${PREFIXO}C`;
      await criarDisciplina({ codigo, nome: "Nome Antigo" });

      await abrir(driver, "/disciplinas");
      await (await (await aguardar(driver, linha(codigo))).findElement({ css: '[data-testid="botao-editar"]' })).click();
      await porTestId(driver, "disciplina-form");
      await preencher(driver, "nome", "Nome Novo");
      await clicar(driver, "botao-salvar");

      await aguardarUrl(driver, /\/disciplinas$/);
      await driver.wait(async () => (await textoEm(await aguardar(driver, linha(codigo)), "disciplina-nome")) === "Nome Novo", 10_000);
    });

    it("só exclui após confirmação e remove as atividades vinculadas", async () => {
      const codigo = `${PREFIXO}D`;
      const disciplina = await criarDisciplina({ codigo, nome: "Para Excluir" });
      await criarAtividade({ titulo: "Trabalho 1", disciplinaId: disciplina.id });
      await criarAtividade({ titulo: "Trabalho 2", disciplinaId: disciplina.id });

      await abrir(driver, "/disciplinas");
      const botaoExcluir = async () =>
        (await aguardar(driver, linha(codigo))).findElement({ css: '[data-testid="botao-excluir"]' });

      // Cancelar mantém a disciplina.
      await (await botaoExcluir()).click();
      const dialogo = await porTestId(driver, "dialogo-exclusao");
      assert.match(await dialogo.getText(), /2 atividades vinculadas/);
      await clicar(driver, "cancelar-exclusao");
      await aguardarAusencia(driver, '[data-testid="dialogo-exclusao"]');
      await aguardar(driver, linha(codigo));

      // Confirmar remove a disciplina e, em cascata, suas atividades.
      await (await botaoExcluir()).click();
      await clicar(driver, "confirmar-exclusao");
      await aguardarAusencia(driver, linha(codigo));
      assert.deepEqual(await listarAtividades(disciplina.id), []);
    });
  });
});
