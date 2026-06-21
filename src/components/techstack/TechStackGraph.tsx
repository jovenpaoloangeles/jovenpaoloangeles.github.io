import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  TECHSTACK_DOMAINS, TECHSTACK_TOOLS, TECHSTACK_TECH_LINKS, TECHSTACK_CENTER,
  domainById, iconSrc, monogram, neighborsOf, type Tool,
} from '@/content/techstack';
import {
  TILE_SIZES, NODE_RADII, COLLISION_PADDING, BOUNDARY_PADDING,
  PHYSICS, ANIMATION, ZOOM, SPOTLIGHT
} from './techstack-graph-config';

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  kind: 'center' | 'domain' | 'tool';
  label: string;
  tool?: Tool;
  domainId?: string;
  level?: Tool['level'];
}
interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  kind: 'spoke' | 'member' | 'tech';
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

interface Selected {
  id: string;
  kind: 'center' | 'domain' | 'tool';
  x: number;
  y: number;
}

const graphStyles = `
  .ts-node, .ts-link {
    transition: opacity ${SPOTLIGHT.activeDuration}ms ease;
    opacity: 1;
  }

  .ts-node.dimmed, .ts-link.dimmed {
    opacity: ${SPOTLIGHT.dimmedOpacity};
  }
`;

export function TechStackGraph() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<Selected | null>(null);

  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const linksRef = useRef<SimLink[]>([]);
  const sizeRef = useRef({ w: 600, h: 460 });
  const selectedIdRef = useRef<string | null>(null);

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
    const { w, h } = sizeRef.current;
    const cx = w / 2;
    const cy = h / 2;

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

    const svg = d3.select(svgEl);
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
      .style('cursor', 'pointer');

    // tile background
    nodeG.append('rect')
      .attr('class', 'ts-tile')
      .attr('rx', (n) => (n.kind === 'center' ? 999 : 8))
      .each(function (n) {
        const s = nodeTile(n);
        d3.select(this).attr('x', -s / 2).attr('y', -s / 2).attr('width', s).attr('height', s);
      });

    // icon or monogram or avatar
    nodeG.each(function (n) {
      const g = d3.select(this);
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
            d3.select(this).style('display', 'none');
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

    // simulation
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
      .force('link', d3.forceLink<SimNode, SimLink>(links).id((n) => n.id)
        .distance((l) => l.kind === 'spoke' ? R1 : l.kind === 'member' ? R2 - R1 : PHYSICS.linkDistances.tech)
        .strength((l) =>
          l.kind === 'spoke' ? PHYSICS.linkStrengths.spoke :
          l.kind === 'member' ? PHYSICS.linkStrengths.member :
          PHYSICS.linkStrengths.tech))
      .force('center', d3.forceCenter(cx, cy).strength(PHYSICS.centerForceStrength))
      .alpha(ANIMATION.initialAlpha).alphaDecay(ANIMATION.initialAlphaDecay);

    simulationRef.current = sim;

    center.fx = cx;
    center.fy = cy;

    // drag (tools + domains only; center is pinned)
    const drag = d3.drag<SVGGElement, SimNode>()
      .on('start', (e, n) => {
        if (n.kind !== 'center') {
          if (!e.active) sim.alphaTarget(ANIMATION.dragAlphaTarget).restart();
          n.fx = n.x;
          n.fy = n.y;
        }
      })
      .on('drag', (e, n) => { if (n.kind !== 'center') { n.fx = e.x; n.fy = e.y; } })
      .on('end', (e, n) => { if (n.kind !== 'center') { if (!e.active) sim.alphaTarget(0); n.fx = null; n.fy = null; } });
    nodeG.call(drag);

    // pan/zoom
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
    svg.call(zoom);

    // click -> select (ignore drag-induced clicks via movement tracking)
    let moved = false;
    nodeG.on('mousedown', () => { moved = false; });
    nodeG.on('mousemove', () => { moved = true; });
    nodeG.on('click', (e, n) => {
      if (moved) return;
      e.stopPropagation();
      const t = d3.zoomTransform(svgEl);
      const [sx, sy] = t.apply([n.x ?? cx, n.y ?? cy]);
      n.fx = n.x; n.fy = n.y; // pin while open
      selectedIdRef.current = n.id;
      setSelected({ id: n.id, kind: n.kind, x: sx, y: sy });
    });
    // #3: unpin on SVG background click
    svg.on('click', () => {
      const id = selectedIdRef.current;
      if (id != null) {
        const node = nodes.find((n) => n.id === id);
        if (node && node.kind !== 'center') { node.fx = null; node.fy = null; }
        selectedIdRef.current = null;
      }
      setSelected(null);
    });

    sim.on('tick', () => {
      // keep nodes inside the box (account for zoom scale 1 at rest)
      const pad = BOUNDARY_PADDING;
      for (const n of nodes) {
        if (n.kind === 'center') continue;
        if (n.x! < pad) n.x = pad; else if (n.x! > w - pad) n.x = w - pad;
        if (n.y! < pad) n.y = pad; else if (n.y! > h - pad) n.y = h - pad;
      }
      nodeG.attr('transform', (n) => `translate(${n.x},${n.y})`);
      linkSel
        .attr('x1', (l) => (l.source as SimNode).x!).attr('y1', (l) => (l.source as SimNode).y!)
        .attr('x2', (l) => (l.target as SimNode).x!).attr('y2', (l) => (l.target as SimNode).y!);
    });

    return () => {
      svg.on('.zoom', null);
      sim.stop();
      simulationRef.current = null;
    };
  }, []);

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

  // keep popover attached to the selected node across ticks
  useEffect(() => {
    if (!selected) return;
    let lastX = selected.x;
    let lastY = selected.y;
    const id = setInterval(() => {
      const el = svgRef.current?.querySelector(`[data-id="${selected.id}"]`) as SVGGElement | null;
      if (!el) return;
      const m = el.getAttribute('transform')?.match(/translate\(([^,]+),([^)]+)\)/);
      if (!m) return;
      const t = d3.zoomTransform(svgRef.current!);
      const [sx, sy] = t.apply([+m[1], +m[2]]);
      // #2: only call setSelected when position actually changed
      if (sx === lastX && sy === lastY) return;
      lastX = sx;
      lastY = sy;
      setSelected((s) => (s ? { ...s, x: sx, y: sy } : s));
    }, 120);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- depend on id only so the interval doesn't restart on every position update
  }, [selected?.id]);

  // #3: unpin on popover close
  const handleClose = () => {
    const id = selectedIdRef.current;
    if (id != null) {
      const node = nodesRef.current.find((n) => n.id === id);
      if (node && node.kind !== 'center') { node.fx = null; node.fy = null; }
      selectedIdRef.current = null;
    }
    setSelected(null);
  };

  const pop = selected ? renderPopover(selected, handleClose, sizeRef.current.w) : null;

  return (
    <div className="space-y-3">
      <style>{graphStyles}</style>
      <p className="max-w-prose text-sm text-muted-foreground">
        A map of my technical range — six domains and the tools within each, with lines tracing how the
        stack connects. Drag to rearrange, scroll to zoom, click any tool for the details.
      </p>
      <div
        ref={wrapRef}
        className="relative h-[clamp(460px,72vh,720px)] w-full overflow-hidden rounded-lg border border-border bg-muted/30"
      >
        <svg ref={svgRef} className="block h-full w-full" role="img" aria-label="Tech stack knowledge graph" />
        <span className="pointer-events-none absolute bottom-2 left-3 font-mono text-[0.7rem] text-muted-foreground">
          drag · scroll to zoom · click for details
        </span>
        {pop}
      </div>
    </div>
  );
}

// #7: accept stageWidth for proper clamping
function renderPopover(sel: Selected, onClose: () => void, stageWidth: number) {
  let title = '';
  let tag = '';
  let body = '';
  let connects: string[] = [];
  if (sel.kind === 'center') {
    title = TECHSTACK_CENTER.name;
    tag = 'Profile';
    body = TECHSTACK_CENTER.title;
  } else if (sel.kind === 'domain') {
    const d = domainById(sel.id);
    title = d.name;
    tag = 'Domain';
    body = d.role;
    connects = TECHSTACK_TOOLS.filter((t) => t.domainId === d.id).slice(0, 6).map((t) => t.name);
  } else {
    const t = TECHSTACK_TOOLS.find((x) => x.id === sel.id)!;
    title = t.name;
    tag = domainById(t.domainId).name;
    body = t.role;
    connects = [...neighborsOf(t.id)].filter((id) => id !== t.id).map((id) => TECHSTACK_TOOLS.find((x) => x.id === id)!.name);
  }
  const left = Math.max(6, Math.min(sel.x + 16, stageWidth - 240));
  const top = sel.y - 20;
  return (
    <div
      className="pointer-events-auto absolute z-10 w-56 rounded-md border border-border bg-card p-3 shadow-lg"
      style={{ left, top, transform: 'translate(0, -100%)' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">{tag}</span>
        <button className="text-muted-foreground hover:text-foreground" aria-label="Close" onClick={onClose}>×</button>
      </div>
      <div className="text-sm font-semibold text-foreground">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{body}</div>
      {connects.length > 0 && (
        <div className="mt-2 border-t border-dashed border-border pt-2 text-[0.7rem] text-muted-foreground">
          <span className="font-semibold text-foreground">Connects to:</span> {connects.join(' · ')}
        </div>
      )}
    </div>
  );
}
