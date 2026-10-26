import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Tipos e constantes compartilhados com a API são consumidos direto do código-fonte TS.
  transpilePackages: ["@acadflow/shared"],
  // O navegador chama /api/* no próprio front, que repassa para a API: sem CORS e com cookies
  // de sessão no mesmo domínio (Release 02).
  async rewrites() {
    return [{ source: "/api/:caminho*", destination: `${process.env.API_URL ?? "http://localhost:3333"}/api/:caminho*` }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
