export type ToolLevel = 'sig' | 'sup' | 'chip';
export type IconSpec = ['local', string] | ['cdn', string] | ['mono', string];

export interface Domain {
  id: string;     // 'd1'..'d6'
  num: string;    // '01'
  name: string;   // full label
  short: string;  // compact label for the graph node
  role: string;   // one-line "what I do here"
  proof?: string[]; // project names (list view only)
}

export interface Tool {
  id: string;
  name: string;
  domainId: string;
  level: ToolLevel;
  role: string;
  icon: IconSpec;
  isNew?: boolean;
}

export const TECHSTACK_CENTER = {
  name: 'Joven Paolo Angeles',
  title: 'PhD Candidate · Senior AI Engineer',
  photo: '/profile_pictures/profile-photo.webp',
};

export const TECHSTACK_DOMAINS: Domain[] = [
  { id: 'd1', num: '01', name: 'Scientific Computing & Research', short: 'Scientific',
    role: 'Numerical methods, statistics & the lab notebook of a materials-science PhD.',
    proof: ['XRD Analyzer'] },
  { id: 'd2', num: '02', name: 'Machine Learning & Optimization', short: 'ML & Optimization',
    role: 'Surrogate models, Gaussian processes & adaptive experiment design.',
    proof: ['Bayesian Optimization Framework'] },
  { id: 'd3', num: '03', name: 'LLMs & Generative AI', short: 'LLMs & GenAI',
    role: 'Retrieval-augmented and agentic systems — local inference to production APIs.',
    proof: ['JuanaKNOW', 'RAG Chatbot'] },
  { id: 'd4', num: '04', name: 'Web Development & Interfaces', short: 'Web & Interfaces',
    role: 'Frontends, APIs and data apps — including this site.',
    proof: ['This Portfolio', 'ChunkingExpress'] },
  { id: 'd5', num: '05', name: 'Data & Infrastructure', short: 'Data & Infra',
    role: 'Databases, containers, CI/CD and the home lab that runs it all.',
    proof: ['Home Lab', 'Deploy Pipeline'] },
  { id: 'd6', num: '06', name: 'Creative Coding & Visualization', short: 'Creative',
    role: 'Generative art, simulations and interactive visual essays.',
    proof: ['Creative Coding', 'Photography'] },
];

export const TECHSTACK_TOOLS: Tool[] = [
  // d1
  { id: 'python', name: 'Python', domainId: 'd1', level: 'sig', role: 'Scientific computing, data analysis, ML & backend', icon: ['local', 'icons/python.svg'] },
  { id: 'jupyter', name: 'JupyterLab', domainId: 'd1', level: 'sig', role: 'Interactive computing environment', icon: ['local', 'icons/jupyter.svg'] },
  { id: 'pandas', name: 'Pandas', domainId: 'd1', level: 'sig', role: 'Data manipulation & analysis', icon: ['local', 'icons/pandas.svg'] },
  { id: 'numpy', name: 'NumPy', domainId: 'd1', level: 'sig', role: 'Numerical arrays & linear algebra', icon: ['cdn', 'numpy/numpy'], isNew: true },
  { id: 'matlab', name: 'MATLAB', domainId: 'd1', level: 'sup', role: 'Engineering & numerical computing', icon: ['local', 'icons/matlab.png'] },
  { id: 'r', name: 'R', domainId: 'd1', level: 'sup', role: 'Statistical analysis & visualization', icon: ['local', 'icons/r.svg'] },
  { id: 'scipy', name: 'SciPy', domainId: 'd1', level: 'sup', role: 'Optimization, signal & image processing', icon: ['mono', 'Sp'], isNew: true },
  { id: 'matplotlib', name: 'matplotlib', domainId: 'd1', level: 'sup', role: 'Publication-quality plotting', icon: ['cdn', 'matplotlib/matplotlib'], isNew: true },
  { id: 'plotly', name: 'Plotly', domainId: 'd1', level: 'sup', role: 'Interactive dashboards', icon: ['local', 'icons/plotly.svg'] },
  { id: 'latex', name: 'LaTeX', domainId: 'd1', level: 'chip', role: 'Typesetting papers & reports', icon: ['mono', 'TeX'], isNew: true },
  // d2
  { id: 'pytorch', name: 'PyTorch', domainId: 'd2', level: 'sig', role: 'Deep learning framework & tensors', icon: ['local', 'icons/pytorch.svg'] },
  { id: 'botorch', name: 'BoTorch', domainId: 'd2', level: 'sig', role: 'Bayesian optimization research', icon: ['mono', 'BO'] },
  { id: 'gpytorch', name: 'GPyTorch', domainId: 'd2', level: 'sup', role: 'Gaussian processes on PyTorch', icon: ['mono', 'GP'] },
  { id: 'ax', name: 'Ax', domainId: 'd2', level: 'sup', role: 'Adaptive experimentation platform', icon: ['mono', 'Ax'] },
  { id: 'jax', name: 'JAX', domainId: 'd2', level: 'sup', role: 'High-performance ML & autodiff', icon: ['local', 'icons/jax.png'] },
  { id: 'cuda', name: 'CUDA', domainId: 'd2', level: 'sup', role: 'NVIDIA GPU computing', icon: ['local', 'icons/cuda.svg'] },
  { id: 'exptrack', name: 'Experiment Tracking', domainId: 'd2', level: 'chip', role: 'Logging runs & comparing models (W&B / MLflow)', icon: ['mono', 'ET'], isNew: true },
  // d3
  { id: 'agno', name: 'Agno', domainId: 'd3', level: 'sig', role: 'Multi-agent framework & runtime', icon: ['local', 'icons/agno.jpeg'] },
  { id: 'openai', name: 'OpenAI', domainId: 'd3', level: 'sig', role: 'LLM API provider', icon: ['local', 'icons/openai.svg'] },
  { id: 'gemini', name: 'Gemini', domainId: 'd3', level: 'sig', role: 'Google generative models', icon: ['local', 'icons/gemini.svg'] },
  { id: 'huggingface', name: 'Hugging Face', domainId: 'd3', level: 'sig', role: 'Model hub & transformers', icon: ['local', 'icons/huggingface.jpeg'] },
  { id: 'langchain', name: 'LangChain', domainId: 'd3', level: 'sup', role: 'Framework for LLM applications', icon: ['local', 'icons/langchain.svg'] },
  { id: 'chromadb', name: 'ChromaDB', domainId: 'd3', level: 'sup', role: 'Embedding database for RAG', icon: ['local', 'icons/chromadb.svg'] },
  { id: 'mcp', name: 'MCP & Tool Use', domainId: 'd3', level: 'sup', role: 'Model Context Protocol & function calling', icon: ['mono', 'MCP'], isNew: true },
  { id: 'supabaseedge', name: 'Supabase Edge Fns', domainId: 'd3', level: 'sup', role: 'Serverless (Deno) functions for AI APIs', icon: ['cdn', 'supabase/supabase'], isNew: true },
  { id: 'ollama', name: 'Ollama', domainId: 'd3', level: 'sup', role: 'Local LLM orchestration', icon: ['local', 'icons/ollama.svg'] },
  { id: 'openrouter', name: 'OpenRouter', domainId: 'd3', level: 'sup', role: 'Unified API across LLMs', icon: ['local', 'icons/openrouter.svg'] },
  { id: 'unsloth', name: 'Unsloth', domainId: 'd3', level: 'sup', role: 'Fast LLM fine-tuning', icon: ['local', 'icons/unsloth.png'] },
  { id: 'vllm', name: 'vLLM', domainId: 'd3', level: 'chip', role: 'High-throughput inference', icon: ['local', 'icons/vllm.jpeg'] },
  // d4
  { id: 'react', name: 'React', domainId: 'd4', level: 'sig', role: 'Component-based UI', icon: ['local', 'icons/react.svg'] },
  { id: 'typescript', name: 'TypeScript', domainId: 'd4', level: 'sig', role: 'Typed JavaScript', icon: ['local', 'icons/typescript.svg'] },
  { id: 'vite', name: 'Vite', domainId: 'd4', level: 'sig', role: 'Frontend build tool', icon: ['local', 'icons/vite.svg'] },
  { id: 'fastapi', name: 'FastAPI', domainId: 'd4', level: 'sup', role: 'Modern Python web APIs', icon: ['local', 'icons/fastapi.svg'] },
  { id: 'streamlit', name: 'Streamlit', domainId: 'd4', level: 'sup', role: 'Data apps in Python', icon: ['local', 'icons/streamlit.svg'] },
  { id: 'nodejs', name: 'Node.js', domainId: 'd4', level: 'sup', role: 'JavaScript runtime', icon: ['local', 'icons/nodejs.svg'] },
  { id: 'n8n', name: 'n8n', domainId: 'd4', level: 'sup', role: 'Workflow automation', icon: ['local', 'icons/n8n.svg'] },
  { id: 'flask', name: 'Flask', domainId: 'd4', level: 'chip', role: 'Lightweight web framework', icon: ['local', 'icons/flask.svg'] },
  // d5
  { id: 'postgresql', name: 'PostgreSQL', domainId: 'd5', level: 'sig', role: 'Relational database', icon: ['cdn', 'postgresql/postgresql'] },
  { id: 'docker', name: 'Docker', domainId: 'd5', level: 'sig', role: 'Containerization & deployment', icon: ['local', 'icons/docker.svg'] },
  { id: 'githubactions', name: 'GitHub Actions', domainId: 'd5', level: 'sig', role: 'CI/CD workflows', icon: ['local', 'icons/githubactions.svg'] },
  { id: 'supabase', name: 'Supabase', domainId: 'd5', level: 'sig', role: 'Postgres, storage, auth & edge functions', icon: ['cdn', 'supabase/supabase'], isNew: true },
  { id: 'pgvector', name: 'pgvector', domainId: 'd5', level: 'sup', role: 'Vector search inside Postgres', icon: ['mono', 'pg'], isNew: true },
  { id: 'nginx', name: 'Nginx', domainId: 'd5', level: 'sup', role: 'Reverse proxy', icon: ['local', 'icons/nginx.svg'] },
  { id: 'vercel', name: 'Vercel', domainId: 'd5', level: 'sup', role: 'Frontend deployment', icon: ['local', 'icons/vercel.svg'] },
  { id: 'prometheus', name: 'Prometheus', domainId: 'd5', level: 'chip', role: 'Metrics & monitoring', icon: ['local', 'icons/prometheus.svg'] },
  { id: 'opentelemetry', name: 'OpenTelemetry', domainId: 'd5', level: 'chip', role: 'Observability framework', icon: ['local', 'icons/opentelemetry.svg'] },
  { id: 'openlit', name: 'OpenLit', domainId: 'd5', level: 'chip', role: 'OTel-native LLM observability', icon: ['local', 'icons/openlit.png'] },
  { id: 'jenkins', name: 'Jenkins', domainId: 'd5', level: 'chip', role: 'Automation server for CI/CD', icon: ['local', 'icons/jenkins.svg'] },
  // d6
  { id: 'p5js', name: 'p5.js', domainId: 'd6', level: 'sig', role: 'Creative coding in JavaScript', icon: ['local', 'icons/p5js.svg'] },
  { id: 'processing', name: 'Processing', domainId: 'd6', level: 'sup', role: 'Visual arts & creative coding', icon: ['local', 'icons/processing.svg'] },
  { id: 'lightroom', name: 'Lightroom', domainId: 'd6', level: 'chip', role: 'Photo editing & cataloging', icon: ['mono', 'Lr'], isNew: true },
];

export const TECHSTACK_TECH_LINKS: [string, string][] = [
  ['python', 'pytorch'], ['python', 'fastapi'], ['python', 'streamlit'],
  ['fastapi', 'postgresql'], ['docker', 'fastapi'], ['docker', 'postgresql'],
  ['huggingface', 'pytorch'], ['unsloth', 'pytorch'], ['vllm', 'pytorch'],
  ['supabase', 'supabaseedge'], ['pgvector', 'chromadb'], ['githubactions', 'vercel'], ['n8n', 'langchain'],
];

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';

export function iconSrc(tool: Pick<Tool, 'icon'>): string {
  const [kind, val] = tool.icon;
  if (kind === 'mono') return '';
  if (kind === 'cdn') return DEVICON + val + '-original.svg';
  return '/' + val; // local -> served from public root
}

export function monogram(tool: Pick<Tool, 'name' | 'icon'>): string {
  const [kind, val] = tool.icon;
  if (kind === 'mono') return val;
  return tool.name.replace(/[^A-Za-z0-9+]/g, '').slice(0, 2);
}

export function domainById(id: string): Domain {
  const d = TECHSTACK_DOMAINS.find(x => x.id === id);
  if (!d) throw new Error(`Unknown domain id: ${id}`);
  return d;
}

export function toolsByDomain(): Record<string, Tool[]> {
  const groups: Record<string, Tool[]> = {};
  for (const d of TECHSTACK_DOMAINS) groups[d.id] = [];
  for (const t of TECHSTACK_TOOLS) groups[t.domainId].push(t);
  return groups;
}

export function neighborsOf(toolId: string): Set<string> {
  const s = new Set<string>([toolId]);
  for (const [a, b] of TECHSTACK_TECH_LINKS) {
    if (a === toolId) s.add(b);
    if (b === toolId) s.add(a);
  }
  return s;
}
