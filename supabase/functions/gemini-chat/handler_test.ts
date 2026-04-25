import { assertEquals, assertStringIncludes } from "jsr:@std/assert";
import { createHandler, type HandlerConfig } from "./handler.ts";

// ── helpers ───────────────────────────────────────────────────────────────────

const BASE_CONFIG: HandlerConfig = {
  apiKey: "test-api-key",
  fileSearchStore: "",
  geminiUrl: "https://test.gemini.api/generateContent",
  rateMax: 3,
  rateWindowMs: 60_000,
  allowedOrigins: ["https://example.com", "http://localhost:5173"],
};

// Each call to makeHandler() produces a fresh handler with its own isolated
// in-memory rate limit store — no shared state between tests.
function makeHandler(overrides: Partial<HandlerConfig> = {}) {
  return createHandler({ ...BASE_CONFIG, ...overrides });
}

function post(
  body: unknown,
  headers: Record<string, string> = {},
): Request {
  return new Request("https://test.fn/gemini-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

function geminiOkResponse(text: string): Response {
  return new Response(
    JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }),
    { status: 200, headers: { "Content-Type": "text/event-stream" } },
  );
}

/** Temporarily replace globalThis.fetch, restore after `fn` completes. */
async function withFetch<T>(
  mock: typeof globalThis.fetch,
  fn: () => Promise<T>,
): Promise<T> {
  const orig = globalThis.fetch;
  globalThis.fetch = mock;
  try {
    return await fn();
  } finally {
    globalThis.fetch = orig;
  }
}

// ── CORS / method guards ──────────────────────────────────────────────────────

Deno.test("OPTIONS returns 204 with CORS headers", async () => {
  const handler = makeHandler();
  const req = new Request("https://test.fn/gemini-chat", {
    method: "OPTIONS",
    headers: { origin: "http://localhost:5173" },
  });
  const res = await handler(req);
  assertEquals(res.status, 204);
  assertEquals(res.headers.get("Access-Control-Allow-Methods"), "POST, OPTIONS");
  assertEquals(res.headers.get("Access-Control-Allow-Origin"), "http://localhost:5173");
});

Deno.test("GET returns 405", async () => {
  const handler = makeHandler();
  const req = new Request("https://test.fn/gemini-chat", { method: "GET" });
  const res = await handler(req);
  assertEquals(res.status, 405);
});

Deno.test("allowed origin is echoed in CORS header", async () => {
  const handler = makeHandler();
  await withFetch(
    async () => geminiOkResponse("hi"),
    async () => {
      const req = post({ message: "hello" }, { origin: "https://example.com" });
      const res = await handler(req);
      assertEquals(res.headers.get("Access-Control-Allow-Origin"), "https://example.com");
    },
  );
});

Deno.test("unknown origin falls back to first allowed origin", async () => {
  const handler = makeHandler();
  await withFetch(
    async () => geminiOkResponse("hi"),
    async () => {
      const req = post({ message: "hello" }, { origin: "https://attacker.com" });
      const res = await handler(req);
      assertEquals(res.headers.get("Access-Control-Allow-Origin"), "https://example.com");
    },
  );
});

// ── Request validation ────────────────────────────────────────────────────────

Deno.test("missing message field returns 400", async () => {
  const handler = makeHandler();
  const res = await handler(post({}));
  assertEquals(res.status, 400);
  const body = await res.json();
  assertStringIncludes(body.error, "message");
});

Deno.test("empty message string returns 400", async () => {
  const handler = makeHandler();
  const res = await handler(post({ message: "   " }));
  assertEquals(res.status, 400);
});

Deno.test("non-string message returns 400", async () => {
  const handler = makeHandler();
  const res = await handler(post({ message: 42 }));
  assertEquals(res.status, 400);
});

Deno.test("malformed JSON body returns 400", async () => {
  const handler = makeHandler();
  const req = new Request("https://test.fn/gemini-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "not json{{{",
  });
  const res = await handler(req);
  assertEquals(res.status, 400);
});

// ── Missing API key ───────────────────────────────────────────────────────────

Deno.test("missing API key returns 503", async () => {
  const handler = makeHandler({ apiKey: "" });
  const res = await handler(post({ message: "hello" }));
  assertEquals(res.status, 503);
  const body = await res.json();
  assertStringIncludes(body.error, "unavailable");
});

// ── Rate limiting ─────────────────────────────────────────────────────────────

Deno.test("allows requests up to rateMax then blocks", async () => {
  const handler = makeHandler({ rateMax: 2 });
  const ip = "10.0.0.1";

  await withFetch(
    async () => geminiOkResponse("ok"),
    async () => {
      const r1 = await handler(post({ message: "a" }, { "x-forwarded-for": ip }));
      assertEquals(r1.status, 200);

      const r2 = await handler(post({ message: "b" }, { "x-forwarded-for": ip }));
      assertEquals(r2.status, 200);

      // Third request exceeds limit
      const r3 = await handler(post({ message: "c" }, { "x-forwarded-for": ip }));
      assertEquals(r3.status, 429);
      const body = await r3.json();
      assertStringIncludes(body.error, "Too many requests");
      assertEquals(typeof r3.headers.get("Retry-After"), "string");
    },
  );
});

Deno.test("different IPs have independent rate limit buckets", async () => {
  const handler = makeHandler({ rateMax: 1 });

  await withFetch(
    async () => geminiOkResponse("ok"),
    async () => {
      const r1 = await handler(post({ message: "hi" }, { "x-forwarded-for": "1.1.1.1" }));
      assertEquals(r1.status, 200);
      const r2 = await handler(post({ message: "hi" }, { "x-forwarded-for": "2.2.2.2" }));
      assertEquals(r2.status, 200);
    },
  );
});

// ── Successful response ───────────────────────────────────────────────────────

Deno.test("successful request returns 200 with SSE stream", async () => {
  const handler = makeHandler();
  await withFetch(
    async () => geminiOkResponse("Joven is a researcher at UP."),
    async () => {
      const res = await handler(post({ message: "Who is Joven?" }));
      assertEquals(res.status, 200);
      assertEquals(res.headers.get("Content-Type"), "text/event-stream");

      // Read the full stream and verify it contains the text
      const text = await res.text();
      assertStringIncludes(text, "Joven is a researcher at UP.");
    },
  );
});

Deno.test("streams response even when candidates is empty (client handles fallback)", async () => {
  const handler = makeHandler();
  await withFetch(
    async () =>
      new Response(JSON.stringify({ candidates: [] }), {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      }),
    async () => {
      const res = await handler(post({ message: "hello" }));
      assertEquals(res.status, 200);
      assertEquals(res.headers.get("Content-Type"), "text/event-stream");
    },
  );
});

Deno.test("Gemini error response is forwarded to client", async () => {
  const handler = makeHandler();
  await withFetch(
    async () =>
      new Response("Bad Request from Gemini", {
        status: 400,
        headers: { "Content-Type": "text/plain" },
      }),
    async () => {
      const res = await handler(post({ message: "hello" }));
      assertEquals(res.status, 400);
      const body = await res.json();
      assertStringIncludes(body.error, "Bad Request");
    },
  );
});

Deno.test("fetch network failure returns 500", async () => {
  const handler = makeHandler();
  await withFetch(
    async () => { throw new Error("Network timeout"); },
    async () => {
      const res = await handler(post({ message: "hello" }));
      assertEquals(res.status, 500);
      const body = await res.json();
      assertStringIncludes(body.error, "Network timeout");
    },
  );
});

// ── History handling ──────────────────────────────────────────────────────────

Deno.test("history is passed to Gemini as contents", async () => {
  const handler = makeHandler();
  let capturedBody: Record<string, unknown> = {};

  await withFetch(
    async (_url, init) => {
      capturedBody = JSON.parse((init as RequestInit).body as string);
      return geminiOkResponse("ok");
    },
    async () => {
      const history = [
        { role: "user", parts: [{ text: "first question" }] },
        { role: "model", parts: [{ text: "first answer" }] },
      ];
      await handler(post({ message: "follow-up", history }));
    },
  );

  const contents = capturedBody.contents as Array<{ role: string }>;
  assertEquals(contents.length, 3);
  assertEquals(contents[0].role, "user");
  assertEquals(contents[1].role, "model");
  assertEquals(contents[2].role, "user");
});

Deno.test("history is capped at 20 most recent messages", async () => {
  const handler = makeHandler();
  let capturedBody: Record<string, unknown> = {};

  const longHistory = Array.from({ length: 30 }, (_, i) => ({
    role: i % 2 === 0 ? "user" : "model",
    parts: [{ text: `message ${i}` }],
  }));

  await withFetch(
    async (_url, init) => {
      capturedBody = JSON.parse((init as RequestInit).body as string);
      return geminiOkResponse("ok");
    },
    async () => {
      await handler(post({ message: "new message", history: longHistory }));
    },
  );

  const contents = capturedBody.contents as unknown[];
  // 20 capped history + 1 new message
  assertEquals(contents.length, 21);
});

// ── RAG / fileSearch tool ─────────────────────────────────────────────────────

Deno.test("fileSearch tool is included when store is configured", async () => {
  const handler = makeHandler({ fileSearchStore: "fileSearchStores/test-store" });
  let capturedBody: Record<string, unknown> = {};

  await withFetch(
    async (_url, init) => {
      capturedBody = JSON.parse((init as RequestInit).body as string);
      return geminiOkResponse("ok");
    },
    async () => {
      await handler(post({ message: "What is Joven's PhD about?" }));
    },
  );

  const tools = capturedBody.tools as Array<{
    fileSearch: { fileSearchStoreNames: string[] };
  }>;
  assertEquals(tools?.length, 1);
  assertEquals(tools[0].fileSearch.fileSearchStoreNames[0], "fileSearchStores/test-store");
});

Deno.test("fileSearch tool is omitted when store is not configured", async () => {
  const handler = makeHandler({ fileSearchStore: "" });
  let capturedBody: Record<string, unknown> = {};

  await withFetch(
    async (_url, init) => {
      capturedBody = JSON.parse((init as RequestInit).body as string);
      return geminiOkResponse("ok");
    },
    async () => {
      await handler(post({ message: "hello" }));
    },
  );

  assertEquals(capturedBody.tools, undefined);
});

// ── Gemini request shape ──────────────────────────────────────────────────────

Deno.test("request includes system instruction and safety settings", async () => {
  const handler = makeHandler();
  let capturedBody: Record<string, unknown> = {};

  await withFetch(
    async (_url, init) => {
      capturedBody = JSON.parse((init as RequestInit).body as string);
      return geminiOkResponse("ok");
    },
    async () => {
      await handler(post({ message: "hello" }));
    },
  );

  assertEquals(typeof capturedBody.system_instruction, "object");
  const safetySettings = capturedBody.safetySettings as unknown[];
  assertEquals(safetySettings.length, 4);
});
