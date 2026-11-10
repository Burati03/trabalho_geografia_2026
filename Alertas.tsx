import { useState } from "react";
import { Filtros, R, qs, useApi } from "./api";
import MapView from "./MapView";
import { Estado, FiltroBar, TIPOS, dia, iso, nf } from "./ui";

const POR_PAG = 50;
export default function Alertas() {
  const [f, setF] = useState<Filtros>({ de: iso(30) });
  const [vista, setVista] = useState<"tabela" | "mapa">("tabela");
  const [pag, setPag] = useState(0);
  const d = useApi<R>("alertas", { ...f, limit: POR_PAG, offset: pag * POR_PAG });
  const mudar = (x: Filtros) => { setF(x); setPag(0); };
  const paginas = Math.max(1, Math.ceil((d.data?.total || 0) / POR_PAG));
  return (
    <>
      <header className="topo"><h2>Central de alertas</h2><p>Registros georreferenciados com fonte e situação.</p></header>
      <FiltroBar v={f} onChange={mudar} />
      <div className="barra">
        <div role="tablist" className="abas">{(["tabela", "mapa"] as const).map((v) => <button key={v} role="tab" aria-selected={vista === v} onClick={() => setVista(v)}>{v === "tabela" ? "Tabela" : "Mapa"}</button>)}</div>
        <span>{nf(d.data?.total)} alertas</span>
        <a className="botao" href={`/api/export/alertas.csv${qs(f)}`}>Exportar CSV</a>
      </div>
      {vista === "mapa" ? <MapView f={f} altura={560} onBioma={(bioma) => mudar({ ...f, bioma })} /> : (
        <Estado erro={d.erro} carregando={d.carregando} vazio={d.data?.total === 0 && "Nenhum alerta com estes filtros."}>
          <div className="tabela"><table>
            <thead><tr><th>ID</th><th>Bioma</th><th>Impacto</th><th>Lat, Lon</th><th>Área (ha)</th><th>Data</th><th>Fonte</th><th>UF</th><th>Prioridade</th><th>Situação</th></tr></thead>
            <tbody>{d.data?.itens.map((a: R) => (
              <tr key={a.id}><td title={a.id_externo}>{a.demo ? "DEMO " : ""}{a.id}</td><td>{a.bioma_nome || "—"}</td><td>{TIPOS[a.tipo_impacto]}</td>
                <td>{a.latitude.toFixed(4)}, {a.longitude.toFixed(4)}</td><td>{nf(a.area_afetada, 1)}</td><td>{dia(a.data_ocorrencia)}</td>
                <td>{a.fonte}</td><td>{a.uf || "—"}</td><td><span className={"chip " + a.nivel_prioridade}>{a.nivel_prioridade}</span></td><td>{a.status}</td></tr>))}</tbody>
          </table></div>
          <div className="barra"><button disabled={pag === 0} onClick={() => setPag(pag - 1)}>Anterior</button><span>Página {pag + 1} de {paginas}</span><button disabled={pag + 1 >= paginas} onClick={() => setPag(pag + 1)}>Próxima</button></div>
        </Estado>)}
    </>
  );
}
