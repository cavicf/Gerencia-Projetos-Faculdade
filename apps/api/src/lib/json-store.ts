import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { env } from "../config/env";

interface ComId {
  id: string;
}

/**
 * Coleção persistida em um arquivo JSON (`<dataDir>/<nome>.json`).
 *
 * - Escrita atômica: grava em arquivo temporário e renomeia, de modo que um
 *   encerramento inesperado nunca deixa o arquivo corrompido (RNF04).
 * - Escritas serializadas em fila, evitando que duas requisições simultâneas
 *   sobrescrevam as alterações uma da outra.
 */
export class JsonCollection<T extends ComId> {
  private readonly arquivo: string;
  private fila: Promise<unknown> = Promise.resolve();

  constructor(readonly nome: string) {
    this.arquivo = path.join(env.dataDir, `${nome}.json`);
  }

  async listar(filtro?: (item: T) => boolean): Promise<T[]> {
    const itens = await this.ler();
    return filtro ? itens.filter(filtro) : itens;
  }

  async buscar(filtro: (item: T) => boolean): Promise<T | undefined> {
    return (await this.ler()).find(filtro);
  }

  async contar(): Promise<number> {
    return (await this.ler()).length;
  }

  async inserir(dados: Omit<T, "id">): Promise<T> {
    return this.alterar((itens) => {
      const novo = { ...dados, id: randomUUID() } as T;
      itens.push(novo);
      return novo;
    });
  }

  async atualizar(id: string, dados: Partial<Omit<T, "id">>): Promise<T | undefined> {
    return this.alterar((itens) => {
      const i = itens.findIndex((item) => item.id === id);
      if (i === -1) return undefined;
      itens[i] = { ...itens[i], ...dados, id };
      return itens[i];
    });
  }

  /** Remove os itens que satisfazem o filtro e retorna quantos foram removidos. */
  async remover(filtro: (item: T) => boolean): Promise<number> {
    return this.alterar((itens) => {
      const antes = itens.length;
      const restantes = itens.filter((item) => !filtro(item));
      itens.splice(0, itens.length, ...restantes);
      return antes - restantes.length;
    });
  }

  private alterar<R>(operacao: (itens: T[]) => R): Promise<R> {
    const execucao = this.fila.then(async () => {
      const itens = await this.ler();
      const resultado = operacao(itens);
      await this.gravar(itens);
      return resultado;
    });
    this.fila = execucao.catch(() => undefined);
    return execucao;
  }

  private async ler(): Promise<T[]> {
    await garantirArquivo(this.nome);
    return JSON.parse(await readFile(this.arquivo, "utf-8")) as T[];
  }

  private async gravar(itens: T[]): Promise<void> {
    const temporario = `${this.arquivo}.${process.pid}.tmp`;
    await writeFile(temporario, JSON.stringify(itens, null, 2) + "\n", "utf-8");
    await rename(temporario, this.arquivo);
  }
}

/** Cria o arquivo da coleção a partir do seed (ou vazio) na primeira execução. */
async function garantirArquivo(nome: string): Promise<void> {
  const destino = path.join(env.dataDir, `${nome}.json`);
  if (existsSync(destino)) return;
  await mkdir(env.dataDir, { recursive: true });
  const seed = path.join(env.seedDir, `${nome}.json`);
  if (existsSync(seed)) await copyFile(seed, destino);
  else await writeFile(destino, "[]\n", "utf-8");
}
