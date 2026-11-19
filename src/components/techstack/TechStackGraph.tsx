import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Minus, Plus } from 'lucide-react';
import {
  select,
  forceSimulation,
  forceManyBody,
  forceCollide,
  forceRadial,
  forceLink,
  forceCenter,
  drag as d3drag,
  zoom as d3zoom,
  zoomTransform,
} from 'd3';
import type {
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
  ForceLink,
} from 'd3';
import {
  TECHSTACK_DOMAINS, TECHSTACK_TOOLS, TECHSTACK_TECH_LINKS, TECHSTACK_CENTER,
  domainById, iconSrc, monogram, neighborsOf, type Tool,
} from '@/content/techstack';
import {
  TILE_SIZES, NODE_RADII, COLLISION_PADDING, BOUNDARY_PADDING,
  PHYSICS, ANIMATION, ZOOM, SPOTLIGHT, POPOVER, placePopover
} from './techstack-graph-config';

interface SimNode extends SimulationNodeDatum {
  id: string;
  kind: 'center' | 'domain' | 'tool';
  label: string;
  tool?: Tool;
  domainId?: string;
  level?: Tool['level'];
}
interface SimLink extends SimulationLinkDatum<SimNode> {
  kind: 'spoke' | 'member' | 'tech' | 'cross' | 'child';
}

const CENTER_ID = '__me';

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

// Ring radius for a domain's tools — scales with tool count so even rings don't overlap.
function toolRingRadius(domainId: string): number {
  const count = TECHSTACK_TOOLS.filter((t) => t.domainId === domainId && !t.parent).length;
  return Math.max(PHYSICS.toolRing.minRadius, count * PHYSICS.toolRing.perTool);
}

// Angle (from center) at which a domain sits on its ring.
function domainAngle(domainId: string): number {
  const i = TECHSTACK_DOMAINS.findIndex((d) => d.id === domainId);
  return (i / TECHSTACK_DOMAINS.length) * 2 * Math.PI - Math.PI / 2;
}

// Link endpoints are id strings until forceLink resolves them into node objects.
const endId = (end: SimLink['source']): string =>
  typeof end === 'object' ? (end as SimNode).id : String(end);

function linkDistance(l: SimLink, R1: number): number {
  if (l.kind === 'spoke') return R1;
  if (l.kind === 'member') {
    const tool = TECHSTACK_TOOLS.find((t) => t.id === endId(l.target));
    return toolRingRadius(tool?.domainId ?? '');
  }
  if (l.kind === 'child') return PHYSICS.toolRing.childGap;
  return PHYSICS.techLinkDistance;
}

// With prefers-reduced-motion, run the simulation to rest synchronously and paint
// the final layout once instead of animating. Otherwise reheat as normal.
const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function reheat(sim: Simulation<SimNode, SimLink>, alpha: number) {
  if (!prefersReducedMotion()) {
    sim.alpha(alpha).restart();
    return;
  }
  sim.alpha(alpha).stop();
  while (sim.alpha() > sim.alphaMin()) sim.tick();
  sim.on('tick')?.call(sim); // sim.tick() doesn't emit events; paint once
}

const MAX_DOMAIN_CONNECTS = 6;

/** What the details popover shows for a node id. */
function popoverContent(id: string): { tag: string; title: string; body: string; connects: string[]; more: number } {
  if (id === CENTER_ID) {
    return { tag: 'Profile', title: TECHSTACK_CENTER.name, body: TECHSTACK_CENTER.title, connects: [], more: 0 };
  }
  const tool = TECHSTACK_TOOLS.find((t) => t.id === id);
  if (!tool) {
    const d = domainById(id);
    const names = TECHSTACK_TOOLS.filter((t) => t.domainId === d.id).map((t) => t.name);
    return {
      tag: 'Domain', title: d.name, body: d.role,
      connects: names.slice(0, MAX_DOMAIN_CONNECTS),
      more: Math.max(0, names.length - MAX_DOMAIN_CONNECTS),
    };
  }
  const connects = [...neighborsOf(tool.id)].filter((n) => n !== tool.id)
    .map((n) => TECHSTACK_TOOLS.find((t) => t.id === n)!.name);
  return { tag: domainById(tool.domainId).name, title: tool.name, body: tool.role, connects, more: 0 };
}

const graphStyles = `
  .ts-node, .ts-link {
    transition: opacity ${SPOTLIGHT.activeDuration}ms ease;
    opacity: 1;
  }

  .ts-node.dimmed, .ts-link.dimmed {
    opacity: ${SPOTLIGHT.dimmedOpacity};
  }

  .ts-hidden {
    opacity: 0 !important;
  }
`;

export function TechStackGraph() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const simulationRef = useRef<Simulation<SimNode, SimLink> | null>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const linksRef = useRef<SimLink[]>([]);
  const sizeRef = useRef({ w: 600, h: 460 });
  const lastSizeRef = useRef({ w: 0, h: 0 });
  // Set by the setup effect; lets the React +/− buttons drive d3-zoom.
  const zoomByRef = useRef<(factor: number) => void>(() => {});
  // Selection: React state drives the popover; the ref mirrors it for d3 handlers.
  // Both are written only by setSelection inside the setup effect.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const positionPopoverRef = useRef<() => void>(() => {});
  const closeRef = useRef<() => void>(() => {});

  // Place the popover before paint whenever the selection changes; the tick and
  // zoom handlers keep it attached to the node after that.
  useLayoutEffect(() => positionPopoverRef.current(), [selectedId]);

  const handleResize = (newSize: { w: number; h: number }) => {
    sizeRef.current = newSize;

    if (!simulationRef.current || !svgRef.current) return;

    const { w, h } = newSize;
    const cx = w / 2;
    const cy = h / 2;
    const R1 = Math.min(w, h) * PHYSICS.radialRings.innerFactor;

    // Update SVG viewBox
    select(svgRef.current).attr('viewBox', `0 0 ${w} ${h}`);

    // Update force centers imperatively
    simulationRef.current
      .force('center', forceCenter(cx, cy).strength(PHYSICS.centerForceStrength))
      .force('radial', forceRadial<SimNode>(
        (n) => (n.kind === 'center' ? 0 : R1),
        cx, cy
      ).strength(PHYSICS.radialStrength));

    // Update link distances based on new R1
    const linkForce = simulationRef.current.force('link') as ForceLink<SimNode, SimLink>;
    if (linkForce) {
      linkForce.distance((l) => linkDistance(l, R1));
    }

    // Update center node position
    const centerNode = nodesRef.current.find(n => n.id === CENTER_ID);
    if (centerNode) {
      centerNode.fx = cx;
      centerNode.fy = cy;
    }

    // Only reheat on a meaningful size change — avoid reheating on every sub-pixel
    // ResizeObserver tick (which would keep the simulation alive and jank the UI).
    const prev = lastSizeRef.current;
    const changed = Math.abs(prev.w - w) > 2 || Math.abs(prev.h - h) > 2;
    if (changed) {
      lastSizeRef.current = { w, h };
      reheat(simulationRef.current, 0.2);
    }
  };

  // #1: coalesce ResizeObserver updates to one per animation frame
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
          handleResize(next);
        });
      } else {
        handleResize(next);
      }
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    // Synchronously measure the real container size so forces are built from correct
    // dimensions from the first tick (sizeRef may still hold stale defaults on mount).
    const measured = wrapRef.current?.getBoundingClientRect();
    const w = measured ? Math.max(320, measured.width) : sizeRef.current.w;
    const h = measured ? Math.max(360, measured.height) : sizeRef.current.h;
    sizeRef.current = { w, h };
    const cx = w / 2;
    const cy = h / 2;

    const R1 = Math.min(w, h) * PHYSICS.radialRings.innerFactor;

    // Seed domains on a symmetric ring so the simulation starts balanced — random
    // initial positions can freeze mid-convergence and produce a persistent drift.
    const center: SimNode = { id: CENTER_ID, kind: 'center', label: TECHSTACK_CENTER.name, x: cx, y: cy };
    const domNodes: SimNode[] = TECHSTACK_DOMAINS.map((d) => {
      const a = domainAngle(d.id);
      return {
        id: d.id, kind: 'domain', label: d.short,
        x: cx + R1 * Math.cos(a),
        y: cy + R1 * Math.sin(a),
      };
    });
    // Seed non-child tools on even rings around their domain node.
    const toolsByDomain = new Map<string, typeof TECHSTACK_TOOLS>();
    for (const t of TECHSTACK_TOOLS) {
      if (t.parent) continue; // children are seeded in the second pass
      const arr = toolsByDomain.get(t.domainId) ?? [];
      arr.push(t);
      toolsByDomain.set(t.domainId, arr);
    }
    const toolNodes: SimNode[] = [];
    for (const [domId, tools] of toolsByDomain) {
      const a = domainAngle(domId);
      const domX = cx + R1 * Math.cos(a);
      const domY = cy + R1 * Math.sin(a);
      const ringR = toolRingRadius(domId);
      tools.forEach((t, i) => {
        const ta = (i / tools.length) * 2 * Math.PI;
        toolNodes.push({
          id: t.id, kind: 'tool', label: t.name, tool: t, domainId: t.domainId, level: t.level,
          x: domX + ringR * Math.cos(ta),
          y: domY + ringR * Math.sin(ta),
        });
      });
    }
    // Second pass: seed each child at childGap distance from its parent, toward the domain
    // node. This starts at the force-link equilibrium so the sim settles with near-zero work.
    for (const t of TECHSTACK_TOOLS) {
      if (!t.parent) continue;
      const parentNode = toolNodes.find((n) => n.id === t.parent);
      const px = parentNode?.x ?? cx;
      const py = parentNode?.y ?? cy;
      const a = domainAngle(t.domainId);
      const domX = cx + R1 * Math.cos(a);
      const domY = cy + R1 * Math.sin(a);
      const dx = domX - px;
      const dy = domY - py;
      const len = Math.hypot(dx, dy) || 1;
      toolNodes.push({
        id: t.id, kind: 'tool', label: t.name, tool: t, domainId: t.domainId, level: t.level,
        x: px + (dx / len) * PHYSICS.toolRing.childGap,
        y: py + (dy / len) * PHYSICS.toolRing.childGap,
      });
    }
    const nodes: SimNode[] = [center, ...domNodes, ...toolNodes];
    nodesRef.current = nodes;

    const crossLinks: SimLink[] = TECHSTACK_TOOLS.flatMap<SimLink>((t) =>
      (t.also ?? []).map((domId) => ({ kind: 'cross', source: t.id, target: domId })),
    );
    const childLinks: SimLink[] = TECHSTACK_TOOLS
      .filter((t) => t.parent != null)
      .map<SimLink>((t) => ({ kind: 'child', source: t.parent!, target: t.id }));
    const links: SimLink[] = [
      ...TECHSTACK_DOMAINS.map<SimLink>((d) => ({ kind: 'spoke', source: CENTER_ID, target: d.id })),
      ...TECHSTACK_TOOLS.filter((t) => !t.parent).map<SimLink>((t) => ({ kind: 'member', source: t.domainId, target: t.id })),
      ...TECHSTACK_TECH_LINKS.map<SimLink>(([a, b]) => ({ kind: 'tech', source: a, target: b })),
      ...crossLinks,
      ...childLinks,
    ];
    linksRef.current = links;

    const svg = select(svgEl);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${w} ${h}`);

    const root = svg.append('g').attr('class', 'ts-graph-root');

    const linkSel = root.append('g').attr('class', 'ts-links')
      .selectAll('line').data(links).join('line')
      .attr('class', (l) => 'ts-link ' + l.kind);

    const nodeG = root.append('g').attr('class', 'ts-nodes')
      .selectAll('g').data(nodes, (n) => (n as SimNode).id).join('g')
      .attr('class', (n) => 'ts-node ts-' + n.kind)
      .attr('data-node', (n) => n.kind)
      .attr('data-id', (n) => n.id)
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', (n) => (n.tool ? `${n.label} (${domainById(n.tool.domainId).name})` : n.label))
      .style('cursor', 'pointer');

    // Native hover tooltip — tool tiles are icon-only at default zoom.
    nodeG.append('title').text((n) => n.label);

    // Spotlight dimming effect
    const activateSpotlight = (nodeId: string) => {
      const connected = new Set<string>();
      connected.add(nodeId);

      // Find all first-degree neighbors
      linksRef.current.forEach(link => {
        const srcId = endId(link.source);
        const tgtId = endId(link.target);

        if (srcId === nodeId) connected.add(tgtId);
        if (tgtId === nodeId) connected.add(srcId);
      });

      // Dim nodes not in connected set
      nodeG.classed('dimmed', n => !connected.has(n.id));

      // Dim links not connected to selected node
      linkSel.classed('dimmed', l => {
        const srcId = endId(l.source);
        const tgtId = endId(l.target);
        return srcId !== nodeId && tgtId !== nodeId;
      });
    };

    const clearSpotlight = () => {
      nodeG.classed('dimmed', false);
      linkSel.classed('dimmed', false);
    };

    // tile background
    nodeG.append('rect')
      .attr('class', 'ts-tile')
      .attr('rx', (n) => (n.kind === 'center' ? 999 : 8))
      .each(function (n) {
        const s = nodeTile(n);
        select(this).attr('x', -s / 2).attr('y', -s / 2).attr('width', s).attr('height', s);
      });

    // icon or monogram or avatar
    nodeG.each(function (n) {
      const g = select(this);
      const s = nodeTile(n);
      if (n.kind === 'center') {
        g.append('clipPath').attr('id', 'ts-me-clip').append('circle').attr('r', s / 2 - 2);
        g.append('image')
          .attr('href', TECHSTACK_CENTER.photo)
          .attr('width', s).attr('height', s).attr('x', -s / 2).attr('y', -s / 2)
          .attr('preserveAspectRatio', 'xMidYMid slice')
          .attr('clip-path', 'url(#ts-me-clip)');
      } else if (n.tool && iconSrc(n.tool)) {
        g.append('image')
          .attr('href', iconSrc(n.tool))
          .attr('width', s * 0.6).attr('height', s * 0.6)
          .attr('x', -s * 0.3).attr('y', -s * 0.3)
          .attr('preserveAspectRatio', 'xMidYMid meet')
          .on('error', function () {
            select(this).style('display', 'none');
            g.append('text').attr('class', 'ts-mg').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
              .attr('font-size', s * 0.32).text(monogram(n.tool!));
          });
      } else {
        g.append('text').attr('class', 'ts-mg').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
          .attr('font-size', s * 0.32).text(n.tool ? monogram(n.tool) : n.label.slice(0, 2));
      }
    });

    // domain labels (outside tile)
    nodeG.filter((n) => n.kind === 'domain').append('text')
      .attr('class', 'ts-dom-label').attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('y', nodeTile({ kind: 'domain' } as SimNode) / 2 + 12)
      .text((n) => n.label);

    // tool names, shown only when zoomed in (see applySemanticZoom)
    nodeG.filter((n) => n.kind === 'tool').append('text')
      .attr('class', 'ts-tool-label').attr('text-anchor', 'middle').attr('dominant-baseline', 'hanging')
      .attr('y', (n) => nodeTile(n) / 2 + 3)
      .text((n) => n.label);

    // simulation
    const sim = forceSimulation<SimNode>(nodes)
      .force('charge', forceManyBody<SimNode>().strength((n) =>
        n.kind === 'center' ? PHYSICS.charge.center :
        n.kind === 'domain' ? PHYSICS.charge.domain :
        PHYSICS.charge.tool))
      .force('collide', forceCollide<SimNode>()
        .radius((n) => nodeRadius(n) + COLLISION_PADDING)
        .iterations(PHYSICS.collideIterations))
      .force('radial', forceRadial<SimNode>(
        // Domains sit on the R1 ring; tools target R1 too so they hug their domain's ring.
        (n) => (n.kind === 'center' ? 0 : R1),
        cx, cy
      ).strength(PHYSICS.radialStrength))
      .force('link', forceLink<SimNode, SimLink>(links).id((n) => n.id)
        .distance((l) => linkDistance(l, R1))
        .strength((l) =>
          l.kind === 'spoke' ? PHYSICS.linkStrengths.spoke :
          l.kind === 'member' ? PHYSICS.linkStrengths.member :
          l.kind === 'child' ? PHYSICS.linkStrengths.member :
          l.kind === 'cross' ? 0 :
          PHYSICS.linkStrengths.tech))
      .force('center', forceCenter(cx, cy).strength(PHYSICS.centerForceStrength))
      .alpha(ANIMATION.initialAlpha).alphaDecay(ANIMATION.initialAlphaDecay);

    simulationRef.current = sim;

    center.fx = cx;
    center.fy = cy;

    // Selection state machine:
    //
    //   none ──select(n)──▶ selected(n) ──select(m)──▶ selected(m)
    //    ▲                      │
    //    └── × / Escape / background click
    //
    // Invariant: the selected node is pinned (fx/fy) so the popover doesn't chase
    // it; the center is always pinned, so releasing never unpins it.
    const setSelection = (node: SimNode | null) => {
      const prev = nodes.find((n) => n.id === selectedIdRef.current);
      if (prev && prev.kind !== 'center') { prev.fx = null; prev.fy = null; }
      selectedIdRef.current = node?.id ?? null;
      setSelectedId(node?.id ?? null);
      if (node) {
        node.fx = node.x; node.fy = node.y;
        activateSpotlight(node.id);
      } else {
        clearSpotlight();
      }
    };
    closeRef.current = () => setSelection(null);

    positionPopoverRef.current = () => {
      const el = popoverRef.current;
      const node = nodes.find((n) => n.id === selectedIdRef.current);
      if (!el || !node || node.x == null || node.y == null) return;
      const t = zoomTransform(svgEl);
      const { w: cw, h: ch } = sizeRef.current;
      const p = placePopover(
        node.x * t.k + t.x, node.y * t.k + t.y, cw, ch,
        el.offsetWidth || POPOVER.w, el.offsetHeight || POPOVER.h,
      );
      el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    };

    // Drag vs click are decoupled:
    //  - drag only "activates" once the pointer travels past CLICK_THRESHOLD, so a
    //    plain click never reheats the simulation (which would jitter the graph)
    //    and never moves the node.
    //  - clickDistance lets the native click event still fire for small movements,
    //    so a real `click` listener handles selection. d3 suppresses that click
    //    after a genuine drag, so dragging a node won't also select it.
    const CLICK_THRESHOLD = 20; // generous threshold for real hardware (trackpads/mice drift ~10px on a tap)
    // Gesture: idle ──press──▶ pressed(x,y) ──moved ≥ threshold──▶ dragging ──release──▶ idle
    //                              └──────────── release (a click) ─────────────────▶ idle
    type Gesture = { kind: 'idle' } | { kind: 'pressed'; x: number; y: number } | { kind: 'dragging' };
    let gesture: Gesture = { kind: 'idle' };
    const drag = d3drag<SVGGElement, SimNode>()
      .clickDistance(CLICK_THRESHOLD)
      .on('start', (e) => {
        gesture = { kind: 'pressed', x: e.x, y: e.y };
      })
      .on('drag', (e, n) => {
        if (n.kind === 'center') return;
        if (gesture.kind === 'pressed' && Math.hypot(e.x - gesture.x, e.y - gesture.y) >= CLICK_THRESHOLD) {
          gesture = { kind: 'dragging' };
          // Reheat so the simulation ticks while we drag. This must NOT be gated on
          // !e.active: during 'drag' events e.active is already 1, so that guard would
          // skip the reheat, leave the settled sim cold, and the node — whose position
          // is repainted only in the tick handler — would never move even though fx/fy
          // are set. (The node visually "freezes": click works, drag does not.)
          sim.alphaTarget(ANIMATION.dragAlphaTarget).restart();
        }
        if (gesture.kind === 'dragging') { n.fx = e.x; n.fy = e.y; }
      })
      .on('end', (_event, n) => {
        if (gesture.kind === 'dragging') {
          sim.alphaTarget(0);
          // Release after a real drag — unless it's the center or the selected node,
          // which stay pinned (see the selection invariant above).
          if (n.kind !== 'center' && n.id !== selectedIdRef.current) { n.fx = null; n.fy = null; }
        }
        gesture = { kind: 'idle' };
      });
    // d3's DragBehavior and Selection generics don't unify across .call (the node
    // selection's first generic is BaseType|SVGGElement); assert nodeG as the exact
    // selection type the behavior expects so the call type-checks.
    (nodeG as unknown as Parameters<typeof drag>[0]).call(drag);

    // Selection — fires for clicks (movement <= clickDistance); suppressed after a drag.
    nodeG.on('click', (event, node) => {
      event.stopPropagation();
      setSelection(node);
    });
    nodeG.on('keydown', (event: KeyboardEvent, node) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      setSelection(node);
    });

    // Semantic zooming: show/hide tool nodes based on zoom scale
    const applySemanticZoom = (scale: number) => {
      // Overview: hide tool nodes and their links, keep domains + center
      const overview = scale < ZOOM.semanticThresholds.showOnlyDomains;
      nodeG.filter((n) => n.kind === 'tool')
        .classed('ts-hidden', overview)
        .attr('tabindex', overview ? -1 : 0); // hidden nodes leave the tab order
      linkSel.filter((l) => l.kind !== 'spoke').classed('ts-hidden', overview);
      root.classed('ts-labels-off', scale < ZOOM.semanticThresholds.showToolLabels);
    };

    // pan/zoom
    const zoom = d3zoom<SVGSVGElement, unknown>()
      .scaleExtent(ZOOM.scaleExtent)
      // A plain wheel scrolls the page; zoom needs Ctrl/⌘ + wheel (trackpad pinch
      // arrives as ctrl+wheel). Touch pans/zooms only with two fingers, so a
      // one-finger swipe still scrolls past the graph. Otherwise d3's default filter.
      .filter((e) => {
        if (e.type === 'wheel') return e.ctrlKey || e.metaKey;
        if (e.type === 'touchstart') return e.touches.length > 1;
        return !e.ctrlKey && !e.button;
      })
      .on('zoom', (event) => {
        root.attr('transform', event.transform.toString());
        root.style('--ts-k', String(event.transform.k));
        applySemanticZoom(event.transform.k);
        positionPopoverRef.current();
      });
    svg.call(zoom).style('touch-action', 'pan-y'); // d3 sets 'none', which traps page scroll
    zoomByRef.current = (factor) => svg.transition().duration(200).call(zoom.scaleBy, factor);
    // Apply initial visibility state (zoom handler only fires on user interaction)
    applySemanticZoom(zoomTransform(svgEl).k);

    // Deselect on SVG background click (empty space, not a node drag) or Escape.
    svg.on('click', () => setSelection(null));
    svg.on('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelection(null);
    });

    sim.on('tick', () => {
      // keep nodes inside the box — read live dimensions so clamping matches the
      // current viewport (forces are updated imperatively on resize via handleResize)
      const pad = BOUNDARY_PADDING;
      const { w: cw, h: ch } = sizeRef.current;
      for (const n of nodes) {
        if (n.kind === 'center') continue;
        if (n.x! < pad) n.x = pad; else if (n.x! > cw - pad) n.x = cw - pad;
        if (n.y! < pad) n.y = pad; else if (n.y! > ch - pad) n.y = ch - pad;
      }
      nodeG.attr('transform', (n) => `translate(${n.x},${n.y})`);
      linkSel
        .attr('x1', (l) => (l.source as SimNode).x!).attr('y1', (l) => (l.source as SimNode).y!)
        .attr('x2', (l) => (l.target as SimNode).x!).attr('y2', (l) => (l.target as SimNode).y!);

      positionPopoverRef.current();
    });
    reheat(sim, ANIMATION.initialAlpha);

    return () => {
      svg.on('.zoom', null);
      sim.stop();
      simulationRef.current = null;
    };
  }, []);



  return (
    <div className="space-y-3">
      <style>{graphStyles}</style>
      <p className="max-w-prose text-sm text-muted-foreground">
        A map of my technical range — six domains and the tools within each, with lines tracing how the
        stack connects. Drag to rearrange, pinch or Ctrl/⌘ + scroll to zoom, click any tool for the details.
      </p>
      <div
        ref={wrapRef}
        className="relative h-[clamp(460px,72vh,720px)] w-full overflow-hidden rounded-lg border border-border bg-muted/30"
      >
        <svg ref={svgRef} className="block h-full w-full" role="group" aria-label="Tech stack knowledge graph — Tab through nodes, Enter for details, Escape to close" />
        <span className="pointer-events-none absolute bottom-2 left-3 font-mono text-[0.7rem] text-muted-foreground">
          drag · ctrl/⌘ + scroll or pinch to zoom · click for details
        </span>
        {selectedId && <Popover ref={popoverRef} id={selectedId} onClose={() => closeRef.current()} />}
        <div className="absolute right-2 top-2 flex flex-col overflow-hidden rounded-md border border-border bg-card">
          <button type="button" aria-label="Zoom in" onClick={() => zoomByRef.current(ZOOM.buttonStep)}
            className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            <Plus className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Zoom out" onClick={() => zoomByRef.current(1 / ZOOM.buttonStep)}
            className="border-t border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            <Minus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

const Popover = forwardRef<HTMLDivElement, { id: string; onClose: () => void }>(function Popover({ id, onClose }, ref) {
  const { tag, title, body, connects, more } = popoverContent(id);
  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={title}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      className="absolute left-0 top-0 w-56 rounded-md border border-border bg-card p-3 shadow-lg"
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">{tag}</span>
        <button type="button" aria-label="Close details" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{body}</div>
      {connects.length > 0 && (
        <div className="mt-2 border-t border-dashed border-border pt-2 text-[0.7rem] text-muted-foreground">
          <span className="font-semibold text-foreground">Connects to: </span>
          {connects.join(' · ')}
          {more > 0 && ` · +${more} more`}
        </div>
      )}
    </div>
  );
});
