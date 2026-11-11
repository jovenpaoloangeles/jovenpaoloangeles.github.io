import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createHandler } from "./handler.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const FILE_SEARCH_STORE = Deno.env.get("GEMINI_FILE_SEARCH_STORE_NAME") ?? "";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent";

const ALLOWED_ORIGINS = [
  "https://jovenpaoloangeles.github.io",
  "http://localhost:5173",
  "http://localhost:4173",
];

Deno.serve(
  createHandler({
    apiKey: GEMINI_API_KEY,
    fileSearchStore: FILE_SEARCH_STORE,
    geminiUrl: GEMINI_URL,
    rateMax: 5,
    rateWindowMs: 15 * 60 * 1000,
    allowedOrigins: ALLOWED_ORIGINS,
  }),
);
