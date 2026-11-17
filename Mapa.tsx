import { useState } from "react";
import { Filtros } from "./api";
import MapView from "./MapView";
import TotaisInformados from "./TotaisInformados";
import { FiltroBar, iso } from "./ui";

export default function Mapa() {
  const [f, setF] = useState<Filtros>({ de: iso(30) });
  return (
    <>
      <header className="topo"><h2>Mapa interativo</h2><p>Ative a camada de totais agregados informados para colorir os biomas e clique em um bioma para consultar o total. Pontos são alertas reais georreferenciados.</p></header>
      <FiltroBar v={f} onChange={setF} ocultar={["uf", "prioridade"]} />
      <MapView f={f} altura="calc(100vh - 250px)" onBioma={(bioma) => setF((x) => ({ ...x, bioma }))} />
      <TotaisInformados />
    </>
  );
}
