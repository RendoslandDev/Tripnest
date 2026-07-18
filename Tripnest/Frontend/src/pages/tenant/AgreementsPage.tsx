import { useState } from 'react';
import type { Agreement, AgreementStatus } from '../../types';
import {
  downloadAgreementPdf, getAgreements, getAgreementSummary, signAgreement, type AgreementSummary,
} from '../../api/agreements';
import { useAsync } from '../../hooks/useAsync';
import AsyncBoundary from '../../components/AsyncBoundary';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge, { type BadgeTone } from '../../components/ui/Badge';
import { formatCedi } from '../../lib/format';
import { useT } from '../../lib/i18n';
import { FileIcon } from '../../components/tenant/icons';

const STATUS: Record<AgreementStatus, { tone: BadgeTone; label: string }> = {
  active: { tone: 'green', label: 'Active' },
  pending: { tone: 'amber', label: 'Pending signature' },
  expired: { tone: 'gray', label: 'Expired' },
};

function AgreementsView({ initial }: { initial: Agreement[] }) {
  const [rows, setRows] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [summary, setSummary] = useState<{ id: string; data: AgreementSummary } | null>(null);

  // Signing stamps the caller's stored profile signature onto the document server-side.
  const sign = async (id: string) => {
    setBusyId(id);
    setNote(null);
    try {
      await signAgreement(id);
      setRows((rs) => rs.map((a) => (a.id === id ? { ...a, status: 'active' } : a)));
      setNote('Signed. Your stored signature has been applied to the document.');
    } catch (e) {
      // The common rejection: no signature image on the profile yet.
      setNote(e instanceof Error ? e.message : 'Could not sign the agreement.');
    } finally {
      setBusyId(null);
    }
  };

  const download = async (id: string) => {
    setBusyId(id);
    setNote(null);
    try {
      await downloadAgreementPdf(id);
    } catch {
      setNote('Could not download the agreement PDF.');
    } finally {
      setBusyId(null);
    }
  };

  const explain = async (id: string) => {
    if (summary?.id === id) { setSummary(null); return; }
    setBusyId(id);
    setNote(null);
    try {
      setSummary({ id, data: await getAgreementSummary(id) });
    } catch (e) {
      setNote(e instanceof Error ? e.message : 'The AI explanation is unavailable right now.');
    } finally {
      setBusyId(null);
    }
  };

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
          <div className="flex flex-wrap gap-2">
            {a.status === 'pending' && (
              <Button size="sm" disabled={busyId === a.id} onClick={() => { void sign(a.id); }}>
                {busyId === a.id ? 'Signing…' : 'Review & sign'}
              </Button>
            )}
            <Button size="sm" variant="ghost" disabled={busyId === a.id} onClick={() => { void explain(a.id); }}>
              {summary?.id === a.id ? 'Hide explanation' : 'Explain'}
            </Button>
            <Button size="sm" variant="ghost" disabled={busyId === a.id} onClick={() => { void download(a.id); }}>
              Download PDF
            </Button>
          </div>
        </Card>
      ))}

      {summary && (
        <Card className="space-y-3 p-5">
          <h3 className="font-semibold text-ink">What this agreement says</h3>
          <p className="text-sm text-ink">{summary.data.summary}</p>
          {summary.data.keyTerms.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-ink">Key terms</h4>
              <ul className="mt-1 list-disc pl-5 text-sm text-muted">
                {summary.data.keyTerms.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          )}
          {summary.data.yourObligations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-ink">Your obligations</h4>
              <ul className="mt-1 list-disc pl-5 text-sm text-muted">
                {summary.data.yourObligations.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          )}
          <p className="text-xs text-muted">{summary.data.disclaimer}</p>
        </Card>
      )}

      {note && <p className="text-sm text-muted">{note}</p>}
    </div>
  );
}

export default function AgreementsPage() {
  const state = useAsync(getAgreements, []);
  const t = useT();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-ink">Agreements</h1>

      <AsyncBoundary
        state={state}
        loadingMessage="Loading agreements…"
        errorMessage="Failed to load agreements."
        emptyMessage={t('You have no agreements yet.')}
        isEmpty={(rows) => rows.length === 0}
      >
        {(rows) => <AgreementsView initial={rows} />}
      </AsyncBoundary>
    </div>
  );
}
