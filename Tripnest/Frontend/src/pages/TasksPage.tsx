import { useMemo, useState } from 'react';
import type { HostTask, TaskPriority, TaskStatus } from '../types';
import { getHostTasks } from '../api/hostTasks';
import { useAsync } from '../hooks/useAsync';
import AsyncBoundary from '../components/AsyncBoundary';
import Card from '../components/ui/Card';
import Badge, { type BadgeTone } from '../components/ui/Badge';

const PRIORITY_TONE: Record<TaskPriority, BadgeTone> = {
  high: 'red',
  medium: 'amber',
  low: 'gray',
};

const FILTERS: { id: TaskStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'todo', label: 'To do' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'done', label: 'Done' },
];

function TaskRow({
  task,
  done,
  onToggle,
}: {
  task: HostTask;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="flex items-center gap-4 px-6 py-4">
      <input
        type="checkbox"
        checked={done}
        onChange={onToggle}
        className="h-4 w-4 shrink-0 accent-brand"
      />
      <div className="min-w-0 flex-1">
        <p className={`truncate font-semibold ${done ? 'text-muted line-through' : 'text-ink'}`}>
          {task.title}
        </p>
        <p className="text-sm text-muted">
          {task.property} · {task.assignee}
        </p>
      </div>
      <span className="hidden text-sm text-muted sm:block">{task.dueDate}</span>
      <Badge tone={PRIORITY_TONE[task.priority]}>{task.priority}</Badge>
    </li>
  );
}

export default function TasksPage() {
  const state = useAsync(getHostTasks, []);
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [overrides, setOverrides] = useState<Record<number, boolean>>({});

  const toggle = (id: number, current: boolean) =>
    setOverrides((o) => ({ ...o, [id]: !current }));

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-ink">Tasks</h1>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              filter === f.id
                ? 'bg-ink text-white'
                : 'bg-gray-100 text-muted hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <AsyncBoundary
        state={state}
        loadingMessage="Loading tasks…"
        errorMessage="Failed to load tasks."
        emptyMessage="No tasks yet."
        isEmpty={(rows) => rows.length === 0}
      >
        {(rows) => <TaskList rows={rows} filter={filter} overrides={overrides} onToggle={toggle} />}
      </AsyncBoundary>
    </div>
  );
}

function TaskList({
  rows,
  filter,
  overrides,
  onToggle,
}: {
  rows: HostTask[];
  filter: TaskStatus | 'all';
  overrides: Record<number, boolean>;
  onToggle: (id: number, current: boolean) => void;
}) {
  const isDone = (t: HostTask) => overrides[t.id] ?? t.status === 'done';

  const visible = useMemo(() => {
    if (filter === 'all') return rows;
    if (filter === 'done') return rows.filter(isDone);
    return rows.filter((t) => !isDone(t) && t.status === filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, filter, overrides]);

  if (visible.length === 0) return <p className="text-muted">Nothing here.</p>;

  return (
    <Card>
      <ul className="divide-y divide-gray-100">
        {visible.map((t) => (
          <TaskRow key={t.id} task={t} done={isDone(t)} onToggle={() => onToggle(t.id, isDone(t))} />
        ))}
      </ul>
    </Card>
  );
}
