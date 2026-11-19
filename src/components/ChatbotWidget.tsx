import {
  useState,
  useRef,
  useEffect,
  useCallback,
  lazy,
  Suspense,
  type ComponentProps,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Trash2 } from 'lucide-react';

// Markdown pipeline is deferred to its own chunk so visitors who never open
// chat never download react-markdown + remark-gfm.
const LazyReactMarkdown = lazy(async () => {
  const [{ default: Markdown }, { default: gfm }] = await Promise.all([
    import('react-markdown'),
    import('remark-gfm'),
  ]);
  return {
    default: (props: ComponentProps<typeof Markdown>) => (
      <Markdown remarkPlugins={[gfm]} {...props} />
    ),
  };
});

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CHAT_HISTORY_KEY = 'portfolio_chat_history';
const AUTO_OPEN_KEY = 'portfolio_chat_auto_opened';
const AUTO_OPEN_DELAY = 3000; // ms before auto-opening to aid discoverability
const EDGE_FUNCTION_URL =
  'https://pseeqvnoppfsbmptzznj.supabase.co/functions/v1/gemini-chat';

// Client-side mirror of the edge function's sanitizeHistory: history restored
// from localStorage is untrusted input, so filter hard. Keeps user history when
// fixable (synthesize id/timestamp) instead of dropping entries.
const MAX_RESTORED_HISTORY = 50;
const MAX_CONTENT_LENGTH = 2000;

function sanitizeRestoredHistory(raw: string): Message[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  const entries = parsed.flatMap((m: unknown): Message[] => {
    if (m === null || typeof m !== 'object') return [];
    const entry = m as Partial<Omit<Message, 'timestamp'>> & { timestamp?: unknown };
    if (
      (entry.role !== 'user' && entry.role !== 'assistant') ||
      typeof entry.content !== 'string' ||
      entry.content.trim().length === 0
    ) {
      return [];
    }
    const restored = new Date(entry.timestamp as string);
    return [
      {
        id: typeof entry.id === 'string' && entry.id ? entry.id : crypto.randomUUID(),
        role: entry.role,
        content: entry.content.slice(0, MAX_CONTENT_LENGTH),
        timestamp: Number.isNaN(restored.getTime()) ? new Date() : restored,
      },
    ];
  });
  return entries.slice(-MAX_RESTORED_HISTORY);
}

// Request lifecycle — one request at a time:
//
//   idle ──send──▶ sending ──first token──▶ streaming ──done──▶ idle
//   error ─send─▶    │                          │
//                    └───────── fail ───────────┴──────────▶ error
//
// `sending` shows "Thinking…"; `streaming` shows the reply growing instead.
// History is persisted in every state except `streaming`, so tokens don't
// re-serialize the whole history; leaving `streaming` persists the final text.
type ChatStatus =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'streaming' }
  | { kind: 'error'; message: string };

const FALLBACK_REPLY = 'Sorry, I could not generate a response.';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(CHAT_HISTORY_KEY);
    return saved ? sanitizeRestoredHistory(saved) : [];
  });
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<ChatStatus>({ kind: 'idle' });
  const busy = status.kind === 'sending' || status.kind === 'streaming';

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Set briefly when the panel opens via auto-open so the focus effect can skip
  // stealing focus from whatever the user was reading.
  const autoOpenedRef = useRef(false);

  useEffect(() => {
    if (status.kind === 'streaming') return;
    if (typeof window !== 'undefined') {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    }
  }, [messages, status.kind]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens — but not when it auto-opened, so we don't yank
  // focus from the page the user is reading.
  useEffect(() => {
    if (!isOpen) return;
    if (autoOpenedRef.current) {
      autoOpenedRef.current = false;
      return;
    }
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Auto-open once per browser session so first-time visitors discover the chat.
  // Skip returning visitors who already have history, and never re-trigger after
  // the user has interacted with it.
  useEffect(() => {
    const hasHistory = messages.length > 0;
    const alreadyShown =
      typeof window !== 'undefined' && sessionStorage.getItem(AUTO_OPEN_KEY) === '1';
    if (hasHistory || alreadyShown) return;

    autoOpenTimerRef.current = setTimeout(() => {
      setIsOpen(true);
      autoOpenedRef.current = true;
      sessionStorage.setItem(AUTO_OPEN_KEY, '1');
    }, AUTO_OPEN_DELAY);

    return () => {
      if (autoOpenTimerRef.current) {
        clearTimeout(autoOpenTimerRef.current);
        autoOpenTimerRef.current = null;
      }
    };
    // Run once on mount; the initial `messages` snapshot is captured here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Any manual interaction cancels a pending auto-open and records that the user
  // is already aware of the chatbot (so we don't auto-open again this session).
  const markUserAware = useCallback(() => {
    if (autoOpenTimerRef.current) {
      clearTimeout(autoOpenTimerRef.current);
      autoOpenTimerRef.current = null;
    }
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(AUTO_OPEN_KEY, '1');
    }
  }, []);

  const toggleChat = useCallback(() => {
    markUserAware();
    setIsOpen((prev) => !prev);
  }, [markUserAware]);

  const closeChat = useCallback(() => {
    markUserAware();
    setIsOpen(false);
  }, [markUserAware]);

  const handleClearHistory = useCallback(() => {
    if (busy) return;
    setMessages([]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  }, [busy]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || busy) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setStatus({ kind: 'sending' });

    // Build history in Gemini format (role: 'user' | 'model')
    const history = messages
      .filter((m) => m.content.trim())
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

    // The assistant bubble is created on the first token (sending → streaming),
    // so there is never an empty bubble to clean up on failure.
    let assistantId: string | null = null;
    const appendReply = (text: string) => {
      if (assistantId === null) {
        const id = (assistantId = crypto.randomUUID());
        setMessages((prev) => [...prev, { id, role: 'assistant', content: text, timestamp: new Date() }]);
        setStatus({ kind: 'streaming' });
        return;
      }
      const id = assistantId;
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: m.content + text } : m)));
    };

    try {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content, history }),
      });

      if (res.status === 429) {
        const retryAfter = res.headers.get('Retry-After');
        const minutes = retryAfter ? Math.ceil(Number(retryAfter) / 60) : 15;
        throw new Error(`You've sent a lot of messages! Please wait ${minutes} minute${minutes !== 1 ? 's' : ''} before trying again.`);
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      const contentType = res.headers.get('Content-Type') ?? '';

      if (contentType.includes('text/event-stream')) {
        // Streaming response — read SSE chunks and append incrementally
        const reader = res.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim();
              if (jsonStr === '[DONE]') continue;
              try {
                const chunk = JSON.parse(jsonStr);
                const text: string =
                  chunk?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
                if (text) appendReply(text);
              } catch {
                // Ignore malformed chunks
              }
            }
          }
        }
        if (assistantId === null) appendReply(FALLBACK_REPLY);
      } else {
        // Fallback for non-streaming response (e.g. error JSON)
        const data = await res.json();
        appendReply(data.text ?? FALLBACK_REPLY);
      }
      setStatus({ kind: 'idle' });
    } catch (err) {
      // Partial streamed text (if any) stays; the error banner explains the cut.
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'An error occurred' });
    }
  }, [input, busy, messages]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl sm:w-[400px] lg:bottom-6 lg:right-24 lg:h-[600px] lg:w-[25vw] lg:min-w-[350px] lg:max-w-[450px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Ask about Joven</h3>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    disabled={busy}
                    className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
                    title="Clear chat history"
                    aria-label="Clear chat history"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={closeChat}
                  className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                  <MessageCircle className="mb-2 h-8 w-8" />
                  <p className="text-sm">Ask me anything about Joven!</p>
                  <p className="mt-1 text-xs">Research, projects, photography, or how to collaborate.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        ) : (
                          <Suspense
                            fallback={
                              <span
                                className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current opacity-50"
                                aria-hidden="true"
                              />
                            }
                          >
                            <LazyReactMarkdown
                              components={{
                                p: ({ children }) => (
                                  <p className="mb-1 last:mb-0 break-words">{children}</p>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-semibold text-foreground">{children}</strong>
                                ),
                                em: ({ children }) => <em className="italic">{children}</em>,
                                ul: ({ children }) => (
                                  <ul className="my-1 ml-4 list-disc space-y-0.5">{children}</ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="my-1 ml-4 list-decimal space-y-0.5">{children}</ol>
                                ),
                                li: ({ children }) => <li className="leading-snug">{children}</li>,
                                a: ({ href, children }) => (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-2 hover:opacity-80"
                                  >
                                    {children}
                                  </a>
                                ),
                                code: ({ children }) => (
                                  <code className="rounded bg-black/10 px-1 py-0.5 font-mono text-xs dark:bg-white/10">
                                    {children}
                                  </code>
                                ),
                                pre: ({ children }) => (
                                  <pre className="my-1 overflow-x-auto rounded bg-black/10 p-2 font-mono text-xs dark:bg-white/10">
                                    {children}
                                  </pre>
                                ),
                                h1: ({ children }) => (
                                  <p className="font-semibold text-foreground">{children}</p>
                                ),
                                h2: ({ children }) => (
                                  <p className="font-semibold text-foreground">{children}</p>
                                ),
                                h3: ({ children }) => (
                                  <p className="font-medium text-foreground">{children}</p>
                                ),
                                blockquote: ({ children }) => (
                                  <blockquote className="border-l-2 border-current pl-2 opacity-80">
                                    {children}
                                  </blockquote>
                                ),
                              }}
                            >
                              {message.content}
                            </LazyReactMarkdown>
                          </Suspense>
                        )}
                        <p
                          className={`mt-1 text-[10px] ${
                            message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {status.kind === 'sending' && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Thinking…</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Error */}
            {status.kind === 'error' && (
              <div role="alert" className="border-t border-destructive/20 bg-destructive/10 px-4 py-2 text-xs text-destructive">
                {status.message}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message…"
                  disabled={busy}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || busy}
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-right text-[10px] text-muted-foreground">Press Enter to send</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
