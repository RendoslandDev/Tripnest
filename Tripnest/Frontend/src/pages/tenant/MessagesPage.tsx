import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChatMessage, Conversation } from '../../types';
import { getConversations, getMessages, markConversationRead, sendMessage } from '../../api/messages';
import { useAsync } from '../../hooks/useAsync';
import AsyncBoundary from '../../components/AsyncBoundary';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import {
  ArrowUpIcon, MicIcon, PaperclipIcon, PhoneIcon, InfoIcon, SearchIcon, ShieldIcon, StarIcon,
  PlayIcon, PauseIcon, TrashIcon,
} from '../../components/tenant/icons';

/** A thread item — extends the API message with optional recorded-audio fields. */
interface ChatItem extends ChatMessage {
  audioUrl?: string;
  /** Recorded length in seconds. */
  duration?: number;
}

/** Format a number of seconds as m:ss. */
function clock(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Inline player for a sent voice message — play/pause + progress + duration. */
function VoicePlayer({ url, duration, mine }: { url: string; duration: number; mine: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.pause();
    else void audio.play();
  };

  const progress = duration > 0 ? Math.min(1, elapsed / duration) : 0;

  return (
    <div className="flex items-center gap-2.5 py-0.5">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause voice message' : 'Play voice message'}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          mine ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-brand-50 text-brand hover:bg-brand-50/70'
        }`}
      >
        {playing ? <PauseIcon size={15} /> : <PlayIcon size={15} />}
      </button>
      <div className={`h-1 w-28 overflow-hidden rounded-full ${mine ? 'bg-white/30' : 'bg-gray-200'}`}>
        <div
          className={`h-full rounded-full ${mine ? 'bg-white' : 'bg-brand'}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className={`text-[11px] tabular-nums ${mine ? 'text-white/80' : 'text-muted'}`}>
        {clock(playing || elapsed > 0 ? elapsed : duration)}
      </span>
      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setElapsed(e.currentTarget.currentTime)}
        onEnded={() => { setPlaying(false); setElapsed(0); }}
      />
    </div>
  );
}

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

function Thread({ conversation }: { conversation: Conversation }) {
  const state = useAsync(() => getMessages(conversation.id), [conversation.id]);
  const [sent, setSent] = useState<ChatItem[]>([]);
  const [draft, setDraft] = useState('');
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const discardRef = useRef(false);

  // Keep the latest message in view as the thread grows or switches.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [sent, state.data]);

  // Auto-dismiss the transient call banner.
  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 2500);
    return () => clearTimeout(t);
  }, [banner]);

  // Stop any in-flight recording and free object URLs on unmount / thread switch.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const append = (item: Omit<ChatItem, 'id' | 'fromMe' | 'time'>) =>
    setSent((s) => [...s, { id: Date.now(), fromMe: true, time: 'Now', ...item }]);

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    // Optimistic bubble, reconciled with the saved message from the API.
    const tempId = `pending-${Date.now()}`;
    setSent((s) => [...s, { id: tempId, fromMe: true, time: 'Sending…', text }]);
    try {
      const saved = await sendMessage(conversation.id, text);
      setSent((s) => s.map((m) => (m.id === tempId ? saved : m)));
    } catch {
      setSent((s) => s.filter((m) => m.id !== tempId));
      setDraft(text); // give the user their message back to retry
      setBanner('Message failed to send.');
    }
  };

  const onAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) append({ text: `📎 ${file.name}` });
    e.target.value = '';
  };

  // Stop the recorder; `discard` decides whether the clip is sent or dropped.
  const finishRecording = (discard: boolean) => {
    discardRef.current = discard;
    recorderRef.current?.stop();
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setBanner('Recording is not supported on this device.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      discardRef.current = false;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const seconds = (Date.now() - startedAtRef.current) / 1000;
        if (!discardRef.current && chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          append({ text: '', audioUrl: URL.createObjectURL(blob), duration: seconds });
        }
        stream.getTracks().forEach((t) => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
        setRecording(false);
        setElapsed(0);
      };
      recorderRef.current = recorder;
      startedAtRef.current = Date.now();
      recorder.start();
      setRecording(true);
      setElapsed(0);
      timerRef.current = window.setInterval(
        () => setElapsed((Date.now() - startedAtRef.current) / 1000),
        200,
      );
    } catch {
      setBanner('Microphone permission denied.');
    }
  };

  return (
    <Card className="flex h-[600px] overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-3">
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
                      <div key={item.id} className={`flex ${item.fromMe ? 'justify-end' : 'justify-start'}`}>
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

        {/* Composer — reference-style rounded container */}
        <div className="border-t border-gray-100 p-3">
          <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white px-3 py-2 transition-colors focus-within:border-brand">
            {recording ? (
              <div className="flex items-center gap-3 px-1 py-1.5">
                <button
                  type="button"
                  onClick={() => finishRecording(true)}
                  aria-label="Discard recording"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-gray-100 hover:text-rose-600"
                >
                  <TrashIcon size={17} />
                </button>
                <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-rose-500" />
                <span className="text-sm font-medium tabular-nums text-ink">{clock(elapsed)}</span>
                <span className="text-sm text-muted">Recording…</span>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={() => finishRecording(false)}
                  aria-label="Send voice message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white hover:bg-brand/90"
                >
                  <ArrowUpIcon size={18} />
                </button>
              </div>
            ) : (
              <>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') void send(); }}
                  placeholder="Type a message…"
                  className="w-full bg-transparent px-1 py-1.5 text-sm text-ink outline-none placeholder:text-muted"
                />
                <div className="mt-1 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    aria-label="Attach a file"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-gray-100 hover:text-ink"
                  >
                    <PaperclipIcon size={17} />
                  </button>
                  <input ref={fileRef} type="file" className="hidden" onChange={onAttach} />

                  <div className="flex items-center gap-1.5">
                    {draft.trim() ? (
                      <button
                        type="button"
                        onClick={() => void send()}
                        aria-label="Send message"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white transition-opacity hover:bg-brand/90"
                      >
                        <ArrowUpIcon size={18} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void startRecording()}
                        aria-label="Record a voice message"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-gray-100 hover:text-ink"
                      >
                        <MicIcon size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Details panel */}
      {showDetails && (
        <aside className="hidden w-64 shrink-0 flex-col border-l border-gray-100 p-5 text-center lg:flex">
          <Avatar name={conversation.name} size={64} className="mx-auto" />
          <p className="mt-3 font-semibold text-ink">{conversation.name}</p>
          <p className="text-xs text-muted">{conversation.role}</p>
          <div className="mt-4 space-y-2 text-left">
            <p className="flex items-center gap-2 text-sm text-ink">
              <ShieldIcon size={15} className="text-brand" /> Verified {conversation.role.toLowerCase()}
            </p>
            <p className="flex items-center gap-2 text-sm text-ink">
              <StarIcon size={15} className="text-amber-400" /> 4.9 · responds in ~1h
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBanner(`Calling ${conversation.name}…`)}
            className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-brand-50 py-2 text-sm font-semibold text-brand hover:bg-brand-50/70"
          >
            <PhoneIcon size={15} /> Call
          </button>
        </aside>
      )}
    </Card>
  );
}

function MessagesView({ conversations }: { conversations: Conversation[] }) {
  const [rows, setRows] = useState(conversations);
  const [selectedId, setSelectedId] = useState(conversations[0]?.id);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? rows.filter((c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)) : rows;
  }, [rows, query]);

  const current = rows.find((c) => c.id === selectedId) ?? rows[0];

  const open = (id: string | number) => {
    setSelectedId(id);
    // Opening a conversation clears its unread state locally and server-side.
    const wasUnread = rows.some((c) => c.id === id && c.unread > 0);
    setRows((rs) => rs.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    if (wasUnread) markConversationRead(id).catch(() => {});
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[320px_1fr]">
      <Card className="flex max-h-[600px] flex-col overflow-hidden">
        <div className="relative border-b border-gray-100 p-3">
          <span className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-muted">
            <SearchIcon size={16} />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations…"
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-ink outline-none focus:border-brand"
          />
        </div>
        <div className="flex-1 divide-y divide-gray-100 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted">No conversations found.</p>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => open(c.id)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                  c.id === current?.id ? 'bg-brand-50' : 'hover:bg-gray-50'
                }`}
              >
                <Avatar name={c.name} size={40} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between">
                    <span className="truncate text-sm font-semibold text-ink">{c.name}</span>
                    <span className="shrink-0 pl-2 text-xs text-muted">{c.time}</span>
                  </span>
                  <span className="block truncate text-xs text-muted">{c.lastMessage}</span>
                </span>
                {c.unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-semibold text-white">
                    {c.unread}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </Card>

      {current && <Thread key={current.id} conversation={current} />}
    </div>
  );
}

export default function MessagesPage() {
  const state = useAsync(getConversations, []);

  return (
    <div>
      <h1 className="mb-1 text-3xl font-bold text-ink">Messages</h1>
      <p className="mb-6 text-muted">Chat with agents, caretakers and support in real time.</p>
      <AsyncBoundary
        state={state}
        loadingMessage="Loading conversations…"
        errorMessage="Failed to load conversations."
        emptyMessage="No conversations yet."
        isEmpty={(r) => r.length === 0}
      >
        {(r) => <MessagesView conversations={r} />}
      </AsyncBoundary>
    </div>
  );
}
