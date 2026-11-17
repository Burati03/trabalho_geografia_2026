import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ROTULO_TOTAIS_INFORMADOS, TOTAIS_BIOMAS, TOTAIS_ESTADOS } from "./totaisInformados";
import { BIOMA_COR, nf } from "./ui";

export default function TotaisInformados() {
  return (
    <section className="painel totais-informados" aria-label="Totais agregados informados">
      <h3>Totais agregados informados</h3>
      <p className="nota">{ROTULO_TOTAIS_INFORMADOS} Não são alertas individuais, não têm coordenadas e não mudam com os filtros.</p>
      <div className="totais-grade">
        <div className="painel">
          <h4>Comparação agregada por bioma</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={TOTAIS_BIOMAS} layout="vertical" margin={{ left: 12, right: 12 }}>
              <CartesianGrid stroke="#E3EAE4" horizontal={false} />
              <XAxis type="number" fontSize={12} />
              <YAxis type="category" dataKey="nome" width={110} fontSize={12} />
              <Tooltip formatter={(value) => nf(value)} />
              <Bar dataKey="total" name="Total agregado">{TOTAIS_BIOMAS.map((x) =>
                <Cell key={x.slug} fill={BIOMA_COR[x.slug]} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="tabela">
          <table>
            <thead><tr><th>Bioma</th><th>Total</th></tr></thead>
            <tbody>{TOTAIS_BIOMAS.map((x) => <tr key={x.slug}><td>{x.nome}</td><td>{nf(x.total)}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="tabela">
          <table>
            <thead><tr><th>Estado</th><th>Total</th></tr></thead>
            <tbody>{TOTAIS_ESTADOS.map((x) => <tr key={x.nome}><td>{x.nome}</td><td>{nf(x.total)}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
