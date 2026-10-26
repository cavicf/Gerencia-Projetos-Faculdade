import { Builder, By, Select, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

export const BASE_URL = process.env.WEB_URL ?? "http://localhost:3000";
export const TIMEOUT = 10_000;
/** Pausa (ms) antes de cada ação, para acompanhar os testes com o navegador visível. */
const PAUSA_MS = Number(process.env.PAUSA_MS ?? 0);

const pausar = () => (PAUSA_MS > 0 ? new Promise((resolve) => setTimeout(resolve, PAUSA_MS)) : undefined);

/** Cria um Chrome controlado pelo Selenium. Use HEADLESS=false para ver o navegador. */
export async function criarDriver() {
  const opcoes = new chrome.Options().addArguments("--window-size=1280,900", "--lang=pt-BR");
  if (process.env.HEADLESS !== "false") opcoes.addArguments("--headless=new");
  return new Builder().forBrowser("chrome").setChromeOptions(opcoes).build();
}

export async function abrir(driver, caminho = "/") {
  await pausar();
  await driver.get(new URL(caminho, BASE_URL).href);
}

export const seletorTestId = (testId) => `[data-testid="${testId}"]`;

/**
 * Aguarda um elemento **visível** pelo seletor CSS.
 *
 * O Next.js faz streaming do conteúdo dentro de `<Suspense>`: o HTML chega primeiro em um
 * contêiner oculto e só depois é movido para o lugar. Por isso não basta o elemento existir.
 */
export async function aguardar(driver, css) {
  return driver.wait(
    async () => {
      for (const elemento of await driver.findElements(By.css(css))) {
        try {
          if (await elemento.isDisplayed()) return elemento;
        } catch {
          // Elemento substituído durante a renderização; tenta de novo.
        }
      }
      return null;
    },
    TIMEOUT,
    `Elemento visível não encontrado: ${css}`,
  );
}

/** Aguarda um elemento visível identificado por `data-testid`. */
export async function porTestId(driver, testId) {
  return aguardar(driver, seletorTestId(testId));
}

/** Aguarda até que nenhum elemento visível corresponda ao seletor CSS. */
export async function aguardarAusencia(driver, css) {
  await driver.wait(
    async () => {
      for (const elemento of await driver.findElements(By.css(css))) {
        try {
          if (await elemento.isDisplayed()) return false;
        } catch {
          // Elemento já removido.
        }
      }
      return true;
    },
    TIMEOUT,
    `Ainda existe: ${css}`,
  );
}

export async function aguardarUrl(driver, regex) {
  await driver.wait(until.urlMatches(regex), TIMEOUT);
}

export async function clicar(driver, testId) {
  await pausar();
  await (await porTestId(driver, testId)).click();
}

/**
 * Define o valor de um campo de forma que o React perceba a mudança.
 * (`WebElement.clear()` não dispara o `onChange` de inputs controlados.)
 */
async function definirValorNativo(driver, elemento, valor) {
  await driver.executeScript(
    `const [el, valor] = arguments;
     const prototipo = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
     Object.getOwnPropertyDescriptor(prototipo, "value").set.call(el, valor);
     el.dispatchEvent(new Event("input", { bubbles: true }));`,
    elemento,
    valor,
  );
}

/** Limpa o campo `#id` e digita o texto, como o estudante faria. */
export async function preencher(driver, id, texto) {
  await pausar();
  const campo = await aguardar(driver, `#${id}`);
  await definirValorNativo(driver, campo, "");
  if (texto) await campo.sendKeys(texto);
}

/** Preenche um `<input type="date">` com `YYYY-MM-DD` (independe do idioma do navegador). */
export async function preencherData(driver, id, data) {
  await pausar();
  await definirValorNativo(driver, await aguardar(driver, `#${id}`), data);
}

export async function selecionar(driver, id, valor) {
  await pausar();
  await new Select(await aguardar(driver, `#${id}`)).selectByValue(valor);
}

export async function valorSelecionado(driver, id) {
  return (await aguardar(driver, `#${id}`)).getAttribute("value");
}

/** Texto de um `data-testid` dentro de outro elemento. */
export async function textoEm(elemento, testId) {
  return (await elemento.findElement(By.css(seletorTestId(testId)))).getText();
}
