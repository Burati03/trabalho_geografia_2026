import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Filtros, R, useApi } from "../api";
import { BIOMA_COR, COR_TIPO, Estado, FiltroBar, TIPOS, dh, iso, nf } from "../ui";

export default function Dashboard() {
  const [f, setF] = useState<Filtros>({ de: iso(30) });
  const ind = useApi<R>("indicadores", f);
  const ser = useApi<R[]>("series", { ...f, periodo: "week" });
  const bio = useApi<R[]>("biomas", { de: f.de, ate: f.ate });
  const tipo = useApi<R[]>("por-tipo", f);
  const d = ind.data;
  const itens = d && [
    ["Alertas registrados", nf(d.total_alertas)],
    ["Área afetada (ha)", nf(d.area_ha, 1)],
    ["Focos de calor", nf(d.focos)],
    ["Alertas nos últimos 7 dias", nf(d.recentes_7d)],
    ["Bioma com mais ocorrências", d.bioma_top ? d.bioma_top.nome : "—"],
    ["Vegetação nativa remanescente", d.remanescente_ha == null ? "Aguardando MapBiomas" : nf(d.remanescente_ha)],
  ];
  return (
    <>
      <header className="topo"><h2>Situação ambiental do Brasil</h2><p>Alertas por período, bioma e tipo de impacto.</p></header>
      <FiltroBar v={f} onChange={setF} ocultar={["uf", "prioridade"]} />
      <Estado erro={ind.erro} carregando={ind.carregando}>
        <section className="boletim" aria-label="Indicadores">
          {itens?.map(([r, v]) => <div key={r}><span>{r}</span><strong className={String(v).startsWith("Aguard") ? "pendente" : ""}>{v}</strong></div>)}
        </section>
        <p className="fonte">Fontes no período: {d?.fontes.length ? d.fontes.map((x: R) => `${x.nome} (atualizada em ${dh(x.ultima_atualizacao)})`).join("; ") : "nenhuma — sem alertas para estes filtros"}.</p>
      </Estado>
      <div className="grade">
        <section className="painel largo"><h3>Alertas por semana</h3>
          <Estado erro={ser.erro} carregando={ser.carregando} vazio={ser.data?.length === 0 && "Sem alertas no período. Rode uma coleta ou ajuste os filtros."}>
            <ResponsiveContainer height={260}><LineChart data={ser.data!}><CartesianGrid stroke="#E3EAE4" /><XAxis dataKey="periodo" fontSize={12} /><YAxis fontSize={12} allowDecimals={false} /><Tooltip /><Legend formatter={(k) => TIPOS[k] || k} />
              {Object.keys(TIPOS).map((k) => <Line key={k} type="monotone" dataKey={k} stroke={COR_TIPO[k]} strokeWidth={2} dot={false} />)}</LineChart></ResponsiveContainer>
          </Estado></section>
        <section className="painel"><h3>Comparação entre biomas</h3>
          <Estado erro={bio.erro} carregando={bio.carregando}>
            <ResponsiveContainer height={260}><BarChart data={bio.data!} layout="vertical" margin={{ left: 20 }}><CartesianGrid stroke="#E3EAE4" horizontal={false} /><XAxis type="number" fontSize={12} allowDecimals={false} /><YAxis type="category" dataKey="nome" width={130} fontSize={12} /><Tooltip />
              <Bar dataKey="alertas" name="Alertas">{bio.data?.map((b) => <Cell key={b.slug} fill={BIOMA_COR[b.slug]} />)}</Bar></BarChart></ResponsiveContainer>
          </Estado></section>
        <section className="painel"><h3>Área afetada por tipo de impacto (ha)</h3>
          <Estado erro={tipo.erro} carregando={tipo.carregando} vazio={tipo.data?.length === 0 && "Sem dados no período."}>
            <ResponsiveContainer height={260}><BarChart data={tipo.data!.map((t) => ({ ...t, nome: TIPOS[t.tipo], area: Number(t.area) }))}><CartesianGrid stroke="#E3EAE4" vertical={false} /><XAxis dataKey="nome" fontSize={12} /><YAxis fontSize={12} /><Tooltip />
              <Bar dataKey="area" name="Hectares">{tipo.data?.map((t) => <Cell key={t.tipo} fill={COR_TIPO[t.tipo]} />)}</Bar></BarChart></ResponsiveContainer>
            <p className="nota">Focos de calor não têm área medida pela fonte e não entram neste total.</p>
          </Estado></section>
      </div>
    </>
  );
}
