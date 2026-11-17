CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS fontes_dados (
  id SERIAL PRIMARY KEY,
  chave TEXT UNIQUE NOT NULL,
  nome_instituicao TEXT NOT NULL,
  descricao TEXT,
  endereco_api TEXT,
  link_original TEXT,
  tipo_dados TEXT,
  ultima_atualizacao TIMESTAMPTZ,
  status_integracao TEXT NOT NULL DEFAULT 'pendente'
    CHECK (status_integracao IN ('pendente','ativa','erro','nao_configurada','planejada')),
  mensagem TEXT
);

CREATE TABLE IF NOT EXISTS biomas (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  nome TEXT UNIQUE NOT NULL,
  descricao TEXT,
  area_total NUMERIC CHECK (area_total >= 0),               -- hectares, calculada da geometria
  percentual_remanescente NUMERIC CHECK (percentual_remanescente BETWEEN 0 AND 100),
  clima TEXT,
  ameacas TEXT[],
  geometria geometry(MultiPolygon, 4326),
  data_atualizacao TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS biomas_geom_gix ON biomas USING GIST (geometria);

CREATE TABLE IF NOT EXISTS alertas (
  id BIGSERIAL PRIMARY KEY,
  id_externo TEXT NOT NULL,
  bioma_id INT REFERENCES biomas(id),
  latitude DOUBLE PRECISION NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  area_afetada NUMERIC CHECK (area_afetada >= 0),
  unidade_medida TEXT NOT NULL DEFAULT 'ha' CHECK (unidade_medida IN ('ha','km2')),
  data_ocorrencia DATE NOT NULL,
  tipo_impacto TEXT NOT NULL CHECK (tipo_impacto IN ('desmatamento','queimada','degradacao','outro')),
  descricao TEXT,
  fonte_id INT NOT NULL REFERENCES fontes_dados(id),
  nivel_prioridade TEXT NOT NULL DEFAULT 'baixa' CHECK (nivel_prioridade IN ('baixa','media','alta','critica')),
  status TEXT NOT NULL DEFAULT 'preliminar' CHECK (status IN ('preliminar','consolidado')),
  uf CHAR(2),
  demo BOOLEAN NOT NULL DEFAULT FALSE,
  geom geometry(Point, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)) STORED,
  UNIQUE (fonte_id, id_externo)
);
CREATE INDEX IF NOT EXISTS alertas_geom_gix ON alertas USING GIST (geom);
CREATE INDEX IF NOT EXISTS alertas_data_idx ON alertas (data_ocorrencia);
CREATE INDEX IF NOT EXISTS alertas_bioma_idx ON alertas (bioma_id, tipo_impacto);

CREATE TABLE IF NOT EXISTS historico_ambiental (
  id SERIAL PRIMARY KEY,
  bioma_id INT NOT NULL REFERENCES biomas(id),
  ano INT NOT NULL CHECK (ano BETWEEN 1985 AND 2100),
  area_desmatada NUMERIC CHECK (area_desmatada >= 0),
  area_queimada NUMERIC CHECK (area_queimada >= 0),
  vegetacao_remanescente NUMERIC CHECK (vegetacao_remanescente >= 0),
  fonte_id INT NOT NULL REFERENCES fontes_dados(id),
  data_registro TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (bioma_id, ano, fonte_id)
);

CREATE TABLE IF NOT EXISTS unidades_conservacao (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT,
  bioma_id INT REFERENCES biomas(id),
  area NUMERIC CHECK (area >= 0),
  geometria geometry(MultiPolygon, 4326),
  fonte_id INT NOT NULL REFERENCES fontes_dados(id)
);
CREATE INDEX IF NOT EXISTS uc_geom_gix ON unidades_conservacao USING GIST (geometria);

INSERT INTO fontes_dados (chave, nome_instituicao, descricao, endereco_api, link_original, tipo_dados, status_integracao) VALUES
('inpe_deter','INPE — DETER','Alertas de alteração da cobertura florestal (Amazônia e Cerrado), preliminares.','TerraBrasilis GeoServer (WFS)','https://www.gov.br/inpe/','Alertas de desmatamento e degradação','pendente'),
('inpe_prodes','INPE — PRODES','Taxa anual consolidada de desmatamento.',NULL,'https://www.gov.br/inpe/','Série anual consolidada','planejada'),
('inpe_focos','INPE — Queimadas','Focos de calor do Programa Queimadas.',NULL,'https://www.gov.br/inpe/','Focos de calor','planejada'),
('nasa_firms','NASA FIRMS','Focos de calor por satélite (VIIRS S-NPP, tempo quase real).','https://firms.modaps.eosdis.nasa.gov/api/area/','https://firms.modaps.eosdis.nasa.gov/','Focos de calor','pendente'),
('ibge_biomas','IBGE — Biomas','Limites territoriais dos biomas.',NULL,'https://www.ibge.gov.br/','Geometria dos biomas','pendente'),
('mapbiomas','MapBiomas','Uso e cobertura do solo, histórico de vegetação.',NULL,'https://brasil.mapbiomas.org/','Cobertura do solo anual','planejada'),
('icmbio','ICMBio','Unidades de Conservação, áreas protegidas e espécies ameaçadas.',NULL,'https://www.gov.br/icmbio/','Áreas protegidas','planejada'),
('demo','Demonstração','Alertas sintéticos para testar a interface; não representam ocorrências reais.',NULL,NULL,'Dados sintéticos de demonstração','planejada')
ON CONFLICT (chave) DO NOTHING;

INSERT INTO biomas (slug, nome, descricao, clima, ameacas) VALUES
('amazonia','Amazônia','Maior bioma brasileiro, formado principalmente por florestas tropicais e uma extensa rede de rios; abriga grande diversidade de espécies.','Equatorial quente e úmido, com variações regionais',ARRAY['Conversão da vegetação nativa','Queimadas','Garimpo e exploração madeireira ilegais','Fragmentação de habitats']),
('pantanal','Pantanal','Planície sazonalmente inundável cuja paisagem e fauna são influenciadas pelo pulso anual de cheias e vazantes.','Tropical continental, com estação chuvosa e estação seca',ARRAY['Incêndios florestais','Alteração do regime de cheias','Conversão de habitats','Pressões agropecuárias na planície e nas cabeceiras']),
('mata-atlantica','Mata Atlântica','Conjunto diverso de formações florestais e ecossistemas associados, com alto endemismo e forte fragmentação histórica.','Tropical úmido a subtropical, conforme latitude e altitude',ARRAY['Fragmentação e supressão de habitats','Expansão urbana e agropecuária','Incêndios','Poluição de rios e áreas costeiras']),
('cerrado','Cerrado','Savana tropical com mosaico de campos, savanas e florestas; abriga nascentes de importantes bacias hidrográficas.','Tropical sazonal, com verão chuvoso e inverno seco',ARRAY['Conversão da vegetação nativa para agropecuária','Fragmentação de habitats','Incêndios em frequência ou intensidade inadequadas','Pressão sobre nascentes e recursos hídricos']),
('caatinga','Caatinga','Bioma exclusivamente brasileiro, com vegetação adaptada à escassez e à irregularidade das chuvas.','Semiárido quente, com chuvas escassas e irregulares',ARRAY['Supressão da vegetação nativa','Extração insustentável de lenha','Sobrepastoreio e degradação do solo','Risco localizado de desertificação']),
('pampa','Pampa','Bioma de campos naturais no Rio Grande do Sul, com mosaicos de pastagens nativas, áreas úmidas e matas ciliares.','Subtropical, com estações do ano bem definidas',ARRAY['Conversão de campos nativos para lavouras e silvicultura','Fragmentação dos campos','Espécies exóticas invasoras','Degradação de áreas úmidas']),
('costeiro-marinho','Sistema Costeiro-Marinho','Conjunto de ecossistemas costeiros e marinhos, como manguezais, restingas, estuários e recifes; não é um dos seis biomas terrestres do IBGE.','Varia conforme a latitude e o ecossistema',ARRAY['Perda e degradação de habitats','Ocupação costeira desordenada','Poluição e resíduos','Sobrepesca','Aquecimento e branqueamento de corais'])
ON CONFLICT (slug) DO UPDATE SET
  descricao=EXCLUDED.descricao,
  clima=EXCLUDED.clima,
  ameacas=EXCLUDED.ameacas;
