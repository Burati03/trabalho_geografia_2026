import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { api, Filtros } from "./api";
import { BIOMA_COR, TIPOS, dia, nf } from "./ui";

const esc = (s: any) => String(s ?? "—").replace(/[&<>"']/g, (c) => "&#" + c.charCodeAt(0) + ";");
const VAZIO = { type: "FeatureCollection", features: [] } as any;
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
  const [ok, setOk] = useState(false);
  const [aviso, setAviso] = useState("");
  const [cam, setCam] = useState({ biomas: true, pontos: true, calor: false, base: true });

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
      m.addLayer({ id: "biomas-fill", type: "fill", source: "biomas", paint: { "fill-color": ["get", "cor"], "fill-opacity": 0.2 } });
      m.addLayer({ id: "biomas-line", type: "line", source: "biomas", paint: { "line-color": ["get", "cor"], "line-width": 1.3 } });
      m.addLayer({ id: "calor", type: "heatmap", source: "alertas", layout: { visibility: "none" }, paint: { "heatmap-radius": 20, "heatmap-intensity": 0.9 } });
      m.addLayer({ id: "pontos", type: "circle", source: "alertas", paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 3, 2.5, 10, 7],
        "circle-color": ["match", ["get", "tipo_impacto"], "desmatamento", "#DC4545", "queimada", "#E99A32", "degradacao", "#8A6D3B", "#1677A8"],
        "circle-stroke-width": 0.6, "circle-stroke-color": "#fff" } });
      m.on("click", "biomas-fill", (e) => {
        if (m.queryRenderedFeatures(e.point, { layers: ["pontos"] }).length) return;
        const s = e.features?.[0]?.properties?.slug; if (s) cb.current?.(s);
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
        g.features.forEach((x: any) => (x.properties.cor = BIOMA_COR[x.properties.slug] || "#23834B"));
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
    const m = mapa.current; if (!ok || !m) return;
    const vis = (id: string, on: boolean) => m.setLayoutProperty(id, "visibility", on ? "visible" : "none");
    vis("biomas-fill", cam.biomas); vis("biomas-line", cam.biomas); vis("pontos", cam.pontos); vis("calor", cam.calor); vis("base", cam.base);
  }, [ok, cam]);

  return (
    <div className="mapwrap" style={{ height: altura }}>
      <div ref={el} className="mapa" />
      <fieldset className="camadas"><legend>Camadas</legend>
        {([["biomas", "Limites dos biomas"], ["pontos", "Alertas"], ["calor", "Mapa de calor"], ["base", "Mapa base"]] as const).map(([k, n]) => (
          <label key={k}><input type="checkbox" checked={cam[k]} onChange={(e) => setCam({ ...cam, [k]: e.target.checked })} /> {n}</label>))}
      </fieldset>
      <div className="leitura">Lat, Lon: <span ref={coord}>—</span>{aviso && <> · {aviso}</>}</div>
    </div>
  );
}
