import { ReactNode } from "react";
import { Filtros, useApi, R } from "./api";

export const TIPOS: Record<string, string> = { desmatamento: "Desmatamento", queimada: "Foco de calor", degradacao: "Degradação", outro: "Outro" };
export const COR_TIPO: Record<string, string> = { desmatamento: "#DC4545", queimada: "#E99A32", degradacao: "#8A6D3B", outro: "#1677A8" };
export const BIOMA_COR: Record<string, string> = {
  amazonia: "#1E7B3F", pantanal: "#1677A8", "mata-atlantica": "#0F5C4A", cerrado: "#C98A2B",
  caatinga: "#B8793A", pampa: "#8DB255", "costeiro-marinho": "#2BA5B5" };
export const PRIORIDADES = ["baixa", "media", "alta", "critica"];
export const nf = (v: any, d = 0) => (v == null ? "—" : Number(v).toLocaleString("pt-BR", { maximumFractionDigits: d }));
export const dh = (v?: string | null) => (v ? new Date(v).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "nunca");
export const dia = (v?: string) => (v ? new Date(v + "T00:00:00").toLocaleDateString("pt-BR") : "—");
export const iso = (dias: number) => new Date(Date.now() - dias * 864e5).toISOString().slice(0, 10);

export function Estado({ erro, carregando, vazio, children }: { erro?: string | null; carregando?: boolean; vazio?: string | false; children?: ReactNode }) {
  if (erro) return <p className="estado erro" role="alert">{erro}. Verifique se a API está rodando em localhost:8000.</p>;
  if (carregando) return <p className="estado">Carregando…</p>;
  if (vazio) return <p className="estado">{vazio}</p>;
  return <>{children}</>;
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
