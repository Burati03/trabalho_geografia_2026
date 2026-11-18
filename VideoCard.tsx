import { useState } from "react";
import { Link } from "react-router-dom";
import { ASSUNTOS, VIDEOS, Video, ytBusca, ytEmbed, ytThumb, ytWatch } from "./videos";
import { BIOMA_NOME } from "./ui";

/* Miniatura + título. O player oficial do YouTube só é carregado quando a pessoa aperta play. */
export function VideoCard({ v }: { v: Video }) {
  const [tocando, setTocando] = useState(false);
  return (
    <article className="video">
      <div className="video-tela">
        {tocando ? (
          <iframe src={ytEmbed(v.id) + "?autoplay=1&rel=0"} title={v.titulo} loading="lazy" allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin" />
        ) : (
          <button type="button" className="video-capa" onClick={() => setTocando(true)} aria-label={`Reproduzir: ${v.titulo}`}>
            <img src={ytThumb(v.id)} alt="" loading="lazy" />
            <span className="play" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="video-info">
        <h4>{v.titulo}</h4>
        <p>{v.instituicao} · {v.bioma === "geral" ? "Todos os biomas" : BIOMA_NOME[v.bioma]} · {v.assunto}</p>
        <a className="botao-yt" href={ytWatch(v.id)} target="_blank" rel="noreferrer">Assistir no YouTube</a>
      </div>
    </article>
  );
}

/* Vídeos organizados por bioma e assunto. Com `travado`, o bioma fica fixo (página de um bioma). */
export function VideosExplorador({ bioma = "", travado = false }: { bioma?: string; travado?: boolean }) {
  const [b, setB] = useState(bioma);
  const [a, setA] = useState("");
  const lista = VIDEOS.filter((v) => (!b || v.bioma === b || v.bioma === "geral") && (!a || v.assunto === a));
  const consulta = (b ? `bioma ${BIOMA_NOME[b]} Brasil` : "biomas brasileiros") + (a ? ` ${a.toLowerCase()}` : "");
  return (
    <div className="videos">
      <form className="filtros" onSubmit={(e) => e.preventDefault()} aria-label="Filtrar vídeos">
        {!travado && <label>Bioma<select value={b} onChange={(e) => setB(e.target.value)}>
          <option value="">Todos</option>{Object.entries(BIOMA_NOME).map(([k, n]) => <option key={k} value={k}>{n}</option>)}</select></label>}
        <label>Assunto<select value={a} onChange={(e) => setA(e.target.value)}>
          <option value="">Todos</option>{ASSUNTOS.map((x) => <option key={x} value={x}>{x}</option>)}</select></label>
      </form>
      {lista.length > 0
        ? <div className="videos-grade">{lista.map((v) => <VideoCard key={v.id} v={v} />)}</div>
        : <p className="estado">Nenhum vídeo cadastrado para esta combinação ainda.</p>}
      <p className="nota"><a className="link-ac" href={ytBusca(consulta)} target="_blank" rel="noreferrer">Procurar mais vídeos no YouTube</a> — a busca abre no site do YouTube, e os vídeos só entram aqui depois de conferidos.</p>
    </div>
  );
}

/* Bloco do dashboard: vídeos em destaque e atalho para a área educativa. */
export function VideosDestaque() {
  const lista = VIDEOS.slice(0, 3);
  return (
    <section className="painel destaque-videos" aria-label="Vídeos educativos em destaque">
      <div className="painel-cab"><h3>Vídeos educativos em destaque</h3><Link className="link-ac" to="/aprenda">Aprenda sobre os Biomas</Link></div>
      <div className="videos-grade">
        {lista.map((v) => <VideoCard key={v.id} v={v} />)}
        <Link to="/aprenda" className="convite">
          <strong>Conheça os 7 biomas</strong>
          <span>Fauna, flora, ameaças e curiosidades de cada um, com vídeos organizados por bioma e assunto.</span>
        </Link>
      </div>
    </section>
  );
}
