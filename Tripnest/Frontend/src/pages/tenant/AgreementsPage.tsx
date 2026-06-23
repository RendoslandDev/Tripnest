import type { AgreementStatus } from '../../types';
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
        {(rows) => (
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
                    <Button size="sm">Review &amp; sign</Button>
                  ) : (
                    <>
                      <Button size="sm" variant="ghost">View</Button>
                      <Button size="sm" variant="ghost">Download</Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </AsyncBoundary>
    </div>
  );
}
