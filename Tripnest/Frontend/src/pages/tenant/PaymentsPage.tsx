import { useEffect, useState } from 'react';
import type { Payment, PaymentChannel, PaymentMethod, PaymentStatus } from '../../types';
import { getPayments, getPaymentMethods, initiatePayment, verifyPayment } from '../../api/payments';
import { useAsync } from '../../hooks/useAsync';
import AsyncBoundary from '../../components/AsyncBoundary';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge, { type BadgeTone } from '../../components/ui/Badge';
import { formatCedi } from '../../lib/format';
import { currentUser } from '../../data/user';
import { CardIcon, PlusIcon } from '../../components/tenant/icons';

const STATUS: Record<PaymentStatus, { tone: BadgeTone; label: string }> = {
  paid: { tone: 'green', label: 'Paid' },
  due: { tone: 'amber', label: 'Due' },
  upcoming: { tone: 'gray', label: 'Upcoming' },
};

/** Infer the provider channel so the charge routes correctly. */
function channelFor(method: PaymentMethod | undefined): PaymentChannel {
  return method && /card|visa|master/i.test(method.provider) ? 'card' : 'momo';
}

function AddMethodForm({ onAdd }: { onAdd: (m: PaymentMethod) => void }) {
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState('MTN MoMo');
  const [number, setNumber] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = number.replace(/\D/g, '');
    if (digits.length < 4) return;
    onAdd({
      id: `PM-${Date.now()}`,
      provider,
      number: `•••• ${digits.slice(-4)}`,
      primary: false,
    });
    setNumber('');
    setOpen(false);
  };

  if (!open) {
    return (
      <Button variant="ghost" size="sm" className="mt-1 w-full" onClick={() => setOpen(true)}>
        <PlusIcon size={16} /> <span className="ml-1.5">Add method</span>
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-2 space-y-2 rounded-lg border border-gray-100 p-3">
      <select
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-ink outline-none focus:border-brand"
      >
        <option>MTN MoMo</option>
        <option>Telecel Cash</option>
        <option>AirtelTigo Money</option>
        <option>Debit Card</option>
      </select>
      <input
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        inputMode="numeric"
        placeholder="Phone or card number"
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-ink outline-none focus:border-brand"
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">Save</Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </form>
  );
}

function PaymentsView({
  initialPayments, initialMethods,
}: { initialPayments: Payment[]; initialMethods: PaymentMethod[] }) {
  const [payments, setPayments] = useState(initialPayments);
  const [methods, setMethods] = useState(initialMethods);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 3000);
    return () => clearTimeout(t);
  }, [banner]);

  const primary = methods.find((m) => m.primary) ?? methods[0];
  const nextDue = payments.find((p) => p.status === 'due');

  const pay = async (payment: Payment) => {
    setError(null);
    setPayingId(payment.id);
    try {
      const intent = await initiatePayment({
        amount: payment.amount,
        channel: channelFor(primary),
        email: currentUser.email,
      });
      const txn = await verifyPayment(intent.reference);
      if (txn.status !== 'success') throw new Error('Payment was not completed.');
      setPayments((ps) =>
        ps.map((p) =>
          p.id === payment.id ? { ...p, status: 'paid', method: primary?.provider ?? p.method } : p,
        ),
      );
      setBanner(`${formatCedi(payment.amount)} paid for ${payment.description}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed. Please try again.');
    } finally {
      setPayingId(null);
    }
  };

  const addMethod = (m: PaymentMethod) =>
    setMethods((ms) => [...ms, ms.length === 0 ? { ...m, primary: true } : m]);

  const setPrimary = (id: string) =>
    setMethods((ms) => ms.map((m) => ({ ...m, primary: m.id === id })));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-6">
        {banner && (
          <div className="rounded-xl border border-brand-50 bg-brand-50 px-4 py-3 text-sm font-medium text-brand">
            {banner}
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600" role="alert">
            {error}
          </div>
        )}

        {nextDue && (
          <Card className="flex flex-col gap-4 bg-brand p-5 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-white/80">Next payment due</p>
              <p className="text-2xl font-bold">{formatCedi(nextDue.amount)}</p>
              <p className="text-sm text-white/80">{nextDue.description} · due {nextDue.date}</p>
            </div>
            <Button
              className="bg-white text-brand hover:bg-white/90"
              onClick={() => pay(nextDue)}
              disabled={payingId === nextDue.id}
            >
              {payingId === nextDue.id ? 'Processing…' : 'Pay now'}
            </Button>
          </Card>
        )}

        <Card className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-semibold">Description</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Method</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-4">
                    <span className="font-medium text-ink">{p.description}</span>
                    <span className="block text-xs text-muted">{p.property}</span>
                  </td>
                  <td className="px-5 py-4 text-muted">{p.date}</td>
                  <td className="px-5 py-4 text-muted">{p.method}</td>
                  <td className="px-5 py-4 font-semibold text-ink">{formatCedi(p.amount)}</td>
                  <td className="px-5 py-4">
                    <Badge tone={STATUS[p.status].tone}>{STATUS[p.status].label}</Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {p.status === 'due' && (
                      <Button size="sm" onClick={() => pay(p)} disabled={payingId === p.id}>
                        {payingId === p.id ? 'Processing…' : 'Pay'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Card className="h-fit p-5">
        <h2 className="mb-3 font-bold text-ink">Payment methods</h2>
        <div className="space-y-2">
          {methods.map((m) => (
            <div key={m.id} className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand">
                <CardIcon size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ink">{m.provider}</span>
                <span className="block text-xs text-muted">{m.number}</span>
              </span>
              {m.primary ? (
                <Badge tone="green">Primary</Badge>
              ) : (
                <button
                  type="button"
                  onClick={() => setPrimary(m.id)}
                  className="text-xs font-semibold text-brand hover:underline"
                >
                  Set primary
                </button>
              )}
            </div>
          ))}
          <AddMethodForm onAdd={addMethod} />
        </div>
      </Card>
    </div>
  );
}

export default function PaymentsPage() {
  const paymentsState = useAsync(getPayments, []);
  const methodsState = useAsync(getPaymentMethods, []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-ink">Payments</h1>
      <AsyncBoundary state={paymentsState} loadingMessage="Loading payments…" errorMessage="Failed to load payments.">
        {(payments) => (
          <AsyncBoundary state={methodsState} loadingMessage="Loading payments…" errorMessage="Failed to load methods.">
            {(methods) => <PaymentsView initialPayments={payments} initialMethods={methods} />}
          </AsyncBoundary>
        )}
      </AsyncBoundary>
    </div>
  );
}
