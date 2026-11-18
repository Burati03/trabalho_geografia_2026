/* Conteúdo educativo dos biomas (seção "Aprenda sobre os Biomas").
   Texto de apoio escrito de forma geral, sem números não verificados. Os números de monitoramento
   continuam vindo da API. Para aprofundar, use os links de "Saiba mais" (IBGE, WWF-Brasil, MMA). */
export type BiomaInfo = {
  slug: string; nome: string; frase: string; descricao: string; local: string; clima: string;
  caracteristicas: string[]; fauna: string[]; flora: string[];
  ameacas: { t: string; d: string }[]; curiosidades: string[];
};

export const SAIBA_MAIS: { nome: string; url: string }[] = [
  { nome: "IBGE Educa: Biomas brasileiros", url: "https://educa.ibge.gov.br/jovens/conheca-o-brasil/territorio/18307-biomas-brasileiros.html" },
  { nome: "WWF-Brasil: Biomas", url: "https://www.wwf.org.br/nossosconteudos/biomas/" },
  { nome: "Ministério do Meio Ambiente: Cerrado", url: "https://www.gov.br/mma/pt-br/assuntos/biodiversidade-e-biomas/biomas-e-ecossistemas/biomas/cerrado" },
];

export const BIOMAS_INFO: BiomaInfo[] = [
  {
    slug: "amazonia", nome: "Amazônia",
    frase: "A maior floresta tropical do planeta e a maior bacia hidrográfica do mundo.",
    descricao: "A Amazônia é o maior bioma brasileiro e ocupa cerca de metade do território nacional, espalhada por nove estados. Sua floresta densa e úmida ajuda a regular a chuva, guarda uma enorme diversidade de vida e abriga povos indígenas e comunidades tradicionais que vivem dela há muitas gerações.",
    local: "Região Norte, com partes do Centro-Oeste e do Maranhão",
    clima: "Equatorial: quente e úmido, com chuva forte durante boa parte do ano.",
    caracteristicas: [
      "Floresta densa, com árvores altas e copas que formam camadas de sombra",
      "Rios gigantes funcionam como estradas para quem vive na floresta",
      "A água liberada pelas árvores volta ao ar e vira chuva, inclusive longe dali",
      "O solo é pobre: os nutrientes vêm das folhas e galhos que caem e se decompõem",
    ],
    fauna: ["Onça-pintada", "Boto-cor-de-rosa", "Peixe-boi-da-amazônia", "Harpia", "Arara-vermelha", "Jacaré-açu", "Macaco-aranha", "Pirarucu"],
    flora: ["Castanheira", "Seringueira", "Açaizeiro", "Vitória-régia", "Sumaúma", "Cupuaçuzeiro"],
    ameacas: [
      { t: "Desmatamento", d: "A mata é derrubada para abrir pasto, lavouras e áreas de exploração ilegal. Quanto mais floresta se perde, menos chuva e mais risco de ela não conseguir se recuperar." },
      { t: "Queimadas e incêndios", d: "O fogo usado para limpar terreno escapa para a mata, que em geral não é adaptada a queimar." },
      { t: "Garimpo e extração ilegais", d: "Contaminam rios com mercúrio e pressionam terras indígenas e unidades de conservação." },
      { t: "Mudanças climáticas e secas extremas", d: "Secas mais longas secam rios, ameaçam comunidades e aumentam a morte de árvores e de animais aquáticos." },
    ],
    curiosidades: [
      "Os \"rios voadores\" são massas de vapor de água que saem da floresta e ajudam a levar chuva a outras regiões do país.",
      "Os botos-cor-de-rosa são golfinhos de água doce.",
      "A castanheira depende da cutia, que enterra as sementes e ajuda a espalhá-las pela floresta.",
    ],
  },
  {
    slug: "cerrado", nome: "Cerrado",
    frase: "A savana rica em vida que serve de berço para grandes rios brasileiros.",
    descricao: "O Cerrado é o segundo maior bioma do Brasil e ocupa o centro do país. Mistura campos, savanas e matas, tem duas estações bem marcadas e abriga nascentes de bacias importantes, como a do São Francisco e a do Tocantins-Araguaia.",
    local: "Planalto Central, com trechos no Centro-Oeste, Nordeste, Sudeste e Norte",
    clima: "Tropical com duas estações: verão chuvoso e inverno seco.",
    caracteristicas: [
      "Árvores de tronco retorcido e casca grossa, adaptadas ao fogo natural",
      "Raízes muito profundas que buscam água no subsolo — por isso o Cerrado é chamado de \"floresta de cabeça para baixo\"",
      "Mosaico de campos, savanas e florestas de galeria ao longo dos rios",
      "Muitas espécies que só existem ali (endêmicas)",
    ],
    fauna: ["Lobo-guará", "Tamanduá-bandeira", "Ema", "Tatu-canastra", "Seriema", "Onça-parda", "Pato-mergulhão", "Arara-canindé"],
    flora: ["Pequi", "Buriti", "Ipê-amarelo", "Barbatimão", "Baru", "Capim-dourado", "Cagaita"],
    ameacas: [
      { t: "Expansão agropecuária", d: "A vegetação nativa dá lugar a lavouras e pastos, e com ela some o abrigo de muitas espécies." },
      { t: "Queimadas fora de época", d: "O fogo natural faz parte do bioma, mas queimadas frequentes e fora de época prejudicam a regeneração." },
      { t: "Perda de nascentes", d: "Menos vegetação nativa significa menos água infiltrando no solo e alimentando os rios." },
      { t: "Pouca proteção formal", d: "Uma parte pequena do bioma está em unidades de conservação, o que deixa muitas áreas expostas." },
    ],
    curiosidades: [
      "O pequi e o baru são frutos do Cerrado muito usados na culinária regional.",
      "Muitas plantas rebrotam depois do fogo natural graças às raízes profundas e às cascas grossas.",
      "O Cerrado é chamado de \"berço das águas\" porque nele nascem rios que abastecem várias regiões do país.",
    ],
  },
  {
    slug: "mata-atlantica", nome: "Mata Atlântica",
    frase: "Uma floresta que acompanha o litoral e hoje resiste em fragmentos.",
    descricao: "A Mata Atlântica se estende ao longo da costa, do Nordeste ao Sul, e avança para o interior em alguns trechos. Foi a primeira floresta explorada pelos colonizadores e hoje restam pedaços dela, que ainda guardam uma biodiversidade enorme.",
    local: "Faixa litorânea, do Nordeste ao Sul, com trechos no interior",
    clima: "Tropical úmido e subtropical, com muita chuva perto do mar.",
    caracteristicas: [
      "Floresta alta e densa, cheia de bromélias, orquídeas e outras plantas que crescem sobre as árvores",
      "Relevo variado, com serras e vales, e ambientes ligados ao litoral como restingas e manguezais",
      "No Sul, inclui as florestas com araucária",
      "Muitas espécies exclusivas, razão pela qual é prioridade mundial de conservação",
    ],
    fauna: ["Mico-leão-dourado", "Muriqui", "Onça-pintada", "Jacutinga", "Anta", "Sabiá-laranjeira", "Bugio", "Gato-do-mato"],
    flora: ["Pau-brasil", "Jacarandá", "Araucária", "Palmito-juçara", "Ipê", "Jequitibá", "Bromélias", "Orquídeas"],
    ameacas: [
      { t: "Desmatamento histórico e fragmentação", d: "A floresta foi cortada em pedaços isolados, o que dificulta a circulação dos animais e a reprodução das plantas." },
      { t: "Urbanização e especulação imobiliária", d: "Cidades, estradas e loteamentos avançam sobre os remanescentes de mata." },
      { t: "Caça e tráfico de animais", d: "Aves e primatas estão entre os animais mais afetados pela captura ilegal." },
      { t: "Extração ilegal de palmito-juçara", d: "Cortar o palmito mata a planta, que demora muitos anos para se recuperar." },
    ],
    curiosidades: [
      "O nome do Brasil vem do pau-brasil, árvore típica da Mata Atlântica.",
      "O mico-leão-dourado vive apenas na Mata Atlântica do Rio de Janeiro e virou símbolo de um dos casos de recuperação de espécie mais conhecidos do país.",
      "A maior parte da população brasileira vive em áreas que originalmente eram cobertas por Mata Atlântica.",
    ],
  },
  {
    slug: "caatinga", nome: "Caatinga",
    frase: "O único bioma que existe somente no Brasil, feito para a seca.",
    descricao: "A Caatinga é exclusivamente brasileira e ocupa grande parte do Nordeste. Tem clima semiárido e plantas adaptadas à falta de água. Seu nome, em tupi, remete à \"mata branca\", como fica a vegetação quando perde as folhas na estiagem.",
    local: "Nordeste e norte de Minas Gerais",
    clima: "Semiárido: calor intenso, chuvas curtas e irregulares.",
    caracteristicas: [
      "Muitas plantas perdem as folhas na seca para poupar água e rebrotam logo que chove",
      "Cactos, árvores espinhosas e raízes que armazenam água",
      "Rios temporários, que secam em parte do ano",
      "A paisagem muda de cinza para verde em poucos dias de chuva",
    ],
    fauna: ["Ararinha-azul", "Asa-branca", "Tatu-bola", "Veado-catingueiro", "Preá", "Cutia", "Gambá"],
    flora: ["Mandacaru", "Xique-xique", "Facheiro", "Umbuzeiro", "Juazeiro", "Caatingueira"],
    ameacas: [
      { t: "Desmatamento e uso de lenha", d: "Boa parte da energia usada para cozinhar e em atividades produtivas ainda vem da madeira nativa." },
      { t: "Desertificação", d: "A combinação de solo degradado, pouca chuva e perda de vegetação torna a terra menos produtiva." },
      { t: "Caça e tráfico de animais", d: "Aves e outros animais são capturados ilegalmente, o que ameaça espécies como a ararinha-azul." },
      { t: "Mudanças climáticas", d: "Por já ser seco, o bioma é muito sensível a secas mais longas e ao aumento da temperatura." },
    ],
    curiosidades: [
      "O tatu-bola, animal da Caatinga, inspirou o mascote da Copa do Mundo de 2014.",
      "O umbuzeiro guarda água nas raízes e seus frutos geram renda para muitas famílias do sertão.",
      "A Caatinga costuma ser vista como terra sem vida, mas abriga grande biodiversidade.",
    ],
  },
  {
    slug: "pantanal", nome: "Pantanal",
    frase: "A maior planície alagável do mundo, onde a água dita o ritmo da vida.",
    descricao: "O Pantanal é a maior planície alagável do planeta. Fica no centro da América do Sul e, no Brasil, ocupa partes de Mato Grosso e Mato Grosso do Sul. A vida ali segue o ritmo da água: na cheia, os rios transbordam; na seca, a terra volta a aparecer.",
    local: "Mato Grosso e Mato Grosso do Sul",
    clima: "Tropical, com verão chuvoso e inverno seco. A cheia chega depois das chuvas nas áreas mais altas.",
    caracteristicas: [
      "Planície que alaga e seca todos os anos, num ciclo que organiza a vida da região",
      "Mistura de ambientes: campos, matas, trechos de cerrado e áreas alagadas",
      "Os rios que o alimentam nascem no planalto ao redor",
      "Grande concentração de aves e de animais fáceis de observar",
    ],
    fauna: ["Jacaré-do-pantanal", "Tuiuiú", "Capivara", "Sucuri", "Onça-pintada", "Arara-azul-grande", "Ariranha", "Cervo-do-pantanal"],
    flora: ["Aguapé", "Piúva", "Ipê-roxo", "Carandá", "Acuri", "Manduvi", "Cambará"],
    ameacas: [
      { t: "Incêndios", d: "Em anos de seca forte, o fogo se espalha pela vegetação seca e atinge grandes áreas." },
      { t: "Seca e mudança no regime de cheias", d: "Cheias menores ou fora de época alteram a vida de plantas, peixes e aves." },
      { t: "Uso do solo no planalto ao redor", d: "O que acontece nas cabeceiras dos rios (desmatamento, erosão) chega à planície." },
      { t: "Assoreamento e barragens", d: "Mudam o caminho e o volume da água que alimenta o Pantanal." },
    ],
    curiosidades: [
      "O tuiuiú é a ave-símbolo do Pantanal.",
      "O Pantanal é Patrimônio Natural da Humanidade e Reserva da Biosfera, títulos concedidos pela UNESCO.",
      "A cheia e a seca fazem parte do ciclo natural; o problema aparece quando elas fogem muito do normal.",
    ],
  },
  {
    slug: "pampa", nome: "Pampa",
    frase: "Campos abertos e colinas suaves no extremo sul do país.",
    descricao: "O Pampa, também chamado de campos sulinos, é formado por gramíneas e colinas suaves. No Brasil existe somente no Rio Grande do Sul e continua pelo Uruguai e pela Argentina.",
    local: "Rio Grande do Sul",
    clima: "Subtropical: verões quentes, invernos frios e chuva distribuída ao longo do ano.",
    caracteristicas: [
      "Campos abertos de gramíneas, com poucas árvores",
      "Relevo de colinas suaves, chamadas coxilhas",
      "Árvores e arbustos aparecem em matas ao longo dos rios e em pequenos capões",
      "Boa parte do campo nativo é usada para a pecuária",
    ],
    fauna: ["Quero-quero", "Ema", "Veado-campeiro", "Graxaim-do-campo", "Tuco-tuco", "Capivara", "João-de-barro"],
    flora: ["Gramíneas nativas", "Espinilho", "Butiá", "Aroeira", "Figueira"],
    ameacas: [
      { t: "Conversão do campo nativo", d: "Campos viram lavouras e plantações de árvores, e a vegetação original some." },
      { t: "Espécies exóticas invasoras", d: "O capim-annoni, por exemplo, ocupa o espaço das gramíneas nativas." },
      { t: "Manejo inadequado do solo", d: "Em alguns trechos, o uso intenso do solo arenoso causa a arenização, com perda de cobertura vegetal." },
      { t: "Poucas áreas protegidas", d: "É um dos biomas com menos unidades de conservação, o que deixa o campo nativo mais exposto." },
    ],
    curiosidades: [
      "O quero-quero é uma ave muito ligada à cultura gaúcha e costuma avisar quando alguém se aproxima do ninho.",
      "Os campos convivem com a pecuária há séculos, e o manejo adequado ajuda a manter o campo nativo.",
      "O Pampa tem grande variedade de gramíneas, que sustentam toda a cadeia de vida da região.",
    ],
  },
  {
    slug: "costeiro-marinho", nome: "Sistema Costeiro-Marinho",
    frase: "Onde o continente encontra o mar: manguezais, restingas, dunas e recifes.",
    descricao: "O Sistema Costeiro-Marinho reúne os ambientes entre a terra e o mar: praias, dunas, restingas, manguezais, estuários, costões rochosos e recifes. O IBGE o trata como um conjunto complementar aos seis biomas continentais, porque ele se estende da costa até o mar.",
    local: "Todo o litoral brasileiro e as águas marinhas do país",
    clima: "Varia ao longo da costa, do tropical quente no Norte e Nordeste ao subtropical no Sul.",
    caracteristicas: [
      "Manguezais crescem em água salobra e protegem a costa contra a erosão",
      "Restingas e dunas formam faixas de areia com vegetação própria",
      "Recifes e costões rochosos abrigam muita vida marinha",
      "Estuários misturam água doce e salgada e funcionam como berçários",
    ],
    fauna: ["Peixe-boi-marinho", "Tartarugas-marinhas", "Baleia-jubarte", "Boto-cinza", "Caranguejo-uçá", "Guará"],
    flora: ["Mangue-vermelho", "Mangue-branco", "Mangue-preto (siriúba)", "Vegetação de restinga", "Algas marinhas"],
    ameacas: [
      { t: "Poluição", d: "Esgoto, plásticos e óleo chegam ao mar e aos manguezais e afetam toda a cadeia de vida." },
      { t: "Ocupação desordenada e aterros", d: "Construções sobre dunas, restingas e manguezais destroem ambientes que protegem a costa." },
      { t: "Pesca predatória", d: "A retirada excessiva de peixes e a captura de espécies ameaçadas reduzem as populações." },
      { t: "Aquecimento do mar e erosão costeira", d: "Corais sofrem com o calor da água e a costa sofre com a elevação do nível do mar." },
    ],
    curiosidades: [
      "Os manguezais são berçários: muitos peixes, caranguejos e camarões passam ali a fase jovem.",
      "A baleia-jubarte usa águas do litoral brasileiro para reprodução e para criar os filhotes.",
      "As raízes aéreas do mangue ajudam a segurar o sedimento e a proteger a costa.",
    ],
  },
];
