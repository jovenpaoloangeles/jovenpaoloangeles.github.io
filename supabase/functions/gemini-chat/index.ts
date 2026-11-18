import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createHandler } from "./handler.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const FILE_SEARCH_STORE = Deno.env.get("GEMINI_FILE_SEARCH_STORE_NAME") ?? "";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent";

// Comma-separated allowlist. Local dev opts in by setting ALLOWED_ORIGINS to
// its dev-server origins (e.g. the vite dev/preview ports on 127.0.0.1).
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ??
  "https://jovenpaoloangeles.github.io")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Durable rate-limit store, shared across isolates (Supabase edge runtime
// enables Deno.openKv natively).
const kv = await Deno.openKv();

Deno.serve(
  createHandler({
    apiKey: GEMINI_API_KEY,
    fileSearchStore: FILE_SEARCH_STORE,
    geminiUrl: GEMINI_URL,
    rateMax: 5,
    rateWindowMs: 15 * 60 * 1000,
    allowedOrigins: ALLOWED_ORIGINS,
    kv,
  }),
);
