import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

export const BASE_URL = process.env.WEB_URL ?? "http://localhost:3000";
const TIMEOUT = 10_000;

/** Cria um Chrome controlado pelo Selenium. Use HEADLESS=false para ver o navegador. */
export async function criarDriver() {
  const opcoes = new chrome.Options().addArguments("--window-size=1280,900", "--lang=pt-BR");
  if (process.env.HEADLESS !== "false") opcoes.addArguments("--headless=new");
  return new Builder().forBrowser("chrome").setChromeOptions(opcoes).build();
}

export async function abrir(driver, caminho = "/") {
  await driver.get(new URL(caminho, BASE_URL).href);
}

/** Aguarda um elemento identificado por `data-testid`. */
export async function porTestId(driver, testId) {
  return driver.wait(until.elementLocated(By.css(`[data-testid="${testId}"]`)), TIMEOUT);
}
