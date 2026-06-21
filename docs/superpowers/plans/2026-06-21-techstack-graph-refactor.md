# TechStack Graph Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor TechStack D3.js force-directed graph to eliminate performance bottlenecks, clean up architecture, and add visual polish (spotlight dimming, foreignObject popover, progressive cooling, semantic zooming).

**Architecture:** Extract configuration constants to separate module. Replace state-triggered simulation rebuilds with persistent ref-based simulation and imperative resize handling. Remove 120ms polling interval by using foreignObject for popover. Add CSS-based visual effects for spotlight and semantic zoom.

**Tech Stack:** React 18, TypeScript, D3.js v7, Tailwind CSS

## Global Constraints

- TypeScript strict mode enabled
- No `any` types without explicit justification
- Follow existing code style (2-space indent, single quotes)
- All D3 selections must use explicit type parameters
- Maintain existing CSS class naming convention (`ts-*` prefix)
- Component API must remain unchanged (no breaking changes to parent)
- No new dependencies

---

## Task 1: Extract Configuration Module

**Files:**
- Create: `src/components/techstack/techstack-graph-config.ts`
- Test: Manual verification (imported correctly in next task)

**Interfaces:**
- Consumes: None
- Produces: 
  - `export const TILE_SIZES: { sig: number; sup: number; chip: number }`
  - `export const NODE_RADII: { center: number; domain: number }`
  - `export const COLLISION_PADDING: number`
  - `export const BOUNDARY_PADDING: number`
  - `export const PHYSICS: { charge: {...}, radialRings: {...}, ...}`
  - `export const ANIMATION: { initialAlpha: number, initialAlphaDecay: number, ...}`
  - `export const ZOOM: { scaleExtent: [number, number], semanticThresholds: {...} }`
  - `export const SPOTLIGHT: { dimmedOpacity: number, activeDuration: number }`

- [ ] **Step 1: Create configuration file with all constants**

```typescript
// src/components/techstack/techstack-graph-config.ts

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
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run build`
Expected: No errors, config file compiles successfully

- [ ] **Step 3: Commit configuration module**

```bash
git add src/components/techstack/techstack-graph-config.ts
git commit -m "feat(techstack): extract graph configuration constants"
```

---

## Task 2: Add CSS for Visual Effects

**Files:**
- Modify: `src/components/techstack/TechStackGraph.tsx:1-10` (add style tag or className)
- Alternative: Modify global CSS if preferred

**Interfaces:**
- Consumes: `SPOTLIGHT.dimmedOpacity` from techstack-graph-config.ts
- Produces: CSS classes `.ts-node.dimmed`, `.ts-link.dimmed` with opacity transitions

- [ ] **Step 1: Add CSS for spotlight and transitions**

Add this near the top of `TechStackGraph.tsx` (after imports, before component):

```typescript
// Add after imports
const graphStyles = `
  .ts-node, .ts-link {
    transition: opacity 300ms ease;
    opacity: 1;
  }
  
  .ts-node.dimmed, .ts-link.dimmed {
    opacity: 0.2;
  }
`;
```

Then in the component return, add a style tag:

```typescript
return (
  <div className="space-y-3">
    <style>{graphStyles}</style>
    {/* ... rest of component */}
```

- [ ] **Step 2: Verify styles are applied**

Run: `npm run dev`
Open browser, inspect a node element, verify CSS rules are present

- [ ] **Step 3: Commit CSS additions**

```bash
git add src/components/techstack/TechStackGraph.tsx
git commit -m "feat(techstack): add CSS for spotlight dimming transitions"
```

---

## Task 3: Refactor State Management and Add Persistent Simulation

**Files:**
- Modify: `src/components/techstack/TechStackGraph.tsx:40-74` (refs and state)
- Modify: `src/components/techstack/TechStackGraph.tsx:75-232` (simulation setup)

**Interfaces:**
- Consumes: All exports from `techstack-graph-config.ts`
- Produces: 
  - `simulationRef: React.MutableRefObject<d3.Simulation<SimNode, SimLink> | null>`
  - `sizeRef: React.MutableRefObject<{ w: number; h: number }>`
  - `linksRef: React.MutableRefObject<SimLink[]>`
  - Helper functions for use in later tasks:
    - `releaseSelectedNode(): void`
    - `handleResize(newSize: { w: number; h: number }): void`

- [ ] **Step 1: Import configuration at top of file**

```typescript
// Add to imports section
import {
  TILE_SIZES, NODE_RADII, COLLISION_PADDING, BOUNDARY_PADDING,
  PHYSICS, ANIMATION, ZOOM, SPOTLIGHT
} from './techstack-graph-config';
```

- [ ] **Step 2: Replace magic numbers in helper functions**

Find the `TILE` constant (line ~21) and `nodeRadius` function (line ~22-26):

```typescript
// OLD:
const TILE: Record<string, number> = { sig: 28, sup: 24, chip: 20 };

// NEW: Remove TILE constant entirely, update nodeRadius and nodeTile:
function nodeRadius(n: SimNode): number {
  if (n.kind === 'center') return NODE_RADII.center;
  if (n.kind === 'domain') return NODE_RADII.domain;
  return (n.level ? TILE_SIZES[n.level] : 22) / 2;
}

function nodeTile(n: SimNode): number {
  if (n.kind === 'center') return 46;
  if (n.kind === 'domain') return 44;
  return n.level ? TILE_SIZES[n.level] : 22;
}
```

- [ ] **Step 3: Update refs and state (lines 40-48)**

```typescript
// OLD:
const [size, setSize] = useState({ w: 600, h: 460 });
const [selected, setSelected] = useState<Selected | null>(null);
const nodesRef = useRef<SimNode[]>([]);
const selectedIdRef = useRef<string | null>(null);

// NEW:
const [selected, setSelected] = useState<Selected | null>(null);
const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
const nodesRef = useRef<SimNode[]>([]);
const linksRef = useRef<SimLink[]>([]);
const sizeRef = useRef({ w: 600, h: 460 });
const selectedIdRef = useRef<string | null>(null);
```

- [ ] **Step 4: Add releaseSelectedNode helper function**

Add this function after the refs/state declarations:

```typescript
const releaseSelectedNode = () => {
  const id = selectedIdRef.current;
  if (id == null) return;
  
  const node = nodesRef.current.find(n => n.id === id);
  if (node && node.kind !== 'center') {
    node.fx = null;
    node.fy = null;
  }
  selectedIdRef.current = null;
};
```

- [ ] **Step 5: Add imperative handleResize function**

```typescript
const handleResize = (newSize: { w: number; h: number }) => {
  sizeRef.current = newSize;
  
  if (!simulationRef.current || !svgRef.current) return;
  
  const { w, h } = newSize;
  const cx = w / 2;
  const cy = h / 2;
  const R1 = Math.min(w, h) * PHYSICS.radialRings.innerFactor;
  const R2 = Math.min(w, h) * PHYSICS.radialRings.outerFactor;
  
  // Update SVG viewBox
  d3.select(svgRef.current).attr('viewBox', `0 0 ${w} ${h}`);
  
  // Update force centers imperatively
  simulationRef.current
    .force('center', d3.forceCenter(cx, cy).strength(PHYSICS.centerForceStrength))
    .force('radial', d3.forceRadial<SimNode>(
      (n) => (n.kind === 'center' ? 0 : n.kind === 'domain' ? R1 : R2),
      cx, cy
    ).strength(PHYSICS.radialStrength));
  
  // Update link distances based on new R1/R2
  const linkForce = simulationRef.current.force('link') as d3.ForceLink<SimNode, SimLink>;
  if (linkForce) {
    linkForce.distance((l) => 
      l.kind === 'spoke' ? R1 : l.kind === 'member' ? R2 - R1 : PHYSICS.linkDistances.tech
    );
  }
  
  // Update center node position
  const centerNode = nodesRef.current.find(n => n.id === CENTER_ID);
  if (centerNode) {
    centerNode.fx = cx;
    centerNode.fy = cy;
  }
  
  // Gently reheat simulation
  simulationRef.current.alpha(0.3).restart();
};
```

- [ ] **Step 6: Update ResizeObserver to use handleResize**

Find the first useEffect (lines 51-73), replace `setSize(next)` with `handleResize(next)`:

```typescript
useEffect(() => {
  const el = wrapRef.current;
  if (!el) return;
  let rafId: number | null = null;
  const ro = new ResizeObserver((entries) => {
    const r = entries[0].contentRect;
    const next = { w: Math.max(320, r.width), h: Math.max(360, r.height) };
    if (rafId != null) cancelAnimationFrame(rafId);
    if (typeof requestAnimationFrame === 'function') {
      rafId = requestAnimationFrame(() => {
        rafId = null;
        handleResize(next);  // CHANGED: was setSize(next)
      });
    } else {
      handleResize(next);  // CHANGED: was setSize(next)
    }
  });
  ro.observe(el);
  return () => {
    ro.disconnect();
    if (rafId != null) cancelAnimationFrame(rafId);
  };
}, []);
```

- [ ] **Step 7: Update simulation setup useEffect dependency**

Find the main simulation useEffect (starts line 75). Change the dependency array from `[size]` to `[]`:

```typescript
useEffect(() => {
  const svgEl = svgRef.current;
  if (!svgEl) return;
  const { w, h } = sizeRef.current;  // CHANGED: read from ref, not state
  // ... rest of simulation setup
  
  return () => {
    svg.on('.zoom', null);
    sim.stop();
    simulationRef.current = null;  // ADDED: clear ref on cleanup
  };
}, []); // CHANGED: empty deps array
```

- [ ] **Step 8: Replace hardcoded values with config constants in simulation**

Within the simulation setup useEffect, find and replace:

```typescript
// OLD charge force:
.force('charge', d3.forceManyBody().strength((n) =>
  n.kind === 'center' ? -700 : n.kind === 'domain' ? -280 : -55))

// NEW:
.force('charge', d3.forceManyBody<SimNode>().strength((n) =>
  n.kind === 'center' ? PHYSICS.charge.center :
  n.kind === 'domain' ? PHYSICS.charge.domain :
  PHYSICS.charge.tool))

// OLD collide force:
.force('collide', d3.forceCollide<SimNode>().radius((n) => nodeRadius(n) + 6).iterations(2))

// NEW:
.force('collide', d3.forceCollide<SimNode>()
  .radius((n) => nodeRadius(n) + COLLISION_PADDING)
  .iterations(PHYSICS.collideIterations))

// OLD radial force (keep R1, R2 local vars, use config for strength):
.force('radial', d3.forceRadial<SimNode>(
  (n) => (n.kind === 'center' ? 0 : n.kind === 'domain' ? R1 : R2), cx, cy).strength(0.6))

// NEW:
.force('radial', d3.forceRadial<SimNode>(
  (n) => (n.kind === 'center' ? 0 : n.kind === 'domain' ? R1 : R2),
  cx, cy
).strength(PHYSICS.radialStrength))

// OLD link force:
.force('link', d3.forceLink<SimNode, SimLink>(links).id((n) => n.id)
  .distance((l) => (l.kind === 'spoke' ? R1 : l.kind === 'member' ? R2 - R1 : 120))
  .strength((l) => (l.kind === 'spoke' ? 0.9 : l.kind === 'member' ? 0.5 : 0.05)))

// NEW:
.force('link', d3.forceLink<SimNode, SimLink>(links).id((n) => n.id)
  .distance((l) => l.kind === 'spoke' ? R1 : l.kind === 'member' ? R2 - R1 : PHYSICS.linkDistances.tech)
  .strength((l) => 
    l.kind === 'spoke' ? PHYSICS.linkStrengths.spoke :
    l.kind === 'member' ? PHYSICS.linkStrengths.member :
    PHYSICS.linkStrengths.tech))

// OLD center force:
.force('center', d3.forceCenter(cx, cy).strength(0.03))

// NEW:
.force('center', d3.forceCenter(cx, cy).strength(PHYSICS.centerForceStrength))

// OLD alpha and decay:
.alpha(1).alphaDecay(0.025);

// NEW:
.alpha(ANIMATION.initialAlpha).alphaDecay(ANIMATION.initialAlphaDecay);
```

- [ ] **Step 9: Store simulation in ref**

Right after creating the simulation (after `.alphaDecay(...)`), add:

```typescript
simulationRef.current = sim;
```

- [ ] **Step 10: Store links in linksRef**

After creating the `links` array (around line 96), add:

```typescript
linksRef.current = links;
```

- [ ] **Step 11: Update drag handler to use ANIMATION.dragAlphaTarget**

Find the drag setup (around line 178-181):

```typescript
// OLD:
.on('start', (e, n) => { if (n.kind !== 'center') { if (!e.active) sim.alphaTarget(0.25).restart(); ...

// NEW:
.on('start', (e, n) => { 
  if (n.kind !== 'center') { 
    if (!e.active) sim.alphaTarget(ANIMATION.dragAlphaTarget).restart(); 
    n.fx = n.x; 
    n.fy = n.y; 
  } 
})
```

- [ ] **Step 12: Update zoom to use config and add semantic zooming**

Find the zoom setup (around line 185-188):

```typescript
// OLD:
const zoom = d3.zoom<SVGSVGElement, unknown>()
  .scaleExtent([0.5, 2.5])
  .on('zoom', (e) => root.attr('transform', e.transform.toString()));

// NEW:
const zoom = d3.zoom<SVGSVGElement, unknown>()
  .scaleExtent(ZOOM.scaleExtent)
  .on('zoom', (event) => {
    root.attr('transform', event.transform.toString());
    
    const scale = event.transform.k;
    
    // Semantic zooming: hide tool nodes at low zoom
    if (scale < ZOOM.semanticThresholds.showOnlyDomains) {
      nodeG.filter(n => n.kind === 'tool').style('opacity', '0');
      linkSel.filter(l => l.kind === 'tech' || l.kind === 'member').style('opacity', '0');
    } else if (scale < ZOOM.semanticThresholds.hideToolLabels) {
      nodeG.filter(n => n.kind === 'tool').style('opacity', '1');
      linkSel.style('opacity', '1');
    } else {
      nodeG.style('opacity', '1');
      linkSel.style('opacity', '1');
    }
  });
```

- [ ] **Step 13: Update boundary padding in tick handler**

Find the tick handler boundary constraints (around line 216-220):

```typescript
// OLD:
const pad = 24;

// NEW:
const pad = BOUNDARY_PADDING;
```

- [ ] **Step 14: Verify TypeScript compilation**

Run: `npm run build`
Expected: No errors, all types resolve correctly

- [ ] **Step 15: Test in browser**

Run: `npm run dev`
Open http://localhost:5173
Navigate to TechStack section
Expected: Graph renders, no console errors

- [ ] **Step 16: Commit persistent simulation changes**

```bash
git add src/components/techstack/TechStackGraph.tsx
git commit -m "refactor(techstack): implement persistent simulation with imperative resize"
```

---

## Task 4: Add Progressive Cooling Effect

**Files:**
- Modify: `src/components/techstack/TechStackGraph.tsx:233-255` (after main simulation useEffect)

**Interfaces:**
- Consumes: 
  - `simulationRef` from Task 3
  - `ANIMATION.coolingTickThreshold`, `ANIMATION.finalAlphaDecay` from config
- Produces: Progressive cooling animation (high friction → relaxed after 100 ticks)

- [ ] **Step 1: Add progressive cooling useEffect**

Add this new useEffect right after the main simulation useEffect (before the popover tracking effect):

```typescript
// Progressive cooling effect
useEffect(() => {
  const sim = simulationRef.current;
  if (!sim) return;
  
  let ticks = 0;
  const coolingListener = () => {
    ticks++;
    if (ticks === ANIMATION.coolingTickThreshold) {
      sim.alphaDecay(ANIMATION.finalAlphaDecay);
    }
  };
  
  sim.on('tick.cooling', coolingListener);
  
  return () => {
    sim.on('tick.cooling', null);
  };
}, []);
```

- [ ] **Step 2: Test progressive cooling**

Run: `npm run dev`
Reload page, observe graph settling animation
Expected: Smoother settling, less jittery after first few seconds

- [ ] **Step 3: Commit progressive cooling**

```bash
git add src/components/techstack/TechStackGraph.tsx
git commit -m "feat(techstack): add progressive cooling animation"
```

---

## Task 5: Implement foreignObject Popover

**Files:**
- Modify: `src/components/techstack/TechStackGraph.tsx:235-255` (remove polling effect)
- Modify: `src/components/techstack/TechStackGraph.tsx:190-212` (update click handlers)
- Modify: `src/components/techstack/TechStackGraph.tsx:256-265` (remove old handleClose)
- Modify: `src/components/techstack/TechStackGraph.tsx:290-333` (replace renderPopover function)

**Interfaces:**
- Consumes: `releaseSelectedNode()` from Task 3
- Produces: 
  - `renderPopoverInSVG(container: d3.Selection<SVGGElement, unknown, null, undefined>, node: SimNode): void`
  - `clearPopover(container: d3.Selection<SVGGElement, unknown, null, undefined>): void`

- [ ] **Step 1: Remove polling useEffect (lines 235-254)**

Delete the entire useEffect that starts with `// keep popover attached...` and contains `setInterval`.

- [ ] **Step 2: Add popover container in simulation setup**

In the main simulation useEffect, after creating `nodeG` (around line 153), add:

```typescript
const popoverG = root.append('g').attr('class', 'ts-popover-container');
```

- [ ] **Step 3: Create renderPopoverInSVG function**

Replace the existing `renderPopover` function (lines 290-333) with:

```typescript
function renderPopoverInSVG(
  container: d3.Selection<SVGGElement, unknown, null, undefined>,
  node: SimNode,
  handleClose: () => void
) {
  container.selectAll('*').remove();
  
  // Gather popover data
  let title = '';
  let tag = '';
  let body = '';
  let connects: string[] = [];
  
  if (node.kind === 'center') {
    title = TECHSTACK_CENTER.name;
    tag = 'Profile';
    body = TECHSTACK_CENTER.title;
  } else if (node.kind === 'domain') {
    const d = domainById(node.id);
    title = d.name;
    tag = 'Domain';
    body = d.role;
    connects = TECHSTACK_TOOLS.filter(t => t.domainId === d.id).slice(0, 6).map(t => t.name);
  } else {
    const t = node.tool!;
    title = t.name;
    tag = domainById(t.domainId).name;
    body = t.role;
    connects = [...neighborsOf(t.id)].filter(id => id !== t.id)
      .map(id => TECHSTACK_TOOLS.find(x => x.id === id)!.name);
  }
  
  // foreignObject positioned above node
  const fo = container.append('foreignObject')
    .attr('width', 224)
    .attr('height', 200)
    .attr('x', 16)
    .attr('y', -200)
    .attr('class', 'ts-popover-fo');
  
  // HTML content with Tailwind classes
  const div = fo.append('xhtml:div')
    .attr('xmlns', 'http://www.w3.org/1999/xhtml')
    .attr('class', 'pointer-events-auto w-56 rounded-md border border-border bg-card p-3 shadow-lg')
    .on('click', (e) => e.stopPropagation());
  
  // Header
  const header = div.append('div')
    .attr('class', 'mb-1 flex items-center justify-between');
  
  header.append('span')
    .attr('class', 'text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground')
    .text(tag);
  
  header.append('button')
    .attr('class', 'text-muted-foreground hover:text-foreground')
    .attr('aria-label', 'Close')
    .text('×')
    .on('click', handleClose);
  
  // Title
  div.append('div')
    .attr('class', 'text-sm font-semibold text-foreground')
    .text(title);
  
  // Body
  div.append('div')
    .attr('class', 'mt-1 text-xs text-muted-foreground')
    .text(body);
  
  // Connections
  if (connects.length > 0) {
    const connectDiv = div.append('div')
      .attr('class', 'mt-2 border-t border-dashed border-border pt-2 text-[0.7rem] text-muted-foreground');
    
    connectDiv.append('span')
      .attr('class', 'font-semibold text-foreground')
      .text('Connects to: ');
    
    connectDiv.append('span').text(connects.join(' · '));
  }
}
```

- [ ] **Step 4: Update node click handler**

Find the node click handler (around line 194-202), replace it with:

```typescript
nodeG.on('click', (event, node) => {
  if (moved) return;
  event.stopPropagation();
  
  // Pin node
  node.fx = node.x;
  node.fy = node.y;
  selectedIdRef.current = node.id;
  
  // Render popover
  renderPopoverInSVG(popoverG, node, handleClosePopover);
});
```

- [ ] **Step 5: Create handleClosePopover function**

Add this function inside the main simulation useEffect, before the node click handler:

```typescript
const handleClosePopover = () => {
  releaseSelectedNode();
  popoverG.selectAll('*').remove();
};
```

- [ ] **Step 6: Update SVG background click handler**

Find the SVG background click (around line 204-212):

```typescript
// OLD:
svg.on('click', () => {
  const id = selectedIdRef.current;
  if (id != null) {
    const node = nodes.find((n) => n.id === id);
    if (node && node.kind !== 'center') { node.fx = null; node.fy = null; }
    selectedIdRef.current = null;
  }
  setSelected(null);
});

// NEW:
svg.on('click', () => {
  releaseSelectedNode();
  popoverG.selectAll('*').remove();
});
```

- [ ] **Step 7: Update tick handler to move popover**

In the `sim.on('tick', ...)` handler, add popover position update at the end (before closing brace):

```typescript
sim.on('tick', () => {
  // ... existing boundary constraints and position updates ...
  
  // Update popover position if active
  if (selectedIdRef.current) {
    const node = nodes.find(n => n.id === selectedIdRef.current);
    if (node && node.x != null && node.y != null) {
      popoverG.attr('transform', `translate(${node.x},${node.y - 20})`);
    }
  }
});
```

- [ ] **Step 8: Remove old handleClose and renderPopover**

Delete the old `handleClose` function (was around lines 257-265) and the old `renderPopover` function. Also remove the `pop` variable and its rendering in JSX:

```typescript
// DELETE these lines:
const handleClose = () => { ... };
const pop = selected ? renderPopover(selected, handleClose, size.w) : null;
// And in JSX: {pop}
```

- [ ] **Step 9: Remove Selected interface and selected state**

Since we're no longer using React state for popover positioning, we can remove the `Selected` interface (lines 33-38) and the `selected` state:

```typescript
// DELETE:
interface Selected {
  id: string;
  kind: 'center' | 'domain' | 'tool';
  x: number;
  y: number;
}

// DELETE:
const [selected, setSelected] = useState<Selected | null>(null);
```

- [ ] **Step 10: Verify no setInterval remains**

Run: `grep -n "setInterval" src/components/techstack/TechStackGraph.tsx`
Expected: No matches

- [ ] **Step 11: Test foreignObject popover**

Run: `npm run dev`
Click a node → popover should appear
Drag the node → popover should follow
Zoom/pan → popover should stay attached
Click background or close button → popover should disappear

- [ ] **Step 12: Commit foreignObject popover**

```bash
git add src/components/techstack/TechStackGraph.tsx
git commit -m "feat(techstack): replace polling popover with foreignObject"
```

---

## Task 6: Implement Spotlight Dimming Effect

**Files:**
- Modify: `src/components/techstack/TechStackGraph.tsx` (add spotlight functions, update handlers)

**Interfaces:**
- Consumes:
  - `linksRef` from Task 3
  - `nodeG`, `linkSel` D3 selections from simulation setup
- Produces:
  - `activateSpotlight(nodeId: string): void`
  - `clearSpotlight(): void`

- [ ] **Step 1: Add activateSpotlight function**

Add inside the main simulation useEffect, after creating `linkSel` and `nodeG`:

```typescript
const activateSpotlight = (nodeId: string) => {
  const connected = new Set<string>();
  connected.add(nodeId);
  
  // Find all first-degree neighbors
  linksRef.current.forEach(link => {
    const srcId = typeof link.source === 'string' ? link.source : link.source.id;
    const tgtId = typeof link.target === 'string' ? link.target : link.target.id;
    
    if (srcId === nodeId) connected.add(tgtId);
    if (tgtId === nodeId) connected.add(srcId);
  });
  
  // Dim nodes not in connected set
  nodeG.classed('dimmed', n => !connected.has(n.id));
  
  // Dim links not connected to selected node
  linkSel.classed('dimmed', l => {
    const srcId = typeof l.source === 'string' ? l.source : l.source.id;
    const tgtId = typeof l.target === 'string' ? l.target : l.target.id;
    return srcId !== nodeId && tgtId !== nodeId;
  });
};
```

- [ ] **Step 2: Add clearSpotlight function**

```typescript
const clearSpotlight = () => {
  nodeG.classed('dimmed', false);
  linkSel.classed('dimmed', false);
};
```

- [ ] **Step 3: Update node click handler to activate spotlight**

Find the node click handler, add `activateSpotlight(node.id);`:

```typescript
nodeG.on('click', (event, node) => {
  if (moved) return;
  event.stopPropagation();
  
  node.fx = node.x;
  node.fy = node.y;
  selectedIdRef.current = node.id;
  
  activateSpotlight(node.id);  // ADDED
  renderPopoverInSVG(popoverG, node, handleClosePopover);
});
```

- [ ] **Step 4: Update handleClosePopover to clear spotlight**

```typescript
const handleClosePopover = () => {
  releaseSelectedNode();
  clearSpotlight();  // ADDED
  popoverG.selectAll('*').remove();
};
```

- [ ] **Step 5: Update SVG background click to clear spotlight**

```typescript
svg.on('click', () => {
  releaseSelectedNode();
  clearSpotlight();  // ADDED
  popoverG.selectAll('*').remove();
});
```

- [ ] **Step 6: Test spotlight effect**

Run: `npm run dev`
Click a node → unconnected nodes/links should dim (opacity 0.2)
Connected nodes/links should remain opaque
Transition should be smooth (300ms)

- [ ] **Step 7: Commit spotlight dimming**

```bash
git add src/components/techstack/TechStackGraph.tsx
git commit -m "feat(techstack): add spotlight dimming effect on node selection"
```

---

## Task 7: Manual Testing and Verification

**Files:**
- Test: All changes in browser

**Interfaces:**
- Consumes: All previous tasks' outputs
- Produces: Verified working implementation

- [ ] **Step 1: Test resize performance**

Run: `npm run dev`
Open Chrome DevTools → Performance tab
Start recording
Resize browser window multiple times (rapidly)
Stop recording
Expected: No large layout recalculations, no "useEffect" spikes, smooth 60fps

- [ ] **Step 2: Verify no polling**

Open Chrome DevTools → Sources tab → Event Listener Breakpoints
Check "setInterval"
Interact with graph
Expected: No breakpoints hit (no setInterval calls)

- [ ] **Step 3: Test all interactions**

Run through this checklist:
- [ ] Graph renders on page load
- [ ] Nodes settle smoothly (progressive cooling)
- [ ] Drag a tool node → it follows cursor, releases on drop
- [ ] Drag a domain node → same behavior
- [ ] Try to drag center node → should not move (pinned)
- [ ] Click a tool → popover appears, spotlight dims others
- [ ] Drag the selected tool → popover follows
- [ ] Zoom in → popover stays attached
- [ ] Pan → popover stays attached
- [ ] Click popover close button → popover disappears, spotlight clears
- [ ] Click background → any active popover/spotlight clears
- [ ] Zoom out below 0.6 → tool nodes disappear
- [ ] Zoom in above 0.6 → tool nodes reappear
- [ ] All transitions are smooth

- [ ] **Step 4: Test on mobile viewport**

Chrome DevTools → Toggle device toolbar
Select iPhone SE or similar small device
Expected: Graph still works, no layout issues, touch interactions work

- [ ] **Step 5: Check for console errors**

Open Console tab
Expected: No errors or warnings

- [ ] **Step 6: Document test results**

Create a brief test report (can be in git commit message or separate file):
```
Manual Testing Results (2026-06-21):
- ✅ Resize performance: no jitter, no re-renders
- ✅ No setInterval polling detected
- ✅ All interactions working (drag, zoom, pan, click)
- ✅ foreignObject popover follows node correctly
- ✅ Spotlight effect highlights connections
- ✅ Semantic zooming hides tools at low zoom
- ✅ Progressive cooling settles smoothly
- ✅ Mobile viewport: functional
- ✅ No console errors
```

---

## Task 8: Update Tests (If Needed)

**Files:**
- Modify: `src/components/__tests__/TechStackGraph.test.tsx` (if tests exist and fail)

**Interfaces:**
- Consumes: Refactored TechStackGraph component
- Produces: Updated passing tests

- [ ] **Step 1: Check if tests exist**

Run: `npm test -- TechStackGraph`
Expected: May show "no tests found" (which is fine), or tests may run

- [ ] **Step 2: If tests exist and pass, skip to commit**

If output shows tests passing, no changes needed. Proceed to Step 4.

- [ ] **Step 3: If tests fail, update them**

Common issues to fix:
- Remove any tests checking for `setInterval`
- Update tests expecting absolute-positioned popover HTML to check for foreignObject instead
- Update any tests mocking D3 selections to include new spotlight/config functions

Example fix for foreignObject test:

```typescript
// If there's a test like:
expect(container.querySelector('.popover-content')).toBeTruthy();

// Update to:
expect(container.querySelector('foreignObject.ts-popover-fo')).toBeTruthy();
```

- [ ] **Step 4: Run all tests**

Run: `npm test`
Expected: All tests pass

- [ ] **Step 5: Commit test updates**

```bash
git add src/components/__tests__/TechStackGraph.test.tsx
git commit -m "test(techstack): update tests for refactored graph"
```

---

## Task 9: Final Build Verification and Documentation

**Files:**
- Test: Production build
- Update: CLAUDE.md or README if needed

**Interfaces:**
- Consumes: All completed tasks
- Produces: Production-ready build, updated docs

- [ ] **Step 1: Clean build**

Run: `npm run build`
Expected: Build completes successfully, no errors or warnings

- [ ] **Step 2: Preview production build**

Run: `npm run preview`
Open browser to preview URL
Test all interactions again (same checklist as Task 7, Step 3)
Expected: Everything works in production build

- [ ] **Step 3: Check bundle size (optional)**

Run: `ls -lh dist/assets/*.js`
Compare to previous build (if available)
Expected: Size should be similar or slightly smaller (removed polling code)

- [ ] **Step 4: Update documentation if needed**

If CLAUDE.md or README mentions TechStack implementation details, update them:

Example addition to CLAUDE.md:
```markdown
### TechStack Graph

The force-directed graph uses D3.js with a persistent simulation architecture. Configuration is centralized in `techstack-graph-config.ts`. The simulation persists across resizes via imperative updates (no teardown/rebuild). Popover uses foreignObject to stay in SVG coordinate space (no polling). Visual effects (spotlight, semantic zoom) use CSS transitions.
```

- [ ] **Step 5: Final commit**

```bash
git add CLAUDE.md  # or README, if updated
git commit -m "docs: document TechStack graph refactor architecture"
```

- [ ] **Step 6: Verify all success criteria from spec**

Check against the spec's success criteria:
1. ✅ Resize without simulation rebuild
2. ✅ No setInterval polling
3. ✅ Single releaseSelectedNode() function
4. ✅ All magic numbers in config file
5. ✅ Popover via foreignObject
6. ✅ Spotlight effect working
7. ✅ Progressive cooling animation
8. ✅ Semantic zooming at thresholds
9. ✅ No TypeScript `as` assertions (removed where possible)
10. ✅ All tests pass

---

## Execution Notes

**Parallel Implementation (Subagent-Driven):**
- Task 1 (Config) → Task 2 (CSS) can run in parallel
- Task 3 (Simulation refactor) blocks Tasks 4-6
- Tasks 4 (Cooling), 5 (foreignObject), 6 (Spotlight) can run in parallel after Task 3
- Tasks 7-9 must run sequentially after all implementation tasks

**Estimated Time:**
- Task 1: 5 minutes
- Task 2: 5 minutes
- Task 3: 20 minutes
- Task 4: 5 minutes
- Task 5: 15 minutes
- Task 6: 10 minutes
- Task 7: 15 minutes
- Task 8: 5-10 minutes (if tests exist)
- Task 9: 10 minutes

**Total: ~90 minutes** (or ~60 minutes with parallel execution)
