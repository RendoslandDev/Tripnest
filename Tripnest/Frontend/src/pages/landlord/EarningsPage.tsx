import { useEffect, useState } from 'react';
import type { EarningsSummary, EarningStatus } from '../../types';
import { getEarnings } from '../../api/earnings';
import { useAsync } from '../../hooks/useAsync';
import AsyncBoundary from '../../components/AsyncBoundary';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge, { type BadgeTone } from '../../components/ui/Badge';
import { formatCedi } from '../../lib/format';
import { CardIcon, ClockIcon, ChevronRightIcon } from '../../components/tenant/icons';

const TXN_STATUS: Record<EarningStatus, { tone: BadgeTone; label: string }> = {
  settled: { tone: 'green', label: 'Settled' },
  pending: { tone: 'amber', label: 'Pending' },
};

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </Card>
  );
}

function Earnings({ data }: { data: EarningsSummary }) {
  const [available, setAvailable] = useState(data.available);
  const [banner, setBanner] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 3000);
    return () => clearTimeout(t);
  }, [banner]);

  const withdraw = () => {
    if (available <= 0 || withdrawing) return;
    setWithdrawing(true);
    // Mock provider transfer; real impl: POST /landlord/payouts (Paystack transfer).
    setTimeout(() => {
      setBanner(`${formatCedi(available)} is on its way to your MTN MoMo account.`);
      setAvailable(0);
      setWithdrawing(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Earnings</h1>
        <p className="mt-1 text-muted">Track payouts and settled bookings across your portfolio.</p>
      </div>

      {banner && (
        <div className="rounded-xl border border-brand-50 bg-brand-50 px-4 py-3 text-sm font-medium text-brand">
          {banner}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Available balance" value={formatCedi(available)} />
        <Stat label="Pending" value={formatCedi(data.pending)} hint="Clears after check-in" />
        <Stat label="This month" value={formatCedi(data.thisMonth)} />
        <Stat label="Lifetime" value={formatCedi(data.lifetime)} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="min-w-0 overflow-x-auto">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="font-bold text-ink">Recent transactions</h2>
          </div>
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-y border-gray-100 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-semibold">Booking</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Gross</th>
                <th className="px-5 py-3 font-semibold">Fee</th>
                <th className="px-5 py-3 font-semibold">Net</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.transactions.map((t) => (
                <tr key={t.id}>
                  <td className="px-5 py-4">
                    <span className="font-medium text-ink">{t.guest}</span>
                    <span className="block text-xs text-muted">{t.listing} · {t.id}</span>
                  </td>
                  <td className="px-5 py-4 text-muted">{t.date}</td>
                  <td className="px-5 py-4 text-muted">{formatCedi(t.gross)}</td>
                  <td className="px-5 py-4 text-muted">−{formatCedi(t.fee)}</td>
                  <td className="px-5 py-4 font-semibold text-ink">{formatCedi(t.net)}</td>
                  <td className="px-5 py-4">
                    <Badge tone={TXN_STATUS[t.status].tone}>{TXN_STATUS[t.status].label}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <aside className="space-y-5">
          <Card className="bg-brand p-5 text-white">
            <p className="text-sm text-white/80">Available to withdraw</p>
            <p className="mt-1 text-3xl font-bold">{formatCedi(available)}</p>
            <Button
              className="mt-4 w-full bg-white text-brand hover:bg-white/90"
              onClick={withdraw}
              disabled={available <= 0 || withdrawing}
            >
              {withdrawing ? 'Processing…' : 'Withdraw to MoMo'}
            </Button>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand">
                <ClockIcon size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Next payout</p>
                <p className="text-xs text-muted">{data.nextPayoutDate}</p>
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-ink">{formatCedi(data.pending)}</p>
            <p className="text-xs text-muted">Auto-paid on the 1st of each month.</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand">
                <CardIcon size={18} />
              </span>
              <p className="text-sm font-semibold text-ink">Payout method</p>
            </div>
            <p className="mt-3 text-sm font-medium text-ink">MTN MoMo · •••• 4567</p>
            <Button variant="ghost" size="sm" className="mt-2 gap-1 px-0 hover:bg-transparent">
              Change method <ChevronRightIcon size={14} />
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}

export default function EarningsPage() {
  const state = useAsync(getEarnings, []);
  return (
    <AsyncBoundary state={state} loadingMessage="Loading earnings…" errorMessage="Failed to load earnings.">
      {(data) => <Earnings data={data} />}
    </AsyncBoundary>
  );
}
