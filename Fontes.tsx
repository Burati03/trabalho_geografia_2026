import { R, useApi } from "./api";
import { Estado, dh } from "./ui";

const ROTULO: Record<string, string> = { ativa: "Ativa", erro: "Com erro", nao_configurada: "Sem chave", planejada: "Planejada", pendente: "Aguardando coleta" };

export default function Fontes() {
  const d = useApi<R[]>("fontes");
  return (
    <>
      <header className="topo"><h2>Fontes e metodologia</h2><p>De onde vem cada número e o que ele significa.</p></header>
      <Estado erro={d.erro} carregando={d.carregando}>
        <div className="tabela tabela-fontes" tabIndex={0} aria-label="Tabela de fontes e metodologia">
          <table>
          <thead><tr><th>Instituição</th><th>Dados</th><th>Tipo</th><th>Situação</th><th>Última atualização</th><th>Link</th></tr></thead>
          <tbody>{d.data?.map((x) => (
            <tr key={x.id}><td>{x.nome_instituicao}</td><td>{x.descricao}{x.mensagem && <small className="msg"><br />{x.mensagem}</small>}</td><td>{x.tipo_dados}</td>
              <td><span className={"chip st-" + x.status_integracao}>{ROTULO[x.status_integracao]}</span></td><td>{dh(x.ultima_atualizacao)}</td>
              <td>{x.link_original ? <a href={x.link_original} target="_blank" rel="noreferrer">Fonte original</a> : "—"}</td></tr>))}</tbody>
        </table></div>
      </Estado>
      <section className="metodo">
        <h3>Como ler os dados</h3>
        <ul>
          <li>Alertas do DETER e focos do FIRMS são <strong>preliminares</strong>. Dados consolidados (PRODES, MapBiomas) têm outra metodologia e período de referência, e não devem ser somados aos alertas.</li>
          <li>Os dados chegam em intervalos: FIRMS a cada 3 horas, DETER uma vez por dia. O sistema não é monitoramento em tempo real.</li>
          <li>A prioridade é uma regra do projeto, não uma classificação oficial: 100 ha ou mais é crítica, 25 ha ou mais é alta, 5 ha ou mais é média, e abaixo disso é baixa. Focos de calor ficam em média, ou baixa quando a confiança do sensor é baixa.</li>
          <li>O bioma de cada alerta é calculado cruzando o ponto com os limites do IBGE. Alertas fora desses limites são descartados.</li>
          <li>Fontes planejadas ou sem chave aparecem com a situação correspondente, e seus indicadores ficam vazios em vez de receber valores estimados.</li>
        </ul>
      </section>
    </>
  );
}
