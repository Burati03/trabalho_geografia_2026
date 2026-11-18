# Renova Terra Monitoramento

Aplicativo web de monitoramento ambiental dos biomas brasileiros: FastAPI + PostgreSQL/PostGIS no backend e React + TypeScript + MapLibre + Recharts no frontend.

## Como rodar (tudo em http://localhost:8000)

```bash
cp env.example .env             # preencha FIRMS_MAP_KEY (gratuita) e ADMIN_TOKEN
docker compose up --build       # compila o site, sobe o banco e a API
```

Abra **http://localhost:8000** (documentação da API em `/docs`). Para desenvolver o frontend separado, execute `npm install && npm run dev` na raiz do projeto (porta 5173).
O padrão `SEED_DEMO=0` remove registros sintéticos e mantém apenas alertas reais. A NASA FIRMS fornece focos de calor para o Brasil; o DETER cobre Amazônia e Cerrado. Portanto, outros biomas só terão registros reais quando houver focos FIRMS no período. Para testar a interface, `SEED_DEMO=1` inclui amostras sintéticas nos seis biomas terrestres, sempre identificadas como demonstração.
Totais recebidos de forma agregada por bioma e estado aparecem separadamente dos alertas reais na visão geral, na lista e no detalhe dos biomas, no mapa e na central de alertas. Como a fonte e o período não foram informados, não são verificáveis, não respondem aos filtros e não geram pontos de alerta; no mapa, somente os totais por bioma podem colorir os polígonos oficiais.

## Deploy no Render

Crie um Blueprint no Render apontando para este repositório e use o arquivo `render.yaml`. Ele configura o serviço web como Docker (não como Python nativo), cria o PostgreSQL e publica frontend e API no mesmo endereço. Defina `FIRMS_MAP_KEY` e `VITE_CARTO_MAP_KEY` quando o Render solicitar os valores secretos; `DATABASE_URL` e `ADMIN_TOKEN` são configurados pelo Blueprint. O serviço de banco gratuito pode ter limitações de retenção e disponibilidade, conforme o plano atual do Render.

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
- O Sistema Costeiro-Marinho é exibido como unidade ecológica complementar, não como um dos seis biomas terrestres do IBGE; como não há polígono oficial carregado para ele, os dados de demonstração espacial são gerados apenas nos seis biomas com geometria.
- Exportação em CSV está pronta; PDF não foi implementado (RF14 parcial).
- UF só existe para alertas do DETER; focos do FIRMS não trazem UF.

## Aprenda sobre os Biomas (área educativa)

Rotas `/aprenda` (lista dos 7 biomas e vídeos) e `/aprenda/:slug` (fauna, flora, características, ameaças, curiosidades, vídeos e atalho para o monitoramento do bioma).

- Conteúdo dos biomas: `biomasInfo.ts`. Texto educativo geral, sem números não verificados; os números de monitoramento continuam vindo da API.
- Ilustrações: `ilustracoes.tsx` (SVG desenhado no projeto, não fotografias).
- Vídeos: `videos.ts`. Entram apenas vídeos com ID conferido no YouTube e canal de instituição confiável. Para adicionar, inclua uma linha com `id` (trecho depois de `v=` na URL), título, instituição, bioma e assunto. O player oficial (youtube-nocookie) só carrega quando a pessoa aperta play, e cada vídeo tem o botão "Assistir no YouTube". Hoje o catálogo tem um vídeo (IBGE Explica); os demais biomas mostram um atalho de busca no YouTube até que novos IDs sejam cadastrados.
- Componentes: `Aprenda.tsx` (páginas) e `VideoCard.tsx` (cartão, explorador por bioma/assunto e destaque do dashboard).

## Redesign (etapa 1)

Nova identidade em verde-escuro, verde-claro, branco e cinza (`styles.css`), menu inferior no celular, faixa de biomas como filtro rápido, indicador principal com mini-gráfico, mapa e alertas recentes no dashboard e comparação entre biomas. Correção: o botão "Mapa base" agora oculta as camadas do mapa base; removida uma chamada à API sem uso em `App.tsx`.

## Estrutura

Na raiz: `schema.sql` (tabelas, FKs, índices GIST), `collectors.py`, `demo.py` e `main.py` (API REST); os componentes React e a configuração do Vite/TypeScript também ficam na raiz.
