/**
 * Clean geometric SVG icon generator.
 * 6 icons recreated from root SVG references with mathematical precision.
 */
const fs = require('fs');
const PI  = Math.PI;
const cos = Math.cos;
const sin = Math.sin;
const sq3 = Math.sqrt(3);

const STROKE = '#ffffff';
const SW     = 1.6;

function svg(vb, body) {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"`,
    `     fill="none" stroke="${STROKE}" stroke-width="${SW}"`,
    `     stroke-linecap="round" stroke-linejoin="round">`,
    body,
    `</svg>`
  ].join('\n');
}

const pt = (x, y) => `${x.toFixed(3)},${y.toFixed(3)}`;
const ln = (x1, y1, x2, y2) =>
  `<line x1="${x1.toFixed(3)}" y1="${y1.toFixed(3)}" x2="${x2.toFixed(3)}" y2="${y2.toFixed(3)}"/>`;
const pol = (pts) =>
  `<polygon points="${pts.map(([x,y]) => pt(x,y)).join(' ')}"/>`;

// ───────────────────────────────────────────────────────────────────────────
// ICON 1 — Isometric Cube Triangle  (ref: 004726.svg)
//   Six cubes arranged in a triangular 3-2-1 row formation
// ───────────────────────────────────────────────────────────────────────────
function icon1() {
  const S  = 46;               // cube half-size
  const dx = S * sq3 / 2;     // horizontal offset to corner
  const dy = S / 2;           // vertical   offset to corner

  // Cube centers in the isometric triangle (origin top, 3 rows)
  const O  = [130, 58];
  const centers = [
    [O[0],          O[1]],                   // row 1, pos 1
    [O[0] - dx,     O[1] + 3*dy],            // row 2, pos 1
    [O[0] + dx,     O[1] + 3*dy],            // row 2, pos 2
    [O[0] - 2*dx,   O[1] + 6*dy],            // row 3, pos 1
    [O[0],          O[1] + 6*dy],            // row 3, pos 2
    [O[0] + 2*dx,   O[1] + 6*dy],            // row 3, pos 3
  ];

  const els = [];
  for (const [cx, cy] of centers) {
    const T  = [cx,      cy - 2*dy];  // top apex
    const TL = [cx - dx, cy - dy];
    const TR = [cx + dx, cy - dy];
    const BL = [cx - dx, cy + dy];
    const BR = [cx + dx, cy + dy];
    const B  = [cx,      cy + 2*dy];  // bottom apex
    const C  = [cx,      cy];         // centre keystone
    // Top rhombus face
    els.push(pol([T, TR, C, TL]));
    // Left rhombus face
    els.push(pol([TL, C, B, BL]));
    // Right rhombus face
    els.push(pol([C, TR, BR, B]));
  }

  return svg('26 8 210 232', els.join('\n  '));
}

// ───────────────────────────────────────────────────────────────────────────
// ICON 2 — Expanding Concentric Ring Bands  (ref: 005610.svg)
//   A series of concentric ellipse pairs that expand outward like sound waves,
//   each pair slightly rotated & scaled to create an organic motion feel
// ───────────────────────────────────────────────────────────────────────────
function icon2() {
  const els = [];
  const cx = 120, cy = 120;
  const bands = 9;

  for (let i = 0; i < bands; i++) {
    const t   = i / (bands - 1);
    const rx  = 18 + t * 90;
    const ry  = 14 + t * 68;
    const rot = i * 7;  // slight twist outward
    const attr = `cx="${cx}" cy="${cy}" rx="${rx.toFixed(2)}" ry="${ry.toFixed(2)}"` +
                 ` transform="rotate(${rot} ${cx} ${cy})"` +
                 ` fill="none" stroke="${STROKE}" stroke-width="${SW}"`;
    els.push(`<ellipse ${attr}/>`);
  }

  return svg('15 15 210 210', els.join('\n  '));
}

// ───────────────────────────────────────────────────────────────────────────
// ICON 3 — 3D Spiral Coil  (ref: 005646.svg)
//   Helix rendered with accurate 3-axis rotation — looks like a spring
// ───────────────────────────────────────────────────────────────────────────
function icon3() {
  const els = [];
  const R     = 52;       // coil radius
  const pitch = 200;      // total length along axis
  const turns = 8;
  const steps = 400;
  const tiltX = 0.82;    // rotation around X  (tilt toward viewer)
  const rotY  = 0.48;    // rotation around Y  (slight left-right pan)

  let prev = null;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * 2 * PI * turns;
    const z = -pitch/2 + (i / steps) * pitch;
    const x0 = R * cos(a);
    const y0 = R * sin(a);

    // Rotate around X axis
    const y1 = y0 * cos(tiltX) - z  * sin(tiltX);
    const z1 = y0 * sin(tiltX) + z  * cos(tiltX);
    // Rotate around Y axis
    const x2 = x0 * cos(rotY)  + z1 * sin(rotY);
    const y2 = y1;

    const sx = 120 + x2;
    const sy = 130 - y2;
    if (prev) els.push(ln(prev[0], prev[1], sx, sy));
    prev = [sx, sy];
  }

  return svg('8 5 225 250', els.join('\n  '));
}

// ───────────────────────────────────────────────────────────────────────────
// ICON 4 — 3D Diamond / Hexagonal Lattice  (ref: 005701.svg)
//   Isometric honeycomb grid projected in 3D — concentric diamond rings
// ───────────────────────────────────────────────────────────────────────────
function icon4() {
  // Isometric projection helper
  const isoX = (x, z) => 120 + (x - z) * cos(PI/6) * 18;
  const isoY = (x, y, z) => 130 + (x + z) * sin(PI/6) * 18 - y * 18;

  const els = [];

  // Draw a grid of isometric "floor" diamond tiles z=-3..3, x=-3..3
  for (let xi = -3; xi <= 3; xi++) {
    for (let zi = -3; zi <= 3; zi++) {
      const a = [isoX(xi,   zi),   isoY(xi,   0, zi)];
      const b = [isoX(xi+1, zi),   isoY(xi+1, 0, zi)];
      const c = [isoX(xi+1, zi+1), isoY(xi+1, 0, zi+1)];
      const d = [isoX(xi,   zi+1), isoY(xi,   0, zi+1)];
      els.push(pol([a, b, c, d]));
    }
  }

  return svg('15 10 210 210', els.join('\n  '));
}

// ───────────────────────────────────────────────────────────────────────────
// ICON 5 — Concentric Offset Circles (Vortex)
//   Circles that progressively offset downward — creates a spiral/funnel look
// ───────────────────────────────────────────────────────────────────────────
function icon5() {
  const els = [];
  const count = 11;
  for (let i = 0; i < count; i++) {
    const t  = i / (count - 1);
    const r  = 100 - t * 65;             // shrinks inward
    const cy = 108 + t * 52;             // shifts downward = vortex
    els.push(`<circle cx="120" cy="${cy.toFixed(2)}" r="${r.toFixed(2)}"/>`);
  }
  return svg('10 8 220 225', els.join('\n  '));
}

// ───────────────────────────────────────────────────────────────────────────
// ICON 6 — Isometric Y Structure
//   Three rectangular prism arms meeting at a central isometric junction
// ───────────────────────────────────────────────────────────────────────────
function icon6() {
  const S = 20;   // unit size
  const els = [];

  const iso = (x, y, z) => [
    120 + (x - z) * cos(PI/6) * S,
    120 + (x + z) * sin(PI/6) * S - y * S,
  ];

  // Draw a solid-faced box given corner (ox,oy,oz) and dimensions (w,h,d)
  function box(ox, oy, oz, w, h, d) {
    const [A,B,C,D,E,F,G,H] = [
      iso(ox,   oy+h, oz  ),
      iso(ox+w, oy+h, oz  ),
      iso(ox+w, oy+h, oz+d),
      iso(ox,   oy+h, oz+d),
      iso(ox,   oy,   oz  ),
      iso(ox+w, oy,   oz  ),
      iso(ox+w, oy,   oz+d),
      iso(ox,   oy,   oz+d),
    ];
    els.push(pol([A, B, C, D]));  // top
    els.push(pol([D, C, G, H]));  // front
    els.push(pol([B, C, G, F]));  // right
  }

  box(-1,  0, -1, 2, 1, 2);      // centre junction
  box( 1,  0, -1, 3, 1, 2);      // right arm  (+X)
  box(-1,  0,  1, 2, 1, 3);      // forward arm (+Z)
  box(-1, -4, -1, 2, 4, 2);      // downward arm (-Y)

  return svg('18 8 220 235', els.join('\n  '));
}

// ───────────────────────────────────────────────────────────────────────────
// Write to /public
// ───────────────────────────────────────────────────────────────────────────
const generators = [icon1, icon2, icon3, icon4, icon5, icon6];
generators.forEach((fn, i) => {
  const out  = fn();
  const dest = `d:/partofu/public/process-icon-${i+1}.svg`;
  fs.writeFileSync(dest, out, 'utf8');
  console.log(`✓  process-icon-${i+1}.svg  (${out.length} bytes)`);
});
console.log('All icons written successfully.');
