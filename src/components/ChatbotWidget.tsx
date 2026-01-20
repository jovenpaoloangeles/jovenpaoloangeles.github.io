import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Key, Loader2, Trash2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const STORAGE_KEY = 'gemini_api_key';
const CHAT_HISTORY_KEY = 'gemini_chat_history';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || '';
    }
    return '';
  });
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CHAT_HISTORY_KEY);
      if (saved) {
        try {
          return JSON.parse(saved).map((m: Message) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }));
        } catch {
          return [];
        }
      }
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<ReturnType<GoogleGenAI['chats']['create']> | null>(null);
  const aiRef = useRef<GoogleGenAI | null>(null);

  // Initialize AI client when API key changes
  useEffect(() => {
    if (apiKey) {
      aiRef.current = new GoogleGenAI({ apiKey });
      // Create chat session with history
      const history = messages
        .filter((m) => m.content.trim())
        .map((m) => ({
          role: m.role === 'user' ? 'user' as const : 'model' as const,
          parts: [{ text: m.content }],
        }));
      
      chatRef.current = aiRef.current.chats.create({
        model: 'gemini-2.0-flash',
        history,
        config: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });
    }
  }, [apiKey, messages.length]);

  // Save messages to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && apiKey) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, apiKey]);

  const handleSaveApiKey = useCallback(() => {
    if (apiKeyInput.trim()) {
      const key = apiKeyInput.trim();
      localStorage.setItem(STORAGE_KEY, key);
      setApiKey(key);
      setApiKeyInput('');
      setError(null);
    }
  }, [apiKeyInput]);

  const handleRemoveApiKey = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
    aiRef.current = null;
    chatRef.current = null;
  }, []);

  const handleClearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
    // Recreate chat session without history
    if (aiRef.current) {
      chatRef.current = aiRef.current.chats.create({
        model: 'gemini-2.0-flash',
        config: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });
    }
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatRef.current.sendMessage({
        message: userMessage.content,
      });

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.text || 'Sorry, I could not generate a response.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Gemini API error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      // If API key is invalid, prompt to re-enter
      if (errorMessage.toLowerCase().includes('api key') || 
          errorMessage.toLowerCase().includes('unauthorized') ||
          errorMessage.toLowerCase().includes('invalid')) {
        handleRemoveApiKey();
      }
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, handleRemoveApiKey]);

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
        onClick={() => setIsOpen(!isOpen)}
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
                  <h3 className="text-sm font-semibold">AI Assistant</h3>
                  <p className="text-xs text-muted-foreground">Powered by Gemini</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {apiKey && (
                  <button
                    onClick={handleClearHistory}
                    className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Clear chat history"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            {!apiKey ? (
              /* API Key Input */
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Key className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold">Enter your Gemini API Key</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your key is stored locally in your browser and never sent to our servers.
                  </p>
                </div>
                <div className="w-full space-y-3">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveApiKey()}
                    placeholder="AIza..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={handleSaveApiKey}
                    disabled={!apiKeyInput.trim()}
                    className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    Save API Key
                  </button>
                </div>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  Get your free API key from Google AI Studio →
                </a>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  {messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                      <MessageCircle className="mb-2 h-8 w-8" />
                      <p className="text-sm">Start a conversation!</p>
                      <p className="mt-1 text-xs">Ask me anything about Joven's work, research, or projects.</p>
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
                            <p className="whitespace-pre-wrap break-words">{message.content}</p>
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
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Thinking...</span>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Error Display */}
                {error && (
                  <div className="border-t border-destructive/20 bg-destructive/10 px-4 py-2 text-xs text-destructive">
                    {error}
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
                      placeholder="Type your message..."
                      disabled={isLoading}
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                      className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                      aria-label="Send message"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      onClick={handleRemoveApiKey}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Change API Key
                    </button>
                    <span className="text-[10px] text-muted-foreground">Press Enter to send</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
