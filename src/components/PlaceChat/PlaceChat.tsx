import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Place } from '../../types';
import { useGroqChat } from '../../hooks/useGroqChat';
import './PlaceChat.css';

interface PlaceChatProps {
  place: Place;
}

export default function PlaceChat({ place }: PlaceChatProps) {
  const { t } = useTranslation();
  const { messages, streaming, send, hasKey } = useGroqChat(place);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to latest message when new content arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when section is opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 160);
  }, [open]);

  // Reset input when place changes
  useEffect(() => {
    setInput('');
    setOpen(false);
  }, [place.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || streaming) return;
    setInput('');
    send(trimmed);
  };

  return (
    <div className="place-chat">
      <button
        className={`chat-toggle ${open ? 'chat-toggle--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="chat-toggle-icon">🤖</span>
        <span>{t('chat.title')}</span>
        <span className="chat-toggle-chevron">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="chat-body">
          {!hasKey ? (
            /* ── No API key configured ── */
            <div className="chat-no-key">
              <p>{t('chat.noKey')}</p>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="chat-key-link"
              >
                {t('chat.getKey')} →
              </a>
            </div>
          ) : (
            <>
              {/* ── Messages ── */}
              <div className="chat-messages">
                {messages.length === 0 && (
                  <p className="chat-welcome">
                    {t('chat.welcome', { name: place.name })}
                  </p>
                )}

                {messages.map((msg, i) => (
                  <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
                    {msg.role === 'assistant' && msg.content === '' && streaming ? (
                      <span className="chat-typing" aria-label="typing">
                        <span />
                        <span />
                        <span />
                      </span>
                    ) : (
                      msg.content
                    )}
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>

              {/* ── Input ── */}
              <form className="chat-form" onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  className="chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('chat.placeholder')}
                  disabled={streaming}
                  maxLength={300}
                />
                <button
                  type="submit"
                  className="chat-send"
                  disabled={!input.trim() || streaming}
                  aria-label={t('chat.send')}
                >
                  {streaming ? '…' : '↑'}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
