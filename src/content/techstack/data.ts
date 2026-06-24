import { local, cdn, mono, type IconSpec, type ToolLevel } from './icons';

export interface Domain {
  id: string;
  num: string;
  name: string;
  short: string;
  role: string;
  proof?: string[];
}

export interface Tool {
  id: string;
  name: string;
  domainId: string;
  also?: string[];      // NEW — secondary domain ids
  parent?: string;      // NEW — id of parent tool (same domain, single level only)
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

interface NestedTool {
  id: string;
  name: string;
  level: ToolLevel;
  role: string;
  icon: IconSpec;
  isNew?: true;
  also?: readonly string[];   // NEW
  parent?: string;       // NEW
}

interface NestedDomain {
  id: string;
  num: string;
  name: string;
  short: string;
  role: string;
  proof?: readonly string[];
  tools: readonly NestedTool[];
}

// Single source of truth. Each domain owns its tools[] so a tool's primary
// `domainId` is implicit (the parent it is nested under) and never typed.
const RAW = [
  { id: 'd1', num: '01', name: 'Scientific Computing & Research', short: 'Scientific',
    role: 'Numerical methods, statistics & the lab notebook of a materials-science PhD.',
    proof: ['XRD Analyzer'],
    tools: [
      { id: 'python', name: 'Python', level: 'sig', role: 'Scientific computing, data analysis, ML & backend', icon: local('icons/python.svg'), also: ['d2', 'd4'] },
      { id: 'jupyter', name: 'JupyterLab', level: 'sig', role: 'Interactive computing environment', icon: local('icons/jupyter.svg') },
      { id: 'pandas', name: 'Pandas', level: 'sig', role: 'Data manipulation & analysis', icon: local('icons/pandas.svg') },
      { id: 'numpy', name: 'NumPy', level: 'sig', role: 'Numerical arrays & linear algebra', icon: cdn('numpy/numpy'), isNew: true },
      { id: 'matlab', name: 'MATLAB', level: 'sup', role: 'Engineering & numerical computing', icon: local('icons/matlab.png') },
      { id: 'r', name: 'R', level: 'sup', role: 'Statistical analysis & visualization', icon: local('icons/r.svg') },
      { id: 'scipy', name: 'SciPy', level: 'sup', role: 'Optimization, signal & image processing', icon: mono('Sp'), isNew: true },
      { id: 'matplotlib', name: 'matplotlib', level: 'sup', role: 'Publication-quality plotting', icon: cdn('matplotlib/matplotlib'), isNew: true },
      { id: 'plotly', name: 'Plotly', level: 'sup', role: 'Interactive dashboards', icon: local('icons/plotly.svg') },
      { id: 'latex', name: 'LaTeX', level: 'chip', role: 'Typesetting papers & reports', icon: mono('TeX'), isNew: true },
    ],
  },
  { id: 'd2', num: '02', name: 'Machine Learning & Optimization', short: 'ML & Optimization',
    role: 'Surrogate models, Gaussian processes & adaptive experiment design.',
    proof: ['Bayesian Optimization Framework'],
    tools: [
      { id: 'pytorch', name: 'PyTorch', level: 'sig', role: 'Deep learning framework & tensors', icon: local('icons/pytorch.svg'), also: ['d1', 'd3'] },
      { id: 'botorch', name: 'BoTorch', level: 'sig', role: 'Bayesian optimization research', icon: mono('BO') },
      { id: 'gpytorch', name: 'GPyTorch', level: 'sup', role: 'Gaussian processes on PyTorch', icon: mono('GP') },
      { id: 'ax', name: 'Ax', level: 'sup', role: 'Adaptive experimentation platform', icon: mono('Ax') },
      { id: 'jax', name: 'JAX', level: 'sup', role: 'High-performance ML & autodiff', icon: local('icons/jax.png') },
      { id: 'cuda', name: 'CUDA', level: 'sup', role: 'NVIDIA GPU computing', icon: local('icons/cuda.svg') },
      { id: 'exptrack', name: 'Experiment Tracking', level: 'chip', role: 'Logging runs & comparing models (W&B / MLflow)', icon: mono('ET'), isNew: true },
    ],
  },
  { id: 'd3', num: '03', name: 'LLMs & Generative AI', short: 'LLMs & GenAI',
    role: 'Retrieval-augmented and agentic systems — local inference to production APIs.',
    proof: ['JuanaKNOW', 'RAG Chatbot'],
    tools: [
      { id: 'agno', name: 'Agno', level: 'sig', role: 'Multi-agent framework & runtime', icon: local('icons/agno.jpeg') },
      { id: 'openai', name: 'OpenAI', level: 'sig', role: 'LLM API provider', icon: local('icons/openai.svg') },
      { id: 'gemini', name: 'Gemini', level: 'sig', role: 'Google generative models', icon: local('icons/gemini.svg') },
      { id: 'huggingface', name: 'Hugging Face', level: 'sig', role: 'Model hub & transformers', icon: local('icons/huggingface.jpeg') },
      { id: 'langchain', name: 'LangChain', level: 'sup', role: 'Framework for LLM applications', icon: local('icons/langchain.svg') },
      { id: 'chromadb', name: 'ChromaDB', level: 'sup', role: 'Embedding database for RAG', icon: local('icons/chromadb.svg') },
      { id: 'mcp', name: 'MCP & Tool Use', level: 'sup', role: 'Model Context Protocol & function calling', icon: mono('MCP'), isNew: true },
      { id: 'supabaseedge', name: 'Supabase Edge Fns', level: 'sup', role: 'Serverless (Deno) functions for AI APIs', icon: cdn('supabase/supabase'), isNew: true },
      { id: 'ollama', name: 'Ollama', level: 'sup', role: 'Local LLM orchestration', icon: local('icons/ollama.svg') },
      { id: 'openrouter', name: 'OpenRouter', level: 'sup', role: 'Unified API across LLMs', icon: local('icons/openrouter.svg') },
      { id: 'unsloth', name: 'Unsloth', level: 'sup', role: 'Fast LLM fine-tuning', icon: local('icons/unsloth.png') },
      { id: 'vllm', name: 'vLLM', level: 'chip', role: 'High-throughput inference', icon: local('icons/vllm.jpeg') },
    ],
  },
  { id: 'd4', num: '04', name: 'Web Development & Interfaces', short: 'Web & Interfaces',
    role: 'Frontends, APIs and data apps — including this site.',
    proof: ['This Portfolio', 'ChunkingExpress'],
    tools: [
      { id: 'react', name: 'React', level: 'sig', role: 'Component-based UI', icon: local('icons/react.svg') },
      { id: 'typescript', name: 'TypeScript', level: 'sig', role: 'Typed JavaScript', icon: local('icons/typescript.svg'), also: ['d3'] },
      { id: 'vite', name: 'Vite', level: 'sig', role: 'Frontend build tool', icon: local('icons/vite.svg') },
      { id: 'fastapi', name: 'FastAPI', level: 'sup', role: 'Modern Python web APIs', icon: local('icons/fastapi.svg') },
      { id: 'streamlit', name: 'Streamlit', level: 'sup', role: 'Data apps in Python', icon: local('icons/streamlit.svg') },
      { id: 'nodejs', name: 'Node.js', level: 'sup', role: 'JavaScript runtime', icon: local('icons/nodejs.svg') },
      { id: 'n8n', name: 'n8n', level: 'sup', role: 'Workflow automation', icon: local('icons/n8n.svg') },
      { id: 'flask', name: 'Flask', level: 'chip', role: 'Lightweight web framework', icon: local('icons/flask.svg') },
    ],
  },
  { id: 'd5', num: '05', name: 'Data & Infrastructure', short: 'Data & Infra',
    role: 'Databases, containers, CI/CD and the home lab that runs it all.',
    proof: ['Home Lab', 'Deploy Pipeline'],
    tools: [
      { id: 'postgresql', name: 'PostgreSQL', level: 'sig', role: 'Relational database', icon: cdn('postgresql/postgresql') },
      { id: 'docker', name: 'Docker', level: 'sig', role: 'Containerization & deployment', icon: local('icons/docker.svg'), also: ['d4'] },
      { id: 'githubactions', name: 'GitHub Actions', level: 'sig', role: 'CI/CD workflows', icon: local('icons/githubactions.svg') },
      { id: 'supabase', name: 'Supabase', level: 'sig', role: 'Postgres, storage, auth & edge functions', icon: cdn('supabase/supabase'), isNew: true, also: ['d3'] },
      { id: 'pgvector', name: 'pgvector', level: 'sup', role: 'Vector search inside Postgres', icon: mono('pg'), isNew: true, parent: 'postgresql' },
      { id: 'nginx', name: 'Nginx', level: 'sup', role: 'Reverse proxy', icon: local('icons/nginx.svg') },
      { id: 'vercel', name: 'Vercel', level: 'sup', role: 'Frontend deployment', icon: local('icons/vercel.svg') },
      { id: 'prometheus', name: 'Prometheus', level: 'chip', role: 'Metrics & monitoring', icon: local('icons/prometheus.svg') },
      { id: 'opentelemetry', name: 'OpenTelemetry', level: 'chip', role: 'Observability framework', icon: local('icons/opentelemetry.svg') },
      { id: 'openlit', name: 'OpenLit', level: 'chip', role: 'OTel-native LLM observability', icon: local('icons/openlit.png'), parent: 'opentelemetry' },
      { id: 'jenkins', name: 'Jenkins', level: 'chip', role: 'Automation server for CI/CD', icon: local('icons/jenkins.svg') },
    ],
  },
  { id: 'd6', num: '06', name: 'Creative Coding & Visualization', short: 'Creative',
    role: 'Generative art, simulations and interactive visual essays.',
    proof: ['Creative Coding', 'Photography'],
    tools: [
      { id: 'p5js', name: 'p5.js', level: 'sig', role: 'Creative coding in JavaScript', icon: local('icons/p5js.svg') },
      { id: 'processing', name: 'Processing', level: 'sup', role: 'Visual arts & creative coding', icon: local('icons/processing.svg') },
      { id: 'lightroom', name: 'Lightroom', level: 'chip', role: 'Photo editing & cataloging', icon: mono('Lr'), isNew: true },
    ],
  },
] as const satisfies readonly NestedDomain[];

// Literal id unions derived from the data — used to type-check tech links
// (links.ts) and cross-domain `also` references (Task 3) at compile time.
export type DomainId = (typeof RAW)[number]['id'];
export type ToolId = (typeof RAW)[number]['tools'][number]['id'];

// Compile-time guard: every id listed in a tool's `also` must be a known domain.
type ToolWithAlso = Extract<(typeof RAW)[number]['tools'][number], { also: readonly string[] }>;
type AllAlso = ToolWithAlso extends { also: infer A }
  ? A extends readonly (infer E)[] ? E : never
  : never;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _alsoCheck: AllAlso extends DomainId ? true : `✖ unknown domain id in 'also': ${AllAlso & string}` = true;

// Compile-time guard: every tool's `parent` must be a known tool id.
type ToolWithParent = Extract<(typeof RAW)[number]['tools'][number], { parent: string }>;
type AllParents = ToolWithParent['parent'];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _parentCheck: AllParents extends ToolId ? true : `✖ unknown tool id in 'parent': ${AllParents & string}` = true;

export const TECHSTACK_DOMAINS: Domain[] = RAW.map((d) => {
  const domain: Domain = { id: d.id, num: d.num, name: d.name, short: d.short, role: d.role };
  if (d.proof) domain.proof = [...d.proof];
  return domain;
});

export const TECHSTACK_TOOLS: Tool[] = RAW.flatMap((d) =>
  d.tools.map((t) => {
    const tool: Tool = {
      id: t.id, name: t.name, domainId: d.id, level: t.level, role: t.role, icon: t.icon,
    };
    if (t.isNew) tool.isNew = true;
    if (t.also) tool.also = [...t.also];
    const parent = (t as NestedTool).parent;
    if (parent) tool.parent = parent;
    return tool;
  }),
);
