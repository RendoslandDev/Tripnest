import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import type { PaymentChannel, Property } from '../../types';
import { getPropertyById } from '../../api/properties';
import { initiatePayment, verifyPayment, attachBooking, type MomoNetwork } from '../../api/payments';
import { useAsync } from '../../hooks/useAsync';
import AsyncBoundary from '../../components/AsyncBoundary';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatCedi, formatDateShort } from '../../lib/format';
import { createBooking, quotePrice } from '../../store/bookingStore';
import { currentUser } from '../../data/user';
import type { BookingSelection } from '../../components/tenant/BookingWidget';
import { CalendarIcon, MapPinIcon, ShieldIcon, UserIcon } from '../../components/tenant/icons';

type PayPhase = 'idle' | 'initiating' | 'awaiting' | 'verifying';

const PAYMENT_METHODS = [
  { id: 'momo', label: 'Mobile Money', hint: 'MTN, Telecel, AirtelTigo' },
  { id: 'card', label: 'Debit / Credit card', hint: 'Visa or Mastercard' },
] as const;

const MOMO_NETWORKS: { id: MomoNetwork; label: string }[] = [
  { id: 'mtn', label: 'MTN MoMo' },
  { id: 'telecel', label: 'Telecel Cash' },
  { id: 'airteltigo', label: 'AirtelTigo Money' },
];

/** Ghana MoMo numbers are 10 digits (e.g. 024XXXXXXX). */
function isValidMomo(num: string): boolean {
  return /^0\d{9}$/.test(num.replace(/\s/g, ''));
}

function defaultSelection(property: Property): BookingSelection {
  const today = new Date();
  const out = new Date(today);
  out.setDate(out.getDate() + (property.period === 'month' ? 30 : 7));
  return {
    checkInISO: today.toISOString().slice(0, 10),
    checkOutISO: out.toISOString().slice(0, 10),
    guests: 2,
  };
}

function Review({ property }: { property: Property }) {
  const location = useLocation();
  const navigate = useNavigate();
  const selection = (location.state as BookingSelection | null) ?? defaultSelection(property);
  const quote = quotePrice(property, selection.checkInISO, selection.checkOutISO);

  const [method, setMethod] = useState<PaymentChannel>('momo');
  const [momoNetwork, setMomoNetwork] = useState<MomoNetwork>('mtn');
  const [momoNumber, setMomoNumber] = useState('');
  const [phase, setPhase] = useState<PayPhase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const submitting = phase !== 'idle';
  const momoReady = method !== 'momo' || isValidMomo(momoNumber);
  const canPay = quote.nights > 0 && momoReady && !submitting;

  // Charge first; only write the booking once the payment verifies as successful.
  const confirm = async () => {
    setError(null);
    if (method === 'momo' && !isValidMomo(momoNumber)) {
      setError('Enter a valid 10-digit Mobile Money number.');
      return;
    }
    try {
      setPhase('initiating');
      const intent = await initiatePayment({
        amount: quote.total,
        channel: method,
        email: currentUser.email,
        ...(method === 'momo' && { momoNumber, momoNetwork }),
      });

      // MoMo: the payer approves a prompt on their phone. Card: provider auth.
      setPhase(method === 'momo' ? 'awaiting' : 'verifying');
      const txn = await verifyPayment(intent.reference);
      if (txn.status !== 'success') throw new Error('Payment was not completed.');

      const booking = createBooking({
        property,
        checkInISO: selection.checkInISO,
        checkOutISO: selection.checkOutISO,
        guests: selection.guests,
      });
      attachBooking(intent.reference, booking.id);
      setConfirmedId(booking.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed. Please try again.');
    } finally {
      setPhase('idle');
    }
  };

  const payLabel =
    phase === 'initiating'
      ? 'Starting payment…'
      : phase === 'awaiting'
        ? 'Approve on your phone…'
        : phase === 'verifying'
          ? 'Verifying payment…'
          : `Confirm & pay ${formatCedi(quote.total)}`;

  if (confirmedId) {
    return (
      <Card className="mx-auto max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand">
          <ShieldIcon size={26} />
        </div>
        <h1 className="text-2xl font-bold text-ink">Booking confirmed</h1>
        <p className="mt-2 text-muted">
          Your reservation at <span className="font-semibold text-ink">{property.title}</span> is
          booked. Reference <span className="font-semibold text-ink">{confirmedId}</span>.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={() => navigate('/bookings')}>View my bookings</Button>
          <Link to="/search" className="text-sm font-semibold text-brand no-underline">
            Keep browsing
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to={`/property/${property.id}`} className="text-sm font-semibold text-brand no-underline">
        ← Back to listing
      </Link>
      <h1 className="mt-4 mb-6 text-3xl font-bold text-ink">Review &amp; pay</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-3 text-lg font-bold text-ink">Your trip</h2>
            <div className="space-y-2 text-sm text-ink">
              <p className="flex items-center gap-2">
                <CalendarIcon size={15} className="text-brand" />
                {formatDateShort(selection.checkInISO)} → {formatDateShort(selection.checkOutISO)}
                <span className="text-muted">
                  · {quote.nights} night{quote.nights > 1 ? 's' : ''}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <UserIcon size={15} className="text-brand" />
                {selection.guests} guest{selection.guests > 1 ? 's' : ''}
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="mb-3 text-lg font-bold text-ink">Pay with</h2>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                    method === m.id ? 'border-brand bg-brand-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={method === m.id}
                    onChange={() => setMethod(m.id as PaymentChannel)}
                    className="h-4 w-4 accent-brand"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ink">{m.label}</span>
                    <span className="block text-xs text-muted">{m.hint}</span>
                  </span>
                </label>
              ))}
            </div>

            {method === 'momo' && (
              <div className="mt-4 space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-ink">Network</span>
                  <div className="flex flex-wrap gap-2">
                    {MOMO_NETWORKS.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => setMomoNetwork(n.id)}
                        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                          momoNetwork === n.id
                            ? 'border-brand bg-brand-50 text-brand'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">Mobile Money number</span>
                  <input
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    inputMode="tel"
                    placeholder="024 123 4567"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
                  />
                  {momoNumber !== '' && !isValidMomo(momoNumber) && (
                    <span className="mt-1 block text-xs text-rose-600">Enter a valid 10-digit number.</span>
                  )}
                </label>
                <p className="text-xs text-muted">
                  You'll get a prompt on this number to approve the payment.
                </p>
              </div>
            )}
          </Card>
        </div>

        <aside>
          <Card className="sticky top-20 p-5">
            <div className="flex gap-3">
              <div className="h-16 w-20 shrink-0 rounded-lg bg-gradient-to-br from-brand-50 to-gray-200" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{property.title}</p>
                <p className="flex items-center gap-1 text-xs text-muted">
                  <MapPinIcon size={12} /> {property.location}
                </p>
                {property.verified && (
                  <Badge tone="green" className="mt-1">
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between text-muted">
                <span>
                  {formatCedi(quote.perNight)} × {quote.nights} night{quote.nights > 1 ? 's' : ''}
                </span>
                <span className="text-ink">{formatCedi(quote.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Service fee</span>
                <span className="text-ink">{formatCedi(quote.serviceFee)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-ink">
                <span>Total</span>
                <span>{formatCedi(quote.total)}</span>
              </div>
            </div>

            <Button className="mt-4 w-full" onClick={confirm} disabled={!canPay}>
              {payLabel}
            </Button>
            {error && (
              <p className="mt-2 text-center text-xs text-rose-600" role="alert">
                {error}
              </p>
            )}
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
              <ShieldIcon size={13} className="text-brand" /> You won't be charged in this demo
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { id = '' } = useParams();
  const state = useAsync(() => getPropertyById(id), [id]);

  return (
    <AsyncBoundary
      state={state}
      loadingMessage="Loading checkout…"
      errorMessage="Failed to load checkout."
    >
      {(property) =>
        property ? (
          <Review property={property} />
        ) : (
          <div>
            <p className="text-muted">Property not found.</p>
            <Link to="/search" className="text-sm font-semibold text-brand no-underline">
              ← Back to search
            </Link>
          </div>
        )
      }
    </AsyncBoundary>
  );
}
