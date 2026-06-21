// Visual constants
export const TILE_SIZES = { sig: 28, sup: 24, chip: 20 };
export const NODE_RADII = { center: 23, domain: 22 };
export const COLLISION_PADDING = 6;
export const BOUNDARY_PADDING = 24;

// Physics parameters
export const PHYSICS = {
  charge: { center: -700, domain: -280, tool: -55 },
  radialRings: { innerFactor: 0.26, outerFactor: 0.46 },
  radialStrength: 0.6,
  linkDistances: { spoke: 'R1', member: 'R2-R1', tech: 120 },
  linkStrengths: { spoke: 0.9, member: 0.5, tech: 0.05 },
  centerForceStrength: 0.03,
  collideIterations: 2,
};

// Animation & interaction
export const ANIMATION = {
  initialAlpha: 1,
  initialAlphaDecay: 0.025,
  coolingPhaseDecay: 0.04,     // Higher friction for first 100 ticks
  coolingTickThreshold: 100,
  finalAlphaDecay: 0.015,       // Relaxed after settling
  dragAlphaTarget: 0.25,
};

// Zoom & semantic visibility
export const ZOOM = {
  scaleExtent: [0.5, 2.5] as [number, number],
  semanticThresholds: {
    hideToolLabels: 0.7,        // Below this, hide tool labels
    showOnlyDomains: 0.6,       // Below this, hide tool nodes entirely
  },
};

// Spotlight effect
export const SPOTLIGHT = {
  dimmedOpacity: 0.2,
  activeDuration: 300,          // CSS transition duration (ms)
};
