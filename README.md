
# Renova Terra Monitoramento

### *Plataforma de Monitoramento Ambiental dos Biomas Brasileiros*

---

O **Renova Terra Monitoramento** é uma plataforma web desenvolvida para acompanhar, visualizar e analisar informações ambientais dos biomas brasileiros por meio de dados geográficos e fontes oficiais.

A aplicação integra tecnologias modernas de desenvolvimento web, geoprocessamento e visualização de dados para oferecer uma experiência intuitiva, organizada e acessível, permitindo acompanhar **alertas ambientais, focos de calor e informações territoriais** em um único ambiente.

---

## 1. Visão geral

A plataforma disponibiliza recursos para:

- **Monitoramento ambiental:** acompanhamento de informações dos biomas brasileiros.
- **Mapas interativos:** visualização geográfica de alertas e informações ambientais.
- **Focos de calor:** acompanhamento de ocorrências detectadas por satélites.
- **Alertas de desmatamento:** consulta de informações disponibilizadas pelas fontes oficiais.
- **Comparação entre biomas:** análise de indicadores ambientais.
- **Visualização territorial:** consulta de dados por estado e região.
- **Educação ambiental:** acesso a conteúdos sobre fauna, flora e características dos biomas.
- **Exportação de dados:** geração de arquivos no formato CSV.

O sistema foi estruturado para integrar diferentes fontes de informação ambiental, centralizando os dados em uma interface moderna e responsiva.

---

## 2. Tecnologias utilizadas

### Backend

| Tecnologia | Finalidade |
|---|---|
| **Python** | Linguagem principal do servidor |
| **FastAPI** | Desenvolvimento da API REST |
| **PostgreSQL** | Banco de dados relacional |
| **PostGIS** | Armazenamento e consultas geoespaciais |
| **SQLAlchemy** | Integração com o banco de dados |

### Frontend

| Tecnologia | Finalidade |
|---|---|
| **React** | Construção da interface |
| **TypeScript** | Tipagem e organização do código |
| **Vite** | Ambiente de desenvolvimento e compilação |
| **MapLibre GL** | Mapas interativos e visualização geográfica |
| **Recharts** | Construção de gráficos e indicadores |
| **CSS** | Estilização e responsividade |

### Infraestrutura

| Tecnologia | Finalidade |
|---|---|
| **Docker** | Conteinerização da aplicação |
| **Docker Compose** | Gerenciamento dos serviços |
| **Render** | Hospedagem e publicação da plataforma |

---

## 3. Biomas monitorados

A plataforma apresenta informações sobre os sete biomas brasileiros e suas características ambientais.

| Bioma | Informações disponíveis |
|---|---|
| **Amazônia** | Características, alertas e monitoramento |
| **Cerrado** | Características, alertas e monitoramento |
| **Mata Atlântica** | Características e monitoramento |
| **Caatinga** | Características e monitoramento |
| **Pampa** | Características e monitoramento |
| **Pantanal** | Características e monitoramento |
| **Sistema Costeiro-Marinho** | Conteúdo educativo complementar |

Os seis biomas terrestres possuem suporte a geometrias territoriais do IBGE. O **Sistema Costeiro-Marinho** é apresentado como uma unidade ecológica complementar.

---

## 4. Funcionalidades

### 4.1. Dashboard ambiental

Painel principal com visão geral das informações ambientais, incluindo:

- Indicadores de monitoramento.
- Gráficos de evolução e comparação.
- Mapa interativo.
- Alertas ambientais recentes.
- Filtros rápidos por bioma.
- Resumo das informações disponíveis.

### 4.2. Mapa interativo

Visualização geográfica dos dados ambientais com recursos de:

- Navegação e aproximação territorial.
- Identificação dos biomas brasileiros.
- Visualização de alertas ambientais.
- Representação espacial de focos de calor.
- Camadas geográficas configuráveis.
- Consulta de informações associadas aos registros.

### 4.3. Central de alertas

Área dedicada à consulta e organização dos alertas ambientais, permitindo visualizar informações como:

- **Tipo de ocorrência.**
- **Fonte dos dados.**
- **Bioma relacionado.**
- **Localização geográfica.**
- **Data de registro.**
- **Estado**, quando disponível na fonte.

### 4.4. Comparação entre biomas

Ferramenta para visualizar e comparar indicadores ambientais entre diferentes biomas, facilitando a interpretação dos dados disponíveis.

### 4.5. Área educativa — Aprenda sobre os Biomas

Seção dedicada à educação ambiental, com páginas individuais para cada bioma.

Conteúdos apresentados:

- Fauna e flora.
- Características ambientais.
- Principais ameaças.
- Curiosidades.
- Vídeos educativos.
- Acesso direto ao monitoramento do bioma.

A plataforma utiliza **ilustrações SVG desenvolvidas especialmente para o projeto** e vídeos incorporados por meio do player oficial do YouTube.

---

## 5. Integrações e fontes de dados

O Renova Terra utiliza fontes oficiais e serviços de dados ambientais para alimentar suas funcionalidades.

| Fonte | Situação | Finalidade |
|---|---|---|
| **NASA FIRMS** | Integrada | Monitoramento de focos de calor por satélite |
| **INPE DETER** | Integrada | Alertas de desmatamento |
| **IBGE** | Integrada | Limites geográficos dos biomas |
| **INPE PRODES** | Estrutura preparada | Dados históricos de desmatamento |
| **MapBiomas** | Estrutura preparada | Uso e cobertura do solo |
| **ICMBio** | Estrutura preparada | Unidades de Conservação e espécies ameaçadas |
| **INPE Queimadas** | Estrutura preparada | Informações sobre queimadas |

*As integrações identificadas como estrutura preparada possuem estrutura de armazenamento e interface, com implementação de coleta pendente.*

### 5.1. Metodologia e confiabilidade

O sistema prioriza informações provenientes de fontes oficiais, evitando apresentar estimativas como dados confirmados.

- Alertas reais são armazenados separadamente dos registros de demonstração.
- Dados agregados são apresentados de maneira independente dos alertas georreferenciados.
- Informações sem fonte ou período identificados não são tratadas como ocorrências verificadas.
- Os filtros são aplicados conforme a disponibilidade de informações de cada fonte.
- Registros de demonstração são identificados separadamente para evitar confusão com ocorrências reais.

---

## 6. Instalação e execução

### 6.1. Pré-requisitos

Antes de iniciar, certifique-se de possuir:

- **Docker**
- **Docker Compose**
- **Node.js e npm** (para desenvolvimento separado do frontend).
- **Chave de acesso da API NASA FIRMS.**

### 6.2. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
cd renova-terra-monitoramento
```

### 6.3. Configurar as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp env.example .env
```

Configure as variáveis necessárias no arquivo `.env`:

```env
FIRMS_MAP_KEY=sua_chave_firms
ADMIN_TOKEN=seu_token_administrativo
```

**Importante:** a variável `FIRMS_MAP_KEY` deve conter somente o valor da chave de acesso, sem comentários ou informações adicionais na mesma linha.

### 6.4. Executar a aplicação

Com as variáveis configuradas, execute:

```bash
docker compose up --build
```

O Docker Compose será responsável por construir e iniciar os serviços da aplicação, incluindo o banco de dados, o backend e o frontend.

### 6.5. Acessar a plataforma

Após a inicialização, acesse:

| Serviço | Endereço |
|---|---|
| **Plataforma web** | http://localhost:8000 |
| **Documentação da API** | http://localhost:8000/docs |
| **Documentação alternativa** | http://localhost:8000/redoc |

---

## 7. Desenvolvimento do frontend

Para executar o frontend separadamente durante o desenvolvimento, utilize:

```bash
npm install
npm run dev
```

O Vite disponibilizará a aplicação em:

```text
http://localhost:5173
```

---

## 8. Ambiente de demonstração

A plataforma permite habilitar registros sintéticos para demonstração e testes visuais.

Configure no arquivo `.env`:

```env
SEED_DEMO=1
```

Quando habilitado, o sistema acrescenta alertas demonstrativos nos seis biomas terrestres que possuem polígonos geográficos carregados.

Para executar exclusivamente com alertas reais:

```env
SEED_DEMO=0
```

**Importante:** os registros demonstrativos são identificados separadamente e não representam ocorrências ambientais reais.

O Sistema Costeiro-Marinho não possui polígono oficial carregado nem coleta integrada, portanto não recebe pontos de demonstração.

---

## 9. Atualização dos dados ambientais

A API disponibiliza mecanismos para executar manualmente as rotinas de coleta de dados.

### Exemplo de atualização do INPE DETER

```bash
curl -X POST http://localhost:8000/api/coletar/inpe_deter \
  -H "X-Admin-Token: SEU_TOKEN"
```

### Fontes disponíveis para coleta

- `nasa_firms`
- `inpe_deter`
- `ibge_biomas`

O acompanhamento das operações e dos resultados das integrações pode ser realizado pela seção **Fontes e metodologia** da plataforma.

---

## 10. Publicação e hospedagem — Render

O projeto possui configuração de implantação por meio de Blueprint, utilizando o arquivo `render.yaml`.

### 10.1. Etapas de publicação

1. Acesse o painel do [Render](https://render.com/).
2. Crie um novo Blueprint.
3. Conecte o repositório do projeto.
4. Selecione o arquivo `render.yaml`.
5. Configure as variáveis secretas solicitadas.
6. Aguarde a criação dos serviços e a implantação.

### 10.2. Variáveis de ambiente

Configure os seguintes parâmetros:

| Variável | Descrição |
|---|---|
| `FIRMS_MAP_KEY` | Chave de acesso da NASA FIRMS |
| `VITE_CARTO_MAP_KEY` | Chave de configuração do serviço de mapas |
| `DATABASE_URL` | Conexão com PostgreSQL |
| `ADMIN_TOKEN` | Token de autenticação administrativa |

O Blueprint configura o serviço web utilizando Docker e provisiona o PostgreSQL, permitindo disponibilizar a API e o frontend no mesmo endereço.

*A disponibilidade, retenção e capacidade do banco de dados dependem do plano contratado no Render.*

---

## 11. Estrutura do projeto

A organização principal dos arquivos está distribuída da seguinte forma:

```text
renova-terra-monitoramento/
│
├── main.py                 # API principal com FastAPI
├── collectors.py           # Integrações e coleta de dados
├── demo.py                 # Dados de demonstração
├── schema.sql              # Estrutura do banco de dados
│
├── App.tsx                 # Aplicação principal React
├── Aprenda.tsx             # Área educativa
├── VideoCard.tsx           # Componentes de vídeos
├── biomasInfo.ts           # Conteúdo educativo dos biomas
├── ilustracoes.tsx         # Ilustrações SVG
├── videos.ts               # Catálogo de vídeos
├── styles.css              # Identidade visual
│
├── docker-compose.yml      # Orquestração dos serviços
├── Dockerfile              # Configuração Docker
├── render.yaml             # Configuração de deploy
├── env.example             # Exemplo de variáveis
│
├── package.json            # Dependências do frontend
├── vite.config.ts          # Configuração Vite
├── tsconfig.json           # Configuração TypeScript
│
└── README.md               # Documentação do projeto
```

---

## 12. Identidade visual e experiência do usuário

A interface foi desenvolvida com foco em clareza, acessibilidade e facilidade de navegação.

### Características do design

- Identidade visual baseada em tons de verde, branco e cinza.
- Layout responsivo para computadores, tablets e celulares.
- Navegação adaptada para dispositivos móveis.
- Menu inferior em telas menores.
- Filtros rápidos para seleção dos biomas.
- Indicadores visuais e gráficos informativos.
- Mapas integrados ao dashboard.
- Componentes organizados para facilitar a navegação.

---

## 13. Objetivo do projeto

O **Renova Terra Monitoramento** tem como objetivo contribuir para a disseminação de informações ambientais e ampliar o acesso aos dados relacionados à conservação dos biomas brasileiros.

Por meio da integração de informações geográficas, alertas de satélite e conteúdos educativos, a plataforma busca transformar dados ambientais em informações acessíveis, facilitando o acompanhamento das mudanças no território brasileiro e incentivando a conscientização ambiental.

---

## 14. Referências e fontes oficiais

As informações ambientais utilizadas como referência estão relacionadas às seguintes instituições e plataformas:

- [INPE — Instituto Nacional de Pesquisas Espaciais](https://www.gov.br/inpe/pt-br)
- [NASA FIRMS — Fire Information for Resource Management System](https://firms.modaps.eosdis.nasa.gov/)
- [IBGE — Instituto Brasileiro de Geografia e Estatística](https://www.ibge.gov.br/)
- [TerraBrasilis — INPE](https://terrabrasilis.dpi.inpe.br/)
- [MapBiomas Brasil](https://brasil.mapbiomas.org/)
- [ICMBio — Instituto Chico Mendes de Conservação da Biodiversidade](https://www.gov.br/icmbio/pt-br)

---

<div align="center">

**RENOVA TERRA MONITORAMENTO**

*Tecnologia, informação e consciência ambiental a serviço da preservação dos biomas brasileiros.*

</div>
