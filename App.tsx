import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { useApi } from "./api";
import { BIOMA_COR } from "./ui";
import Dashboard from "./pages/Dashboard";
import Mapa from "./pages/Mapa";
import { BiomasLista, BiomaDetalhe } from "./pages/Biomas";
import Alertas from "./pages/Alertas";
import Fontes from "./pages/Fontes";

const NAV = [["/", "Visão geral"], ["/mapa", "Mapa"], ["/biomas", "Biomas"], ["/alertas", "Alertas"], ["/fontes", "Fontes e metodologia"]];

export default function App() {
  const ind = useApi("indicadores");
  return (
    <BrowserRouter>
      <div className="shell">
        <aside>
          <div className="strata" aria-hidden>{Object.values(BIOMA_COR).map((c) => <i key={c} style={{ background: c }} />)}</div>
          <h1>Biomas<br />Monitor</h1>
          <nav aria-label="Principal">{NAV.map(([to, n]) => <NavLink key={to} to={to} end={to === "/"}>{n}</NavLink>)}</nav>
          <p className="rodape">Dados de fontes oficiais, com a data de cada atualização. Alertas preliminares não são dados consolidados.</p>
        </aside>
        <main>
          {ind.data?.tem_demo && <p className="demo" role="status"><strong>Dados de demonstração presentes.</strong> Registros marcados como DEMO são sintéticos e não representam ocorrências reais.</p>}
          <Routes>
            <Route path="/" element={<Dashboard />} /><Route path="/mapa" element={<Mapa />} />
            <Route path="/biomas" element={<BiomasLista />} /><Route path="/biomas/:slug" element={<BiomaDetalhe />} />
            <Route path="/alertas" element={<Alertas />} /><Route path="/fontes" element={<Fontes />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
