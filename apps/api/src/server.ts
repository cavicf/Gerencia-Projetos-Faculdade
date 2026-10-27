import { criarApp } from "./app";
import { env } from "./config/env";

criarApp().listen(env.port, () => {
  console.log(`AcadFlow API em http://localhost:${env.port} (dados em ${env.dataDir})`);
});
