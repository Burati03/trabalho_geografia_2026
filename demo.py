"""Alertas sintéticos para testar a interface; pontos ficam dentro dos polígonos oficiais disponíveis."""
import random
from datetime import date, timedelta
if __package__:
    from . import db
else:
    import db

BIOMAS_TERRESTRES = {"amazonia", "caatinga", "cerrado", "mata-atlantica", "pampa", "pantanal"}

PONTOS_SQL = """SELECT b.slug, ST_Y(p.geom) latitude, ST_X(p.geom) longitude
FROM biomas b
CROSS JOIN LATERAL ST_Dump(ST_GeneratePoints(b.geometria, 40)) AS p
WHERE b.geometria IS NOT NULL AND b.slug <> 'costeiro-marinho'
ORDER BY b.slug"""
SQL = """INSERT INTO alertas (id_externo, bioma_id, latitude, longitude, area_afetada, data_ocorrencia, tipo_impacto,
  descricao, fonte_id, nivel_prioridade, status, demo)
  VALUES (%(id)s, (SELECT id FROM biomas WHERE slug=%(slug)s), %(lat)s, %(lon)s, %(area)s, %(data)s, %(tipo)s,
  'DADO SINTÉTICO DE DEMONSTRAÇÃO — não é uma ocorrência real', (SELECT id FROM fontes_dados WHERE chave='demo'),
  %(prio)s, 'preliminar', TRUE) ON CONFLICT DO NOTHING"""


def semear():
    if db.one("SELECT 1 AS x FROM alertas WHERE id_externo LIKE 'demo-v2-%' LIMIT 1"):
        return
    pontos = db.rows(PONTOS_SQL)
    biomas_com_pontos = {p["slug"] for p in pontos}
    faltantes = sorted(BIOMAS_TERRESTRES - biomas_com_pontos)
    if faltantes:
        raise RuntimeError("Sem polígonos oficiais para gerar dados de demonstração: " + ", ".join(faltantes))

    rnd, lote, indices = random.Random(7), [], {}
    for ponto in pontos:
        slug = ponto["slug"]
        i = indices.get(slug, 0)
        indices[slug] = i + 1
        tipo = rnd.choice(["desmatamento", "queimada", "queimada", "degradacao"])
        area = None if tipo == "queimada" else round(rnd.uniform(1, 150), 2)
        prio = "baixa" if area is None else "critica" if area >= 100 else "alta" if area >= 25 else "media" if area >= 5 else "baixa"
        lote.append({"id": f"demo-v2-{slug}-{i}", "slug": slug, "lat": ponto["latitude"],
                     "lon": ponto["longitude"], "area": area, "tipo": tipo, "prio": prio,
                     "data": (date.today() - timedelta(days=rnd.randint(0, 29))).isoformat()})
    db.many(SQL, lote)
    db.run("DELETE FROM alertas WHERE demo AND id_externo LIKE 'demo-%' AND id_externo NOT LIKE 'demo-v2-%'")
    db.run("UPDATE fontes_dados SET ultima_atualizacao=now(), mensagem='Registros sintéticos de teste.' WHERE chave='demo'")


def limpar():
    db.run("DELETE FROM alertas WHERE demo")
    db.run("UPDATE fontes_dados SET ultima_atualizacao=NULL, mensagem='Dados sintéticos removidos; demonstração desativada.' "
           "WHERE chave='demo'")
