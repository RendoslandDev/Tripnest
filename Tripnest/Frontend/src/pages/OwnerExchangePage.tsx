import { useState } from 'react';
import type { ExchangeCategory, ExchangePost } from '../types';
import { getExchangePosts } from '../api/exchange';
import { useAsync } from '../hooks/useAsync';
import AsyncBoundary from '../components/AsyncBoundary';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';

const CATEGORIES: ExchangeCategory[] = [
  'General',
  'Tips',
  'Suppliers',
  'Regulation',
  'Marketplace',
];

function Composer({ onPost }: { onPost: (title: string, body: string, category: ExchangeCategory) => void }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<ExchangeCategory>('General');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    onPost(title.trim(), body.trim(), category);
    setTitle('');
    setBody('');
    setCategory('General');
  };

  return (
    <Card className="mb-6 p-5">
      <form onSubmit={submit} className="space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Start a discussion…"
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share details, ask a question, or recommend a supplier."
          rows={3}
          className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand"
        />
        <div className="flex items-center justify-between gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExchangeCategory)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Button type="submit">Post</Button>
        </div>
      </form>
    </Card>
  );
}

function PostCard({ post }: { post: ExchangePost }) {
  const [replies, setReplies] = useState(post.replies);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const sendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setReplies((r) => r + 1);
    setDraft('');
    setOpen(false);
  };

  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <Avatar name={post.author} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink">{post.author}</span>
            <span className="text-xs text-muted">· {post.role}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-ink">{post.title}</h3>
            {post.pinned && <Badge tone="amber">Pinned</Badge>}
            <Badge tone="blue">{post.category}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted">{post.body}</p>
          <div className="mt-3 flex items-center gap-4 text-sm text-muted">
            <span>{replies} replies</span>
            <span>·</span>
            <span>{post.createdAt}</span>
            <button onClick={() => setOpen((o) => !o)} className="ml-auto font-semibold text-brand hover:underline">
              Reply
            </button>
          </div>
          {open && (
            <form onSubmit={sendReply} className="mt-3 flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a reply…"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand"
              />
              <Button type="submit" size="sm">Send</Button>
            </form>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function OwnerExchangePage() {
  const state = useAsync(getExchangePosts, []);
  const [added, setAdded] = useState<ExchangePost[]>([]);

  const addPost = (title: string, body: string, category: ExchangeCategory) => {
    setAdded((prev) => [
      {
        id: Date.now(),
        author: 'You',
        role: 'Host',
        initials: 'YO',
        title,
        body,
        category,
        replies: 0,
        createdAt: 'Just now',
        pinned: false,
      },
      ...prev,
    ]);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-4xl font-bold text-ink">Owner Exchange</h1>

      <Composer onPost={addPost} />

      <AsyncBoundary
        state={state}
        loadingMessage="Loading discussions…"
        errorMessage="Failed to load discussions."
      >
        {(rows) => {
          const all = [...added, ...rows].sort(
            (a, b) => Number(b.pinned) - Number(a.pinned),
          );
          return (
            <div className="space-y-4">
              {all.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          );
        }}
      </AsyncBoundary>
    </div>
  );
}
