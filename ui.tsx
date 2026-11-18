import { ReactNode, useEffect, useRef, useState } from "react";
import { Filtros, useApi, R } from "./api";

export const TIPOS: Record<string, string> = { desmatamento: "Desmatamento", queimada: "Foco de calor", degradacao: "Degradação", outro: "Outro" };
export const COR_TIPO: Record<string, string> = { desmatamento: "#DC4545", queimada: "#E99A32", degradacao: "#8A6D3B", outro: "#1677A8" };
export const BIOMA_COR: Record<string, string> = {
  amazonia: "#1E7B3F", pantanal: "#1677A8", "mata-atlantica": "#0F5C4A", cerrado: "#C98A2B",
  caatinga: "#B8793A", pampa: "#8DB255", "costeiro-marinho": "#2BA5B5" };
export const BIOMA_NOME: Record<string, string> = {
  amazonia: "Amazônia", cerrado: "Cerrado", "mata-atlantica": "Mata Atlântica", caatinga: "Caatinga",
  pantanal: "Pantanal", pampa: "Pampa", "costeiro-marinho": "Costeiro-Marinho" };
export const PRIORIDADES = ["baixa", "media", "alta", "critica"];
export const nf = (v: any, d = 0) => (v == null ? "—" : Number(v).toLocaleString("pt-BR", { maximumFractionDigits: d }));
export const dh = (v?: string | null) => (v ? new Date(v).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "nunca");
export const dia = (v?: string) => (v ? new Date(v + "T00:00:00").toLocaleDateString("pt-BR") : "—");
export const iso = (dias: number) => new Date(Date.now() - dias * 864e5).toISOString().slice(0, 10);

/* Estilo comum dos gráficos (Recharts) */
export const GRADE = "#E4E9E5";
export const EIXO = { tick: { fill: "#5C675F", fontSize: 12 }, axisLine: false, tickLine: false } as const;

export function TooltipBox({ active, payload, label, fmt }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="tip">
      {label != null && label !== "" && <strong>{label}</strong>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="tip-linha">
          <i style={{ background: p.color || (p.payload && p.payload.fill) || "#A9D8B0" }} />
          <span>{p.name}</span>
          <b>{fmt ? fmt(p.value) : nf(p.value, 1)}</b>
        </div>
      ))}
    </div>
  );
}

const ICONES: Record<string, ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
  map: <><path d="M9 4 3 6.5v13L9 17l6 3 6-2.5v-13L15 7 9 4Z" /><path d="M9 4v13M15 7v13" /></>,
  leaf: <><path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" /><path d="M5 19c3-4 6-7 10-9" /></>,
  bell: <><path d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" /><path d="M10 21h4" /></>,
  cap: <><path d="M2 9l10-5 10 5-10 5L2 9Z" /><path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" /><path d="M22 9v5" /></>,
  book: <><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H20v14H5.5A1.5 1.5 0 0 0 4 19.5v-14Z" /><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20v-3" /></>,
};
export function Icone({ n }: { n: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONES[n]}</svg>;
}

/* Número que "chega" contando até o valor; respeita prefers-reduced-motion. */
export function Num({ v, d = 0 }: { v: number | null | undefined; d?: number }) {
  const alvo = v == null || isNaN(Number(v)) ? null : Number(v);
  const ultimo = useRef(0);
  const [x, setX] = useState(0);
  useEffect(() => {
    if (alvo == null) return;
    const reduz = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduz) { ultimo.current = alvo; setX(alvo); return; }
    const ini = ultimo.current;
    const t0 = performance.now();
    let raf = 0;
    const passo = (t: number) => {
      const p = Math.min(1, (t - t0) / 800);
      const v2 = ini + (alvo - ini) * (1 - Math.pow(1 - p, 3));
      ultimo.current = v2;
      setX(v2);
      if (p < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [alvo]);
  return <>{alvo == null ? "—" : nf(x, d)}</>;
}

export function Estado({ erro, carregando, vazio, children }: { erro?: string | null; carregando?: boolean; vazio?: string | false; children?: ReactNode }) {
  if (erro) return <p className="estado erro" role="alert">{erro}. Confira se a API está no ar (em desenvolvimento, localhost:8000) e tente de novo.</p>;
  if (carregando) return <p className="estado carregando" role="status">Carregando…</p>;
  if (vazio) return <p className="estado">{vazio}</p>;
  return <>{children}</>;
}

/* Filtro rápido por bioma: cada faixa usa a cor do bioma. */
export function BiomaFaixa({ valor, onChange }: { valor?: string; onChange: (slug: string) => void }) {
  return (
    <div className="faixa" role="group" aria-label="Filtrar por bioma">
      {Object.keys(BIOMA_NOME).map((slug, i) => (
        <button key={slug} type="button" aria-pressed={valor === slug}
          style={{ ["--cor" as any]: BIOMA_COR[slug], ["--i" as any]: i }}
          onClick={() => onChange(valor === slug ? "" : slug)}>{BIOMA_NOME[slug]}</button>
      ))}
    </div>
  );
}

export function FiltroBar({ v, onChange, ocultar = [] }: { v: Filtros; onChange: (f: Filtros) => void; ocultar?: string[] }) {
  const bio = useApi<R[]>("biomas");
  const set = (k: keyof Filtros) => (e: any) => onChange({ ...v, [k]: e.target.value });
  const mostra = (k: string) => !ocultar.includes(k);
  return (
    <form className="filtros" onSubmit={(e) => e.preventDefault()} aria-label="Filtros">
      {mostra("bioma") && <label>Bioma<select value={v.bioma || ""} onChange={set("bioma")}>
        <option value="">Todos</option>{bio.data?.map((b) => <option key={b.slug} value={b.slug}>{b.nome}</option>)}</select></label>}
      {mostra("tipo") && <label>Tipo de impacto<select value={v.tipo || ""} onChange={set("tipo")}>
        <option value="">Todos</option>{Object.entries(TIPOS).map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select></label>}
      <label>De<input type="date" value={v.de || ""} onChange={set("de")} /></label>
      <label>Até<input type="date" value={v.ate || ""} onChange={set("ate")} /></label>
      {mostra("uf") && <label>UF<input maxLength={2} size={3} value={v.uf || ""} onChange={set("uf")} placeholder="PA" /></label>}
      {mostra("prioridade") && <label>Prioridade<select value={v.prioridade || ""} onChange={set("prioridade")}>
        <option value="">Todas</option>{PRIORIDADES.map((p) => <option key={p} value={p}>{p}</option>)}</select></label>}
    </form>
  );
}
