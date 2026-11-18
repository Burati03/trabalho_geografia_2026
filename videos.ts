/* Catálogo de vídeos educativos.
   REGRA: só entram aqui vídeos cujo ID foi conferido abrindo https://www.youtube.com/watch?v=ID e
   cujo canal é de uma instituição confiável (IBGE, Embrapa, ICMBio, MapBiomas, WWF-Brasil, INPE,
   TV Escola, universidades). Nunca invente ou "adivinhe" um ID.
   Para adicionar um vídeo: copie o ID da URL (o trecho depois de "v=") e inclua uma linha abaixo.
   bioma: slug de um bioma (amazonia, cerrado, mata-atlantica, caatinga, pantanal, pampa,
   costeiro-marinho) ou "geral" para vídeos que cobrem todos os biomas. */
export type Video = { id: string; titulo: string; instituicao: string; bioma: string; assunto: string };

export const ASSUNTOS = ["Introdução", "Fauna e flora", "Ameaças", "Conservação"];

export const VIDEOS: Video[] = [
  {
    id: "uHYgh89B67w",
    titulo: "O que é Bioma e quais são os 6 Biomas brasileiros?",
    instituicao: "IBGE (websérie IBGE Explica)",
    bioma: "geral",
    assunto: "Introdução",
  },
  {
    id: "SpHw2y4EfHg",
    titulo: "O Que Você NÃO Sabe Sobre a Amazônia - Documentário Completo",
    instituicao: "Atlas Doc",
    bioma: "amazonia",
    assunto: "Introdução",
  },
  {
    id: "nlDCeQRJj5U",
    titulo: "Cerrado Brasileiro — Onde a Vida Resiste na Savana Mais Biodiversa do Mundo",
    instituicao: "Wild Nature - Português",
    bioma: "cerrado",
    assunto: "Introdução",
  },
  {
    id: "2q5mpWP3JZw",
    titulo: "Mata Atlântica: A Floresta Mais Ameaçada do Brasil",
    instituicao: "Planeta Pulsante",
    bioma: "mata-atlantica",
    assunto: "Ameaças",
  },
  {
    id: "XcIU8knKpzo",
    titulo: "Caatinga: O Bioma Mais Surpreendente do Mundo",
    instituicao: "Mundo Feroz",
    bioma: "caatinga",
    assunto: "Introdução",
  },
  {
    id: "At-1KfyUwBo",
    titulo: "Pampa: a natureza selvagem e o homem vivendo em harmonia",
    instituicao: "TV Brasil (Nossos Biomas)",
    bioma: "pampa",
    assunto: "Introdução",
  },
  {
    id: "GzMdBydiu1s",
    titulo: "Pantanal: South America's Nature at Its Wildest",
    instituicao: "space and science",
    bioma: "pantanal",
    assunto: "Introdução",
  },
  {
    id: "fQXyPT62kL8",
    titulo: "Sistema costeiro marinho",
    instituicao: "Pó de giz digital",
    bioma: "costeiro-marinho",
    assunto: "Introdução",
  },
];

export const ytWatch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const ytEmbed = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`;
export const ytBusca = (consulta: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(consulta)}`;
