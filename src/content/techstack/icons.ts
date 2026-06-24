export type ToolLevel = 'sig' | 'sup' | 'chip';
export type IconSpec = ['local', string] | ['cdn', string] | ['mono', string] | ['lobe', string];

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';
const LOBE_SVG = 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/';

// Icon-spec helpers — readable replacements for the raw tuple syntax:
//   local('icons/python.svg') -> served from public/
//   cdn('owner/repo')         -> devicon URL
//   lobe('openai')            -> lobehub CDN color SVG (no React 19 dep)
//   mono('Ab')                -> 1–2 char text fallback (no image rendered)
export const local = (path: string): IconSpec => ['local', path];
export const cdn = (repo: string): IconSpec => ['cdn', repo];
export const lobe = (id: string): IconSpec => ['lobe', id];
export const mono = (text: string): IconSpec => ['mono', text];

type WithIcon = { icon: IconSpec };
type WithNameAndIcon = { name: string; icon: IconSpec };

export function iconSrc(tool: WithIcon): string {
  const [kind, val] = tool.icon;
  if (kind === 'mono') return '';
  if (kind === 'cdn') return DEVICON + val + '-original.svg';
  if (kind === 'lobe') return LOBE_SVG + val + '-color.svg';
  return '/' + val; // local -> served from public root
}

export function monogram(tool: WithNameAndIcon): string {
  const [kind, val] = tool.icon;
  if (kind === 'mono') return val;
  return tool.name.replace(/[^A-Za-z0-9+]/g, '').slice(0, 2);
}
