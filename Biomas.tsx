import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Filtros, R, useApi } from "./api";
import MapView from "./MapView";
import { BIOMA_COR, COR_TIPO, EIXO, Estado, FiltroBar, GRADE, TIPOS, TooltipBox, dh, iso, nf } from "./ui";
import { ROTULO_TOTAIS_INFORMADOS, totalInformadoBioma } from "./totaisInformados";

export function BiomasLista() {
  const b = useApi<R[]>("biomas");
  return (
    <>
      <header className="topo"><h2>Biomas e ecossistemas</h2><p>Sete unidades monitoradas.</p></header>
      <Estado erro={b.erro} carregando={b.carregando}>
        <div className="biomas">{b.data?.map((x) => (
          <Link key={x.slug} to={`/biomas/${x.slug}`} className="bioma" style={{ ["--cor" as any]: BIOMA_COR[x.slug] }}>
            <h3>{x.nome}</h3><p>{x.descricao}</p>
            <dl><div><dt>Área</dt><dd>{x.area_total ? nf(x.area_total / 1e6, 1) + " mi ha" : "—"}</dd></div>
              <div><dt>Alertas reais</dt><dd>{Number(x.alertas || 0) === 0 ? "Sem alertas" : nf(x.alertas)}</dd></div>
              <div><dt>Total agregado informado</dt><dd>{nf(totalInformadoBioma(x.slug))}</dd></div></dl>
          </Link>))}</div>
        <p className="nota">{ROTULO_TOTAIS_INFORMADOS} Os totais agregados não são alertas individuais nem respondem aos filtros.</p>
      </Estado>
    </>
  );
}

export function BiomaDetalhe() {
  const { slug } = useParams();
  const [f, setF] = useState<Filtros>({ de: iso(90) });
  const d = useApi<R>(`biomas/${slug}`);
  const ser = useApi<R[]>("series", { bioma: slug, de: f.de, ate: f.ate, periodo: "week" });
  const tp = useApi<R[]>("por-tipo", { bioma: slug, de: f.de, ate: f.ate });
  const b = d.data;
  const total = tp.data?.reduce((s, x) => s + x.total, 0);
  const area = tp.data?.reduce((s, x) => s + Number(x.area), 0);
  const totalInformado = totalInformadoBioma(slug);
  return (
    <Estado erro={d.erro} carregando={d.carregando}>
      {b && <>
        <header className="topo bioma-topo" style={{ ["--cor" as any]: BIOMA_COR[slug!] }}>
          <Link to="/biomas">‹ Biomas</Link><h2>{b.nome}</h2><p>{b.descricao}</p>
          <p><Link className="link-ac" to={`/aprenda/${slug}`}>Aprenda sobre este bioma</Link></p>
        </header>
        <section className="boletim">
          <div><span>Área territorial</span><strong>{b.area_total ? nf(b.area_total / 1e6, 1) + " mi ha" : "Aguardando IBGE"}</strong></div>
          <div><span>Vegetação nativa remanescente</span><strong className={b.percentual_remanescente == null ? "pendente" : ""}>{b.percentual_remanescente == null ? "Aguardando MapBiomas" : nf(b.percentual_remanescente, 1) + "%"}</strong></div>
          <div><span>Clima predominante</span><strong className="texto">{b.clima}</strong></div>
          <div><span>Alertas reais no período</span><strong>{nf(total)}</strong></div>
          <div><span>Total agregado informado</span><strong>{nf(totalInformado)}</strong></div>
          <div><span>Área afetada (ha)</span><strong>{nf(area, 1)}</strong></div>
        </section>
        {totalInformado != null && <p className="nota">{ROTULO_TOTAIS_INFORMADOS} Este número não é filtrado pelo período escolhido.</p>}
        <p className="fonte">Principais ameaças: {b.ameacas?.join("; ")}. Limites atualizados em {dh(b.data_atualizacao)}.</p>
        <FiltroBar v={f} onChange={setF} ocultar={["bioma", "uf", "prioridade", "tipo"]} />
        <div className="grade">
          <section className="painel largo"><h3>Alertas por semana</h3>
            <Estado erro={ser.erro} carregando={ser.carregando} vazio={ser.data?.length === 0 && "Sem alertas neste bioma no período."}>
              <ResponsiveContainer height={240}><LineChart data={ser.data || []}><CartesianGrid stroke={GRADE} vertical={false} /><XAxis dataKey="periodo" {...EIXO} /><YAxis {...EIXO} allowDecimals={false} /><Tooltip content={<TooltipBox />} /><Legend />
                {Object.keys(TIPOS).map((k) => <Line key={k} type="monotone" dataKey={k} name={TIPOS[k]} stroke={COR_TIPO[k]} strokeWidth={2.5} dot={false} />)}</LineChart></ResponsiveContainer>
            </Estado></section>
          <section className="painel"><h3>Histórico anual de desmatamento (ha)</h3>
            <Estado vazio={b.historico.length === 0 && "Série anual ainda não carregada: depende da integração com PRODES/MapBiomas."}>
              <ResponsiveContainer height={240}><BarChart data={(b.historico || []).map((h: R) => ({ ...h, area_desmatada: Number(h.area_desmatada), area_queimada: Number(h.area_queimada) }))}><CartesianGrid stroke={GRADE} vertical={false} /><XAxis dataKey="ano" {...EIXO} /><YAxis {...EIXO} /><Tooltip content={<TooltipBox />} cursor={{ fill: "rgba(15,58,38,.06)" }} /><Legend />
                <Bar dataKey="area_desmatada" name="Desmatada" fill="#DC4545" radius={[6, 6, 0, 0]} /><Bar dataKey="area_queimada" name="Queimada" fill="#E99A32" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
            </Estado></section>
          <section className="painel"><h3>Impacto por tipo (ha)</h3>
            <Estado vazio={tp.data?.length === 0 && "Sem dados no período."}>
              <ResponsiveContainer height={240}><BarChart data={(tp.data || []).map((t) => ({ nome: TIPOS[t.tipo], tipo: t.tipo, area: Number(t.area) }))}><CartesianGrid stroke={GRADE} vertical={false} /><XAxis dataKey="nome" {...EIXO} /><YAxis {...EIXO} /><Tooltip content={<TooltipBox />} cursor={{ fill: "rgba(15,58,38,.06)" }} />
                <Bar dataKey="area" name="Hectares" radius={[6, 6, 0, 0]}>{tp.data?.map((t) => <Cell key={t.tipo} fill={COR_TIPO[t.tipo]} />)}</Bar></BarChart></ResponsiveContainer>
            </Estado></section>
        </div>
        <h3 className="sub">Regiões afetadas</h3>
        {b.bbox ? <MapView f={{ ...f, bioma: slug }} altura={460} /> : <p className="estado">Este ecossistema não tem polígono oficial do IBGE; os alertas aparecem no mapa geral quando houver fonte costeira integrada.</p>}
      </>}
    </Estado>
  );
}
