// Visual constants
export const TILE_SIZES = { sig: 28, sup: 24, chip: 20 };
export const NODE_RADII = { center: 23, domain: 22 };
export const COLLISION_PADDING = 12;
export const BOUNDARY_PADDING = 24;

// Physics parameters
export const PHYSICS = {
  charge: { center: -600, domain: -250, tool: -35 },
  radialRings: { innerFactor: 0.32, outerFactor: 0.55 },
  radialStrength: 0.7,
  // Tools ring around their own domain at a radius that scales with tool count
  toolRing: { minRadius: 44, perTool: 7 },
  linkDistances: { spoke: 'R1', member: 'toolRing', tech: 90 },
  linkStrengths: { spoke: 0.9, member: 0.8, tech: 0.05 },
  centerForceStrength: 0.02,
  collideIterations: 3,
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
    hideToolLabels: 0.95,       // Below this, hide tool labels
    showOnlyDomains: 0.85,      // Below this, hide tool nodes (default 1.0x shows full graph)
  },
};

// Spotlight effect
export const SPOTLIGHT = {
  dimmedOpacity: 0.2,
  activeDuration: 300,          // CSS transition duration (ms)
};
