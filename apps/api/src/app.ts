import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { autenticar } from "./middlewares/autenticacao";
import { rotaNaoEncontrada, tratarErros } from "./middlewares/error-handler";
import { atividadesRoutes } from "./modules/atividades/atividades.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { avaliacoesRoutes } from "./modules/avaliacoes/avaliacoes.routes";
import { disciplinasRoutes } from "./modules/disciplinas/disciplinas.routes";
import { healthRoutes } from "./modules/health/health.routes";
import { resumoRoutes } from "./modules/resumo/resumo.routes";
import { perfilRoutes } from "./modules/usuarios/usuarios.routes";

export function criarApp() {
  const app = express();

  app.use(cors({ origin: env.webOrigin, credentials: true }));
  app.use(express.json());

  // Rotas públicas.
  app.use("/api/health", healthRoutes);
  app.use("/api/auth", authRoutes);

  // A partir daqui todas exigem sessão válida (RF15).
  app.use("/api", autenticar);
  app.use("/api/resumo", resumoRoutes);
  app.use("/api/perfil", perfilRoutes);
  app.use("/api/disciplinas", disciplinasRoutes);
  app.use("/api/atividades", atividadesRoutes);
  app.use("/api/avaliacoes", avaliacoesRoutes);

  app.use(rotaNaoEncontrada);
  app.use(tratarErros);

  return app;
}
