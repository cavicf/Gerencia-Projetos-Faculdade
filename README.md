# Trabalho Final — Gerência de Projetos de Software

Repositório destinado ao trabalho final da disciplina de **Gerência de Projetos de Software**, desenvolvido de forma incremental em cinco releases. O projeto contempla análise de requisitos, planejamento, implementação, testes automatizados e gerência de configuração.

## Objetivos

- Documentar os requisitos e estimar o tamanho do sistema.
- Planejar e acompanhar o cronograma de desenvolvimento.
- Manter a rastreabilidade bidirecional dos requisitos.
- Implementar funcionalidades CRUD e relatórios de forma incremental.
- Automatizar testes utilizando **Selenium**.
- Versionar documentos e código-fonte utilizando **Git**.
- Registrar baselines por meio de **tags** ao final das releases.

## Documentação

| Sigla | Documento |
| --- | --- |
| **DRE** | Documento de Requisitos |
| **EST** | Estimativa de Tamanho |
| **CRO** | Cronograma |
| **MRB** | Matriz de Rastreabilidade Bidirecional |

O DRE e o Cronograma devem ser atualizados durante o projeto, sempre que necessário, e permanecer sob controle de versão.

## Releases

| Release | Aulas | Entregas principais |
| --- | --- | --- |
| **00** | 18–19 | DRE, EST, CRO, MRB, branch de análise e revisão cruzada |
| **01** | 20–21 | Implementação de 2 CRUDs, testes Selenium e baseline |
| **02** | 22–23 | Implementação de mais 2 CRUDs, testes Selenium e baseline |
| **03** | 24–25 | Implementação de relatórios, testes Selenium e baseline |
| **04** | 26–27 | Continuação da implementação de relatórios, testes Selenium e baseline |

### Release 00 — Análise e planejamento

- Elaborar os documentos DRE, EST, CRO e MRB.
- Criar a primeira branch de análise e versionar os documentos.
- Entregar os documentos em sala.
- Elaborar relatório de revisão cruzada de outro grupo, analisando **DRE**, **DRE × EST** e **DRE × CRO**.

### Release 01 — Primeiros CRUDs

- Implementar **2 CRUDs**.
- Automatizar os testes dos CRUDs com **Selenium**.
- Manter código-fonte, DRE e Cronograma atualizados na branch em andamento.
- Criar a tag de baseline da release.
- Apresentar os resultados ao professor.

### Release 02 — Novos CRUDs

- Implementar **mais 2 CRUDs**.
- Automatizar os testes dos CRUDs com **Selenium**.
- Manter código-fonte, DRE e Cronograma atualizados na branch em andamento.
- Criar a tag de baseline da release.
- Apresentar os resultados ao professor.

### Release 03 — Relatórios

- Implementar **relatórios** do sistema.
- Executar e manter testes automatizados dos CRUDs com **Selenium**.
- Manter código-fonte, DRE e Cronograma atualizados na branch em andamento.
- Criar a tag de baseline da release.
- Apresentar os resultados ao professor.

### Release 04 — Continuação dos relatórios

- Implementar **relatórios** do sistema.
- Executar e manter testes automatizados dos CRUDs com **Selenium**.
- Manter código-fonte, DRE e Cronograma atualizados na branch em andamento.
- Criar a tag de baseline da release.
- Apresentar os resultados ao professor.

## Organização do repositório

```text
.
├── analysis/          # DRE, EST, CRO, MRB, Plano de Projeto e análises das releases
├── apps/
│   ├── api/           # Back-end Node.js + Express (dados em arquivos JSON)
│   └── web/           # Front-end Next.js (App Router) + Tailwind CSS
├── packages/
│   └── shared/        # Tipos de domínio e constantes compartilhados
├── tests/
│   └── selenium/      # Testes automatizados com Selenium WebDriver
└── README.md
```

A análise das Releases 01 e 02 (escopo, regras de negócio, API, telas, testes e inconsistências encontradas) está em [`analysis/ANALISE_RELEASES_01_02.md`](analysis/ANALISE_RELEASES_01_02.md).

## Como executar

### Pré-requisitos

- **Node.js 20 ou superior** (com npm) — confira com `node -v`.
- **Google Chrome** instalado — usado pelos testes Selenium. O driver do Chrome é baixado automaticamente pelo Selenium na primeira execução.
- Portas **3000** (front-end) e **3333** (API) livres.

### Passo a passo

1. Clone o repositório e entre na pasta:

   ```bash
   git clone https://github.com/cavicf/Gerencia-Projetos-Faculdade.git
   cd Gerencia-Projetos-Faculdade
   ```

2. Instale as dependências de todos os pacotes (front-end, API, tipos compartilhados e testes):

   ```bash
   npm install
   ```

3. Crie os dados iniciais. O comando copia os dados mockados de `apps/api/data/seed/` para `apps/api/data/db/`, de onde a API lê e grava:

   ```bash
   npm run seed
   ```

4. Suba a API e o front-end juntos:

   ```bash
   npm run dev
   ```

   - Front-end: <http://localhost:3000>
   - API: <http://localhost:3333/api/health>

5. Acesse <http://localhost:3000> e entre com o usuário administrador:

   | E-mail | Senha |
   | --- | --- |
   | `admin@unifei.edu.br` | `12345678` |

   O administrador é o único usuário do sistema e tem acesso a todos os cadastros. Na tela **Usuários** é possível apenas editá-lo (nome, e-mail e senha); não há cadastro nem exclusão de usuários. Todas as telas, exceto `/login`, exigem login.

Para voltar ao estado inicial dos dados a qualquer momento, rode `npm run seed` novamente (com ou sem a aplicação rodando).

### Testes automatizados (Selenium)

Os testes usam a aplicação real, então **a API e o front-end precisam estar rodando** (passo 4) em outro terminal. Recomenda-se rodar `npm run seed` antes, para partir dos dados iniciais. Cada teste cria e remove os próprios dados e, ao final, o administrador volta à senha `12345678`.

**Modo headless** (sem abrir janela, mais rápido — ideal para conferir tudo de uma vez):

```bash
npm run test:e2e
```

**Modo navegador** (abre o Chrome e pausa entre as ações, para acompanhar os testes na tela):

```bash
npm run test:e2e:navegador
```

A velocidade do modo navegador é configurada em `tests/selenium/navegador.env` (`PAUSA_MS`, em milissegundos). Ao final, os dois modos mostram o total de testes aprovados (`ℹ pass`) e reprovados (`ℹ fail`).

Se o front-end ou a API estiverem em outras portas, informe as URLs:

```bash
WEB_URL=http://localhost:3010 API_URL=http://localhost:3333 npm run test:e2e
```

| Arquivo (`tests/selenium/specs/`) | Casos de teste |
| --- | --- |
| `smoke.test.mjs` | Aplicação no ar, totais da tela inicial e navegação |
| `disciplinas.test.mjs` | CT-01 a CT-03 — Manter Disciplinas |
| `atividades.test.mjs` | CT-04 a CT-07 — Manter Atividades |
| `avaliacoes.test.mjs` | CT-08 — Manter Avaliações |
| `usuarios.test.mjs` | CT-14 — Edição do usuário administrador |
| `auth.test.mjs` | CT-15 — Login, logout e rotas protegidas |

### Outros comandos

| Comando | Descrição |
| --- | --- |
| `npm run dev:api` / `npm run dev:web` | Sobe apenas a API ou apenas o front-end |
| `npm run seed` | Restaura os dados iniciais |
| `npm run typecheck` | Verifica os tipos de todos os pacotes |
| `npm run lint` | ESLint do front-end |
| `npm run build` | Build de produção do front-end |

As variáveis de ambiente opcionais estão em `apps/api/.env.example` e `apps/web/.env.example`.

### Dados mockados

Não há banco de dados nesta fase: os dados ficam em arquivos JSON. `apps/api/data/seed/` é versionado e `apps/api/data/db/` (ignorado pelo Git) é a cópia usada pela API. A senha do usuário é guardada apenas como hash bcrypt.

## Controle de versão e baselines

Cada release deve ter seu desenvolvimento acompanhado em branch apropriada, com commits que registrem as mudanças no código e nos documentos. Ao concluir uma release, deve ser criada uma **tag** que identifique sua baseline.

| Release | Branch | Tag |
| --- | --- | --- |
| 00 | `release-00` | `v0.0-release-00` |
| 01 | `release-01` | `v0.1-release-01` |
| 02 | `release-02` | `v0.2-release-02` |
| 03 | `release-03` | `v0.3-release-03` |
| 04 | `release-04` | `v0.4-release-04` |

## Testes automatizados

Os CRUDs implementados devem ser validados com **Selenium**, cobrindo, conforme aplicável:

- Cadastro de registros.
- Consulta ou listagem.
- Atualização de registros.
- Exclusão de registros.
- Validações e fluxos principais de cada funcionalidade.

## Tecnologias

- **Git** — controle de versão.
- **Next.js 16 + React 19 + Tailwind CSS 4** — front-end.
- **Node.js + Express 5** — back-end (API REST).
- **Arquivos JSON** — persistência dos dados (sem banco de dados nesta fase).
- **TypeScript** — linguagem do front-end, do back-end e dos tipos compartilhados.
- **Selenium WebDriver** — automação de testes.

## Equipe

- Camily Victal
- Luis Gustavo Riso
- Rodolfo Alberti
- João Jacometti

## Acompanhamento

| Release | Status |
| --- | --- |
| 00 | Concluída |
| 01 | Concluída |
| 02 | Concluída |
| 03 | Pendente |
| 04 | Pendente |

