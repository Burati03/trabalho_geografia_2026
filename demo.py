"""Alertas SINTÉTICOS (demo=true, fonte 'demo') para testar a interface. Posições ilustrativas, não são ocorrências reais."""
import random
from datetime import date, timedelta
try:
    from . import db
except ImportError:
    import db

CAIXAS = {"amazonia": (-70, -9, -50, -1), "cerrado": (-52, -18, -45, -8), "pantanal": (-58, -20, -55.5, -16),
          "mata-atlantica": (-48, -26, -41, -18), "caatinga": (-43, -12, -38, -6), "pampa": (-56, -31, -52, -29),
          "costeiro-marinho": (-39, -14, -36, -9)}
SQL = """INSERT INTO alertas (id_externo, bioma_id, latitude, longitude, area_afetada, data_ocorrencia, tipo_impacto,
  descricao, fonte_id, nivel_prioridade, status, demo)
  VALUES (%(id)s, (SELECT id FROM biomas WHERE slug=%(slug)s), %(lat)s, %(lon)s, %(area)s, %(data)s, %(tipo)s,
  'DADO DE DEMONSTRAÇÃO — não é uma ocorrência real', (SELECT id FROM fontes_dados WHERE chave='demo'),
  %(prio)s, 'preliminar', TRUE) ON CONFLICT DO NOTHING"""


def semear():
    if db.one("SELECT 1 AS x FROM alertas WHERE demo LIMIT 1"):
        return
    rnd, lote = random.Random(7), []
    for slug, (x0, y0, x1, y1) in CAIXAS.items():
        for i in range(40):
            tipo = rnd.choice(["desmatamento", "queimada", "queimada", "degradacao"])
            area = None if tipo == "queimada" else round(rnd.uniform(1, 150), 2)
            prio = "baixa" if area is None else "critica" if area >= 100 else "alta" if area >= 25 else "media" if area >= 5 else "baixa"
            lote.append({"id": f"demo-{slug}-{i}", "slug": slug, "lat": round(rnd.uniform(y0, y1), 4),
                         "lon": round(rnd.uniform(x0, x1), 4), "area": area, "tipo": tipo, "prio": prio,
                         "data": (date.today() - timedelta(days=rnd.randint(0, 89))).isoformat()})
    db.many(SQL, lote)
    db.run("UPDATE fontes_dados SET ultima_atualizacao=now(), mensagem='Registros sintéticos de teste.' WHERE chave='demo'")
