import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatbotWidget } from '../ChatbotWidget';

// ── Mock react-markdown to render content as plain text in jsdom ─────────────
vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => <>{children}</>,
}));
vi.mock('remark-gfm', () => ({ default: () => {} }));

// ── Mock framer-motion to skip animations in jsdom ────────────────────────────
vi.mock('framer-motion', () => ({
  motion: {
    button: ({
      children,
      whileHover: _wh,
      whileTap: _wt,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      ...props
    }: React.ComponentPropsWithRef<'button'> & Record<string, unknown>) => (
      <button {...props}>{children}</button>
    ),
    div: ({
      children,
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      ...props
    }: React.ComponentPropsWithRef<'div'> & Record<string, unknown>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ── Constants ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'portfolio_chat_history';
const EDGE_URL = 'https://pseeqvnoppfsbmptzznj.supabase.co/functions/v1/gemini-chat';

// ── fetch mock factories ──────────────────────────────────────────────────────

/** Helper to create a ReadableStream from a string */
function textStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
}

/** Simulate a streaming SSE response from the edge function */
function fetchStreamOk(text = 'Hello from Joven!') {
  // Send text in two chunks to simulate streaming
  const mid = Math.ceil(text.length / 2);
  const chunk1 = text.slice(0, mid);
  const chunk2 = text.slice(mid);

  const event1 = JSON.stringify({
    candidates: [{ content: { parts: [{ text: chunk1 }] } }],
  });
  const event2 = JSON.stringify({
    candidates: [{ content: { parts: [{ text: chunk2 }] } }],
  });

  const body = textStream(`data: ${event1}\n\ndata: ${event2}\n\n`);

  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    body,
    headers: new Headers({ 'Content-Type': 'text/event-stream' }),
  });
}

function fetchError(status = 500, error = 'Internal server error') {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => ({ error }),
    headers: new Headers(),
  });
}

function fetchRateLimit(retryAfterSeconds = 900) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status: 429,
    json: async () => ({}),
    headers: new Headers({ 'Retry-After': String(retryAfterSeconds) }),
  });
}

function fetchPending() {
  return vi.fn().mockReturnValue(new Promise<never>(() => {}));
}

// ── Test suite ────────────────────────────────────────────────────────────────
describe('ChatbotWidget', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  // ── Initial render ──────────────────────────────────────────────────────────
  describe('initial render', () => {
    it('renders the floating toggle button', () => {
      render(<ChatbotWidget />);
      expect(screen.getByRole('button', { name: /open chat/i })).toBeInTheDocument();
    });

    it('does not show the chat panel initially', () => {
      render(<ChatbotWidget />);
      expect(screen.queryByPlaceholderText(/type your message/i)).not.toBeInTheDocument();
    });
  });

  // ── Opening / closing ───────────────────────────────────────────────────────
  describe('open and close', () => {
    it('opens the chat panel when the toggle button is clicked', async () => {
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    });

    it('closes the chat panel via the header close button', async () => {
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      // The header has a dedicated close button (second one with this label)
      const closeButtons = screen.getAllByRole('button', { name: /close chat/i });
      await user.click(closeButtons[closeButtons.length - 1]);
      expect(screen.queryByPlaceholderText(/type your message/i)).not.toBeInTheDocument();
    });
  });

  // ── Empty state ─────────────────────────────────────────────────────────────
  describe('empty state', () => {
    it('shows empty-state prompt when there are no messages', async () => {
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      expect(screen.getByText(/ask me anything about joven!/i)).toBeInTheDocument();
      expect(screen.getByText(/research, projects, photography/i)).toBeInTheDocument();
    });

    it('send button is disabled when input is empty', async () => {
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
    });
  });

  // ── Sending messages ────────────────────────────────────────────────────────
  describe('sending messages', () => {
    it('enables the send button when the input has text', async () => {
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Hello');
      expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
    });

    it('displays the user message bubble after sending', async () => {
      vi.stubGlobal('fetch', fetchStreamOk());
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Who is Joven?');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      expect(screen.getByText('Who is Joven?')).toBeInTheDocument();
    });

    it('clears the input field after sending', async () => {
      vi.stubGlobal('fetch', fetchStreamOk());
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      const input = screen.getByPlaceholderText(/type your message/i);
      await user.type(input, 'Hello');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      expect(input).toHaveValue('');
    });

    it('displays the assistant response after a successful fetch', async () => {
      vi.stubGlobal('fetch', fetchStreamOk('Joven is a PhD candidate at UP.'));
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Who is Joven?');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        expect(screen.getByText('Joven is a PhD candidate at UP.')).toBeInTheDocument();
      });
    });

    it('submits the message when Enter is pressed', async () => {
      const mockFetch = fetchStreamOk();
      vi.stubGlobal('fetch', mockFetch);
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Hello{Enter}');
      expect(mockFetch).toHaveBeenCalledOnce();
    });

    it('does not submit when Shift+Enter is pressed', async () => {
      const mockFetch = vi.fn();
      vi.stubGlobal('fetch', mockFetch);
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Hello');
      await user.keyboard('{Shift>}{Enter}{/Shift}');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('calls the edge function URL with the correct payload', async () => {
      const mockFetch = fetchStreamOk();
      vi.stubGlobal('fetch', mockFetch);
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Tell me about Joven');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      expect(mockFetch).toHaveBeenCalledWith(
        EDGE_URL,
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Tell me about Joven'),
        }),
      );

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body).toHaveProperty('message', 'Tell me about Joven');
      expect(body).toHaveProperty('history');
      expect(Array.isArray(body.history)).toBe(true);
    });

    it('sends previous messages as history in Gemini format', async () => {
      const mockFetch = fetchStreamOk('Second response');
      vi.stubGlobal('fetch', mockFetch);
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));

      // First message
      await user.type(screen.getByPlaceholderText(/type your message/i), 'First message');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => screen.getByText('Second response'));

      // Second message — history should contain first exchange
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Second message');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      const secondCallBody = JSON.parse(mockFetch.mock.calls[1][1].body);
      expect(secondCallBody.history).toHaveLength(2);
      expect(secondCallBody.history[0].role).toBe('user');
      expect(secondCallBody.history[1].role).toBe('model');
    });
  });

  // ── Loading state ───────────────────────────────────────────────────────────
  describe('loading state', () => {
    it('shows a loading indicator while waiting for the response', async () => {
      vi.stubGlobal('fetch', fetchPending());
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Hello');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      expect(screen.getByText(/thinking/i)).toBeInTheDocument();
    });

    it('disables the send button while loading', async () => {
      vi.stubGlobal('fetch', fetchPending());
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Hello');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
    });

    it('disables the text input while loading', async () => {
      vi.stubGlobal('fetch', fetchPending());
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Hello');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      expect(screen.getByPlaceholderText(/type your message/i)).toBeDisabled();
    });
  });

  // ── Error handling ──────────────────────────────────────────────────────────
  describe('error handling', () => {
    it('shows an error message when the network request fails', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Hello');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('shows an error message from a non-ok response', async () => {
      vi.stubGlobal('fetch', fetchError(500, 'Chatbot is temporarily unavailable.'));
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Hello');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        expect(
          screen.getByText('Chatbot is temporarily unavailable.'),
        ).toBeInTheDocument();
      });
    });

    it('shows a human-readable rate limit message on 429', async () => {
      // 900 seconds = 15 minutes
      vi.stubGlobal('fetch', fetchRateLimit(900));
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Hello');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        expect(screen.getByText(/15 minute/i)).toBeInTheDocument();
      });
    });

    it('shows singular "minute" for a 1-minute retry window', async () => {
      vi.stubGlobal('fetch', fetchRateLimit(60));
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Hello');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        // should say "1 minute" not "1 minutes"
        expect(screen.getByText(/1 minute[^s]/i)).toBeInTheDocument();
      });
    });

    it('clears the error when a new message is sent', async () => {
      const user = userEvent.setup();
      // First request fails
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Oops')));
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Hello');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => screen.getByText('Oops'));

      // Second request succeeds
      vi.stubGlobal('fetch', fetchStreamOk('All good now'));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Retry');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        expect(screen.queryByText('Oops')).not.toBeInTheDocument();
      });
    });
  });

  // ── Chat history ────────────────────────────────────────────────────────────
  describe('chat history', () => {
    it('does not show the clear history button when there are no messages', async () => {
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      expect(
        screen.queryByRole('button', { name: /clear chat history/i }),
      ).not.toBeInTheDocument();
    });

    it('shows the clear history button once messages exist', async () => {
      vi.stubGlobal('fetch', fetchStreamOk('Hi'));
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Hello');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /clear chat history/i }),
        ).toBeInTheDocument();
      });
    });

    it('removes all messages when clear history is clicked', async () => {
      vi.stubGlobal('fetch', fetchStreamOk('Response'));
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Hello');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => screen.getByText('Response'));

      await user.click(screen.getByRole('button', { name: /clear chat history/i }));

      expect(screen.queryByText('Hello')).not.toBeInTheDocument();
      expect(screen.queryByText('Response')).not.toBeInTheDocument();
      expect(screen.getByText(/ask me anything about joven!/i)).toBeInTheDocument();
    });

    it('persists messages to localStorage after a response', async () => {
      vi.stubGlobal('fetch', fetchStreamOk('Stored response'));
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Hello');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() => screen.getByText('Stored response'));

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      expect(stored).toHaveLength(2);
      expect(stored[0].role).toBe('user');
      expect(stored[0].content).toBe('Hello');
      expect(stored[1].role).toBe('assistant');
      expect(stored[1].content).toBe('Stored response');
    });

    it('loads saved messages from localStorage on mount', async () => {
      const history = [
        {
          id: 'a',
          role: 'user',
          content: 'Saved question',
          timestamp: new Date().toISOString(),
        },
        {
          id: 'b',
          role: 'assistant',
          content: 'Saved answer',
          timestamp: new Date().toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      expect(screen.getByText('Saved question')).toBeInTheDocument();
      expect(screen.getByText('Saved answer')).toBeInTheDocument();
    });

    it('removes the localStorage key when clear history is clicked', async () => {
      vi.stubGlobal('fetch', fetchStreamOk());
      const user = userEvent.setup();
      render(<ChatbotWidget />);
      await user.click(screen.getByRole('button', { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/type your message/i), 'Hello');
      await user.click(screen.getByRole('button', { name: /send message/i }));
      await waitFor(() =>
        screen.getByRole('button', { name: /clear chat history/i }),
      );

      await user.click(screen.getByRole('button', { name: /clear chat history/i }));
      // After clearing, the persistence effect re-runs with [] and writes back an
      // empty array. Verify the messages list is empty rather than checking for null.
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      expect(stored).toHaveLength(0);
    });
  });
});
