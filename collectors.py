"""Coletores. Cada um trata falhas sem derrubar a API e registra status em fontes_dados."""
import csv, io, json, os, tempfile, unicodedata, zipfile
from datetime import date, timedelta
import httpx
if __package__:
    from . import db
else:
    import db

H = {"User-Agent": "biomas-monitor/1.0 (projeto academico)"}
# CONFIRME este endereço no site do IBGE antes de usar (ou defina IBGE_BIOMAS_URL).
IBGE_PADRAO = "https://geoftp.ibge.gov.br/informacoes_ambientais/estudos_ambientais/biomas/vetores/Biomas_250mil.zip"
PRIORIDADE = """CASE WHEN {a} >= 100 THEN 'critica' WHEN {a} >= 25 THEN 'alta' WHEN {a} >= 5 THEN 'media' ELSE 'baixa' END"""


def registrar(chave, status, msg=None, ok=False):
    db.run(
        "UPDATE fontes_dados SET status_integracao=%s, mensagem=%s, "
        "ultima_atualizacao=CASE WHEN %s THEN now() ELSE ultima_atualizacao END WHERE chave=%s",
        (status, msg, ok, chave),
    )


def atribuir_biomas():
    db.run("UPDATE alertas a SET bioma_id=b.id FROM biomas b "
           "WHERE a.bioma_id IS NULL AND b.geometria IS NOT NULL AND ST_Intersects(b.geometria, a.geom)")


def descartar_fora_do_brasil(chave):
    # Só descarta quando os limites do IBGE já foram carregados.
    db.run("DELETE FROM alertas WHERE bioma_id IS NULL AND fonte_id=(SELECT id FROM fontes_dados WHERE chave=%s) "
           "AND EXISTS (SELECT 1 FROM biomas WHERE geometria IS NOT NULL)", (chave,))


# ---------- NASA FIRMS ----------
SQL_FIRMS = """INSERT INTO alertas (id_externo, latitude, longitude, data_ocorrencia, tipo_impacto, descricao,
  fonte_id, nivel_prioridade, status)
  VALUES (%(id)s, %(lat)s, %(lon)s, %(data)s, 'queimada', %(desc)s,
  (SELECT id FROM fontes_dados WHERE chave='nasa_firms'), %(prio)s, 'preliminar') ON CONFLICT DO NOTHING"""


def firms():
    chave = os.environ.get("FIRMS_MAP_KEY")
    if not chave:
        return registrar("nasa_firms", "nao_configurada", "Defina FIRMS_MAP_KEY (chave gratuita da NASA).")
    url = f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{chave}/VIIRS_SNPP_NRT/-74,-34,-34,6/2"
    try:
        r = httpx.get(url, timeout=90, headers=H)
        r.raise_for_status()
        leitor = csv.DictReader(io.StringIO(r.text))
        if not leitor.fieldnames or "latitude" not in leitor.fieldnames:
            raise ValueError("Resposta inesperada: " + r.text[:150])
        lote = []
        for l in leitor:
            lote.append({
                "id": f"{l['latitude']}|{l['longitude']}|{l['acq_date']}|{l['acq_time']}",
                "lat": float(l["latitude"]), "lon": float(l["longitude"]), "data": l["acq_date"],
                "desc": f"Foco VIIRS S-NPP, confiança {l.get('confidence','?')}, FRP {l.get('frp','?')} MW, {l.get('daynight','?')}",
                "prio": "baixa" if l.get("confidence") == "l" else "media",
            })
        db.many(SQL_FIRMS, lote)
        atribuir_biomas()
        descartar_fora_do_brasil("nasa_firms")
        registrar("nasa_firms", "ativa", f"{len(lote)} focos lidos nas últimas 48 h (VIIRS S-NPP, tempo quase real).", True)
    except Exception as e:
        registrar("nasa_firms", "erro", str(e)[:300])


# ---------- INPE DETER (TerraBrasilis, WFS) ----------
SQL_DETER = f"""WITH g AS (SELECT ST_SetSRID(ST_GeomFromGeoJSON(%(geom)s), 4326) AS geom)
INSERT INTO alertas (id_externo, latitude, longitude, area_afetada, data_ocorrencia, tipo_impacto, descricao,
  fonte_id, nivel_prioridade, status, uf)
SELECT %(id)s, ST_Y(ST_PointOnSurface(geom)), ST_X(ST_PointOnSurface(geom)),
  ROUND((ST_Area(geom::geography)/10000)::numeric, 2), %(data)s::date, %(tipo)s, %(desc)s,
  (SELECT id FROM fontes_dados WHERE chave='inpe_deter'),
  {PRIORIDADE.format(a="ST_Area(geom::geography)/10000")}, 'preliminar', %(uf)s
FROM g ON CONFLICT DO NOTHING"""


def _tipo(classe):
    c = (classe or "").upper()
    if "QUEIMADA" in c: return "queimada"
    if "DESMAT" in c: return "desmatamento"
    if "MINERA" in c: return "outro"
    return "degradacao"


def deter():
    base = os.environ.get("DETER_WFS", "https://terrabrasilis.dpi.inpe.br/geoserver/ows")
    camadas = os.environ.get("DETER_LAYERS", "deter-amz:deter_amz,deter-cerrado:deter_cerrado").split(",")
    desde = (date.today() - timedelta(days=int(os.environ.get("DETER_DIAS", "30")))).isoformat()
    total = 0
    try:
        for cam in camadas:
            r = httpx.get(base, timeout=180, headers=H, params={
                "service": "WFS", "version": "2.0.0", "request": "GetFeature", "typeNames": cam.strip(),
                "outputFormat": "application/json", "srsName": "EPSG:4326", "count": 5000,
                "CQL_FILTER": f"view_date>='{desde}'"})
            r.raise_for_status()
            lote = []
            for f in r.json().get("features", []):
                p = f.get("properties", {})
                lote.append({"id": str(f.get("id")), "geom": json.dumps(f["geometry"]),
                             "data": str(p.get("view_date"))[:10], "tipo": _tipo(p.get("classname")),
                             "desc": f"DETER: {p.get('classname','?')} ({p.get('satellite','?')})",
                             "uf": p.get("uf")})
            db.many(SQL_DETER, lote)
            total += len(lote)
        atribuir_biomas()
        registrar("inpe_deter", "ativa", f"{total} alertas lidos (últimos {os.environ.get('DETER_DIAS','30')} dias). Alertas preliminares.", True)
    except Exception as e:
        registrar("inpe_deter", "erro", f"{str(e)[:250]} — confirme DETER_WFS/DETER_LAYERS via GetCapabilities.")


# ---------- IBGE: limites dos biomas ----------
NOMES = {"amazonia": "amazonia", "caatinga": "caatinga", "cerrado": "cerrado", "mataatlantica": "mata-atlantica",
         "pampa": "pampa", "pantanal": "pantanal", "sistemacosteiromarinho": "costeiro-marinho"}


def _norm(s):
    return "".join(ch for ch in unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower().strip() if ch.isalnum())


def ibge_biomas_se_preciso():
    if not db.one("SELECT 1 AS x FROM biomas WHERE geometria IS NOT NULL LIMIT 1"):
        ibge_biomas()


def ibge_biomas():
    import shapefile
    from shapely.geometry import shape
    try:
        r = httpx.get(os.environ.get("IBGE_BIOMAS_URL", IBGE_PADRAO), timeout=300, follow_redirects=True, headers=H)
        r.raise_for_status()
        with tempfile.TemporaryDirectory() as d:
            zipfile.ZipFile(io.BytesIO(r.content)).extractall(d)
            shp = next(os.path.join(d, n) for n in os.listdir(d) if n.lower().endswith(".shp"))
            n = 0
            for sr in shapefile.Reader(shp, encoding="utf-8").shapeRecords():
                slug = next((NOMES[_norm(v)] for v in sr.record.as_dict().values()
                             if isinstance(v, str) and _norm(v) in NOMES), None)
                if not slug:
                    continue
                db.run("UPDATE biomas SET geometria=ST_Multi(ST_CollectionExtract(ST_MakeValid(ST_GeomFromText(%s,4326)),3)), "
                       "data_atualizacao=now() WHERE slug=%s", (shape(sr.shape.__geo_interface__).wkt, slug))
                db.run("UPDATE biomas SET area_total=ROUND((ST_Area(geometria::geography)/10000)::numeric,0) WHERE slug=%s", (slug,))
                n += 1
        atribuir_biomas()
        registrar("ibge_biomas", "ativa", f"{n} biomas carregados. O IBGE não publica polígono para o Sistema Costeiro-Marinho.", True)
    except Exception as e:
        registrar("ibge_biomas", "erro", f"{str(e)[:250]} — confirme IBGE_BIOMAS_URL.")


COLETORES = {"nasa_firms": firms, "inpe_deter": deter, "ibge_biomas": ibge_biomas}
