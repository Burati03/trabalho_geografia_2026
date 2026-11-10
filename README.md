# Renova Terra Monitoramento

Aplicativo web de monitoramento ambiental dos biomas brasileiros: FastAPI + PostgreSQL/PostGIS no backend e React + TypeScript + MapLibre + Recharts no frontend.

## Como rodar (tudo em http://localhost:8000)

```bash
cp env.example .env             # preencha FIRMS_MAP_KEY (gratuita) e ADMIN_TOKEN
docker compose up --build       # compila o site, sobe o banco e a API
```

Abra **http://localhost:8000** (documentação da API em `/docs`). Para desenvolver o frontend separado, execute `npm install && npm run dev` na raiz do projeto (porta 5173).

Na primeira execução a API cria as tabelas, tenta baixar os limites dos biomas (IBGE) e coletar FIRMS e DETER. O resultado de cada coleta aparece em **Fontes e metodologia**. Para forçar uma coleta:

```bash
curl -X POST localhost:8000/api/coletar/inpe_deter -H "X-Admin-Token: SEU_TOKEN"
# chaves: nasa_firms, inpe_deter, ibge_biomas
```

## Estado das integrações

| Fonte | Estado | Observação |
|---|---|---|
| NASA FIRMS | Implementada | Exige `FIRMS_MAP_KEY`. Usa a API `area/csv` (VIIRS S-NPP NRT, últimas 48 h). |
| INPE DETER | Implementada | WFS do TerraBrasilis. **Confirme** `DETER_WFS` e `DETER_LAYERS` com `GetCapabilities`. |
| IBGE (biomas) | Implementada | **Confirme** a URL do shapefile em `ibge.gov.br` (ou defina `IBGE_BIOMAS_URL`). O IBGE não publica polígono do Sistema Costeiro-Marinho. |
| INPE PRODES, INPE Queimadas, MapBiomas, ICMBio | Estrutura pronta | Tabelas, fontes e telas já existem. Falta escrever o coletor (`collectors.py`). Até lá, os campos ficam vazios ("Aguardando…"), sem valores estimados. |

## O que ainda não foi testado

Este código foi escrito em um ambiente sem internet: o backend foi apenas verificado quanto à sintaxe, e o frontend, as consultas SQL e as chamadas às APIs externas **não foram executados**. Espere pequenos ajustes no primeiro uso, principalmente nos nomes de campos das camadas do DETER e do shapefile do IBGE.

## Fontes oficiais usadas

O sistema foi configurado para operar apenas com fontes reais e oficiais:

- INPE (DETER e PRODES): alertas diários de desmatamento e queimadas por satélite.
- MapBiomas: série histórica de uso e cobertura do solo no Brasil.
- NASA FIRMS: focos de calor globais em tempo real.
- IBGE e ICMBio: limites de biomas, UC e espécies ameaçadas.

## Desvios do briefing

- Estilos em CSS próprio no lugar de Tailwind, para manter a identidade visual sem depender de utilitários.
- Percentual de vegetação remanescente, histórico anual, Unidades de Conservação e espécies ameaçadas (RF09, RF10) aguardam as integrações MapBiomas/PRODES/ICMBio.
- Exportação em CSV está pronta; PDF não foi implementado (RF14 parcial).
- UF só existe para alertas do DETER; focos do FIRMS não trazem UF.

## Estrutura

Na raiz: `schema.sql` (tabelas, FKs, índices GIST), `collectors.py`, `demo.py` e `main.py` (API REST); os componentes React e a configuração do Vite/TypeScript também ficam na raiz.
