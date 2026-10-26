# Análise das Releases 01 e 02 — AcadFlow

> Documento de preparação para a implementação. Fontes: DRE v1.0 (`GPR-2026-01 –Documento_de_Requisitos_AcadFlow_v1.0.docx-1.pdf`), Cronograma (`CRO_Projeto_Final_V2_SDES06.pod`), MRB (`Matriz_de_Rastreabilidade_AcadFlow(1).xlsx`) e Plano de Projeto (`Plano_de_Projeto_AcadFlow_Release00.pdf`).
>
> Branch: `feat/initial-releases` · Data da análise: 26/10/2026

## 1. Situação do cronograma

| Release | Início (CRO) | Entrega (CRO) | Escopo | Responsáveis |
| --- | --- | --- | --- | --- |
| 01 | 16/10/2026 | 22/10/2026 | Manter Disciplinas [RFC01] | Camily, Luis |
| 01 | 16/10/2026 | 22/10/2026 | Manter Atividades Acadêmicas [RFC02] | João, Rodolfo |
| 02 | 23/10/2026 | 29/10/2026 | Manter Avaliações (RF08) | Camily, Luis |
| 02 | 23/10/2026 | 29/10/2026 | Manter Usuários (RF14/RF15) | João, Rodolfo |

**Atenção:** pelo CRO a Release 01 já deveria ter sido entregue em 22/10 e a Release 02 está em andamento (entrega 29/10). Hoje (26/10) a Release 01 está com **2 dias úteis de atraso**. O critério de ação corretiva do Plano de Projeto (seção 5) é atraso acumulado **> 5 dias úteis**, então ainda não é obrigatório replanejar, mas o CRO precisa ser atualizado com as datas reais (exigência do README: "DRE e Cronograma atualizados na branch em andamento").

## 2. Escopo da Release 01

### 2.1 Manter Disciplinas [RFC01] — Camily, Luis

| Tarefa do CRO | Requisito | Prioridade | Caso de teste (MRB) | Regras de negócio |
| --- | --- | --- | --- | --- |
| Inserir disciplina | RF01 | Essencial | CT-01 | Campos: código, nome, professor, semestre. **Código único por (estudante, semestre)** — comparar sem diferenciar maiúsculas/espaços. |
| Consultar disciplinas | RF02 | Essencial | CT-02 | Lista com nome, semestre e **contagem de atividades pendentes e concluídas** (pendente = status ≠ `concluida`). |
| Alterar disciplina | RF03 | Importante | CT-03 | Reaplica a regra de unicidade do RF01 (ignorando a própria disciplina). |
| Excluir disciplina | RF03 | Importante | CT-03 | **Confirmação explícita** informando que as atividades vinculadas serão removidas → exclusão em cascata (atividades **e** avaliações dessas atividades). |
| Testar / Ajustar | — | — | CT-01..03 | Selenium. |

### 2.2 Manter Atividades Acadêmicas [RFC02] — João, Rodolfo

| Tarefa do CRO | Requisito | Prioridade | Caso de teste (MRB) | Regras de negócio |
| --- | --- | --- | --- | --- |
| Inserir atividade | RF04 | Essencial | CT-04 | Título, descrição, tipo (`prova`/`trabalho`/`tarefa`), data de entrega, disciplina. **Obrigatórios: título, data de entrega, disciplina.** Status inicial `pendente`. |
| Definir prioridade | RF06 | Importante | CT-06 | `alta`/`media`/`baixa`; **padrão `media`** quando não informada. |
| Consultar / alterar status | RF05 | Essencial | CT-05 | `pendente` ↔ `em_andamento` ↔ `concluida`. Ao concluir, grava `dataConclusao` automaticamente; ao sair de `concluida`, limpa a data. |
| Alterar atividade | RF07 | Importante | CT-07 | Permite **trocar a disciplina** (que deve pertencer ao mesmo estudante). |
| Excluir atividade | RF07 | Importante | CT-07 | Mediante confirmação; remove também a avaliação vinculada. |
| Testar / Ajustar | — | — | CT-04..07 | Selenium. |

RNFs que já se aplicam: **RNF01** (interface em português), **RNF02** (cadastro de atividade em ≤ 3 interações a partir da tela inicial — botão "Nova atividade" visível no início + formulário curto), **RNF04** (persistência atômica), **RNF05** (validação + mensagens claras), **RNF10** (isolamento por usuário).

## 3. Escopo da Release 02

### 3.1 Manter Avaliações — Camily, Luis

| Tarefa do CRO | Requisito | Prioridade | Caso de teste | Regras de negócio |
| --- | --- | --- | --- | --- |
| Inserir avaliação, nota e peso | RF08 | Desejável | CT-08 | Somente para atividade com status `concluida`. Uma avaliação por atividade. Nota 0–10; peso > 0. |
| Consultar avaliação | RF08 | Desejável | CT-08 | Listagem por disciplina com **média ponderada** (Σ nota·peso / Σ peso) — "acompanhar seu desempenho em cada disciplina". |
| Alterar / Excluir avaliação | RF08 | Desejável | CT-08 | Exclusão mediante confirmação. |

### 3.2 Manter Usuários — João, Rodolfo

| Tarefa do CRO | Requisito | Prioridade | Caso de teste | Regras de negócio |
| --- | --- | --- | --- | --- |
| Inserir usuário | RF14 | Essencial | CT-14 | Nome, e-mail, senha. **E-mail único** (sem diferenciar maiúsculas); **senha ≥ 8 caracteres**; senha guardada só como hash bcrypt (RNF09). |
| Consultar / Alterar / Excluir usuário | RF14* | — | — | Ver inconsistência I-1 abaixo. Proposta: "Meu perfil" (o próprio estudante vê/edita seus dados e exclui a conta, removendo todos os seus registros). |
| Logar / Autenticar | RF15 | Essencial | CT-15 | Login por e-mail + senha; mensagem genérica em caso de erro ("E-mail ou senha inválidos"). |
| Encerrar sessão | RF15 | Essencial | CT-15 | Logout invalida o cookie. **Nenhuma rota de cadastro/consulta acessível sem autenticação** (API responde 401; front redireciona para `/login`). |

## 4. Inconsistências encontradas (DRE × CRO × MRB × Plano)

Recomenda-se registrar como solicitação de mudança (DRE, seção 6) e versionar DRE/CRO/MRB.

| ID | Onde | Inconsistência | Sugestão |
| --- | --- | --- | --- |
| I-1 | DRE × CRO | O CRO prevê **Consultar/Alterar/Excluir Usuário**, mas o RF14 do DRE só trata do cadastro. É escopo extra sem requisito. | Incluir no DRE um requisito "Manter perfil do usuário" (ou remover as tarefas do CRO). Atualizar a MRB. |
| I-2 | Plano × CRO | O risco R02 do Plano manda entregar antes os essenciais **RF01, RF04, RF09, RF14, RF15**, mas o CRO coloca RF14/RF15 só na Release 02 e **RF09 (essencial, tela inicial) na Release 04**, enquanto RF08 (desejável) entra na Release 02. | Manter a ordem do CRO (já aprovado), mas registrar a justificativa; ou trazer RF09 para antes. |
| I-3 | DRE × CRO | RF15 diz que nada é acessível sem autenticação e RNF10 exige isolamento, mas a autenticação só chega na Release 02. | **Decisão técnica adotada:** todos os registros já nascem com `usuarioId` e toda consulta filtra por ele; na Release 01 um middleware fixa o "usuário de desenvolvimento" do seed. Na Release 02 o middleware passa a ler a sessão — os CRUDs da Release 01 não mudam. |
| I-4 | Plano / MRB | Esforço total aparece como **120 h** (seção 6 e tabela da seção 7), mas como **1.200 horas** no texto da seção 7 e na MRB; o risco R01 cita "fase de Implementação (600h)" enquanto a tabela diz 60 h. | Padronizar em 120 h / 60 h. |
| I-5 | CRO | A tarefa "Ajuste Manter Avaliação" está **sem responsável**. | Atribuir a Camily/Luis. |
| I-6 | DRE | Seção 6 cita "Equipe **CLRJ**"; o resto do documento usa "CRLJ". | Corrigir na próxima versão. |
| I-7 | DRE | RF04/RNF05 não dizem se data de entrega no passado é válida. | Aceitar qualquer data de calendário válida (necessário para cadastrar atividades já atrasadas — RF11). Rejeitar datas inexistentes/formato inválido. |
| I-8 | DRE | RF08 fala em "peso da avaliação" sem escala; CT-08 fala em "cálculo de desempenho". | Definir nota 0–10, peso numérico > 0 e média ponderada por disciplina. |

## 5. Arquitetura adotada

```text
.
├── apps/
│   ├── api/                  # Back-end Node.js + Express 5 (TypeScript via tsx)
│   │   ├── data/seed/        # Dados mockados versionados (JSON)
│   │   ├── data/db/          # Dados de execução (gerados do seed, fora do Git)
│   │   ├── scripts/          # seed.ts (restaura dados), hash-senha.ts
│   │   └── src/
│   │       ├── config/       # Variáveis de ambiente
│   │       ├── lib/          # json-store (persistência), db, errors
│   │       ├── middlewares/  # usuario-atual (RNF10), tratamento de erros (RNF05)
│   │       └── modules/      # Um diretório por módulo: <modulo>.routes.ts, .service.ts, .schema.ts
│   └── web/                  # Front-end Next.js 16 (App Router) + Tailwind CSS 4
│       └── src/
│           ├── app/          # Rotas (páginas finas, só compõem componentes)
│           ├── components/   # Componentes reutilizáveis (layout/, ui/)
│           ├── config/       # Navegação
│           └── lib/          # Cliente HTTP da API
├── packages/shared/          # Tipos de domínio e constantes usados pela API e pelo front
├── tests/selenium/           # Testes funcionais automatizados (selenium-webdriver + node:test)
└── analysis/                 # Artefatos de gerência (DRE, EST, CRO, MRB, Plano, esta análise)
```

- **Persistência em JSON** (`JsonCollection`): um arquivo por coleção; escrita atômica (arquivo temporário + `rename`) e fila de escrita para não perder dados em requisições simultâneas (RNF04). Na primeira execução os arquivos são copiados de `data/seed/`. `npm run seed` restaura o estado inicial (usar antes dos testes Selenium).
- **Contrato único**: tipos em `packages/shared/src/domain.ts` e valores permitidos/rótulos em `constants.ts`. Front e API importam de `@acadflow/shared`, o que permite às duplas trabalharem em paralelo.
- **Erros** sempre no formato `{ erro: { mensagem, campos? } }`, sem stack trace para o usuário (RNF05).
- **Tecnologias gratuitas/open source** (RNF15); roda em máquina dual-core/8 GB (RNF16).

## 6. Modelo de dados (arquivos JSON)

| Arquivo | Campos | Release |
| --- | --- | --- |
| `usuarios.json` | id, nome, email, senhaHash, criadoEm, atualizadoEm | 02 (já existe no seed) |
| `disciplinas.json` | id, usuarioId, codigo, nome, professor, semestre, criadoEm, atualizadoEm | 01 |
| `atividades.json` | id, usuarioId, disciplinaId, titulo, descricao, tipo, dataEntrega (`YYYY-MM-DD`), status, prioridade, dataConclusao, criadoEm, atualizadoEm | 01 |
| `avaliacoes.json` | id, usuarioId, atividadeId, peso, nota, criadoEm, atualizadoEm | 02 |

Seed: 2 estudantes (o segundo existe para testar o isolamento — RNF10), 4 disciplinas, 8 atividades (pendentes, em andamento, concluídas e uma atrasada) e 2 avaliações. Credenciais de teste estão no `README.md`.

## 7. API planejada

Base: `http://localhost:3333/api`. Todas as rotas (exceto `health` e `auth`) filtram pelo `usuarioId` da requisição.

| Método | Rota | Requisito | Release |
| --- | --- | --- | --- |
| GET | `/health` | — | pronto |
| GET | `/disciplinas` | RF02 (com contagens) | 01 |
| POST | `/disciplinas` | RF01 | 01 |
| GET | `/disciplinas/:id` | RF02 | 01 |
| PUT | `/disciplinas/:id` | RF03 | 01 |
| DELETE | `/disciplinas/:id` | RF03 (cascata) | 01 |
| GET | `/atividades?disciplinaId=` | RF04/RF05 | 01 |
| POST | `/atividades` | RF04/RF06 | 01 |
| GET | `/atividades/:id` | RF05 | 01 |
| PUT | `/atividades/:id` | RF07 | 01 |
| PATCH | `/atividades/:id/status` | RF05 | 01 |
| DELETE | `/atividades/:id` | RF07 | 01 |
| GET/POST | `/avaliacoes` | RF08 | 02 |
| GET/PUT/DELETE | `/avaliacoes/:id` | RF08 | 02 |
| GET | `/avaliacoes/desempenho` | RF08 (média por disciplina) | 02 |
| POST | `/auth/cadastro` | RF14 | 02 |
| POST | `/auth/login` · `/auth/logout` | RF15 | 02 |
| GET/PUT/DELETE | `/usuarios/me` | RF14* (I-1) | 02 |

Códigos de resposta: 200/201/204 sucesso · 400 validação (com `campos`) · 401 sem sessão · 404 inexistente **ou de outro usuário** (não revelar que o registro existe) · 409 duplicidade (código de disciplina, e-mail).

Sessão (Release 02): cookie `httpOnly` assinado (JWT ou id de sessão em `sessoes.json`) emitido pela API; o front envia com `credentials: "include"` (já configurado em `apps/web/src/lib/api.ts`).

## 8. Telas planejadas (front-end)

| Rota | Conteúdo | Release |
| --- | --- | --- |
| `/` | Início com atalhos e status da API (vira "Próximos prazos" — RF09 — na Release 04) | pronto |
| `/disciplinas` | Tabela + botão "Nova disciplina" + editar/excluir com diálogo de confirmação | 01 |
| `/disciplinas/nova`, `/disciplinas/[id]/editar` | Formulário | 01 |
| `/atividades` | Lista com troca rápida de status + "Nova atividade" | 01 |
| `/atividades/nova`, `/atividades/[id]/editar` | Formulário (prioridade pré-selecionada "Média") | 01 |
| `/avaliacoes` | Avaliações por disciplina com média ponderada | 02 |
| `/login`, `/cadastro`, `/perfil` | Autenticação e perfil | 02 |

Convenção sugerida: cada módulo em `apps/web/src/features/<modulo>/` (componentes, chamadas à API e ações), com as páginas em `src/app/` apenas compondo esses componentes. Elementos usados nos testes recebem `data-testid`.

## 9. Testes Selenium previstos

| Caso | Cenários | Release |
| --- | --- | --- |
| Smoke | Tela inicial carrega e API está online; navegação pelo menu | pronto |
| CT-01 | Cadastrar disciplina; impedir código repetido no mesmo semestre; permitir em outro semestre | 01 |
| CT-02 | Listagem mostra contagem de pendentes/concluídas correta | 01 |
| CT-03 | Editar disciplina; excluir com confirmação e verificar remoção das atividades | 01 |
| CT-04 | Cadastrar atividade; mensagens para título/data/disciplina vazios | 01 |
| CT-05 | Mudar status para concluída e verificar data de conclusão | 01 |
| CT-06 | Atividade sem prioridade informada fica "Média" | 01 |
| CT-07 | Trocar disciplina de atividade; excluir com confirmação | 01 |
| CT-08 | Registrar nota/peso apenas em atividade concluída; média ponderada | 02 |
| CT-14 | Cadastro com e-mail duplicado e senha curta rejeitados | 02 |
| CT-15 | Login, logout e redirecionamento de rota protegida sem sessão | 02 |
| RNF10 | Usuário A não acessa registro do usuário B (via URL direta) | 02 |

## 10. Gerência de configuração

- Esta branch (`feat/initial-releases`) contém a configuração inicial e a análise. Fluxo sugerido pelo README: integrar em `release-01`, criar a tag `v0.1-release-01` na entrega; depois `release-02` / `v0.2-release-02`.
- Commits descritivos no padrão *Conventional Commits* (`feat:`, `fix:`, `docs:`, `test:`, `chore:`) — RNF13.
- A cada release: atualizar CRO (datas reais), DRE (se houver mudança aprovada) e MRB.

## 11. Ordem de implementação recomendada

1. **Disciplinas (API → tela)** primeiro: Atividades depende dela (seleção de disciplina, cascata).
2. **Atividades** em paralelo, já usando o contrato de `@acadflow/shared` e os dados do seed.
3. Testes Selenium CT-01..CT-07 → tag da Release 01.
4. **Usuários/Autenticação** (substitui o middleware `usuario-atual`) e **Avaliações** em paralelo.
5. Testes CT-08, CT-14, CT-15 e de isolamento → tag da Release 02.
