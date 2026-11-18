import { Link, useParams } from "react-router-dom";
import { BIOMAS_INFO, SAIBA_MAIS } from "./biomasInfo";
import { Paisagem } from "./ilustracoes";
import { VideosExplorador } from "./VideoCard";
import { BIOMA_COR, Estado } from "./ui";

export function AprendaLista() {
  return (
    <>
      <header className="topo"><h2>Aprenda sobre os Biomas</h2>
        <p>Sete ambientes, cada um com seus animais, plantas e problemas. Escolha um bioma para conhecer como ele é, o que o ameaça e como acompanhá-lo no monitoramento.</p></header>
      <section className="aprenda-grade" aria-label="Biomas">
        {BIOMAS_INFO.map((b) => (
          <Link key={b.slug} to={`/aprenda/${b.slug}`} className="aprenda-card" style={{ ["--cor" as any]: BIOMA_COR[b.slug] }}>
            <div className="arte"><Paisagem slug={b.slug} /></div>
            <div className="corpo"><h3>{b.nome}</h3><p>{b.frase}</p><span className="link-ac">Explorar este bioma</span></div>
          </Link>))}
      </section>
      <h3 className="sub">Vídeos educativos</h3>
      <VideosExplorador />
      <section className="painel saiba-mais">
        <h3>Saiba mais em fontes oficiais</h3>
        <ul>{SAIBA_MAIS.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.nome}</a></li>)}</ul>
        <p className="nota">As ilustrações desta seção são desenhos feitos para o projeto, não fotografias.</p>
      </section>
    </>
  );
}

const Lista = ({ itens }: { itens: string[] }) => <ul className="lista-simples">{itens.map((x) => <li key={x}>{x}</li>)}</ul>;
const Etiquetas = ({ itens }: { itens: string[] }) => <ul className="etiquetas">{itens.map((x) => <li key={x}>{x}</li>)}</ul>;

export function AprendaBioma() {
  const { slug } = useParams();
  const i = BIOMAS_INFO.findIndex((x) => x.slug === slug);
  const b = BIOMAS_INFO[i];
  if (!b) return <Estado vazio="Bioma não encontrado."><span /></Estado>;
  const ant = BIOMAS_INFO[(i + BIOMAS_INFO.length - 1) % BIOMAS_INFO.length];
  const prox = BIOMAS_INFO[(i + 1) % BIOMAS_INFO.length];
  return (
    <div style={{ ["--cor" as any]: BIOMA_COR[b.slug] }}>
      <header className="aprenda-hero">
        <Paisagem slug={b.slug} titulo={`Ilustração de paisagem do bioma ${b.nome}`} />
        <div className="aprenda-hero-texto">
          <Link to="/aprenda">‹ Aprenda sobre os Biomas</Link>
          <h2>{b.nome}</h2><p>{b.frase}</p>
        </div>
      </header>

      <div className="aprenda-corpo">
        <section className="painel">
          <h3>Sobre o bioma</h3>
          <p className="texto-longo">{b.descricao}</p>
          <dl className="fatos"><div><dt>Onde fica</dt><dd>{b.local}</dd></div><div><dt>Clima</dt><dd>{b.clima}</dd></div></dl>
        </section>
        <section className="painel"><h3>Características</h3><Lista itens={b.caracteristicas} /></section>
        <section className="painel"><h3>Fauna</h3><Etiquetas itens={b.fauna} /></section>
        <section className="painel"><h3>Flora</h3><Etiquetas itens={b.flora} /></section>
        <section className="painel largo"><h3>Ameaças ambientais</h3>
          <div className="ameacas">{b.ameacas.map((x) => <article key={x.t}><h4>{x.t}</h4><p>{x.d}</p></article>)}</div></section>
        <section className="painel largo"><h3>Curiosidades</h3><Lista itens={b.curiosidades} /></section>
        <section className="painel largo"><h3>Vídeos sobre este bioma</h3><VideosExplorador bioma={b.slug} travado /></section>
        <section className="painel largo cta-monitor">
          <div><h3>Veja como está o {b.nome} agora</h3><p className="nota">Alertas, área afetada e mapa do bioma, com dados e fontes do monitoramento.</p></div>
          <Link className="botao" to={`/biomas/${b.slug}`}>Abrir monitoramento</Link>
        </section>
      </div>

      <nav className="aprenda-nav" aria-label="Outros biomas">
        <Link to={`/aprenda/${ant.slug}`}>‹ {ant.nome}</Link>
        <Link to={`/aprenda/${prox.slug}`}>{prox.nome} ›</Link>
      </nav>
    </div>
  );
}
