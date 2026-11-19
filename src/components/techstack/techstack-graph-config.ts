// Visual constants
export const TILE_SIZES = { sig: 28, sup: 24, chip: 20 };
export const NODE_RADII = { center: 23, domain: 22 };
export const COLLISION_PADDING = 12;
export const BOUNDARY_PADDING = 24;

// Physics parameters
export const PHYSICS = {
  charge: { center: -100, domain: -250, tool: -35 },
  radialRings: { innerFactor: 0.32 },
  radialStrength: 0.7,
  // Tools ring around their own domain at a radius that scales with tool count
  toolRing: { minRadius: 44, perTool: 7, childGap: 48 },
  techLinkDistance: 90, // spoke = inner ring radius, member = toolRing radius
  linkStrengths: { spoke: 0.9, member: 0.8, tech: 0.05 },
  centerForceStrength: 0.02,
  collideIterations: 2,
};

// Animation & interaction. alphaDecay is deliberately high so the simulation settles
// and STOPS quickly (nodes are seeded near-equilibrium, so little work is needed) —
// a low alphaDecay here kept the sim alive for ~450 ticks and froze slower machines.
export const ANIMATION = {
  initialAlpha: 0.8,
  initialAlphaDecay: 0.06,
  dragAlphaTarget: 0.25,
};

// Zoom & semantic visibility
export const ZOOM = {
  scaleExtent: [0.5, 2.5] as [number, number],
  buttonStep: 1.4,              // Scale factor per +/− button press
  semanticThresholds: {
    showToolLabels: 1.5,        // At or above this, tool names render under their tiles (71 tools would collide at 1x)
    showOnlyDomains: 0.85,      // Below this, hide tool nodes (default 1.0x shows full graph)
  },
};

// Spotlight effect
export const SPOTLIGHT = {
  dimmedOpacity: 0.2,
  activeDuration: 300,          // CSS transition duration (ms)
};

// Popover box (matches the w-56 card) and its placement next to a node
export const POPOVER = { w: 224, h: 180, gap: 18, margin: 4 }; // fallback size when not measurable

/**
 * Top-left corner for the popover next to a node at (x, y), in SVG viewport
 * coordinates (the popover layer is NOT zoomed, so the visible area is always
 * 0..w × 0..h). Prefers right-of and above the node; flips/clamps to stay inside.
 */
export function placePopover(
  x: number, y: number, w: number, h: number,
  pw: number = POPOVER.w, ph: number = POPOVER.h, // measured box size when available
): { x: number; y: number } {
  const { gap, margin: m } = POPOVER;
  const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), Math.max(lo, hi));
  let px = x + gap;
  if (px + pw > w - m) px = x - pw - gap; // no room right → left
  if (px < m) px = x - pw / 2; // no room either side → center on node
  let py = y - ph - gap; // prefer above
  if (py < m) py = y + gap; // no room above → below
  return { x: clamp(px, m, w - pw - m), y: clamp(py, m, h - ph - m) };
}
