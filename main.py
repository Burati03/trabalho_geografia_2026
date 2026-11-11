import csv, io, os, threading
from contextlib import asynccontextmanager
from datetime import date
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import Depends, FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
if __package__:
    from . import collectors as c, db
else:
    import collectors as c
    import db

BASE = "FROM alertas a LEFT JOIN biomas b ON b.id=a.bioma_id JOIN fontes_dados f ON f.id=a.fonte_id"


@asynccontextmanager
async def lifespan(app):
    db.init()
    sch = BackgroundScheduler(timezone="UTC")
    sch.add_job(c.firms, "interval", hours=3)      # FIRMS NRT atualiza algumas vezes ao dia
    sch.add_job(c.deter, "interval", hours=24)     # DETER: atualização diária
    for fn in (c.ibge_biomas_se_preciso, c.firms, c.deter):
        sch.add_job(fn)                            # uma execução imediata
    c.atribuir_biomas()
    sch.start()
    yield
    sch.shutdown(wait=False)


app = FastAPI(title="Renova Terra Monitoramento", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_methods=["GET", "POST"], allow_headers=["*"])


class F:
    def __init__(self, bioma: str | None = None, tipo: str | None = None, de: date | None = None,
                 ate: date | None = None, uf: str | None = None, prioridade: str | None = None):
        self.bioma, self.tipo, self.de, self.ate = bioma, tipo, de, ate
        self.uf, self.prioridade = (uf.upper() if uf else None), prioridade


def where(f: F):
    w, p = ["TRUE"], {}
    for campo, col in (("bioma", "b.slug"), ("tipo", "a.tipo_impacto"), ("uf", "a.uf"), ("prioridade", "a.nivel_prioridade")):
        if getattr(f, campo):
            w.append(f"{col}=%({campo})s"); p[campo] = getattr(f, campo)
    if f.de: w.append("a.data_ocorrencia>=%(de)s"); p["de"] = f.de
    if f.ate: w.append("a.data_ocorrencia<=%(ate)s"); p["ate"] = f.ate
    return " AND ".join(w), p


COLS = ("a.id,a.id_externo,b.slug bioma,b.nome bioma_nome,a.latitude,a.longitude,a.area_afetada,a.unidade_medida,"
        "a.data_ocorrencia,a.tipo_impacto,a.descricao,a.nivel_prioridade,a.status,a.uf,a.demo,f.nome_instituicao fonte")


@app.get("/api/indicadores")
def indicadores(f: F = Depends()):
    w, p = where(f)
    r = db.one(f"SELECT count(*) total, COALESCE(sum(a.area_afetada),0) area, count(*) FILTER (WHERE a.tipo_impacto='queimada') focos {BASE} WHERE {w}", p)
    top = db.one(f"SELECT b.nome, count(*) total {BASE} WHERE {w} AND b.id IS NOT NULL GROUP BY b.nome ORDER BY total DESC LIMIT 1", p)
    return {"total_alertas": r["total"], "area_ha": r["area"], "focos": r["focos"], "bioma_top": top,
            "recentes_7d": db.one("SELECT count(*) n FROM alertas WHERE data_ocorrencia>=current_date-7")["n"],
            "remanescente_ha": None,  # exige MapBiomas/PRODES (ainda não integrados)
            "tem_demo": db.one("SELECT EXISTS(SELECT 1 FROM alertas WHERE demo) e")["e"],
            "fontes": db.rows(f"SELECT DISTINCT f.chave, f.nome_instituicao nome, f.ultima_atualizacao, f.status_integracao status {BASE} WHERE {w}", p)}


@app.get("/api/series")
def series(f: F = Depends(), periodo: str = "week"):
    if periodo not in ("day", "week", "month"):
        raise HTTPException(400, "periodo inválido")
    w, p = where(f)
    out = {}
    for d in db.rows(f"SELECT date_trunc('{periodo}',a.data_ocorrencia)::date per, a.tipo_impacto t, count(*) n {BASE} WHERE {w} GROUP BY 1,2 ORDER BY 1", p):
        out.setdefault(str(d["per"]), {"periodo": str(d["per"])})[d["t"]] = d["n"]
    return list(out.values())


@app.get("/api/por-tipo")
def por_tipo(f: F = Depends()):
    w, p = where(f)
    return db.rows(f"SELECT a.tipo_impacto tipo, count(*) total, COALESCE(sum(a.area_afetada),0) area {BASE} WHERE {w} GROUP BY 1 ORDER BY 2 DESC", p)


@app.get("/api/biomas")
def biomas(de: date | None = None, ate: date | None = None):
    return db.rows("""SELECT b.id,b.slug,b.nome,b.descricao,b.area_total,b.percentual_remanescente,b.clima,b.ameacas,
      b.data_atualizacao,(b.geometria IS NOT NULL) tem_geometria,COALESCE(s.total,0) alertas,COALESCE(s.area,0) area_afetada
      FROM biomas b LEFT JOIN (SELECT bioma_id,count(*) total,sum(area_afetada) area FROM alertas
        WHERE (%(de)s::date IS NULL OR data_ocorrencia>=%(de)s) AND (%(ate)s::date IS NULL OR data_ocorrencia<=%(ate)s)
        GROUP BY bioma_id) s ON s.bioma_id=b.id ORDER BY b.id""", {"de": de, "ate": ate})


@app.get("/api/biomas.geojson")
def biomas_geojson():
    r = db.rows("SELECT slug,nome,ST_AsGeoJSON(ST_SimplifyPreserveTopology(geometria,0.02))::json g FROM biomas WHERE geometria IS NOT NULL")
    return {"type": "FeatureCollection", "features": [
        {"type": "Feature", "properties": {"slug": x["slug"], "nome": x["nome"]}, "geometry": x["g"]} for x in r]}


@app.get("/api/biomas/{slug}")
def bioma(slug: str):
    b = db.one("""SELECT id,slug,nome,descricao,area_total,percentual_remanescente,clima,ameacas,data_atualizacao,
      CASE WHEN geometria IS NULL THEN NULL ELSE ARRAY[ST_XMin(geometria),ST_YMin(geometria),ST_XMax(geometria),ST_YMax(geometria)] END bbox
      FROM biomas WHERE slug=%s""", (slug,))
    if not b:
        raise HTTPException(404, "Bioma não encontrado")
    hist = db.rows("SELECT h.ano,h.area_desmatada,h.area_queimada,h.vegetacao_remanescente,f.nome_instituicao fonte "
                   "FROM historico_ambiental h JOIN fontes_dados f ON f.id=h.fonte_id WHERE h.bioma_id=%s ORDER BY ano", (b["id"],))
    return {**b, "historico": hist}


@app.get("/api/alertas")
def alertas(f: F = Depends(), limit: int = Query(50, le=500), offset: int = 0):
    w, p = where(f)
    total = db.one(f"SELECT count(*) n {BASE} WHERE {w}", p)["n"]
    itens = db.rows(f"SELECT {COLS} {BASE} WHERE {w} ORDER BY a.data_ocorrencia DESC, a.id DESC LIMIT %(l)s OFFSET %(o)s", {**p, "l": limit, "o": offset})
    return {"total": total, "itens": itens}


@app.get("/api/alertas.geojson")
def alertas_geojson(f: F = Depends(), limit: int = Query(5000, le=5000)):
    w, p = where(f)
    r = db.rows(f"SELECT {COLS} {BASE} WHERE {w} ORDER BY a.data_ocorrencia DESC LIMIT %(l)s", {**p, "l": limit})
    return {"type": "FeatureCollection", "features": [
        {"type": "Feature", "geometry": {"type": "Point", "coordinates": [x["longitude"], x["latitude"]]},
         "properties": {k: (str(v) if k == "data_ocorrencia" else float(v) if k == "area_afetada" and v is not None else v)
                        for k, v in x.items() if k not in ("latitude", "longitude")}} for x in r]}


@app.get("/api/export/alertas.csv")
def exportar(f: F = Depends()):
    w, p = where(f)
    r = db.rows(f"SELECT {COLS} {BASE} WHERE {w} ORDER BY a.data_ocorrencia DESC LIMIT 100000", p)
    buf = io.StringIO()
    wr = csv.DictWriter(buf, fieldnames=list(r[0].keys()) if r else ["id"])
    wr.writeheader(); wr.writerows(r)
    return Response("\ufeff" + buf.getvalue(), media_type="text/csv; charset=utf-8",
                    headers={"Content-Disposition": "attachment; filename=alertas.csv"})


@app.get("/api/fontes")
def fontes():
    return db.rows("SELECT id,chave,nome_instituicao,descricao,endereco_api,link_original,tipo_dados,ultima_atualizacao,status_integracao,mensagem FROM fontes_dados ORDER BY id")


@app.get("/api/unidades-conservacao")
def ucs(bioma: str | None = None):
    return db.rows("SELECT u.id,u.nome,u.categoria,u.area,b.nome bioma FROM unidades_conservacao u LEFT JOIN biomas b ON b.id=u.bioma_id "
                   "WHERE (%(b)s::text IS NULL OR b.slug=%(b)s) ORDER BY u.nome LIMIT 500", {"b": bioma})


@app.post("/api/coletar/{chave}")
def coletar(chave: str, x_admin_token: str = Header(default="")):
    if x_admin_token != os.environ.get("ADMIN_TOKEN", "") or not x_admin_token:
        raise HTTPException(401, "Token inválido")
    if chave not in c.COLETORES:
        raise HTTPException(404, "Coletor inexistente")
    threading.Thread(target=c.COLETORES[chave], daemon=True).start()
    return {"iniciado": chave}


# ---- Serve o frontend compilado em http://localhost:8000 ----
_DIST = next((p for p in (Path("/srv/static"), Path(__file__).resolve().parents[2] / "frontend" / "dist") if p.exists()), None)
if _DIST:
    app.mount("/assets", StaticFiles(directory=_DIST / "assets"), name="assets")

    @app.get("/{caminho:path}", include_in_schema=False)
    def site(caminho: str):
        arq = _DIST / caminho
        return FileResponse(arq if caminho and arq.is_file() else _DIST / "index.html")
