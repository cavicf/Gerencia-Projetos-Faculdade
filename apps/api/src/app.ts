import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { rotaNaoEncontrada, tratarErros } from "./middlewares/error-handler";
import { usuarioAtual } from "./middlewares/usuario-atual";
import { atividadesRoutes } from "./modules/atividades/atividades.routes";
import { disciplinasRoutes } from "./modules/disciplinas/disciplinas.routes";
import { healthRoutes } from "./modules/health/health.routes";

export function criarApp() {
  const app = express();

  app.use(cors({ origin: env.webOrigin, credentials: true }));
  app.use(express.json());

  app.use("/api/health", healthRoutes);

  // Rotas dos módulos (a partir daqui todas exigem um usuário — RNF10):
  app.use("/api", usuarioAtual);
  app.use("/api/disciplinas", disciplinasRoutes);
  app.use("/api/atividades", atividadesRoutes);
  // Release 02: app.use("/api/avaliacoes", avaliacoesRoutes);
  // Release 02: app.use("/api/auth", authRoutes); app.use("/api/usuarios", usuariosRoutes);

  app.use(rotaNaoEncontrada);
  app.use(tratarErros);

  return app;
}
