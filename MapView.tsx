import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { api, Filtros } from "./api";
import { BIOMA_COR, TIPOS, dia, nf } from "./ui";
import { ROTULO_TOTAIS_INFORMADOS, TOTAIS_BIOMAS } from "./totaisInformados";

const esc = (s: any) => String(s ?? "—").replace(/[&<>"']/g, (c) => "&#" + c.charCodeAt(0) + ";");
const VAZIO = { type: "FeatureCollection", features: [] } as any;
const CAMADAS_PROPRIAS = ["biomas-fill", "biomas-line", "calor", "pontos"];
const CARTO_STYLE = (() => {
  const key = ((import.meta as any).env && (import.meta as any).env.VITE_CARTO_MAP_KEY) || "";
  const base = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
  return key ? `${base}?key=${encodeURIComponent(key)}` : base;
})();

export default function MapView({ f, altura = 560, onBioma }: { f: Filtros; altura?: number | string; onBioma?: (s: string) => void }) {
  const el = useRef<HTMLDivElement>(null);
  const mapa = useRef<maplibregl.Map | null>(null);
  const coord = useRef<HTMLSpanElement>(null);
  const cb = useRef(onBioma); cb.current = onBioma;
  const totaisInformadosRef = useRef(false);
  const [ok, setOk] = useState(false);
  const [aviso, setAviso] = useState("");
  const [cam, setCam] = useState({ biomas: true, pontos: true, calor: false, base: true });
  const [totaisInformados, setTotaisInformados] = useState(false);
  const [painelAberto, setPainelAberto] = useState(() => typeof window === "undefined" || !window.matchMedia || window.matchMedia("(min-width: 700px)").matches);

  useEffect(() => {
    const m = new maplibregl.Map({
      container: el.current!, center: [-54, -14], zoom: 3.4,
      style: CARTO_STYLE,
    });
    mapa.current = m;
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    m.addControl(new maplibregl.ScaleControl());
    m.on("mousemove", (e) => { if (coord.current) coord.current.textContent = `${e.lngLat.lat.toFixed(4)}, ${e.lngLat.lng.toFixed(4)}`; });
    m.on("load", async () => {
      m.addSource("biomas", { type: "geojson", data: VAZIO });
      m.addSource("alertas", { type: "geojson", data: VAZIO });
      m.addLayer({ id: "biomas-fill", type: "fill", source: "biomas", paint: { "fill-color": ["get", "cor"], "fill-opacity": 0.26 } });
      m.addLayer({ id: "biomas-line", type: "line", source: "biomas", paint: { "line-color": ["get", "cor"], "line-width": 1.5 } });
      m.addLayer({ id: "calor", type: "heatmap", source: "alertas", layout: { visibility: "none" }, paint: { "heatmap-radius": 20, "heatmap-intensity": 0.9, "heatmap-color": ["interpolate", ["linear"], ["heatmap-density"], 0, "rgba(233,154,50,0)", 0.3, "rgba(233,154,50,0.55)", 0.65, "rgba(220,69,69,0.8)", 1, "rgba(120,20,20,0.95)"] } });
      m.addLayer({ id: "pontos", type: "circle", source: "alertas", paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 2.5, 10, 7],
        "circle-color": ["match", ["get", "tipo_impacto"], "desmatamento", "#DC4545", "queimada", "#E99A32", "degradacao", "#8A6D3B", "#1677A8"],
        "circle-stroke-width": 0.6, "circle-stroke-color": "#fff" } });
      m.on("click", "biomas-fill", (e) => {
        if (m.queryRenderedFeatures(e.point, { layers: ["pontos"] }).length) return;
        const feature = e.features?.[0];
        const s = feature?.properties?.slug;
        if (s && totaisInformadosRef.current) {
          new maplibregl.Popup({ maxWidth: "280px" }).setLngLat(e.lngLat).setHTML(
            `<strong>${esc(feature.properties.nome)}</strong><br>` +
            `Total agregado informado: ${nf(feature.properties.total_informado)}<br>` +
            `<small>${esc(ROTULO_TOTAIS_INFORMADOS)} Não representa pontos individuais.</small>`
          ).addTo(m);
        }
        if (s) cb.current?.(s);
      });
      m.on("click", "pontos", (e) => {
        const p: any = e.features![0].properties;
        const [lon, lat] = (e.features![0].geometry as any).coordinates;
        new maplibregl.Popup({ maxWidth: "280px" }).setLngLat([lon, lat]).setHTML(
          `<strong>${esc(TIPOS[p.tipo_impacto])}</strong>${p.demo === true || p.demo === "true" ? " <em>(DEMO)</em>" : ""}<br>` +
          `${esc(p.bioma_nome)} · ${dia(p.data_ocorrencia)}<br>Área: ${p.area_afetada ? nf(p.area_afetada, 1) + " ha" : "—"}<br>` +
          `Coord.: ${lat.toFixed(4)}, ${lon.toFixed(4)}<br>Prioridade: ${esc(p.nivel_prioridade)} · ${esc(p.status)}<br>` +
          `Fonte: ${esc(p.fonte)}<br><small>${esc(p.descricao)}</small>`).addTo(m);
      });
      ["biomas-fill", "pontos"].forEach((l) => {
        m.on("mouseenter", l, () => (m.getCanvas().style.cursor = "pointer"));
        m.on("mouseleave", l, () => (m.getCanvas().style.cursor = ""));
      });
      try {
        const g = await api("biomas.geojson");
        const totais = new Map(TOTAIS_BIOMAS.map((x) => [x.slug, x.total]));
        g.features.forEach((x: any) => {
          x.properties.cor = BIOMA_COR[x.properties.slug] || "#23834B";
          x.properties.total_informado = totais.get(x.properties.slug) ?? 0;
        });
        (m.getSource("biomas") as maplibregl.GeoJSONSource).setData(g);
      } catch (e: any) { setAviso(e.message); }
      setOk(true);
    });
    return () => m.remove();
  }, []);

  useEffect(() => {
    if (!ok) return;
    api("alertas.geojson", f).then((d) => {
      (mapa.current!.getSource("alertas") as maplibregl.GeoJSONSource).setData(d);
      setAviso(d.features.length >= 5000 ? "Mostrando os 5.000 alertas mais recentes do filtro." : d.features.length === 0 ? "Nenhum alerta para estes filtros." : "");
    }).catch((e) => setAviso(e.message));
  }, [ok, JSON.stringify(f)]);

  useEffect(() => {
    if (!ok) return;
    if (!f.bioma) { mapa.current!.flyTo({ center: [-54, -14], zoom: 3.4 }); return; }
    api("biomas/" + f.bioma).then((b) => b.bbox && mapa.current!.fitBounds([[b.bbox[0], b.bbox[1]], [b.bbox[2], b.bbox[3]]], { padding: 30 })).catch(() => {});
  }, [ok, f.bioma]);

  useEffect(() => {
    totaisInformadosRef.current = totaisInformados;
    const m = mapa.current; if (!ok || !m) return;
    m.setPaintProperty("biomas-fill", "fill-color", totaisInformados
      ? ["interpolate", ["linear"], ["get", "total_informado"],
          0, "#F1F5F2", 50000, "#B6D7C4", 100000, "#61AA7A", 200000, "#287347", 303510, "#123D2A"]
      : ["get", "cor"]);
  }, [ok, totaisInformados]);

  useEffect(() => {
    const m = mapa.current; if (!ok || !m) return;
    const vis = (id: string, on: boolean) => m.setLayoutProperty(id, "visibility", on ? "visible" : "none");
    vis("biomas-fill", cam.biomas); vis("biomas-line", cam.biomas); vis("pontos", cam.pontos); vis("calor", cam.calor);
    // O mapa base é formado por várias camadas do estilo; as do projeto ficam fora dessa lista.
    (m.getStyle().layers || []).filter((l) => !CAMADAS_PROPRIAS.includes(l.id))
      .forEach((l) => m.setLayoutProperty(l.id, "visibility", cam.base ? "visible" : "none"));
  }, [ok, cam]);

  return (
    <div className="mapwrap" style={{ height: altura }}>
      <div ref={el} className="mapa" />
      <details className="camadas" open={painelAberto} onToggle={(e) => setPainelAberto((e.currentTarget as HTMLDetailsElement).open)}>
        <summary>Camadas</summary>
        {([["biomas", "Limites dos biomas"], ["pontos", "Alertas"], ["calor", "Mapa de calor"], ["base", "Mapa base"]] as const).map(([k, n]) => (
          <label key={k}><input type="checkbox" checked={cam[k]} onChange={(e) => setCam({ ...cam, [k]: e.target.checked })} /> {n}</label>))}
        <label><input type="checkbox" checked={totaisInformados} onChange={(e) => setTotaisInformados(e.target.checked)} /> Totais informados por bioma</label>
      </details>
      {totaisInformados && <div className="mapa-legenda"><strong>Totais agregados por bioma</strong><br />
        0 · 50 mil · 100 mil · 200 mil · 303.510<br />
        <small>{ROTULO_TOTAIS_INFORMADOS} Cores não representam alertas individuais.</small></div>}
      <div className="leitura">Lat, Lon: <span ref={coord}>—</span>{aviso && <> · {aviso}</>}</div>
    </div>
  );
}
