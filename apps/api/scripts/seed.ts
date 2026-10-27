// Restaura os dados de execução (data/db) a partir dos dados mockados (data/seed).
// Use antes de rodar os testes Selenium para partir sempre do mesmo estado.
import { cp, rm } from "node:fs/promises";
import { env } from "../src/config/env";

await rm(env.dataDir, { recursive: true, force: true });
await cp(env.seedDir, env.dataDir, { recursive: true });
console.log(`Dados restaurados: ${env.seedDir} -> ${env.dataDir}`);
