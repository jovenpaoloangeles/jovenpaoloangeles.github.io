import type { ToolId } from './data';

export const TECHSTACK_TECH_LINKS: [ToolId, ToolId][] = [
  ['python', 'pytorch'], ['python', 'fastapi'], ['python', 'streamlit'],
  ['fastapi', 'postgresql'], ['docker', 'fastapi'], ['docker', 'postgresql'],
  ['huggingface', 'pytorch'], ['unsloth', 'pytorch'], ['vllm', 'pytorch'],
  ['pgvector', 'chromadb'], ['githubactions', 'vercel'], ['n8n', 'langchain'],
  // notebook & numeric foundations
  ['jupyter', 'pytorch'], ['jupyter', 'scikitlearn'],
  ['numpy', 'pytorch'], ['numpy', 'scikitlearn'],
  // ML serving & demos
  ['fastapi', 'pytorch'], ['streamlit', 'scikitlearn'], ['streamlit', 'mlflow'],
  // ML infra
  ['mlflow', 'docker'], ['mlflow', 'postgresql'],
  // LLM workflow automation
  ['n8n', 'claude'],
  // HuggingFace ecosystem
  ['huggingface', 'diffusers'],
  // ComfyUI pipeline connections
  ['comfyui', 'huggingface'], ['comfyui', 'diffusers'],
];
