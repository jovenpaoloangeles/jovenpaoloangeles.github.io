import { local, cdn, lobe, mono, type IconSpec, type ToolLevel } from './icons';

export interface Domain {
  id: string;
  num: string;
  name: string;
  short: string;
  role: string;
  proof?: readonly string[];
}

export interface Tool {
  id: string;
  name: string;
  domainId: string;
  also?: readonly string[];
  parent?: string;
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
    role: 'Numerical methods, statistics & data analysis for science and engineering.',
    tools: [
      { id: 'python', name: 'Python', level: 'sig', role: 'Scientific computing, data analysis, ML & backend', icon: local('icons/python.svg'), also: ['d2', 'd4'] },
      { id: 'jupyter', name: 'JupyterLab', level: 'sig', role: 'Interactive computing environment', icon: local('icons/jupyter.svg') },
      { id: 'pandas', name: 'Pandas', level: 'sig', role: 'Data manipulation & analysis', icon: local('icons/pandas.svg') },
      { id: 'numpy', name: 'NumPy', level: 'sig', role: 'Numerical arrays & linear algebra', icon: cdn('numpy/numpy')},
      { id: 'matlab', name: 'MATLAB', level: 'sup', role: 'Engineering & numerical computing', icon: local('icons/matlab.png') },
      { id: 'r', name: 'R', level: 'sup', role: 'Statistical analysis & visualization', icon: local('icons/r.svg') },
      { id: 'scipy', name: 'SciPy', level: 'sup', role: 'Optimization, signal & image processing', icon: local('icons/scipy.svg')},
      { id: 'matplotlib', name: 'matplotlib', level: 'sup', role: 'Publication-quality plotting', icon: cdn('matplotlib/matplotlib')},
      { id: 'plotly', name: 'Plotly', level: 'sup', role: 'Interactive dashboards', icon: local('icons/plotly.svg') },
      { id: 'latex', name: 'LaTeX', level: 'chip', role: 'Typesetting papers & reports', icon: local('icons/latex.svg')},
    ],
  },
  { id: 'd2', num: '02', name: 'Machine Learning & Optimization', short: 'ML & Optimization',
    role: 'Bayesian Optimization, Gaussian processes & Adaptive experiment design.',
    tools: [
      { id: 'pytorch', name: 'PyTorch', level: 'sig', role: 'Deep learning framework & tensors', icon: local('icons/pytorch.svg'), also: ['d1', 'd3'] },
      { id: 'botorch', name: 'BoTorch', level: 'sig', role: 'Bayesian optimization research', icon: local('icons/botorch.png'), parent: 'gpytorch' },
      { id: 'scikitlearn', name: 'scikit-learn', level: 'sig', role: 'Machine learning, feature engineering & evaluation', icon: cdn('scikitlearn/scikitlearn'), also: ['d1'] },
      { id: 'mlflow', name: 'MLflow', level: 'sig', role: 'End-to-end ML lifecycle management', icon: local('icons/mlflow.svg') },
      { id: 'gpytorch', name: 'GPyTorch', level: 'sup', role: 'Gaussian processes on PyTorch', icon: mono('GP'), parent: 'pytorch' },
      { id: 'ax', name: 'Ax', level: 'sup', role: 'Adaptive experimentation platform', icon: local('icons/ax.svg') },
      { id: 'jax', name: 'JAX', level: 'sup', role: 'High-performance ML & autodiff', icon: local('icons/jax.png') },
      { id: 'cuda', name: 'CUDA', level: 'sup', role: 'NVIDIA GPU computing', icon: local('icons/cuda.svg') },
      { id: 'diffusers', name: 'Diffusers', level: 'sup', role: 'Generative image pipelines & LoRA fine-tuning', icon: local('icons/diffusers.svg'), also: ['d3'] },
      { id: 'shap', name: 'SHAP', level: 'sup', role: 'Model interpretability & explainable AI', icon: local('icons/shap.png'), parent: 'scikitlearn'},
      { id: 'optuna', name: 'Optuna', level: 'sup', role: 'Hyperparameter optimization framework', icon: local('icons/optuna.svg')},
    ],
  },
  { id: 'd3', num: '03', name: 'LLMs & Generative AI', short: 'LLMs & GenAI',
    role: 'Retrieval-augmented and agentic systems — local inference to production APIs.',
    tools: [
      { id: 'agno', name: 'Agno', level: 'sig', role: 'Multi-agent framework & runtime', icon: local('icons/agno.jpeg') },
      { id: 'claude', name: 'Claude', level: 'sig', role: 'Anthropic LLM API & ecosystem', icon: lobe('claude')},
      { id: 'openai', name: 'OpenAI', level: 'sig', role: 'LLM API provider', icon: local('icons/openai.png') },
      { id: 'gemini', name: 'Gemini', level: 'sig', role: 'Google generative models', icon: lobe('gemini') },
      { id: 'huggingface', name: 'Hugging Face', level: 'sig', role: 'Model hub & transformers', icon: lobe('huggingface') },
      { id: 'langchain', name: 'LangChain', level: 'sup', role: 'Framework for LLM applications', icon: lobe('langchain') },
      { id: 'chromadb', name: 'ChromaDB', level: 'sup', role: 'Embedding database for RAG', icon: local('icons/chromadb.png') },
      { id: 'claudecode', name: 'Claude Code', level: 'sup', role: 'CLI agent for Claude', icon: local('icons/claudecode.svg'), parent: 'claude'},
      { id: 'bedrock', name: 'AWS Bedrock', level: 'sup', role: 'Serverless LLM orchestration & deployment', icon: lobe('bedrock'), parent: 'claude'},
      { id: 'ollama', name: 'Ollama', level: 'sup', role: 'Local LLM orchestration', icon: local('icons/ollama.png') },
      { id: 'zai', name: 'Z.ai', level: 'chip', role: 'LLM API provider', icon: local('icons/zai.svg')},
      { id: 'openrouter', name: 'OpenRouter', level: 'sup', role: 'Unified API across LLMs', icon: local('icons/openrouter.png') },
      { id: 'unsloth', name: 'Unsloth', level: 'sup', role: 'Fast LLM fine-tuning', icon: local('icons/unsloth.png'), parent: 'huggingface' },
      { id: 'vllm', name: 'vLLM', level: 'chip', role: 'High-throughput inference', icon: lobe('vllm'), parent: 'huggingface' },
    ],
  },
  { id: 'd4', num: '04', name: 'Web Development & Interfaces', short: 'Web & Interfaces',
    role: 'Frontends, APIs and data apps — including this site.',
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
    role: 'Databases, containers, CI/CD and for my personal home lab that runs it all.',
    tools: [
      { id: 'postgresql', name: 'PostgreSQL', level: 'sig', role: 'Relational database', icon: cdn('postgresql/postgresql') },
      { id: 'docker', name: 'Docker', level: 'sig', role: 'Containerization & deployment', icon: local('icons/docker.svg'), also: ['d4'] },
      { id: 'githubactions', name: 'GitHub Actions', level: 'sig', role: 'CI/CD workflows', icon: local('icons/githubactions.svg') },
      { id: 'gitlab', name: 'GitLab CI', level: 'sig', role: 'CI/CD pipelines & automated runners', icon: cdn('gitlab/gitlab') },
      { id: 'ubuntu', name: 'Ubuntu Server', level: 'sig', role: 'Linux environment for infrastructure & microservices', icon: cdn('ubuntu/ubuntu') },
      { id: 'supabase', name: 'Supabase', level: 'sig', role: 'Postgres, storage, auth & edge functions', icon: cdn('supabase/supabase'), also: ['d3'] },
      { id: 'pgvector', name: 'pgvector', level: 'sup', role: 'Vector search inside Postgres', icon: mono('pg'), parent: 'postgresql' },
      { id: 'redis', name: 'Redis', level: 'sup', role: 'In-memory data structure store & cache', icon: local('icons/redis.svg')},
      { id: 'kubernetes', name: 'Kubernetes', level: 'sup', role: 'Automating deployment, scaling & management of containerized apps', icon: cdn('kubernetes/kubernetes'), parent: 'docker' },
      { id: 'nginx', name: 'Nginx', level: 'sup', role: 'Reverse proxy', icon: local('icons/nginx.svg') },
      { id: 'vercel', name: 'Vercel', level: 'sup', role: 'Frontend deployment', icon: local('icons/vercel.png') },
      { id: 'prometheus', name: 'Prometheus', level: 'chip', role: 'Metrics & monitoring', icon: local('icons/prometheus.svg') },
      { id: 'opentelemetry', name: 'OpenTelemetry', level: 'chip', role: 'Observability framework', icon: local('icons/opentelemetry.svg') },
      { id: 'openlit', name: 'OpenLit', level: 'chip', role: 'OTel-native LLM observability', icon: local('icons/openlit.png'), parent: 'opentelemetry' },
      { id: 'grafana', name: 'Grafana', level: 'chip', role: 'Data visualization & monitoring dashboards', icon: cdn('grafana/grafana'), parent: 'prometheus'},
      { id: 'jenkins', name: 'Jenkins', level: 'chip', role: 'Automation server for CI/CD', icon: local('icons/jenkins.svg') },
    ],
  },
  { id: 'd6', num: '06', name: 'Creative Coding & Visualization', short: 'Creative',
    role: 'Generative art, simulations and interactive visual essays.',
    tools: [
      { id: 'comfyui', name: 'ComfyUI', level: 'sig', role: 'Node-based graphical interface for stable diffusion pipelines', icon: lobe('comfyui')},
      { id: 'p5js', name: 'p5.js', level: 'sig', role: 'Creative coding in JavaScript', icon: local('icons/p5js.svg') },
      { id: 'opencv', name: 'OpenCV', level: 'sup', role: 'Real-time computer vision & image processing algorithms', icon: cdn('opencv/opencv'), also: ['d1'] },
      { id: 'processing', name: 'Processing', level: 'sup', role: 'Visual arts & creative coding', icon: local('icons/processing.svg') },
      { id: 'blender', name: 'Blender API', level: 'chip', role: 'Procedural generation, 3D assets & Python-driven modeling', icon: cdn('blender/blender') },
      { id: 'lightroom', name: 'Lightroom', level: 'chip', role: 'Photo editing & cataloging', icon: local('icons/lightroom.svg')},
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
// Note: does NOT enforce same-domain constraint — the runtime test in
// techstack-data.test.ts ('every tool parent…') is the enforcer for that.
type ToolWithParent = Extract<(typeof RAW)[number]['tools'][number], { parent: string }>;
type AllParents = ToolWithParent['parent'];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _parentCheck: AllParents extends ToolId ? true : `✖ unknown tool id in 'parent': ${AllParents & string}` = true;

export const TECHSTACK_DOMAINS: Domain[] = RAW.map(({ tools: _tools, ...d }) => d);

export const TECHSTACK_TOOLS: Tool[] = RAW.flatMap((d) =>
  d.tools.map((t) => {
    const tool: Tool = {
      id: t.id, name: t.name, domainId: d.id, level: t.level, role: t.role, icon: t.icon,
    };
    const nt = t as NestedTool;
    if (nt.isNew) tool.isNew = true;
    if (nt.also) tool.also = nt.also;
    if (nt.parent) tool.parent = nt.parent;
    return tool;
  }),
);

export const TOOLS_BY_ID: Record<ToolId, Tool> = TECHSTACK_TOOLS.reduce((acc, tool) => {
  acc[tool.id as ToolId] = tool;
  return acc;
}, {} as Record<ToolId, Tool>);
