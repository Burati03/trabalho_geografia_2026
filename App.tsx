import { useEffect } from "react";
import { BrowserRouter, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { BIOMA_COR, Icone } from "./ui";
import Dashboard from "./Dashboard";
import Mapa from "./Mapa";
import { BiomasLista, BiomaDetalhe } from "./Biomas";
import Alertas from "./Alertas";
import Fontes from "./Fontes";
import { AprendaLista, AprendaBioma } from "./Aprenda";

/* [rota, nome completo, ícone, nome curto (barra inferior no celular)] */
const NAV: [string, string, string, string][] = [
  ["/", "Visão geral", "grid", "Início"],
  ["/mapa", "Mapa", "map", "Mapa"],
  ["/biomas", "Biomas", "leaf", "Biomas"],
  ["/alertas", "Alertas", "bell", "Alertas"],
  ["/aprenda", "Aprenda sobre os Biomas", "cap", "Aprenda"],
  ["/fontes", "Fontes e metodologia", "book", "Fontes"],
];

function VoltarAoTopo() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <VoltarAoTopo />
      <a className="pular" href="#conteudo">Ir para o conteúdo</a>
      <div className="shell">
        <aside>
          <div className="strata" aria-hidden>{Object.values(BIOMA_COR).map((c) => <i key={c} style={{ background: c }} />)}</div>
          <img className="brand-logo" src="/logo-renova-terra.png" alt="Renova Terra Monitoramento" />
          <nav aria-label="Principal">{NAV.map(([to, nome, ic, curto]) => (
            <NavLink key={to} to={to} end={to === "/"}>
              <Icone n={ic} /><span className="longo">{nome}</span><span className="curto">{curto}</span>
            </NavLink>))}</nav>
          <p className="rodape">Dados de fontes oficiais, com a data de cada atualização. Alertas preliminares não são dados consolidados.</p>
        </aside>
        <main id="conteudo" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Dashboard />} /><Route path="/mapa" element={<Mapa />} />
            <Route path="/biomas" element={<BiomasLista />} /><Route path="/biomas/:slug" element={<BiomaDetalhe />} />
            <Route path="/aprenda" element={<AprendaLista />} /><Route path="/aprenda/:slug" element={<AprendaBioma />} />
            <Route path="/alertas" element={<Alertas />} /><Route path="/fontes" element={<Fontes />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
