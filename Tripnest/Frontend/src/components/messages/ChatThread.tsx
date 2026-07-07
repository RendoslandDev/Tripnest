import { useEffect, useRef, useState } from 'react';
import type { Conversation } from '../../types';
import { getMessages, sendMessage } from '../../api/messages';
import { useAsync } from '../../hooks/useAsync';
import AsyncBoundary from '../AsyncBoundary';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import { ChevronLeftIcon, PhoneIcon, InfoIcon } from '../tenant/icons';
import type { ChatItem } from './types';
import VoicePlayer from './VoicePlayer';
import Composer from './Composer';
import ThreadDetails from './ThreadDetails';

/** Header action: small round icon button with an accessible label. */
function HeaderAction({ label, onClick, active, children }: {
  label: string; onClick: () => void; active?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
        active ? 'bg-brand-50 text-brand' : 'text-muted hover:bg-gray-100 hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

interface ChatThreadProps {
  conversation: Conversation;
  /** When provided, a mobile-only back button appears in the header. */
  onBack?: () => void;
  className?: string;
}

/** The open conversation: header, message history, composer, details aside. */
export default function ChatThread({ conversation, onBack, className = '' }: ChatThreadProps) {
  const state = useAsync(() => getMessages(conversation.id), [conversation.id]);
  const [sent, setSent] = useState<ChatItem[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the latest message in view as the thread grows or switches.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [sent, state.data]);

  // Auto-dismiss the transient banner.
  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 2500);
    return () => clearTimeout(t);
  }, [banner]);

  const append = (item: Omit<ChatItem, 'id' | 'fromMe' | 'time'>) =>
    setSent((s) => [...s, { id: Date.now(), fromMe: true, time: 'Now', ...item }]);

  const send = async (text: string): Promise<boolean> => {
    // Optimistic bubble, reconciled with the saved message from the API.
    const tempId = `pending-${Date.now()}`;
    setSent((s) => [...s, { id: tempId, fromMe: true, time: 'Sending…', text }]);
    try {
      const saved = await sendMessage(conversation.id, text);
      setSent((s) => s.map((m) => (m.id === tempId ? saved : m)));
      return true;
    } catch {
      setSent((s) => s.filter((m) => m.id !== tempId));
      setBanner('Message failed to send.');
      return false;
    }
  };

  const sentIds = new Set(sent.map((m) => m.id));

  return (
    <Card className={`tn-card-in flex min-h-0 overflow-hidden ${className}`}>
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 sm:px-5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to conversations"
              className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-gray-100 hover:text-ink md:hidden"
            >
              <ChevronLeftIcon size={18} />
            </button>
          )}
          <div className="relative">
            <Avatar name={conversation.name} size={40} />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-ink">{conversation.name}</p>
            <p className="text-xs text-emerald-600">Online · {conversation.role}</p>
          </div>
          <HeaderAction label={`Call ${conversation.name}`} onClick={() => setBanner(`Calling ${conversation.name}…`)}>
            <PhoneIcon size={17} />
          </HeaderAction>
          <HeaderAction label="Conversation details" active={showDetails} onClick={() => setShowDetails((v) => !v)}>
            <InfoIcon size={18} />
          </HeaderAction>
        </div>

        {banner && (
          <div className="border-b border-brand-50 bg-brand-50 px-5 py-2 text-center text-sm font-medium text-brand">
            {banner}
          </div>
        )}

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto bg-gray-50/50 px-4 py-5">
          <div className="mx-auto max-w-2xl">
            <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Today
            </p>
            <AsyncBoundary state={state} loadingMessage="Loading messages…" errorMessage="Failed to load messages.">
              {(history) => (
                <div className="space-y-2.5">
                  {[...history, ...(sent as ChatItem[])].map((m) => {
                    const item = m as ChatItem;
                    return (
                      <div
                        key={item.id}
                        className={`flex ${item.fromMe ? 'justify-end' : 'justify-start'} ${
                          sentIds.has(item.id) ? 'tn-rise' : ''
                        }`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                            item.fromMe
                              ? 'rounded-br-md bg-brand text-white'
                              : 'rounded-bl-md border border-gray-100 bg-white text-ink'
                          }`}
                        >
                          {item.audioUrl ? (
                            <VoicePlayer url={item.audioUrl} duration={item.duration ?? 0} mine={item.fromMe} />
                          ) : (
                            <p className="whitespace-pre-wrap break-words">{item.text}</p>
                          )}
                          <span className={`mt-1 block text-right text-[10px] ${item.fromMe ? 'text-white/70' : 'text-muted'}`}>
                            {item.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </AsyncBoundary>
          </div>
        </div>

        <Composer
          onSendText={send}
          onSendVoice={(audioUrl, duration) => append({ text: '', audioUrl, duration })}
          onAttach={(file) => append({ text: `📎 ${file.name}` })}
          onNotice={setBanner}
        />
      </div>

      {showDetails && (
        <ThreadDetails conversation={conversation} onCall={() => setBanner(`Calling ${conversation.name}…`)} />
      )}
    </Card>
  );
}
