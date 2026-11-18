import { useState } from "react";
import { Link } from "react-router-dom";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Filtros, R, useApi } from "./api";
import MapView from "./MapView";
import { BIOMA_COR, COR_TIPO, EIXO, Estado, FiltroBar, GRADE, BiomaFaixa, Num, TIPOS, TooltipBox, dh, dia, iso, nf } from "./ui";
import TotaisInformados from "./TotaisInformados";
import { VideosDestaque } from "./VideoCard";
import { ROTULO_TOTAIS_INFORMADOS, totalInformadoBioma } from "./totaisInformados";

type Metrica = "alertas" | "area" | "informado";
const METRICAS: [Metrica, string][] = [["alertas", "Alertas"], ["area", "Área (ha)"], ["informado", "Total informado"]];

export default function Dashboard() {
  const [f, setF] = useState<Filtros>({ de: iso(30) });
  const [met, setMet] = useState<Metrica>("alertas");
  const ind = useApi<R>("indicadores", f);
  const ser = useApi<R[]>("series", { ...f, periodo: "week" });
  const bio = useApi<R[]>("biomas", { de: f.de, ate: f.ate });
  const tipo = useApi<R[]>("por-tipo", f);
  const rec = useApi<R>("alertas", { ...f, limit: 6 });
  const d = ind.data;
  const escolheBioma = (bioma: string) => setF((x) => ({ ...x, bioma }));

  // Série semanal somada, usada só no gráfico pequeno do indicador principal.
  const spark = (ser.data || []).map((r) => ({ periodo: r.periodo, total: Object.keys(TIPOS).reduce((s, k) => s + Number(r[k] || 0), 0) }));

  const itens = d ? [
    { r: "Área afetada (ha)", v: Number(d.area_ha), d: 1, txt: "", pend: false },
    { r: "Focos de calor", v: Number(d.focos), d: 0, txt: "", pend: false },
    { r: "Alertas nos últimos 7 dias", v: Number(d.recentes_7d), d: 0, txt: "", pend: false },
    { r: "Bioma com mais ocorrências", v: null, d: 0, txt: d.bioma_top ? d.bioma_top.nome : "—", pend: false },
    { r: "Vegetação nativa remanescente", v: d.remanescente_ha == null ? null : Number(d.remanescente_ha), d: 0, txt: d.remanescente_ha == null ? "Aguardando MapBiomas" : "", pend: d.remanescente_ha == null },
  ] : [];

  // Comparação entre biomas: três métricas sobre os mesmos biomas.
  const linhas = (bio.data || []).map((b) => ({
    slug: b.slug as string, nome: b.nome as string,
    v: met === "alertas" ? Number(b.alertas || 0) : met === "area" ? Number(b.area_afetada || 0) : (totalInformadoBioma(b.slug) ?? null),
  })).sort((a, b) => (b.v ?? -1) - (a.v ?? -1));
  const max = Math.max(1, ...linhas.map((l) => l.v ?? 0));

  return (
    <>
      <header className="topo"><h2>Situação ambiental do Brasil</h2><p>Alertas por período, bioma e tipo de impacto. Toque em um bioma para filtrar o painel inteiro.</p></header>
      <BiomaFaixa valor={f.bioma} onChange={escolheBioma} />
      <FiltroBar v={f} onChange={setF} ocultar={["bioma", "uf", "prioridade"]} />
      <Estado erro={ind.erro} carregando={ind.carregando}>
        {d?.tem_demo && <p className="demo">Inclui alertas sintéticos de demonstração; eles não representam ocorrências reais.</p>}
        {d && (
          <section className="boletim com-destaque" aria-label="Indicadores">
            <div className="destaque">
              <span>Alertas registrados</span>
              <strong><Num v={Number(d.total_alertas)} /></strong>
              <div className="spark" aria-hidden>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spark} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                    <Area type="monotone" dataKey="total" stroke="#A9D8B0" strokeWidth={2} fill="rgba(169,216,176,.22)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            {itens.map((x) => (
              <div key={x.r}><span>{x.r}</span>
                <strong className={x.pend ? "pendente" : x.v == null ? "texto" : ""}>{x.v == null ? x.txt : <Num v={x.v} d={x.d} />}</strong></div>))}
          </section>)}
        <p className="fonte">Fontes no período: {d?.fontes?.length ? d.fontes.map((x: R) => `${x.nome} (atualizada em ${dh(x.ultima_atualizacao)})`).join("; ") : "nenhuma — sem alertas para estes filtros"}.</p>
      </Estado>

      <div className="grade-dash">
        <section className="painel mapa-painel">
          <div className="painel-cab"><h3>Mapa de ocorrências</h3><Link className="link-ac" to="/mapa">Abrir mapa completo</Link></div>
          <MapView f={f} altura={440} onBioma={escolheBioma} />
        </section>
        <section className="painel">
          <div className="painel-cab"><h3>Alertas recentes</h3><Link className="link-ac" to="/alertas">Ver todos</Link></div>
          <Estado erro={rec.erro} carregando={rec.carregando} vazio={rec.data?.total === 0 && "Nenhum alerta com estes filtros."}>
            <ul className="recentes">{rec.data?.itens?.map((a: R) => (
              <li key={a.id} style={{ ["--cor" as any]: COR_TIPO[a.tipo_impacto] || "#1677A8" }}>
                <span className="ponto" aria-hidden />
                <div><strong>{TIPOS[a.tipo_impacto] || a.tipo_impacto}{a.demo ? " (demo)" : ""}</strong>
                  <small>{a.bioma_nome || "Fora dos biomas"} · {dia(a.data_ocorrencia)} · {a.area_afetada ? nf(a.area_afetada, 1) + " ha" : "sem área medida"}</small>
                  <small>{a.fonte}</small></div>
                <span className={"chip " + a.nivel_prioridade}>{a.nivel_prioridade}</span>
              </li>))}</ul>
          </Estado>
        </section>
      </div>

      <div className="grade">
        <section className="painel largo"><h3>Alertas por semana</h3>
          <Estado erro={ser.erro} carregando={ser.carregando} vazio={ser.data?.length === 0 && "Sem alertas no período. Rode uma coleta ou ajuste os filtros."}>
            <ResponsiveContainer height={260}><LineChart data={ser.data || []}><CartesianGrid stroke={GRADE} vertical={false} /><XAxis dataKey="periodo" {...EIXO} /><YAxis {...EIXO} allowDecimals={false} /><Tooltip content={<TooltipBox />} /><Legend />
              {Object.keys(TIPOS).map((k) => <Line key={k} type="monotone" dataKey={k} name={TIPOS[k]} stroke={COR_TIPO[k]} strokeWidth={2.5} dot={false} />)}</LineChart></ResponsiveContainer>
          </Estado></section>

        <section className="painel"><div className="painel-cab"><h3>Comparação entre biomas</h3>
          <div role="tablist" className="abas" aria-label="Métrica da comparação">{METRICAS.map(([k, n]) => <button key={k} role="tab" aria-selected={met === k} onClick={() => setMet(k)}>{n}</button>)}</div></div>
          <Estado erro={bio.erro} carregando={bio.carregando} vazio={bio.data?.length === 0 && "Nenhum bioma com alertas no período."}>
            <ul className="rank">{linhas.map((l) => (
              <li key={l.slug}><button type="button" aria-pressed={f.bioma === l.slug} onClick={() => escolheBioma(f.bioma === l.slug ? "" : l.slug)}
                style={{ ["--cor" as any]: BIOMA_COR[l.slug], ["--w" as any]: ((l.v ?? 0) / max) * 100 + "%" }}>
                <span className="nome">{l.nome}</span><span className="trilho"><i /></span><span className="valor">{nf(l.v, met === "area" ? 1 : 0)}</span></button></li>))}</ul>
            <p className="nota">{met === "informado" ? ROTULO_TOTAIS_INFORMADOS + " Não muda com os filtros e não inclui o Costeiro-Marinho." : "Biomas sem alertas no filtro aparecem com zero, sem esconder a ausência de dados."}</p>
          </Estado></section>

        <section className="painel"><h3>Área afetada por tipo de impacto (ha)</h3>
          <Estado erro={tipo.erro} carregando={tipo.carregando} vazio={tipo.data?.length === 0 && "Sem dados no período."}>
            <ResponsiveContainer height={260}><BarChart data={(tipo.data || []).map((t) => ({ ...t, nome: TIPOS[t.tipo], area: Number(t.area) }))}><CartesianGrid stroke={GRADE} vertical={false} /><XAxis dataKey="nome" {...EIXO} /><YAxis {...EIXO} /><Tooltip content={<TooltipBox />} cursor={{ fill: "rgba(15,58,38,.06)" }} />
              <Bar dataKey="area" name="Hectares" radius={[6, 6, 0, 0]}>{tipo.data?.map((t) => <Cell key={t.tipo} fill={COR_TIPO[t.tipo]} />)}</Bar></BarChart></ResponsiveContainer>
            <p className="nota">Focos de calor não têm área medida pela fonte e não entram neste total.</p>
          </Estado></section>
      </div>
      <VideosDestaque />
      <TotaisInformados />
    </>
  );
}
