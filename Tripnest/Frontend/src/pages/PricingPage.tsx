import { useState } from 'react';
import type { PricingSettings } from '../types';
import { getPricingSettings, savePricingSettings } from '../api/pricing';
import { useAsync } from '../hooks/useAsync';
import AsyncBoundary from '../components/AsyncBoundary';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

function Field({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <div className="flex items-center rounded-lg border border-gray-200 px-3 focus-within:border-brand">
        {prefix && <span className="text-muted">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent px-2 py-2.5 text-ink outline-none"
        />
        {suffix && <span className="text-muted">{suffix}</span>}
      </div>
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-bold text-ink">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </Card>
  );
}

function PricingForm({ initial }: { initial: PricingSettings }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof PricingSettings) => (value: number) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const onSave = async () => {
    setSaving(true);
    await savePricingSettings(form);
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <Section title="Nightly rates">
        <Field label="Base rate" prefix="$" value={form.baseRate} onChange={set('baseRate')} />
        <Field label="Weekend rate" prefix="$" value={form.weekendRate} onChange={set('weekendRate')} />
      </Section>

      <Section title="Discounts">
        <Field label="Weekly discount" suffix="%" value={form.weeklyDiscountPercent} onChange={set('weeklyDiscountPercent')} />
        <Field label="Monthly discount" suffix="%" value={form.monthlyDiscountPercent} onChange={set('monthlyDiscountPercent')} />
      </Section>

      <Section title="Stay rules">
        <Field label="Minimum nights" value={form.minNights} onChange={set('minNights')} />
        <Field label="Cleaning fee" prefix="$" value={form.cleaningFee} onChange={set('cleaningFee')} />
      </Section>

      <div className="flex items-center gap-3">
        <Button onClick={onSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
        {saved && <span className="text-sm font-medium text-brand">Saved</span>}
      </div>
    </div>
  );
}

export default function PricingPage() {
  const state = useAsync(getPricingSettings, []);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8 text-4xl font-bold text-ink">Pricing</h1>
      <AsyncBoundary state={state} loadingMessage="Loading pricing…" errorMessage="Failed to load pricing.">
        {(data) => <PricingForm initial={data} />}
      </AsyncBoundary>
    </div>
  );
}
