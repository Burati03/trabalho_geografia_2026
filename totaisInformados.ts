export const ROTULO_TOTAIS_INFORMADOS = "Totais agregados informados pelo usuário; fonte e período não informados.";

export const TOTAIS_BIOMAS = [
  { slug: "amazonia", nome: "Amazônia", total: 303510 },
  { slug: "cerrado", nome: "Cerrado", total: 110315 },
  { slug: "caatinga", nome: "Caatinga", total: 95222 },
  { slug: "mata-atlantica", nome: "Mata Atlântica", total: 29085 },
  { slug: "pantanal", nome: "Pantanal", total: 2036 },
  { slug: "pampa", nome: "Pampa", total: 1494 },
];

export const totalInformadoBioma = (slug?: string) =>
  TOTAIS_BIOMAS.find((bioma) => bioma.slug === slug)?.total;

export const TOTAIS_ESTADOS = [
  { nome: "Pará", total: 123867 },
  { nome: "Acre", total: 62826 },
  { nome: "Amazonas", total: 50552 },
  { nome: "Bahia", total: 42695 },
  { nome: "Maranhão", total: 41111 },
  { nome: "Mato Grosso", total: 27989 },
  { nome: "Rondônia", total: 25755 },
  { nome: "Ceará", total: 24529 },
  { nome: "Minas Gerais", total: 22914 },
  { nome: "Piauí", total: 21517 },
  { nome: "Tocantins", total: 19665 },
  { nome: "Pernambuco", total: 13476 },
  { nome: "Roraima", total: 12929 },
  { nome: "Goiás", total: 12069 },
  { nome: "Paraíba", total: 7766 },
  { nome: "Rio Grande do Sul", total: 5874 },
  { nome: "Mato Grosso do Sul", total: 5549 },
  { nome: "Paraná", total: 5449 },
  { nome: "Rio Grande do Norte", total: 3509 },
  { nome: "Santa Catarina", total: 3087 },
  { nome: "Amapá", total: 2376 },
  { nome: "Sergipe", total: 1749 },
  { nome: "Alagoas", total: 1682 },
  { nome: "São Paulo", total: 869 },
  { nome: "Espírito Santo", total: 745 },
  { nome: "Rio de Janeiro", total: 500 },
  { nome: "Distrito Federal", total: 73 },
];
