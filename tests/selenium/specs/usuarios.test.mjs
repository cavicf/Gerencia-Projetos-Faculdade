// Release 02 – Manter Usuário (DRE v2.0): cadastro (RFS16 / CT-14), alteração do perfil (RFS18),
// exclusão da conta (RFS19) e isolamento dos dados por aluno (RNF10).
// Cada bloco usa alunos novos, cadastrados no próprio teste, para não alterar o aluno do seed.
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { ALUNO, cadastrarAluno, clienteComo, criarDisciplina, excluirConta, excluirDisciplinas, novoAluno, SUFIXO } from "../support/api.mjs";
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
  sair,
} from "../support/driver.mjs";

const MSG_LOGIN_INVALIDO = "E-mail ou senha inválidos.";
const MSG_EMAIL_DUPLICADO = "Este e-mail já está cadastrado.";

async function cadastrarPelaTela(driver, { nome, email, senha }) {
  await sair(driver);
  await abrir(driver, "/login");
  await clicar(driver, "link-cadastro");
  await porTestId(driver, "cadastro-form");
  await preencher(driver, "nome", nome);
  await preencher(driver, "email", email);
  await preencher(driver, "senha", senha);
  await clicar(driver, "botao-cadastrar");
}

/** Tenta entrar e confirma que o acesso foi recusado. */
async function loginRecusado(driver, { email, senha }) {
  await sair(driver);
  await abrir(driver, "/login");
  await preencher(driver, "email", email);
  await preencher(driver, "senha", senha);
  await clicar(driver, "botao-entrar");
  assert.equal(await (await porTestId(driver, "form-erro")).getText(), MSG_LOGIN_INVALIDO);
}

async function textoDoErro(driver, campo) {
  return (await porTestId(driver, `erro-${campo}`)).getText();
}

describe("Manter Usuário", () => {
  let driver;

  before(async () => {
    driver = await criarDriver();
  });

  after(async () => {
    await driver?.quit();
  });

  describe("CT-14 (RFS16): cadastro com e-mail único e senha mínima", () => {
    const aluno = novoAluno("cadastro");

    after(() => excluirConta(aluno));

    it("valida nome, e-mail e senha com menos de 8 caracteres", async () => {
      await cadastrarPelaTela(driver, { nome: "", email: "invalido", senha: "1234567" });
      await porTestId(driver, "form-erro");
      assert.equal(await textoDoErro(driver, "nome"), "Informe o nome.");
      assert.equal(await textoDoErro(driver, "email"), "Informe um e-mail válido.");
      assert.equal(await textoDoErro(driver, "senha"), "A senha deve ter pelo menos 8 caracteres.");
    });

    it("recusa e-mail já cadastrado, sem diferenciar maiúsculas", async () => {
      await cadastrarPelaTela(driver, { nome: "Outro Aluno", email: ALUNO.email.toUpperCase(), senha: "senha-valida" });
      assert.equal(await (await porTestId(driver, "form-erro")).getText(), MSG_EMAIL_DUPLICADO);
      assert.equal(await textoDoErro(driver, "email"), MSG_EMAIL_DUPLICADO);
    });

    it("cadastra o aluno, exibe a confirmação e permite entrar com a nova conta", async () => {
      await cadastrarPelaTela(driver, aluno);
      await porTestId(driver, "cadastro-sucesso");
      await clicar(driver, "ir-para-login");
      await aguardarUrl(driver, /\/login$/);

      await entrar(driver, aluno);
      assert.equal(await (await porTestId(driver, "usuario-logado")).getText(), aluno.nome);
    });
  });

  describe("RFS18: alteração do perfil confirmada pela senha atual", () => {
    const aluno = novoAluno("perfil");
    const NOVA_SENHA = "nova-senha-123";

    async function salvarPerfil(campos) {
      await abrir(driver, "/perfil");
      await porTestId(driver, "perfil-form");
      for (const [campo, valor] of Object.entries(campos)) await preencher(driver, campo, valor);
      await clicar(driver, "botao-salvar");
    }

    before(async () => {
      await cadastrarAluno(aluno);
      await entrar(driver, aluno);
    });

    after(() => excluirConta({ ...aluno, senha: NOVA_SENHA }));

    it("exige a senha atual e recusa senha incorreta", async () => {
      await salvarPerfil({ nome: "Sem Senha", senhaAtual: "" });
      assert.equal(await textoDoErro(driver, "senhaAtual"), "Informe a senha atual.");

      await salvarPerfil({ nome: "Senha Errada", senhaAtual: "senha-errada" });
      assert.equal(await textoDoErro(driver, "senhaAtual"), "Senha atual incorreta.");
    });

    it("exige que a confirmação seja igual à nova senha", async () => {
      await salvarPerfil({ novaSenha: NOVA_SENHA, confirmacaoSenha: "outra-senha-123", senhaAtual: aluno.senha });
      assert.equal(await textoDoErro(driver, "confirmacaoSenha"), "A confirmação deve ser igual à nova senha.");
    });

    it("não aceita o e-mail de outro usuário", async () => {
      await salvarPerfil({ email: ALUNO.email, novaSenha: "", confirmacaoSenha: "", senhaAtual: aluno.senha });
      assert.equal(await textoDoErro(driver, "email"), MSG_EMAIL_DUPLICADO);
    });

    it("altera nome e senha; a senha antiga deixa de valer", async () => {
      await salvarPerfil({
        nome: "Aluno Renomeado",
        email: aluno.email,
        novaSenha: NOVA_SENHA,
        confirmacaoSenha: NOVA_SENHA,
        senhaAtual: aluno.senha,
      });
      await porTestId(driver, "perfil-salvo");
      await driver.wait(async () => (await (await porTestId(driver, "usuario-logado")).getText()) === "Aluno Renomeado");

      await loginRecusado(driver, aluno);
      await entrar(driver, { email: aluno.email, senha: NOVA_SENHA });
    });
  });

  describe("RFS19: exclusão da própria conta", () => {
    const aluno = novoAluno("exclusao");
    const CODIGO = `EX${SUFIXO}`;

    async function abrirDialogo() {
      await abrir(driver, "/perfil");
      await clicar(driver, "excluir-conta");
      await porTestId(driver, "dialogo-excluir-conta");
    }

    before(async () => {
      const cliente = await cadastrarAluno(aluno);
      const disciplina = await cliente.chamar("POST", "/disciplinas", {
        codigo: CODIGO,
        nome: "Disciplina da conta excluída",
        professor: "Prof. Selenium",
        semestre: "2026.2",
      });
      await cliente.chamar("POST", "/atividades", { titulo: "Atividade da conta excluída", dataEntrega: "2026-12-01", disciplinaId: disciplina.id });
      await entrar(driver, aluno);
    });

    after(() => excluirConta(aluno));

    it("cancelar não remove nada", async () => {
      await abrirDialogo();
      await clicar(driver, "cancelar-exclusao");
      await aguardarAusencia(driver, '[data-testid="dialogo-excluir-conta"]');
      await abrir(driver, "/disciplinas");
      await aguardar(driver, `[data-testid="disciplina-linha"][data-codigo="${CODIGO}"]`);
    });

    it("recusa a exclusão com senha incorreta", async () => {
      await abrirDialogo();
      await preencher(driver, "senhaExclusao", "senha-errada");
      await clicar(driver, "confirmar-exclusao");
      assert.equal(await textoDoErro(driver, "senhaExclusao"), "Senha atual incorreta.");
      await clicar(driver, "cancelar-exclusao");
    });

    it("remove a conta e os dados, encerra a sessão e libera o e-mail", async () => {
      await abrirDialogo();
      await preencher(driver, "senhaExclusao", aluno.senha);
      await clicar(driver, "confirmar-exclusao");
      await aguardarUrl(driver, /\/login$/);

      // A sessão foi encerrada e a conta não existe mais.
      await abrir(driver, "/disciplinas");
      await aguardarUrl(driver, /\/login$/);
      await loginRecusado(driver, aluno);

      // O e-mail pode ser usado em um novo cadastro, que começa sem as disciplinas da conta antiga.
      const novaConta = await cadastrarAluno(aluno);
      assert.deepEqual(await novaConta.chamar("GET", "/disciplinas"), []);
      assert.deepEqual(await novaConta.chamar("GET", "/atividades"), []);
    });
  });

  describe("RNF10: cada aluno acessa apenas os próprios dados", () => {
    const outro = novoAluno("isolamento");
    const CODIGO = `IS${SUFIXO}`;
    let disciplina;

    before(async () => {
      disciplina = await criarDisciplina({ codigo: CODIGO, nome: "Disciplina do aluno do seed" });
      await cadastrarAluno(outro);
      await entrar(driver, outro);
    });

    after(async () => {
      await excluirConta(outro);
      await excluirDisciplinas(CODIGO);
    });

    it("não lista as disciplinas de outro aluno", async () => {
      await abrir(driver, "/disciplinas");
      await porTestId(driver, "estado-vazio");
      await aguardarAusencia(driver, `[data-testid="disciplina-linha"][data-codigo="${CODIGO}"]`);
    });

    it("a API responde 404 ao acessar ou alterar registros de outro aluno", async () => {
      const cliente = await clienteComo(outro);
      assert.equal((await cliente.requisitar("GET", `/disciplinas/${disciplina.id}`)).status, 404);
      assert.equal((await cliente.requisitar("DELETE", `/disciplinas/${disciplina.id}`)).status, 404);
    });
  });
});
