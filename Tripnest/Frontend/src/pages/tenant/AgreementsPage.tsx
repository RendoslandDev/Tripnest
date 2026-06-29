import { useState } from 'react';
import type { Agreement, AgreementStatus } from '../../types';
import { getAgreements } from '../../api/agreements';
import { useAsync } from '../../hooks/useAsync';
import AsyncBoundary from '../../components/AsyncBoundary';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge, { type BadgeTone } from '../../components/ui/Badge';
import { formatCedi } from '../../lib/format';
import { FileIcon } from '../../components/tenant/icons';

const STATUS: Record<AgreementStatus, { tone: BadgeTone; label: string }> = {
  active: { tone: 'green', label: 'Active' },
  pending: { tone: 'amber', label: 'Pending signature' },
  expired: { tone: 'gray', label: 'Expired' },
};

/** Render an agreement as plain text and trigger a browser download. */
function downloadAgreement(a: Agreement) {
  const body = [
    'TRIPNEST TENANCY AGREEMENT',
    '==========================',
    `Reference: ${a.id}`,
    `Property:  ${a.property}`,
    `Landlord:  ${a.landlord}`,
    `Term:      ${a.startDate} – ${a.endDate}`,
    `Rent:      GH₵ ${a.rent.toLocaleString('en-GH')} / ${a.period}`,
    `Status:    ${STATUS[a.status].label}`,
  ].join('\n');
  const url = URL.createObjectURL(new Blob([body], { type: 'text/plain' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${a.id}-agreement.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

function AgreementsView({ initial }: { initial: Agreement[] }) {
  const [rows, setRows] = useState(initial);

  const sign = (id: string) =>
    setRows((rs) => rs.map((a) => (a.id === id ? { ...a, status: 'active' } : a)));

  return (
    <div className="space-y-4">
      {rows.map((a) => (
        <Card key={a.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand">
            <FileIcon size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-ink">{a.property}</h3>
              <Badge tone={STATUS[a.status].tone}>{STATUS[a.status].label}</Badge>
            </div>
            <p className="text-xs text-muted">{a.id} · Landlord: {a.landlord}</p>
            <p className="mt-1 text-sm text-muted">
              {a.startDate} – {a.endDate} · {formatCedi(a.rent)} / {a.period}
            </p>
          </div>
          <div className="flex gap-2">
            {a.status === 'pending' ? (
              <>
                <Button size="sm" onClick={() => sign(a.id)}>Review &amp; sign</Button>
                <Button size="sm" variant="ghost" onClick={() => downloadAgreement(a)}>Download</Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="ghost" onClick={() => downloadAgreement(a)}>View</Button>
                <Button size="sm" variant="ghost" onClick={() => downloadAgreement(a)}>Download</Button>
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function AgreementsPage() {
  const state = useAsync(getAgreements, []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-ink">Agreements</h1>

      <AsyncBoundary
        state={state}
        loadingMessage="Loading agreements…"
        errorMessage="Failed to load agreements."
        emptyMessage="You have no agreements yet."
        isEmpty={(rows) => rows.length === 0}
      >
        {(rows) => <AgreementsView initial={rows} />}
      </AsyncBoundary>
    </div>
  );
}
