import { useState } from 'react';
import type { ChatMessage, Conversation } from '../../types';
import { getConversations, getMessages } from '../../api/messages';
import { useAsync } from '../../hooks/useAsync';
import AsyncBoundary from '../../components/AsyncBoundary';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import { SendIcon } from '../../components/tenant/icons';

function Thread({ conversation }: { conversation: Conversation }) {
  const state = useAsync(() => getMessages(conversation.id), [conversation.id]);
  const [sent, setSent] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setSent((s) => [...s, { id: Date.now(), fromMe: true, text, time: 'Now' }]);
    setDraft('');
  };

  return (
    <Card className="flex h-[560px] flex-col">
      <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-3">
        <Avatar name={conversation.name} size={40} />
        <div>
          <p className="font-semibold text-ink">{conversation.name}</p>
          <p className="text-xs text-muted">{conversation.role}</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        <AsyncBoundary state={state} loadingMessage="Loading messages…" errorMessage="Failed to load messages.">
          {(history) =>
            [...history, ...sent].map((m) => (
              <div key={m.id} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    m.fromMe ? 'bg-brand text-white' : 'bg-gray-100 text-ink'
                  }`}
                >
                  {m.text}
                  <span className={`mt-1 block text-[10px] ${m.fromMe ? 'text-white/70' : 'text-muted'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))
          }
        </AsyncBoundary>
      </div>

      <div className="flex items-center gap-2 border-t border-gray-100 p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a message…"
          className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm text-ink outline-none focus:border-brand"
        />
        <button
          onClick={send}
          aria-label="Send"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white hover:bg-brand/90"
        >
          <SendIcon size={18} />
        </button>
      </div>
    </Card>
  );
}

function MessagesView({ conversations }: { conversations: Conversation[] }) {
  const [selectedId, setSelectedId] = useState(conversations[0]?.id);
  const current = conversations.find((c) => c.id === selectedId) ?? conversations[0];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[300px_1fr]">
      <Card className="divide-y divide-gray-100 overflow-hidden">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
              c.id === current?.id ? 'bg-brand-50' : 'hover:bg-gray-50'
            }`}
          >
            <Avatar name={c.name} size={40} />
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between">
                <span className="truncate text-sm font-semibold text-ink">{c.name}</span>
                <span className="text-xs text-muted">{c.time}</span>
              </span>
              <span className="block truncate text-xs text-muted">{c.lastMessage}</span>
            </span>
            {c.unread > 0 && (
              <span className="rounded-full bg-brand px-1.5 text-[11px] font-semibold text-white">
                {c.unread}
              </span>
            )}
          </button>
        ))}
      </Card>

      {current && <Thread key={current.id} conversation={current} />}
    </div>
  );
}

export default function MessagesPage() {
  const state = useAsync(getConversations, []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-ink">Messages</h1>
      <AsyncBoundary
        state={state}
        loadingMessage="Loading conversations…"
        errorMessage="Failed to load conversations."
        emptyMessage="No conversations yet."
        isEmpty={(rows) => rows.length === 0}
      >
        {(rows) => <MessagesView conversations={rows} />}
      </AsyncBoundary>
    </div>
  );
}
