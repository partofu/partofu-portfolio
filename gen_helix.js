/**
 * PERFECT 3D Helix / Coil SVG Generator - v2
 * 
 * Reference image analysis:
 *   - Coil axis tilted ~52° from horizontal (NE direction)
 *   - ~10.5 turns visible
 *   - Barrel profile: wider/more circular loops in the center, 
 *     flatter/elliptical near ends (the axis points more at viewer there)
 *   - Very thin white strokes, front/back depth distinction
 *   - Clean, geometric, computer-rendered look
 * 
 * Key insight: the barrel shape in the reference comes from the viewing angle —
 * the center loops face the viewer more directly (appear circular), while
 * loops at the ends face more sideways (appear as thin ellipses). 
 * This is just the natural result of the 3D projection — no need to manually
 * modify radius; it comes from the math automatically with the right axis tilt.
 */
const fs   = require('fs');
const PI   = Math.PI;
const cos  = Math.cos;
const sin  = Math.sin;
const sqrt = Math.sqrt;

// ─── Design Parameters ──────────────────────────────────────────────────────
const STROKE_COLOR  = '#ffffff';
const STROKE_WIDTH  = 1.0;

// Coil geometry
const TURNS   = 9;        // 9 full loops — matches reference's open airy spacing
const R       = 54;       // slightly larger radius for a fatter mid-section
const LENGTH  = 270;      // shorter axis but fewer turns = more pitch per loop

// The coil axis orientation:
// AXIS_ANGLE_XY: angle of axis in screen plane from horizontal
// AXIS_TILT_Z:   how much the axis dips into screen (toward viewer)
//
// Key insight for matching reference:
//   - axis angle ~50° (slightly less steep than before)
//   - tilt ~42° (deeper Z tilt = flatter ellipses at the tips, more 3D drama)
const AXIS_ANGLE_XY  = (50  * PI) / 180;
const AXIS_TILT_Z    = (42  * PI) / 180;

// ─── Axis & Basis Vectors ────────────────────────────────────────────────────
const cosA = cos(AXIS_ANGLE_XY);
const sinA = sin(AXIS_ANGLE_XY);
const cosT = cos(AXIS_TILT_Z);
const sinT = sin(AXIS_TILT_Z);

// Unit axis vector in 3D (x=right, y=up, z=toward viewer)
const AX = [cosA * cosT, sinA * cosT, sinT];

// Build orthonormal basis for the circle plane
function dot(a, b)  { return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]; }
function norm(a) {
  const l = sqrt(dot(a, a));
  return [a[0]/l, a[1]/l, a[2]/l];
}
function cross(a, b) {
  return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
}

// U = perpendicular to AX in screen plane (mostly), V = AX × U
let U = norm(cross([0, 0, 1], AX));
if (dot(U, U) < 1e-6) U = norm(cross([1, 0, 0], AX));
const V = norm(cross(AX, U));

// ─── Orthographic Projection ─────────────────────────────────────────────────
// (x, y, z) → (CX + x, CY - y) — pure orthographic, Z = depth (not rendered)
const CX = 240, CY = 200;
function project([x, y, z]) {
  return [CX + x, CY - y];
}

// ─── Generate helix points ────────────────────────────────────────────────────
const STEPS = 3000;
const pts3d = [];

for (let i = 0; i <= STEPS; i++) {
  const t      = i / STEPS;
  const angle  = 2 * PI * TURNS * t;
  const axDist = -LENGTH/2 + t * LENGTH;

  // Slight barrel modification: radius is slightly larger at center
  // This is subtle and helps match the reference's visual where center feels wider
  const barrelFactor = 1.0 + 0.08 * (1 - (t - 0.5) ** 2 * 4);

  const rCur = R * barrelFactor;

  const px = AX[0]*axDist + rCur*(cos(angle)*U[0] + sin(angle)*V[0]);
  const py = AX[1]*axDist + rCur*(cos(angle)*U[1] + sin(angle)*V[1]);
  const pz = AX[2]*axDist + rCur*(cos(angle)*U[2] + sin(angle)*V[2]);

  pts3d.push([px, py, pz]);
}

// ─── Z-order split: front vs back half of coil ───────────────────────────────
// For each segment, check if the radius vector points toward viewer (pz > axis_z)
// Simple: radiusZ = cos(angle)*U[2] + sin(angle)*V[2] > 0 means front
const segsFront = [];
const segsBack  = [];

for (let i = 0; i < STEPS; i++) {
  const t     = (i + 0.5) / STEPS;
  const angle = 2 * PI * TURNS * t;
  const radiusZ = cos(angle) * U[2] + sin(angle) * V[2];

  const [sx1, sy1] = project(pts3d[i]);
  const [sx2, sy2] = project(pts3d[i + 1]);

  if (radiusZ >= 0) {
    segsFront.push([sx1, sy1, sx2, sy2]);
  } else {
    segsBack.push([sx1, sy1, sx2, sy2]);
  }
}

// ─── Merge consecutive segments into polylines ───────────────────────────────
function buildPolylines(segs) {
  if (segs.length === 0) return [];
  const chains = [];
  let chain = [[segs[0][0], segs[0][1]], [segs[0][2], segs[0][3]]];
  for (let i = 1; i < segs.length; i++) {
    const [x1, y1, x2, y2] = segs[i];
    const [lx, ly] = chain[chain.length - 1];
    if (Math.abs(x1 - lx) < 0.5 && Math.abs(y1 - ly) < 0.5) {
      chain.push([x2, y2]);
    } else {
      chains.push(chain);
      chain = [[x1, y1], [x2, y2]];
    }
  }
  chains.push(chain);
  return chains;
}

function chainToPolyline(chain, opacity) {
  const pts = chain.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  return `<polyline points="${pts}" fill="none" stroke="${STROKE_COLOR}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
}

// ─── Bounding box ─────────────────────────────────────────────────────────────
let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
for (const p of pts3d) {
  const [sx, sy] = project(p);
  if (sx < minX) minX = sx;
  if (sy < minY) minY = sy;
  if (sx > maxX) maxX = sx;
  if (sy > maxY) maxY = sy;
}
const pad = 12;
const vbX = (minX - pad).toFixed(1);
const vbY = (minY - pad).toFixed(1);
const vbW = (maxX - minX + pad * 2).toFixed(1);
const vbH = (maxY - minY + pad * 2).toFixed(1);

// ─── Assemble SVG ─────────────────────────────────────────────────────────────
const backChains  = buildPolylines(segsBack);
const frontChains = buildPolylines(segsFront);

const svgLines = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX} ${vbY} ${vbW} ${vbH}" fill="none">`,
  `  <!-- Back half of coil -->`,
  ...backChains.map(c  => '  ' + chainToPolyline(c,  '0.32')),
  `  <!-- Front half of coil -->`,
  ...frontChains.map(c => '  ' + chainToPolyline(c,  '1')),
  `</svg>`,
];

const svgContent = svgLines.join('\n');

const dest = 'd:/partofu/public/process-icon-3.svg';
fs.writeFileSync(dest, svgContent, 'utf8');
console.log(`✓  process-icon-3.svg written  (${svgContent.length} bytes)`);
console.log(`   ViewBox: ${vbX} ${vbY} ${vbW} ${vbH}`);
console.log(`   Back chains: ${backChains.length}, Front chains: ${frontChains.length}`);
console.log(`   Total segments: Back=${segsBack.length}, Front=${segsFront.length}`);
