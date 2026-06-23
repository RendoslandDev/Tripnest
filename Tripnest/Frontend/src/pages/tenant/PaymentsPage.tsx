import type { PaymentStatus } from '../../types';
import { getPayments, getPaymentMethods } from '../../api/payments';
import { useAsync } from '../../hooks/useAsync';
import AsyncBoundary from '../../components/AsyncBoundary';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge, { type BadgeTone } from '../../components/ui/Badge';
import { formatCedi } from '../../lib/format';
import { CardIcon, PlusIcon } from '../../components/tenant/icons';

const STATUS: Record<PaymentStatus, { tone: BadgeTone; label: string }> = {
  paid: { tone: 'green', label: 'Paid' },
  due: { tone: 'amber', label: 'Due' },
  upcoming: { tone: 'gray', label: 'Upcoming' },
};

function PaymentMethods() {
  const state = useAsync(getPaymentMethods, []);
  return (
    <Card className="p-5">
      <h2 className="mb-3 font-bold text-ink">Payment methods</h2>
      <AsyncBoundary state={state} loadingMessage="Loading…" errorMessage="Failed to load methods.">
        {(methods) => (
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
                {m.primary && <Badge tone="green">Primary</Badge>}
              </div>
            ))}
            <Button variant="ghost" size="sm" className="mt-1 w-full">
              <PlusIcon size={16} /> <span className="ml-1.5">Add method</span>
            </Button>
          </div>
        )}
      </AsyncBoundary>
    </Card>
  );
}

export default function PaymentsPage() {
  const state = useAsync(getPayments, []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-ink">Payments</h1>

      <AsyncBoundary state={state} loadingMessage="Loading payments…" errorMessage="Failed to load payments.">
        {(payments) => {
          const nextDue = payments.find((p) => p.status === 'due');
          return (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
              <div className="min-w-0 space-y-6">
                {nextDue && (
                  <Card className="flex flex-col gap-4 bg-brand p-5 text-white sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-white/80">Next payment due</p>
                      <p className="text-2xl font-bold">{formatCedi(nextDue.amount)}</p>
                      <p className="text-sm text-white/80">{nextDue.description} · due {nextDue.date}</p>
                    </div>
                    <Button className="bg-white text-brand hover:bg-white/90">Pay now</Button>
                  </Card>
                )}

                <Card className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-muted">
                        <th className="px-5 py-3 font-semibold">Description</th>
                        <th className="px-5 py-3 font-semibold">Date</th>
                        <th className="px-5 py-3 font-semibold">Method</th>
                        <th className="px-5 py-3 font-semibold">Amount</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>

              <PaymentMethods />
            </div>
          );
        }}
      </AsyncBoundary>
    </div>
  );
}
