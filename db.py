import os
from pathlib import Path
import psycopg
from psycopg.rows import dict_row

URL = os.environ.get("DATABASE_URL", "postgresql://biomas:biomas@localhost:5432/biomas")


def conn():
    return psycopg.connect(URL, row_factory=dict_row, autocommit=True)


def rows(sql, params=None):
    with conn() as c:
        return c.execute(sql, params).fetchall()


def one(sql, params=None):
    r = rows(sql, params)
    return r[0] if r else None


def run(sql, params=None):
    with conn() as c:
        c.execute(sql, params)


def many(sql, lote):
    if not lote:
        return
    with conn() as c, c.cursor() as cur:
        cur.executemany(sql, lote)


def init():
    run((Path(__file__).parent / "schema.sql").read_text(encoding="utf-8"))
