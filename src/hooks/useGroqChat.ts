import { useState, useRef, useCallback, useEffect } from 'react';
import type { Place } from '../types';
import i18n from '../i18n';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';
const MAX_TOKENS = 280;

function buildSystemPrompt(place: Place, lang: string): string {
  if (lang === 'es') {
    return `Eres un guía de viajes experto en Guatemala, amable y entusiasta.
El usuario está viendo: ${place.name} (${place.category}) en ${place.department}.
Contexto: ${place.description}
Responde siempre en español. Sé conciso (máximo 3 oraciones). Si no sabes algo con certeza, dilo con honestidad.`;
  }
  return `You are an enthusiastic and knowledgeable travel guide specializing in Guatemala.
The user is viewing: ${place.name} (${place.category}) in ${place.department}.
Context: ${place.description}
Always respond in English. Be concise (3 sentences max). If unsure about something, admit it honestly.`;
}

export function useGroqChat(place: Place) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const apiKey = (import.meta.env.VITE_GROQ_API_KEY as string | undefined) ?? '';

  // Reset chat and cancel any in-flight request when the place changes
  useEffect(() => {
    abortRef.current?.abort();
    setMessages([]);
    setStreaming(false);
  }, [place.id]);

  // Abort on unmount
  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (userContent: string) => {
      if (!apiKey || streaming) return;

      const userMsg: ChatMessage = { role: 'user', content: userContent };
      const history = [...messages, userMsg];
      setMessages(history);
      setStreaming(true);

      // Cancel previous request if still running
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      // Append an empty assistant message that will be filled by streaming tokens
      setMessages([...history, { role: 'assistant', content: '' }]);

      try {
        const response = await fetch(GROQ_URL, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            temperature: 0.72,
            stream: true,
            messages: [
              { role: 'system', content: buildSystemPrompt(place, i18n.language) },
              ...history.map((m) => ({ role: m.role, content: m.content })),
            ],
          }),
        });

        if (!response.ok) {
          throw new Error(`Groq API ${response.status}: ${await response.text()}`);
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? ''; // keep the last incomplete line

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data: ') || trimmed === 'data: [DONE]') continue;
            try {
              const json = JSON.parse(trimmed.slice(6));
              const token: string = json.choices?.[0]?.delta?.content ?? '';
              if (!token) continue;

              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === 'assistant') {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + token,
                  };
                }
                return updated;
              });
            } catch {
              // Ignore malformed SSE chunks
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;

        // Replace the empty assistant placeholder with the error
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === 'assistant' && last.content === '') {
            updated[updated.length - 1] = {
              ...last,
              content: '⚠️ Error connecting to AI. Check your API key.',
            };
          }
          return updated;
        });
      } finally {
        setStreaming(false);
      }
    },
    [apiKey, messages, place, streaming]
  );

  return { messages, streaming, send, hasKey: apiKey.length > 0 };
}
