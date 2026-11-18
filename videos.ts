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
];

export const ytWatch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const ytEmbed = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`;
export const ytBusca = (consulta: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(consulta)}`;
