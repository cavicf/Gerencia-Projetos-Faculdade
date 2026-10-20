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

## Organização sugerida do repositório

```text
.
├── docs/
│   ├── requisitos/
│   ├── estimativa/
│   ├── cronograma/
│   ├── rastreabilidade/
│   └── revisao-cruzada/
├── src/
├── tests/
│   └── selenium/
└── README.md
```

A estrutura poderá ser adaptada conforme as tecnologias utilizadas no projeto.

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
- **Selenium** — automação de testes.
- **Demais tecnologias:** a definir conforme a implementação.

## Equipe

- Camily Victal
- Luis Gustavo Riso
- Rodolfo Alberti
- João Jacometti

## Acompanhamento

| Release | Status |
| --- | --- |
| 00 | Concluída |
| 01 | Pendente |
| 02 | Pendente |
| 03 | Pendente |
| 04 | Pendente |

