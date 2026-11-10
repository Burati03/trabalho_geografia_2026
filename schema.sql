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
    CHECK (status_integracao IN ('pendente','ativa','erro','nao_configurada','planejada','demo')),
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
('demo','DADOS DE DEMONSTRAÇÃO','Registros sintéticos, apenas para testar a interface. Não representam ocorrências reais.',NULL,NULL,'Demonstração','demo')
ON CONFLICT (chave) DO NOTHING;

INSERT INTO biomas (slug, nome, descricao, clima, ameacas) VALUES
('amazonia','Amazônia','Maior floresta tropical do mundo, com enorme biodiversidade e papel central na regulação do clima.','Equatorial úmido',ARRAY['Desmatamento','Queimadas','Exploração ilegal de madeira','Perda de vegetação nativa']),
('pantanal','Pantanal','Planície alagável com ciclos de cheia e seca e grande concentração de fauna.','Tropical com estação seca e cheias sazonais',ARRAY['Queimadas','Desmatamento','Degradação ambiental','Alteração da cobertura vegetal']),
('mata-atlantica','Mata Atlântica','Bioma muito fragmentado, que abriga a maior parte da população brasileira.','Tropical úmido a subtropical',ARRAY['Desmatamento','Fragmentação florestal','Expansão urbana','Perda de biodiversidade']),
('cerrado','Cerrado','Savana com alta diversidade e nascentes de grandes bacias hidrográficas.','Tropical sazonal',ARRAY['Expansão agropecuária','Queimadas','Desmatamento','Conversão da vegetação nativa']),
('caatinga','Caatinga','Bioma exclusivamente brasileiro, típico do semiárido nordestino.','Semiárido',ARRAY['Desertificação','Desmatamento ilegal para lenha','Perda de vegetação nativa']),
('pampa','Pampa','Campos nativos do sul do país, ricos em gramíneas e fauna própria.','Subtropical',ARRAY['Conversão de campos para monocultura (soja, eucalipto)','Perda de campos nativos']),
('costeiro-marinho','Sistema Costeiro-Marinho','Faixa litorânea com manguezais, restingas, recifes e estuários.','Variável ao longo do litoral',ARRAY['Branqueamento de corais','Destruição de manguezais','Expansão imobiliária','Carcinicultura','Resíduos'])
ON CONFLICT (slug) DO NOTHING;
