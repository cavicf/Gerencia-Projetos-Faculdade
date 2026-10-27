import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raizApi = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const arquivoEnv = path.join(raizApi, ".env");
if (existsSync(arquivoEnv)) process.loadEnvFile(arquivoEnv);

export const env = {
  port: Number(process.env.PORT ?? 3333),
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
  dataDir: path.resolve(raizApi, process.env.DATA_DIR ?? "data/db"),
  seedDir: path.join(raizApi, "data/seed"),
};
