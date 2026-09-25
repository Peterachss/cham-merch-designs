// "More ideas" tab: concept mockups drawn as inline SVG (front + back),
// each with clickable shirt colourways.

const INK_DARK = "#1f2a2e";
const INK_LIGHT = "#f6efe0";
const C = {
  pink: "#f06a8f", yellow: "#f5c542", green: "#6cc3a0", teal: "#4fb3bf",
  blue: "#5b8ff9", lav: "#a78bfa", orange: "#f59e42", red: "#e8505b"
};
const SHIRTS = {
  white: ["White", "#ffffff"], cream: ["Cream", "#f6efe0"], sky: ["Sky blue", "#cfe3f7"],
  sage: ["Sage", "#c5d6bd"], pink: ["Pink", "#f7d0da"], butter: ["Butter", "#fbe9a8"],
  lavender: ["Lavender", "#ddd3f5"], charcoal: ["Charcoal", "#34383c"], navy: ["Navy", "#26334d"]
};
const DARK_SHIRTS = new Set(["charcoal", "navy"]);

// ---------- shared shapes ----------
const DEFS = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  <g id="s-hand">
    <rect x="-13" y="-4" width="26" height="26" rx="11"/>
    <rect x="-13" y="-19" width="6.2" height="21" rx="3.1"/>
    <rect x="-6.3" y="-25" width="6.2" height="27" rx="3.1"/>
    <rect x="0.4" y="-23" width="6.2" height="25" rx="3.1"/>
    <rect x="7.1" y="-16" width="6.2" height="18" rx="3.1"/>
    <rect x="-26" y="3" width="17" height="7" rx="3.5" transform="rotate(-35 -12 6)"/>
  </g>
  <path id="s-heart" d="M0,14 C-6,8 -18,2 -18,-6 C-18,-14 -8,-18 0,-9 C8,-18 18,-14 18,-6 C18,2 6,8 0,14 Z"/>
  <g id="s-onesie" stroke="#2b2b2b" stroke-width="1.5" stroke-linejoin="round">
    <path d="M-14,0 L-6,0 Q0,6 6,0 L14,0 L22,8 L16,15 L12,12 L12,30 Q12,36 6,36 L2,36 L0,32 L-2,36 L-6,36 Q-12,36 -12,30 L-12,12 L-16,15 L-22,8 Z"/>
    <rect x="-9" y="-5" width="3" height="9" fill="#c8a06a"/><rect x="6" y="-5" width="3" height="9" fill="#c8a06a"/>
  </g>
  <g id="s-minitee" stroke="#2b2b2b" stroke-width="1.6" stroke-linejoin="round">
    <path d="M-18,0 L-7,0 Q0,6 7,0 L18,0 L29,11 L21,19 L16,15 L16,42 L-16,42 L-16,15 L-21,19 L-29,11 Z"/>
    <rect x="-12" y="-5" width="3.5" height="10" fill="#c8a06a"/><rect x="8.5" y="-5" width="3.5" height="10" fill="#c8a06a"/>
  </g>
  <g id="s-lantern">
    <circle r="27" opacity=".22"/>
    <rect x="-7" y="-23" width="14" height="5" rx="1.5" fill="#c8942e"/>
    <ellipse rx="15" ry="18"/>
    <ellipse rx="7" ry="18" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="1.4"/>
    <rect x="-6" y="16" width="12" height="4" rx="1.5" fill="#c8942e"/>
    <path d="M0,20 L0,34" stroke="#c8942e" stroke-width="2.2" stroke-linecap="round"/>
  </g>
</defs></svg>`;

const FONT_D = `font-family="Fredoka, sans-serif"`;
const FONT_H = `font-family="Caveat, cursive"`;
const FONT_B = `font-family="Nunito, sans-serif"`;

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
function heartHands() {
  const k = 5.2, cy = -40, n = 16, cols = [C.pink, C.yellow, C.green, C.blue, C.orange, C.lav, C.teal];
  let out = `<use href="#s-heart" fill="${C.pink}" opacity=".16" transform="translate(0,-42) scale(4.9)"/>`;
  for (let i = 0; i < n; i++) {
    const t = ((i + 0.5) / n) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3 * k;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * k + cy;
    const ang = [-14, 8, -6, 12][i % 4];
    out += `<use href="#s-hand" fill="${cols[i % cols.length]}" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${ang.toFixed(0)}) scale(.66)"/>`;
  }
  return out;
}

function clothesline() {
  const letters = ["C", "H", "Ạ", "M"], xs = [-66, -22, 22, 66], rots = [-6, 4, -3, 6];
  const cols = [C.pink, C.yellow, C.green, C.blue];
  return letters.map((l, i) => {
    const t = (xs[i] + 95) / 190, y = -100 + 2 * t * (1 - t) * 30;
    return `<g transform="translate(${xs[i]},${y.toFixed(1)}) rotate(${rots[i]})">
      <use href="#s-minitee" fill="${cols[i]}"/>
      <text x="0" y="34" text-anchor="middle" ${FONT_D} font-weight="700" font-size="19" fill="#fff" stroke="#2b2b2b" stroke-width=".6">${l}</text>
    </g>`;
  }).join("");
}

function lanterns() {
  const xs = [-72, -36, 0, 36, 72], drops = [18, 40, 26, 44, 20];
  const cols = [C.red, C.yellow, C.pink, C.orange, C.teal];
  return xs.map((x, i) => {
    const t = (x + 95) / 190, y = -120 + 2 * t * (1 - t) * 40;
    return `<path class="inks" stroke-width="1.3" d="M${x},${y.toFixed(1)} L${x},${(y + drops[i]).toFixed(1)}"/>
      <use href="#s-lantern" fill="${cols[i]}" transform="translate(${x},${(y + drops[i] + 22).toFixed(1)})"/>`;
  }).join("");
}

const SKY_DOTS = [[-95, -60], [-60, -10], [88, -40], [60, 5], [-20, 20], [100, 30], [-100, 40], [30, -140], [-40, -150]]
  .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.7" class="ink" opacity=".6"/>`).join("");

const IDEAS = [
  {
    id: "dictionary", garment: "tee", title: "chạm (v.) to touch",
    desc: "A dictionary-style tee: the three meanings of chạm on the back, one small word on the chest.",
    shirts: ["cream", "white", "sage", "charcoal"],
    chest: `<text class="ink" x="-6" y="8" text-anchor="middle" ${FONT_D} font-weight="700" font-size="22">chạm</text>
      <use href="#s-heart" fill="${C.pink}" transform="translate(30,-10) scale(.38)"/>`,
    back: `<text class="ink" x="0" y="-82" text-anchor="middle" ${FONT_D} font-weight="700" font-size="62">chạm</text>
      <text class="ink" x="0" y="-54" text-anchor="middle" ${FONT_B} font-style="italic" font-size="13" opacity=".75">verb · Vietnamese</text>
      <path class="inks" stroke-width="1.2" opacity=".35" d="M-84,-38 L84,-38"/>
      <g class="ink" ${FONT_B} font-size="12.5" font-weight="600">
        <text x="-84" y="-12">1. to touch.</text>
        <text x="-84" y="12">2. to reach someone’s heart.</text>
        <text x="-84" y="36">3. to change a life, gently.</text>
      </g>
      <use href="#s-heart" fill="${C.pink}" transform="translate(0,82) scale(1.4)"/>
      <path stroke="${C.yellow}" stroke-width="3" stroke-linecap="round" d="M-34,66 L-26,72 M-38,84 L-28,84 M34,66 L26,72 M38,84 L28,84"/>
      <g class="ink" ${FONT_D} font-weight="600" font-size="9.5" letter-spacing="2" text-anchor="middle">
        <text x="0" y="128">CHANGING LIVES</text><text x="0" y="142">THROUGH COMPASSION</text>
      </g>`
  },
  {
    id: "clothesline", garment: "tee", title: "Hang Out With Us",
    desc: "The clothesline from your drafts, but every little shirt carries a letter of C-H-Ạ-M.",
    shirts: ["white", "sky", "sage", "charcoal"],
    chest: `<path class="inks" fill="none" stroke-width="1.4" d="M-40,-14 Q0,-4 40,-14"/>
      <use href="#s-onesie" fill="${C.pink}" transform="translate(-22,-11) scale(.52)"/>
      <use href="#s-onesie" fill="${C.yellow}" transform="translate(0,-9) scale(.52)"/>
      <use href="#s-onesie" fill="${C.blue}" transform="translate(22,-11) scale(.52)"/>`,
    back: `<path class="inks" fill="none" stroke-width="2" d="M-100,-104 Q0,-68 100,-104"/>
      ${clothesline()}
      <text class="ink" x="0" y="14" text-anchor="middle" ${FONT_D} font-weight="600" font-size="30">every child</text>
      <text class="ink" x="0" y="48" text-anchor="middle" ${FONT_D} font-weight="600" font-size="30">deserves <tspan fill="${C.pink}">colour</tspan></text>
      <text class="ink" x="0" y="88" text-anchor="middle" ${FONT_H} font-weight="700" font-size="23">changing lives</text>
      <text class="ink" x="0" y="110" text-anchor="middle" ${FONT_H} font-weight="700" font-size="23">through compassion</text>`
  },
  {
    id: "hands", garment: "hoodie", title: "Little Hands, Big Hearts",
    desc: "Sixteen colourful handprints make one big heart on the back of the hoodie, with a single hand on the chest.",
    shirts: ["white", "cream", "lavender", "sky"],
    chest: `<use href="#s-hand" fill="${C.pink}" transform="scale(1.1)"/>
      <use href="#s-heart" fill="#fff" transform="translate(0,10) scale(.42)"/>`,
    back: `${heartHands()}
      <text class="ink" x="0" y="-24" text-anchor="middle" ${FONT_D} font-weight="700" font-size="32">chạm</text>
      <text class="ink" x="0" y="96" text-anchor="middle" ${FONT_D} font-weight="600" font-size="32">little hands,</text>
      <text x="0" y="132" text-anchor="middle" ${FONT_D} font-weight="700" font-size="32" fill="${C.pink}">big hearts.</text>`
  },
  {
    id: "lanterns", garment: "hoodie", title: "Light the Way",
    desc: "A string of Hội An lanterns glowing on a dark hoodie. Chạm helps light the way for someone.",
    shirts: ["navy", "charcoal", "cream", "sage"],
    chest: `<path class="inks" stroke-width="1.3" d="M0,-34 L0,-22"/>
      <use href="#s-lantern" fill="${C.red}" transform="scale(.8)"/>`,
    back: `${SKY_DOTS}
      <path class="inks" fill="none" stroke-width="1.6" d="M-100,-124 Q0,-80 100,-124"/>
      ${lanterns()}
      <text class="ink" x="0" y="62" text-anchor="middle" ${FONT_D} font-weight="700" font-size="50">chạm</text>
      <text class="ink" x="0" y="94" text-anchor="middle" ${FONT_H} font-weight="700" font-size="25">light the way for someone</text>
      <text class="ink" x="0" y="130" text-anchor="middle" ${FONT_D} font-weight="600" font-size="9" letter-spacing="1.6">CHANGING LIVES THROUGH COMPASSION</text>`
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
