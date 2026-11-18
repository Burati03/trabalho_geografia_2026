/* Paisagens ilustradas dos biomas, desenhadas em SVG (sem arquivos de imagem externos).
   Cada cena é uma interpretação artística, não uma foto nem um mapa. */
import { ReactNode } from "react";

const W = 800, H = 320;
const Nuvens = ({ y = 60, op = 0.8 }: { y?: number; op?: number }) => (
  <g className="nuvens" fill="#fff" opacity={op}>
    <ellipse cx="170" cy={y} rx="62" ry="15" /><ellipse cx="215" cy={y - 10} rx="38" ry="14" />
    <ellipse cx="560" cy={y + 22} rx="74" ry="16" /><ellipse cx="610" cy={y + 12} rx="40" ry="13" />
  </g>
);
const Ceu = ({ id, de, ate }: { id: string; de: string; ate: string }) => (
  <>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={de} /><stop offset="1" stopColor={ate} /></linearGradient></defs>
    <rect width={W} height={H} fill={`url(#${id})`} />
  </>
);
const seq = (n: number) => Array.from({ length: n }, (_, i) => i);

function Amazonia({ p }: { p: string }) {
  return (
    <>
      <Ceu id={p + "c"} de="#BFE3CB" ate="#F1F8EA" />
      <circle cx="610" cy="92" r="34" fill="#FFF3C4" opacity=".9" /><Nuvens y={54} />
      <g fill="#5FA36E" opacity=".75">{seq(30).map((i) => <circle key={i} cx={i * 28 - 10} cy={176 + ((i * 29) % 20)} r={38 + ((i * 11) % 16)} />)}</g>
      <g fill="#2E8B57">{seq(26).map((i) => <circle key={i} cx={i * 32 + 6} cy={214 + ((i * 37) % 24)} r={36 + ((i * 13) % 18)} />)}</g>
      <path d="M0 262C140 244 250 292 400 270S650 236 800 262V320H0Z" fill="#7FC4D9" />
      <path d="M0 282C150 264 260 306 410 288S660 258 800 280V320H0Z" fill="#5BA9C4" opacity=".8" />
      <g fill="#14532D">
        {[120, 330, 560, 700].map((x, i) => (
          <g key={x}><rect x={x - 5} y={150 + i * 8} width="10" height={120 - i * 8} rx="3" /><circle cx={x} cy={146 + i * 8} r={46 - i * 3} /><circle cx={x - 30} cy={168 + i * 8} r="30" /><circle cx={x + 32} cy={170 + i * 8} r="28" /></g>))}
      </g>
      <ellipse cx="400" cy="205" rx="420" ry="20" fill="#fff" opacity=".16" />
    </>
  );
}

function Cerrado({ p }: { p: string }) {
  const arvore = (x: number, y: number, s: number) => (
    <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0C-4-24 8-34 0-58M0-34C-12-44-22-46-28-60M0-44C10-54 20-56 26-68" stroke="#6B4A2B" strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="-4" cy="-70" rx="40" ry="13" fill="#7C9A3F" /><ellipse cx="22" cy="-80" rx="26" ry="9" fill="#6B8E3D" /><ellipse cx="-30" cy="-66" rx="22" ry="8" fill="#8CAA4E" />
    </g>
  );
  return (
    <>
      <Ceu id={p + "c"} de="#F8D58F" ate="#FFF3D8" />
      <circle cx="170" cy="150" r="58" fill="#F6B24B" opacity=".85" />
      <path d="M0 200C120 170 240 190 380 178S620 168 800 192V320H0Z" fill="#E3B66A" />
      <path d="M0 236C160 214 300 244 460 228S680 220 800 238V320H0Z" fill="#D9A441" />
      <path d="M0 280C200 262 380 292 560 276S720 270 800 282V320H0Z" fill="#C48A2C" />
      {[[560, 240, 1.15], [330, 252, 0.85], [700, 262, 1], [90, 268, 0.9]].map(([x, y, s]) => arvore(x, y, s))}
      <g stroke="#E8C77C" strokeWidth="2" strokeLinecap="round">{seq(46).map((i) => <path key={i} d={`M${i * 18 + 4} ${300 - ((i * 7) % 16)}l${(i % 3) - 1} -${14 + ((i * 5) % 10)}`} />)}</g>
      <g transform="translate(430 232)"><rect x="-3" y="-96" width="6" height="96" fill="#6B4A2B" />
        {[-60, -30, 0, 30, 60].map((a) => <path key={a} d={`M0 -96Q${a * 0.7} ${-120 + Math.abs(a) * 0.3} ${a * 1.1} ${-90 + Math.abs(a) * 0.45}`} stroke="#4F7A32" strokeWidth="5" fill="none" strokeLinecap="round" />)}</g>
    </>
  );
}

function MataAtlantica({ p }: { p: string }) {
  return (
    <>
      <Ceu id={p + "c"} de="#CDE9E3" ate="#F4FBF8" />
      <Nuvens y={48} op={0.9} />
      <path d="M0 190L90 120L170 170L270 96L380 176L500 110L610 180L710 124L800 170V320H0Z" fill="#8DBBA9" />
      <path d="M0 220L110 156L210 206L330 140L450 214L580 150L700 212L800 176V320H0Z" fill="#4E9A7E" />
      <rect y="170" width={W} height="40" fill="#fff" opacity=".22" />
      <g fill="#0F5C4A">{seq(30).map((i) => <circle key={i} cx={i * 28 - 6} cy={238 + ((i * 31) % 22)} r={30 + ((i * 7) % 14)} />)}</g>
      <g fill="#0B4A3B">{seq(18).map((i) => <circle key={i} cx={i * 48 + 12} cy={278 + ((i * 17) % 14)} r={34 + ((i * 5) % 12)} />)}</g>
      <g transform="translate(640 280)"><rect x="-4" y="-120" width="8" height="120" fill="#5A3E26" />
        <ellipse cx="0" cy="-122" rx="56" ry="16" fill="#1F6B55" /><ellipse cx="-6" cy="-104" rx="44" ry="12" fill="#2A7C63" /><ellipse cx="4" cy="-88" rx="34" ry="10" fill="#1F6B55" /></g>
      <g transform="translate(160 290)"><rect x="-3" y="-90" width="6" height="90" fill="#5A3E26" />
        <ellipse cx="0" cy="-92" rx="42" ry="13" fill="#2A7C63" /><ellipse cx="2" cy="-76" rx="32" ry="10" fill="#1F6B55" /></g>
    </>
  );
}

function Caatinga({ p }: { p: string }) {
  const cacto = (x: number, y: number, s: number) => (
    <g key={x} transform={`translate(${x} ${y}) scale(${s})`} fill="#6E8B3D">
      <rect x="-9" y="-110" width="18" height="110" rx="9" />
      <rect x="-36" y="-82" width="14" height="40" rx="7" /><rect x="-36" y="-56" width="30" height="14" rx="7" />
      <rect x="22" y="-96" width="14" height="46" rx="7" /><rect x="6" y="-62" width="30" height="14" rx="7" />
    </g>
  );
  return (
    <>
      <Ceu id={p + "c"} de="#FFCE8A" ate="#FFF1D6" />
      <circle cx="600" cy="118" r="64" fill="#F59E3A" opacity=".9" />
      <path d="M0 210C150 186 300 206 460 194S680 188 800 208V320H0Z" fill="#C98B4F" />
      <path d="M0 252C170 234 330 262 500 246S700 244 800 256V320H0Z" fill="#B8793A" />
      <g stroke="#8C5A28" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7">
        {seq(9).map((i) => <path key={i} d={`M${i * 90 + 20} ${280 + (i % 3) * 8}l22 -8l16 10l24 -6`} />)}</g>
      {cacto(150, 262, 1.1)}{cacto(470, 270, 0.8)}{cacto(690, 266, 1)}
      <g stroke="#6B4423" strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M320 262C318 230 326 214 322 188M322 214C304 204 296 190 292 176M322 204C340 196 350 184 354 170" />
        <path d="M570 258C572 232 566 220 570 198M570 222C556 214 550 204 548 192" /></g>
    </>
  );
}

function Pantanal({ p }: { p: string }) {
  return (
    <>
      <Ceu id={p + "c"} de="#C7E4F3" ate="#F5FAFD" />
      <circle cx="140" cy="90" r="30" fill="#FFF3C4" opacity=".9" /><Nuvens y={62} />
      <g fill="#3C7A4A">{seq(22).map((i) => <ellipse key={i} cx={i * 40 + 10} cy={178 + ((i * 13) % 8)} rx={26 + ((i * 7) % 12)} ry={14 + ((i * 5) % 8)} />)}</g>
      <rect y="186" width={W} height="134" fill="#7CB7D6" />
      <rect y="186" width={W} height="34" fill="#9CCBE2" opacity=".7" />
      <g stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".55">{seq(18).map((i) => <path key={i} d={`M${(i * 53) % 760 + 10} ${210 + ((i * 29) % 90)}h${30 + ((i * 7) % 30)}`} />)}</g>
      <g fill="#4FA05A">{[[80, 276, 30], [250, 296, 38], [470, 282, 26], [660, 300, 34], [390, 252, 20]].map(([x, y, r]) => <ellipse key={x} cx={x} cy={y} rx={r} ry={r / 3.2} />)}</g>
      <g transform="translate(560 262)">
        <ellipse cx="0" cy="-40" rx="26" ry="15" fill="#fff" /><path d="M16 -48C34 -64 30 -88 36 -104" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M36 -112l22 6" stroke="#222" strokeWidth="5" strokeLinecap="round" /><circle cx="36" cy="-108" r="8" fill="#222" /><path d="M30 -92l12 0" stroke="#D64545" strokeWidth="5" />
        <path d="M-4 -28V0M8 -28V0" stroke="#3a3a3a" strokeWidth="3" /></g>
    </>
  );
}

function Pampa({ p }: { p: string }) {
  return (
    <>
      <Ceu id={p + "c"} de="#BFE0F2" ate="#F3F9FC" />
      <Nuvens y={70} op={0.95} />
      <path d="M0 196C120 164 240 186 380 176S640 160 800 188V320H0Z" fill="#B7D88A" />
      <path d="M0 232C140 204 300 236 460 218S700 208 800 230V320H0Z" fill="#8DB255" />
      <path d="M0 278C180 254 360 290 540 272S720 262 800 276V320H0Z" fill="#6F9A3E" />
      <g stroke="#9CC45F" strokeWidth="2" strokeLinecap="round">{seq(60).map((i) => <path key={i} d={`M${i * 13 + 3} ${312 - ((i * 11) % 36)}l${(i % 3) - 1} -${10 + ((i * 3) % 9)}`} />)}</g>
      <g transform="translate(250 226)"><rect x="-4" y="-46" width="8" height="46" fill="#5A3E26" /><circle cx="0" cy="-60" r="30" fill="#3E7D34" /><circle cx="-22" cy="-46" r="20" fill="#4C8D40" /><circle cx="22" cy="-48" r="18" fill="#4C8D40" /></g>
      <g stroke="#2d2d2d" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".7"><path d="M520 120q8 -8 16 0q8 -8 16 0" /><path d="M580 96q6 -6 12 0q6 -6 12 0" /></g>
    </>
  );
}

function Costeiro({ p }: { p: string }) {
  return (
    <>
      <Ceu id={p + "c"} de="#C9EEF0" ate="#F2FBFB" />
      <circle cx="560" cy="104" r="36" fill="#FFF3C4" /><Nuvens y={56} />
      <rect y="168" width={W} height="152" fill="#2BA5B5" />
      <rect y="168" width={W} height="30" fill="#5CC2CE" opacity=".6" />
      <g stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".6">
        {seq(10).map((i) => <path key={i} d={`M${(i * 83) % 700 + 10} ${200 + ((i * 23) % 70)}q12 -10 24 0t24 0`} />)}</g>
      <path d="M0 262C100 238 200 252 300 270C220 292 100 300 0 296Z" fill="#EAD7A8" />
      <path d="M0 296C120 290 240 300 330 320H0Z" fill="#D9C28A" />
      <g stroke="#5B3F24" strokeWidth="5" fill="none" strokeLinecap="round">
        {[600, 650, 700].map((x, i) => <path key={x} d={`M${x} ${196 + i * 6}Q${x - 18} ${250} ${x - 30} ${300}M${x} ${196 + i * 6}Q${x + 6} ${250} ${x + 20} ${300}`} />)}</g>
      <g fill="#2E8B57">{[[600, 186, 34], [655, 176, 40], [706, 190, 32]].map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} />)}</g>
      <rect x="520" y="296" width="280" height="24" fill="#6B8A5A" opacity=".6" />
      <g stroke="#3a3a3a" strokeWidth="2" fill="none" strokeLinecap="round"><path d="M330 90q8 -8 16 0q8 -8 16 0" /><path d="M392 70q6 -6 12 0q6 -6 12 0" /></g>
    </>
  );
}

const CENAS: Record<string, (props: { p: string }) => ReactNode> = {
  amazonia: Amazonia, cerrado: Cerrado, "mata-atlantica": MataAtlantica, caatinga: Caatinga,
  pantanal: Pantanal, pampa: Pampa, "costeiro-marinho": Costeiro,
};

export function Paisagem({ slug, titulo }: { slug: string; titulo?: string }) {
  const Cena = CENAS[slug];
  const p = "pz" + slug.replace(/[^a-z]/g, "");
  return (
    <svg className="paisagem" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role={titulo ? "img" : undefined} aria-label={titulo} aria-hidden={titulo ? undefined : true}>
      {Cena ? Cena({ p }) : null}
    </svg>
  );
}
