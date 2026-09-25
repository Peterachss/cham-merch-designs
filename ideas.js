// "More ideas" tab: concept mockups drawn as inline SVG (front + back),
// each with clickable shirt colourways. The hand-made look comes from
// wobbly marker lines, crayon and paint texture, bouncy hand lettering and
// colour printed slightly off-register, like a small-batch screen print.

const INK_DARK = "#26221f";
const INK_LIGHT = "#f4ecdc";
const C = { coral: "#e8604c", mustard: "#f0b43c", sky: "#4f8fc9", leaf: "#6fa66a", pink: "#ee86a6", peg: "#c9a36b" };
const SHIRTS = {
  white: ["White", "#ffffff"], cream: ["Cream", "#f6efe0"], sky: ["Sky blue", "#cfe3f7"],
  sage: ["Sage", "#c5d6bd"], pink: ["Pink", "#f7d0da"], butter: ["Butter", "#fbe9a8"],
  lavender: ["Lavender", "#ddd3f5"], charcoal: ["Charcoal", "#34383c"], navy: ["Navy", "#26334d"]
};
const DARK_SHIRTS = new Set(["charcoal", "navy"]);

// Seeded randomness so the "hand" wobbles the same way on every load.
function rng(seed) {
  let s = seed % 2147483647 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// ---------- texture filters + shared shapes ----------
function paintFilter(id, seed) {
  return `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="${seed}" result="w"/>
    <feDisplacementMap in="SourceGraphic" in2="w" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.14" numOctaves="3" seed="${seed + 20}"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.4 2.75" result="blotch"/>
    <feComposite in="d" in2="blotch" operator="in" result="p"/>
    <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="${seed + 40}"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2 1.95"/>
    <feComposite in="p" operator="in"/>
  </filter>`;
}

const DEFS = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  <filter id="f-rough" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4"/>
    <feDisplacementMap in="SourceGraphic" scale="3.2" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="f-text" x="-5%" y="-10%" width="110%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="9"/>
    <feDisplacementMap in="SourceGraphic" scale="1.8" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="f-crayon" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="11"/>
    <feDisplacementMap in="SourceGraphic" scale="4" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.9 0.3" numOctaves="2" seed="3"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.2 2.6"/>
    <feComposite in="d" operator="in"/>
  </filter>
  ${paintFilter("f-paint0", 5)}${paintFilter("f-paint1", 17)}${paintFilter("f-paint2", 29)}
  <g id="s-print">
    <ellipse cx="0" cy="10" rx="15" ry="17"/>
    <ellipse cx="-9.5" cy="-15" rx="4.6" ry="11" transform="rotate(-14 -9.5 -15)"/>
    <ellipse cx="-2" cy="-19.5" rx="4.9" ry="12.5" transform="rotate(-4 -2 -19.5)"/>
    <ellipse cx="6.2" cy="-17.5" rx="4.6" ry="11.5" transform="rotate(7 6.2 -17.5)"/>
    <ellipse cx="13" cy="-9" rx="4" ry="8.5" transform="rotate(22 13 -9)"/>
    <ellipse cx="-18" cy="6" rx="4.8" ry="10" transform="rotate(-52 -18 6)"/>
  </g>
</defs></svg>`;

const HEART = "M0,14 C-7,8 -19,1 -18,-7 C-17,-15 -7,-17 -1,-8 C6,-17 17,-15 18,-6 C18,2 7,9 0,14 Z";

// A colour fill printed a touch off-register under a wobbly marker outline.
function inked(d, fill, sw = 2.2) {
  return `<path d="${d}" fill="${fill}" filter="url(#f-crayon)" transform="translate(2.6,1.9)"/>
    <path d="${d}" fill="none" class="inks" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" filter="url(#f-rough)"/>`;
}

// A loose marker stroke; colour defaults to the shirt's ink.
function scribble(d, color, sw = 2.4, extra = "") {
  const paint = color ? `stroke="${color}"` : `class="inks"`;
  return `<path d="${d}" fill="none" ${paint} stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" filter="url(#f-rough)" ${extra}/>`;
}

// Hand lettering: every letter sits a little higher or lower and leans a little.
function hand(str, x, y, size, { font = "sh", fill, weight = 700, rot = 0, bounce = 0.07, tilt = 5, seed = 1, anchor = "middle" } = {}) {
  const r = rng(seed * 7919 + 13);
  let prev = 0;
  const dys = [], rots = [];
  for (const ch of Array.from(str)) {
    const o = ch === " " ? prev : (r() - 0.5) * 2 * bounce * size;
    dys.push((o - prev).toFixed(1));
    rots.push(((r() - 0.5) * 2 * tilt).toFixed(1));
    prev = o;
  }
  const paint = fill ? `class="${font}" fill="${fill}"` : `class="ink ${font}"`;
  return `<text ${paint} x="${x}" y="${y}" dy="${dys.join(" ")}" rotate="${rots.join(" ")}" transform="rotate(${rot} ${x} ${y})" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" filter="url(#f-text)">${str}</text>`;
}

// ---------- garments (each drawn in a 400 x 460 box) ----------
const OUT = `stroke="#2b2b2b" stroke-width="2.2" stroke-linejoin="round"`;
const THIN = `fill="none" stroke="#2b2b2b" stroke-width="1.4"`;
const SHADE = `fill="#000" opacity=".1"`;

function tee(side) {
  const neck = side === "front" ? "C165,64 235,64 255,38" : "C170,50 230,50 255,38";
  const collar = side === "front"
    ? `<path class="shirt" ${OUT} d="M145,38 C168,48 232,48 255,38 C235,64 165,64 145,38 Z"/>
       <path ${SHADE} d="M145,38 C168,48 232,48 255,38 C235,64 165,64 145,38 Z"/>
       <path ${THIN} d="M150,42 C170,72 230,72 250,42"/>`
    : `<path ${THIN} d="M152,42 C172,56 228,56 248,42"/>`;
  return `<path class="shirt" ${OUT} d="M145,38 ${neck} L318,60 L395,128 L352,182 L308,152 L312,438 Q200,450 88,438 L92,152 L48,182 L5,128 L82,60 Z"/>
    ${collar}
    <path ${THIN} d="M387,122 L344,176 M13,122 L56,176 M91,425 Q200,437 309,425"/>`;
}

function hoodie(side) {
  const body = `<path class="shirt" ${OUT} d="M140,66 C105,70 80,82 70,108 L24,368 L66,380 L98,196 L98,392 L302,392 L302,196 L334,380 L376,368 L330,108 C320,82 295,70 260,66 Z"/>`;
  const trims = `<path class="shirt" ${OUT} d="M24,368 L20,408 L60,420 L66,380 Z M376,368 L380,408 L340,420 L334,380 Z"/>
    <rect class="shirt" ${OUT} x="98" y="392" width="204" height="38" rx="3"/>
    <path ${THIN} d="M72,112 Q92,150 98,196 M328,112 Q308,150 302,196"/>`;
  if (side === "front") {
    const lining = "M146,68 C150,30 250,30 254,68 C238,84 216,98 200,116 C184,98 162,84 146,68 Z";
    return `<path class="shirt" ${OUT} d="M140,66 C136,22 168,6 200,6 C232,6 264,22 260,66 Z"/>
      ${body}
      <path class="shirt" ${OUT} d="${lining}"/><path ${SHADE} d="${lining}"/>
      <path ${THIN} d="M140,320 L260,320 L282,390 L118,390 Z"/>
      <path fill="none" stroke="#2b2b2b" stroke-width="2" stroke-linecap="round" d="M186,104 L182,162 M214,104 L218,162"/>
      ${trims}`;
  }
  return `${body}${trims}
    <path class="shirt" ${OUT} d="M138,70 C128,22 168,4 200,4 C232,4 272,22 262,70 C252,112 226,126 200,126 C174,126 148,112 138,70 Z"/>
    <path ${THIN} d="M200,6 L200,124"/>`;
}

const GARMENTS = {
  tee: { draw: tee, back: "translate(200,245)", chest: "translate(252,118)" },
  hoodie: { draw: hoodie, back: "translate(200,262) scale(0.8)", chest: "translate(250,160) scale(0.95)" }
};


// ---------- design concepts ----------
const CLOTHES = {
  tee: "M-18,0 L-7,0 Q0,6 7,0 L18,0 L28,11 L20,18 L16,14 L16,42 L-16,42 L-16,14 L-20,18 L-28,11 Z",
  dress: "M-9,0 Q0,5 9,0 L12,12 L23,45 Q0,49 -23,45 L-12,12 Z",
  onesie: "M-16,0 L-7,0 Q0,7 7,0 L16,0 L25,9 L18,17 L14,14 L14,34 Q14,41 7,41 L2,41 L0,36 L-2,41 L-7,41 Q-14,41 -14,34 L-14,14 L-18,17 L-25,9 Z",
  pants: "M-16,0 L16,0 L19,44 L5,44 L0,16 L-5,44 L-19,44 Z"
};
const PEG = "M-2,-6 L2,-6 L2.4,6 L-2.4,6 Z";
const LETTER_Y = { tee: 31, dress: 35, onesie: 28, pants: 22 };

function hangingItem(kind, color, letter, seed) {
  return `${inked(CLOTHES[kind], color)}
    <g transform="translate(-8,0)">${inked(PEG, C.peg, 1.4)}</g><g transform="translate(8,0)">${inked(PEG, C.peg, 1.4)}</g>
    ${hand(letter, 0, LETTER_Y[kind], 19, { weight: 800, seed, tilt: 0 })}`;
}

function clothesline() {
  const sag = x => -116 + (1 - (x / 104) ** 2) * 30 - x * 0.03;
  const items = [["tee", -68, -8, C.coral, "C"], ["dress", -24, 5, C.mustard, "H"], ["onesie", 20, -4, C.sky, "Ạ"], ["pants", 66, 9, C.leaf, "M"]];
  return `${scribble("M-104,-116 C-50,-84 40,-82 104,-122", null, 2)}
    ${scribble("M-104,-114 C-48,-86 42,-80 104,-120", null, 1, 'opacity=".45"')}
    ${items.map(([k, x, r, c, l], i) => `<g transform="translate(${x},${sag(x).toFixed(1)}) rotate(${r})">${hangingItem(k, c, l, 50 + i)}</g>`).join("")}`;
}

function handprintHeart() {
  const prints = [
    [-46, -92, -18, C.coral, 1.35], [44, -94, 16, C.sky, 1.3], [0, -62, -4, C.mustard, 1.25],
    [-80, -44, -38, C.leaf, 1.25], [80, -44, 34, C.pink, 1.3], [-44, -8, -22, C.sky, 1.3],
    [42, -6, 20, C.coral, 1.3], [0, 26, 4, C.leaf, 1.25]
  ];
  return prints.map(([x, y, r, c, s], i) =>
    `<use href="#s-print" fill="${c}" filter="url(#f-paint${i % 3})" transform="translate(${x},${y}) rotate(${r}) scale(${s})"/>`).join("");
}

const LANTERN = "M-15,-16 C-22,-6 -22,8 -15,17 L15,17 C22,8 22,-6 15,-16 Z";
const CAP = "M-8,-22 L8,-22 L8,-16 L-8,-16 Z";
const CAP_B = "M-7,17 L7,17 L7,22 L-7,22 Z";

function lantern(color, seed) {
  const r = rng(seed);
  const rays = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2 + r() * 0.5, r1 = 27 + r() * 3, r2 = r1 + 4 + r() * 4;
    return `M${(Math.cos(a) * r1).toFixed(1)},${(Math.sin(a) * r1).toFixed(1)} L${(Math.cos(a) * r2).toFixed(1)},${(Math.sin(a) * r2).toFixed(1)}`;
  }).join(" ");
  return `${scribble(rays, C.mustard, 2)}
    ${inked(LANTERN, color)}
    ${scribble("M-6,-15 C-11,-4 -11,6 -6,16 M6,-15 C11,-4 11,6 6,16", "rgba(0,0,0,.35)", 1.4)}
    ${inked(CAP, C.peg, 1.6)}${inked(CAP_B, C.peg, 1.6)}
    ${scribble("M0,22 q3,5 0,9 q-3,4 0,9", C.peg, 2)}`;
}

function lanternString() {
  const sag = x => -128 + (1 - (x / 108) ** 2) * 37;
  const xs = [-84, -42, 0, 42, 84], drops = [12, 32, 18, 36, 14], rots = [-5, 3, -2, 6, -4];
  const cols = [C.coral, C.mustard, C.pink, C.coral, C.mustard];
  return `${scribble("M-108,-128 C-50,-92 50,-90 108,-130", null, 1.8)}
    ${xs.map((x, i) => {
      const y = sag(x);
      return `${scribble(`M${x},${y.toFixed(1)} L${x + 1},${(y + drops[i]).toFixed(1)}`, null, 1.3)}
        <g transform="translate(${x + 1},${(y + drops[i] + 20).toFixed(1)}) rotate(${rots[i]}) scale(.8)">${lantern(cols[i], 60 + i)}</g>`;
    }).join("")}`;
}

const TWINKLE = "M-4,0 L4,0 M0,-4 L0,4 M-2.6,-2.6 L2.6,2.6 M-2.6,2.6 L2.6,-2.6";
const SKY = [[-98, -60], [-64, -6], [92, -44], [66, 6], [-104, 30], [104, 28], [30, -150], [-44, -154]]
  .map(([x, y], i) => i % 2
    ? `<circle cx="${x}" cy="${y}" r="1.8" class="ink" opacity=".7"/>`
    : scribble(TWINKLE, C.mustard, 1.6, `transform="translate(${x},${y})"`)).join("");

const IDEAS = [
  {
    id: "dictionary", garment: "tee", title: "chạm (v.) to touch",
    desc: "A dictionary page someone has scribbled on: highlighted word, typed meanings, and a marker arrow pointing at the one that’s about us.",
    shirts: ["cream", "white", "sage", "charcoal"],
    chest: `<path d="M-27,-7 L22,-10 L23,4 L-26,7 Z" fill="${C.pink}" opacity=".75" filter="url(#f-crayon)"/>
      ${hand("chạm", -3, 4, 21, { weight: 800, rot: -5, seed: 4 })}
      <g transform="translate(32,-12) rotate(12) scale(.42)">${inked(HEART, C.coral, 4.5)}</g>`,
    back: `<path d="M-80,-104 L66,-110 L70,-74 L-76,-68 Z" fill="${C.pink}" opacity=".75" filter="url(#f-crayon)" transform="rotate(-4)"/>
      ${hand("chạm", -6, -78, 64, { weight: 800, rot: -5, seed: 3 })}
      <text class="ink tw" x="-88" y="-44" font-size="12">(verb)</text>
      <g class="ink tw" font-size="11">
        <text x="-90" y="-16">1. to touch.</text>
        <text x="-90" y="7">2. to reach someone’s heart.</text>
        <text x="-90" y="30">3. to change a life, gently.</text>
      </g>
      ${scribble("M-91,37 C-50,41 0,34 58,39 C74,40 88,36 97,39", C.coral, 3)}
      ${scribble("M52,86 C60,70 52,56 34,47 M26,54 L34,46 L37,57", null, 2.2)}
      ${hand("that’s us!", 62, 104, 19, { font: "ph", weight: 400, rot: -7, seed: 5 })}
      <g transform="translate(-52,92) rotate(-12) scale(1.45)">${inked(HEART, C.coral, 1.8)}</g>
      ${hand("changing lives through compassion", 0, 146, 13, { font: "ph", weight: 400, seed: 8, bounce: 0.05, tilt: 3 })}`
  },
  {
    id: "clothesline", garment: "tee", title: "Hang Out With Us",
    desc: "Your clothesline idea, drawn loose in marker and crayon: four little outfits pegged up, each spelling out a letter of C-H-Ạ-M.",
    shirts: ["white", "sky", "cream", "charcoal"],
    chest: `${scribble("M-40,-16 C-15,-6 15,-6 40,-16", null, 1.6)}
      <g transform="translate(-22,-12) rotate(-6) scale(.5)">${inked(CLOTHES.tee, C.coral, 3.6)}</g>
      <g transform="translate(0,-9) rotate(3) scale(.5)">${inked(CLOTHES.onesie, C.sky, 3.6)}</g>
      <g transform="translate(22,-12) rotate(7) scale(.5)">${inked(CLOTHES.dress, C.mustard, 3.6)}</g>`,
    back: `${clothesline()}
      ${hand("every child", 0, 6, 28, { seed: 21 })}
      ${hand("deserves", -6, 38, 28, { seed: 22 })}
      ${scribble("M-58,92 C-20,97 30,88 70,93", C.mustard, 5)}
      ${hand("colour!", 4, 80, 40, { fill: C.coral, weight: 800, rot: -4, seed: 23 })}
      ${hand("changing lives through compassion", 0, 128, 13, { font: "ph", weight: 400, seed: 24, bounce: 0.05, tilt: 3 })}`
  },
  {
    id: "hands", garment: "hoodie", title: "Little Hands, Big Hearts",
    desc: "Eight painty handprints pressed into a wonky heart, the way a class of kids would actually do it. Even better: use real handprints from the children.",
    shirts: ["white", "cream", "lavender", "sky"],
    chest: `<use href="#s-print" fill="${C.coral}" filter="url(#f-paint1)" transform="rotate(-8) scale(.95)"/>
      <g transform="translate(24,-22) rotate(14) scale(.36)">${scribble(HEART, null, 5)}</g>`,
    back: `${handprintHeart()}
      <g transform="translate(-100,30) rotate(-14) scale(.6)">${scribble(HEART, null, 3.4)}</g>
      <g transform="translate(102,22) rotate(10) scale(.5)">${scribble(HEART, C.coral, 4)}</g>
      ${hand("little hands,", 0, 94, 32, { seed: 31 })}
      ${hand("big hearts.", 0, 134, 38, { fill: C.coral, weight: 800, rot: -3, seed: 32 })}`
  },
  {
    id: "lanterns", garment: "hoodie", title: "Light the Way",
    desc: "A crooked string of hand-drawn lanterns with little lines of light, on a navy hoodie. Chạm helps light the way for someone.",
    shirts: ["navy", "charcoal", "cream", "sage"],
    chest: `${scribble("M0,-36 L1,-24", null, 1.3)}
      <g transform="translate(1,-2) rotate(-4) scale(.75)">${lantern(C.coral, 71)}</g>`,
    back: `${SKY}
      ${lanternString()}
      ${hand("light the way", 0, 70, 30, { weight: 800, seed: 41 })}
      ${hand("for someone.", 10, 104, 26, { font: "ph", weight: 400, rot: -3, seed: 42 })}
      ${hand("chạm", 0, 140, 17, { weight: 700, seed: 43 })}
      ${scribble("M-22,148 q5.5,-4 11,0 t11,0 t11,0 t11,0", C.mustard, 2)}`
  }
];

// ---------- rendering ----------
function shirtVars(key) {
  return `--shirt:${SHIRTS[key][1]};--dink:${DARK_SHIRTS.has(key) ? INK_LIGHT : INK_DARK}`;
}

function mockupSVG(idea, shirtKey) {
  const g = GARMENTS[idea.garment];
  return `<svg class="mock" viewBox="0 0 820 480" role="img" aria-label="${idea.title}: ${idea.garment} front and back" style="${shirtVars(shirtKey)}">
    <g transform="translate(5,8)">${g.draw("front")}<g transform="${g.chest}">${idea.chest}</g></g>
    <g transform="translate(415,8)">${g.draw("back")}<g transform="${g.back}">${idea.back}</g></g>
    <text class="lbl" x="205" y="474" text-anchor="middle">FRONT</text>
    <text class="lbl" x="615" y="474" text-anchor="middle">BACK</text>
  </svg>`;
}

function renderIdeas() {
  document.body.insertAdjacentHTML("afterbegin", DEFS);
  const grid = document.getElementById("ideas-grid");
  grid.innerHTML = IDEAS.map((idea, n) => `
    <figure class="idea" data-id="${idea.id}">
      <button class="zoom" aria-label="Enlarge ${idea.title}">${mockupSVG(idea, idea.shirts[0])}</button>
      <figcaption>
        <div class="idea-head"><strong>${idea.title}</strong><span class="kind">${idea.garment === "tee" ? "T-shirt" : "Hoodie"} · idea ${n + 1}</span></div>
        <span>${idea.desc}</span>
        <div class="swatches" role="group" aria-label="Shirt colour">
          ${idea.shirts.map((s, i) => `<button class="sw" data-shirt="${s}" aria-label="${SHIRTS[s][0]}" title="${SHIRTS[s][0]}" aria-pressed="${i === 0}" style="background:${SHIRTS[s][1]}"></button>`).join("")}
        </div>
      </figcaption>
    </figure>`).join("");

  grid.addEventListener("click", e => {
    const sw = e.target.closest(".sw");
    if (!sw) return;
    const fig = sw.closest("figure");
    fig.querySelector("svg.mock").setAttribute("style", shirtVars(sw.dataset.shirt));
    fig.querySelectorAll(".sw").forEach(b => b.setAttribute("aria-pressed", b === sw));
  });
  document.getElementById("ideas-count").textContent = IDEAS.length;
}

renderIdeas();
