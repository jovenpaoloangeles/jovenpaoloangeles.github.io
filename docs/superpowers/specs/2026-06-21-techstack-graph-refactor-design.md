# TechStack Graph Refactor Design

**Date:** 2026-06-21  
**Status:** Approved  
**Scope:** Comprehensive refactor of D3.js force-directed graph visualization

## Overview

This design addresses performance bottlenecks, architectural issues, and adds visual polish to the TechStack force-directed graph. The refactor eliminates redundant state management, removes polling-based updates, fixes the resize performance anti-pattern, and introduces four visual enhancements: spotlight dimming, foreignObject popover, progressive collision detection, and semantic zooming.

## Goals

1. **Performance**: Eliminate simulation teardown on resize, remove 120ms polling interval
2. **Architecture**: Clean up dual state tracking, extract magic numbers, improve type safety
3. **Visual Polish**: Add spotlight effect, native SVG popover, progressive cooling, semantic zoom
4. **Maintainability**: Centralize configuration, reduce code duplication

## Architecture Overview

### File Structure

```
src/components/techstack/
├── techstack-graph-config.ts       (NEW - configuration constants)
├── TechStackGraph.tsx              (REFACTORED - main component)
├── TechStackList.tsx               (UNCHANGED)
└── __tests__/
    └── TechStackGraph.test.tsx     (UPDATE - may need adjustments)
```

Single-file refactor approach with extracted configuration module. All graph logic remains in `TechStackGraph.tsx` for ease of review and maintenance.

## Design Details

### 1. Configuration Architecture

**New file: `src/components/techstack/techstack-graph-config.ts`**

Centralized configuration module exporting:

```typescript
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

**Rationale:**
- All tunable parameters in one place
- Grouped by concern (visual, physics, animation, zoom, spotlight)
- Type-safe exports
- Future developers can tune without understanding D3 internals

### 2. Persistent Simulation Architecture

**Problem:** Current implementation triggers full simulation teardown/rebuild on every resize due to `size` state dependency in the main useEffect.

**Solution:** Persistent simulation with imperative updates.

#### Simulation Lifecycle

```typescript
// Refs for persistent state
const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
const nodesRef = useRef<SimNode[]>([]);           // Already exists
const linksRef = useRef<SimLink[]>([]);           // NEW
const sizeRef = useRef({ w: 600, h: 460 });       // NEW (ref instead of state)
const selectedIdRef = useRef<string | null>(null); // Already exists
const svgRef = useRef<SVGSVGElement>(null);       // Already exists
const wrapRef = useRef<HTMLDivElement>(null);     // Already exists

// Minimal state for React rendering
const [selected, setSelected] = useState<Selected | null>(null);
```

#### Resize Handling

```typescript
// Effect 1: ResizeObserver with RAF debouncing (keep existing pattern)
useEffect(() => {
  const el = wrapRef.current;
  if (!el) return;
  
  let rafId: number | null = null;
  const ro = new ResizeObserver((entries) => {
    const r = entries[0].contentRect;
    const next = { w: Math.max(320, r.width), h: Math.max(360, r.height) };
    
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      rafId = null;
      handleResize(next);  // NEW: imperative handler
    });
  });
  
  ro.observe(el);
  return () => {
    ro.disconnect();
    if (rafId != null) cancelAnimationFrame(rafId);
  };
}, []);

// Imperative resize handler (does NOT trigger React re-render)
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
  linkForce.distance((l) => 
    l.kind === 'spoke' ? R1 : l.kind === 'member' ? R2 - R1 : PHYSICS.linkDistances.tech
  );
  
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

#### useEffect Structure

```typescript
// Effect 2: Create simulation once (only re-runs if nodes/links data changes)
useEffect(() => {
  const svgEl = svgRef.current;
  if (!svgEl) return;
  
  const { w, h } = sizeRef.current;
  const cx = w / 2;
  const cy = h / 2;
  
  // Build nodes and links
  const center: SimNode = { id: CENTER_ID, kind: 'center', label: TECHSTACK_CENTER.name };
  const domNodes: SimNode[] = TECHSTACK_DOMAINS.map((d) => ({
    id: d.id, kind: 'domain', label: d.short,
  }));
  const toolNodes: SimNode[] = TECHSTACK_TOOLS.map((t) => ({
    id: t.id, kind: 'tool', label: t.name, tool: t, domainId: t.domainId, level: t.level,
  }));
  const nodes: SimNode[] = [center, ...domNodes, ...toolNodes];
  nodesRef.current = nodes;
  
  const links: SimLink[] = [
    ...TECHSTACK_DOMAINS.map<SimLink>((d) => ({ kind: 'spoke', source: CENTER_ID, target: d.id })),
    ...TECHSTACK_TOOLS.map<SimLink>((t) => ({ kind: 'member', source: t.domainId, target: t.id })),
    ...TECHSTACK_TECH_LINKS.map<SimLink>(([a, b]) => ({ kind: 'tech', source: a, target: b })),
  ];
  linksRef.current = links;
  
  const R1 = Math.min(w, h) * PHYSICS.radialRings.innerFactor;
  const R2 = Math.min(w, h) * PHYSICS.radialRings.outerFactor;
  
  // Create SVG structure
  const svg = d3.select<SVGSVGElement, unknown>(svgEl);
  svg.selectAll('*').remove();
  svg.attr('viewBox', `0 0 ${w} ${h}`);
  
  const root = svg.append('g').attr('class', 'ts-graph-root');
  
  // Links
  const linkSel = root.append('g').attr('class', 'ts-links')
    .selectAll<SVGLineElement, SimLink>('line')
    .data(links)
    .join('line')
    .attr('class', (l) => 'ts-link ' + l.kind);
  
  // Nodes
  const nodeG = root.append('g').attr('class', 'ts-nodes')
    .selectAll<SVGGElement, SimNode>('g')
    .data(nodes, (n) => n.id)
    .join('g')
    .attr('class', (n) => 'ts-node ts-' + n.kind)
    .attr('data-node', (n) => n.kind)
    .attr('data-id', (n) => n.id)
    .style('cursor', 'pointer');
  
  // ... (render tiles, icons, labels - same as current)
  
  // Popover container
  const popoverG = root.append('g').attr('class', 'ts-popover-container');
  
  // Create simulation
  const sim = d3.forceSimulation<SimNode>(nodes)
    .force('charge', d3.forceManyBody<SimNode>().strength((n) =>
      n.kind === 'center' ? PHYSICS.charge.center :
      n.kind === 'domain' ? PHYSICS.charge.domain :
      PHYSICS.charge.tool))
    .force('collide', d3.forceCollide<SimNode>()
      .radius((n) => nodeRadius(n) + COLLISION_PADDING)
      .iterations(PHYSICS.collideIterations))
    .force('radial', d3.forceRadial<SimNode>(
      (n) => (n.kind === 'center' ? 0 : n.kind === 'domain' ? R1 : R2),
      cx, cy
    ).strength(PHYSICS.radialStrength))
    .force('link', d3.forceLink<SimNode, SimLink>(links)
      .id((n) => n.id)
      .distance((l) => l.kind === 'spoke' ? R1 : l.kind === 'member' ? R2 - R1 : PHYSICS.linkDistances.tech)
      .strength((l) => 
        l.kind === 'spoke' ? PHYSICS.linkStrengths.spoke :
        l.kind === 'member' ? PHYSICS.linkStrengths.member :
        PHYSICS.linkStrengths.tech))
    .force('center', d3.forceCenter(cx, cy).strength(PHYSICS.centerForceStrength))
    .alpha(ANIMATION.initialAlpha)
    .alphaDecay(ANIMATION.initialAlphaDecay);
  
  simulationRef.current = sim;
  
  center.fx = cx;
  center.fy = cy;
  
  // Set up drag, zoom, click handlers (see next sections)
  // ...
  
  // Tick handler
  sim.on('tick', () => {
    // Boundary constraints
    const pad = BOUNDARY_PADDING;
    for (const n of nodes) {
      if (n.kind === 'center') continue;
      if (n.x! < pad) n.x = pad;
      else if (n.x! > w - pad) n.x = w - pad;
      if (n.y! < pad) n.y = pad;
      else if (n.y! > h - pad) n.y = h - pad;
    }
    
    // Update node positions
    nodeG.attr('transform', (n) => `translate(${n.x},${n.y})`);
    
    // Update link positions
    linkSel
      .attr('x1', (l) => (l.source as SimNode).x!)
      .attr('y1', (l) => (l.source as SimNode).y!)
      .attr('x2', (l) => (l.target as SimNode).x!)
      .attr('y2', (l) => (l.target as SimNode).y!);
    
    // Update popover position if active
    if (selectedIdRef.current) {
      const node = nodes.find(n => n.id === selectedIdRef.current);
      if (node && node.x != null && node.y != null) {
        popoverG.attr('transform', `translate(${node.x},${node.y - 20})`);
      }
    }
  });
  
  return () => {
    svg.on('.zoom', null);
    sim.stop();
    simulationRef.current = null;
  };
}, []); // Empty deps: only run on mount

// Effect 3: Progressive cooling
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
}, []); // Re-run when simulation recreates
```

**Key changes:**
- Simulation persists in `simulationRef`, only created on mount
- Resize updates simulation imperatively without React re-render
- `sizeRef` stores dimensions (ref, not state)
- Progressive cooling: high friction initially, relaxes after 100 ticks
- Type safety: explicit generics eliminate `as SimNode` casts

### 3. Eliminating Redundancies

#### Unified Node Unpinning

**Current problem:** Unpinning logic duplicated in two places.

**Solution:**
```typescript
// Single helper function
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

// Used in SVG background click
svg.on('click', () => {
  releaseSelectedNode();
  setSelected(null);
});

// Used in popover close
const handleClose = () => {
  releaseSelectedNode();
  setSelected(null);
};
```

#### Simplified State Tracking

**Current:** Maintains both `selected` state and `selectedIdRef` ref.

**Refactored approach:**
- `selectedIdRef`: Source of truth for which node is pinned (D3 needs this)
- `selected` state: Minimal data for popover rendering (`{ id, kind, x, y }`)
- Both set together in click handler, cleared together on close
- No synchronization issues

#### Eliminating Polling

**Current:** 120ms `setInterval` tracks node position for popover.

**Refactored:** Completely removed. Popover position updated in `sim.on('tick')` handler via foreignObject transform (see Section 4).

#### Type Safety Improvements

```typescript
// Explicit generics
const sim = d3.forceSimulation<SimNode>(nodes);

// Typed selections
const nodeG = root.append('g')
  .selectAll<SVGGElement, SimNode>('g')
  .data(nodes, d => d.id)  // Type inference works correctly
  .join('g');

// No more assertions needed:
// OLD: (n as SimNode).x
// NEW: n.x  (type already known)
```

### 4. Visual Enhancements

#### foreignObject Popover

**Current problem:** Absolutely-positioned HTML requires polling to track node position.

**Solution:** Render popover inside SVG using `<foreignObject>`.

```typescript
// Inside simulation setup, create popover container
const popoverG = root.append('g').attr('class', 'ts-popover-container');

// On node click
const handleNodeClick = (event: MouseEvent, node: SimNode) => {
  if (moved) return;
  event.stopPropagation();
  
  // Pin node
  node.fx = node.x;
  node.fy = node.y;
  selectedIdRef.current = node.id;
  
  // Render popover in SVG
  renderPopoverInSVG(popoverG, node);
};

nodeG.on('click', handleNodeClick);

// Popover rendering function
const renderPopoverInSVG = (
  container: d3.Selection<SVGGElement, unknown, null, undefined>,
  node: SimNode
) => {
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
    .attr('height', 200)  // Auto-adjust based on content
    .attr('x', 16)
    .attr('y', -200)  // Above the node
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
};

// Update position on tick (inside sim.on('tick'))
if (selectedIdRef.current) {
  const node = nodes.find(n => n.id === selectedIdRef.current);
  if (node && node.x != null && node.y != null) {
    popoverG.attr('transform', `translate(${node.x},${node.y - 20})`);
  }
}
```

**Benefits:**
- No polling interval
- Popover automatically follows node during zoom/pan
- SVG coordinate space (no screen-space conversion)
- Tailwind classes work inside foreignObject

#### Spotlight Dimming Effect

**Goal:** When a node is selected, dim all unconnected nodes and links.

**CSS (add to component or global styles):**
```css
.ts-node, .ts-link {
  transition: opacity 300ms ease;
  opacity: 1;
}

.ts-node.dimmed, .ts-link.dimmed {
  opacity: 0.2;
}
```

**Implementation:**
```typescript
// Activate spotlight on node selection
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

// Clear spotlight
const clearSpotlight = () => {
  nodeG.classed('dimmed', false);
  linkSel.classed('dimmed', false);
};

// Call in node click handler
nodeG.on('click', (event, node) => {
  if (moved) return;
  event.stopPropagation();
  
  node.fx = node.x;
  node.fy = node.y;
  selectedIdRef.current = node.id;
  
  activateSpotlight(node.id);
  renderPopoverInSVG(popoverG, node);
});

// Call in background click and close handlers
svg.on('click', () => {
  releaseSelectedNode();
  clearSpotlight();
  popoverG.selectAll('*').remove();
});

const handleClose = () => {
  releaseSelectedNode();
  clearSpotlight();
  popoverG.selectAll('*').remove();
};
```

**Benefits:**
- Clear visual hierarchy
- Reduces cognitive load when exploring connections
- Performant (CSS transitions, no JS animation)

#### Semantic Zooming

**Goal:** Progressive disclosure — hide details at low zoom levels, reveal when zoomed in.

**Implementation:**
```typescript
// Set up zoom with semantic visibility
const zoom = d3.zoom<SVGSVGElement, unknown>()
  .scaleExtent(ZOOM.scaleExtent)
  .on('zoom', (event) => {
    root.attr('transform', event.transform.toString());
    
    const scale = event.transform.k;
    
    // At low zoom, hide tool nodes entirely (keep only center + domains)
    if (scale < ZOOM.semanticThresholds.showOnlyDomains) {
      nodeG.filter(n => n.kind === 'tool').style('opacity', 0);
      linkSel.filter(l => l.kind === 'tech' || l.kind === 'member').style('opacity', 0);
    }
    // At medium zoom, show tools but hide labels (if we add them later)
    else if (scale < ZOOM.semanticThresholds.hideToolLabels) {
      nodeG.filter(n => n.kind === 'tool').style('opacity', 1);
      linkSel.style('opacity', 1);
      // If we add tool labels: nodeG.selectAll('.ts-tool-label').style('opacity', 0);
    }
    // At high zoom, show everything
    else {
      nodeG.style('opacity', 1);
      linkSel.style('opacity', 1);
      // If we add tool labels: nodeG.selectAll('.ts-tool-label').style('opacity', 1);
    }
  });

svg.call(zoom);
```

**CSS for smooth transitions:**
```css
.ts-node, .ts-link {
  transition: opacity 200ms ease;
}
```

**Benefits:**
- Reduces visual clutter at overview zoom levels
- Scales better if more tools are added in the future
- Smooth CSS transitions (performant)

**Note:** Current implementation doesn't have tool labels (only domain labels). If tool labels are added in the future, semantic zooming will hide them at low zoom levels.

## Testing Strategy

1. **Manual Testing:**
   - Resize browser window repeatedly → verify no jitter, no full rebuilds
   - Click nodes → verify popover appears, follows node during drag/zoom
   - Verify spotlight dims unconnected nodes/links
   - Zoom in/out → verify semantic visibility thresholds work
   - Test on mobile viewport sizes

2. **Unit Tests (update existing TechStackGraph.test.tsx):**
   - Verify configuration constants are imported correctly
   - Test `releaseSelectedNode()` helper
   - Mock D3 simulation and verify force parameters match config
   - Test spotlight `activateSpotlight()` / `clearSpotlight()` logic

3. **Integration Tests:**
   - Verify clicking a node → popover renders → close button works
   - Verify background click clears selection and spotlight
   - Verify drag behavior (nodes can be dragged, center cannot)

4. **Performance Testing:**
   - Profile with Chrome DevTools during resize → verify no full re-renders
   - Verify 120ms polling interval is gone (check Sources → setInterval)
   - Measure FPS during initial simulation settling

## Migration Notes

- No data structure changes → content in `techstack.ts` unchanged
- CSS classes remain the same → existing styles compatible
- Component API unchanged → parent component (`TechStack.tsx`) needs no updates
- Tests may need updates due to foreignObject structure changes

## Success Criteria

1. ✅ Resize browser window without triggering full simulation rebuild
2. ✅ No `setInterval` polling in running code
3. ✅ Single `releaseSelectedNode()` function (no duplication)
4. ✅ All magic numbers extracted to config file
5. ✅ Popover rendered in SVG via foreignObject
6. ✅ Spotlight effect highlights connected nodes when selected
7. ✅ Progressive cooling animation on initial load (settles smoothly)
8. ✅ Semantic zooming hides tools when zoomed out below threshold
9. ✅ No TypeScript `as` assertions for node types (proper generics)
10. ✅ All existing tests pass (or updated appropriately)

## Future Enhancements (Out of Scope)

- Tool labels on hover (would integrate with semantic zooming)
- Animated transitions when switching between list/graph views
- Keyboard navigation (tab through nodes, enter to select)
- Touch gesture support for mobile (pinch to zoom, two-finger pan)
- Export graph as SVG/PNG
- Permalink to specific node selection (URL hash parameter)
