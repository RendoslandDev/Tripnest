import { useEffect, useRef, useState } from 'react';
import { getSignatureInfo, uploadSignature, type SignatureInfo } from '../../api/profile';
import { useT } from '../../lib/i18n';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * The user's stored signature image — what gets stamped onto agreements when they sign. The first
 * upload is free; replacing it needs the account password (+ Ghana Card number once verified) and
 * sits behind a 30-day cooldown, all enforced server-side.
 */
export default function SignatureCard() {
  const [info, setInfo] = useState<SignatureInfo | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [ghanaCard, setGhanaCard] = useState('');
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  // Render-stable "now" for the cooldown comparison (impure calls can't run in render).
  const [mountedAt] = useState(() => Date.now());
  const fileRef = useRef<HTMLInputElement>(null);
  const t = useT();

  useEffect(() => {
    getSignatureInfo().then(setInfo).catch(() => setInfo(null));
  }, []);

  const replacing = Boolean(info?.hasSignature);
  const cooldownActive =
    replacing && info?.editableFrom != null && new Date(info.editableFrom).getTime() > mountedAt;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || busy) return;
    setBusy(true);
    setNote(null);
    try {
      await uploadSignature(file, password || undefined, ghanaCard || undefined);
      setNote(replacing ? 'Signature replaced.' : 'Signature saved — you can now sign agreements.');
      setFile(null);
      setPassword('');
      setGhanaCard('');
      if (fileRef.current) fileRef.current.value = '';
      setInfo(await getSignatureInfo().catch(() => info));
    } catch (err) {
      setNote(err instanceof Error ? err.message : 'Could not save the signature.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-ink">{t('Signature')}</h2>
      <p className="mt-1 text-sm text-muted">
        {replacing
          ? `On file since ${info?.updatedAt ? new Date(info.updatedAt).toLocaleDateString() : '—'}. Used when you sign agreements.`
          : 'Upload an image of your signature — it’s applied to agreements when you sign.'}
      </p>

      {cooldownActive ? (
        <p className="mt-3 text-sm text-muted">
          For security, your signature can be changed again from{' '}
          {new Date(info!.editableFrom!).toLocaleDateString()}.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-3 space-y-2">
          <label className="tn-glow flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 border-dashed border-brand/40 bg-brand-50/50 px-4 py-3 hover:border-brand">
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-ink">
                {file ? file.name : t('Choose your signature image')}
              </span>
              <span className="block text-xs text-muted">PNG or JPG — a clear photo or scan of your signature</span>
            </span>
            <span className="shrink-0 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">
              {t('Browse…')}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
              aria-label="Signature image"
            />
          </label>
          {replacing && (
            <>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Account password (required to replace)"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                value={ghanaCard}
                onChange={(e) => setGhanaCard(e.target.value)}
                placeholder="Ghana Card number (if identity-verified)"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </>
          )}
          <Button size="sm" disabled={!file || busy}>
            {busy ? 'Saving…' : replacing ? 'Replace signature' : 'Save signature'}
          </Button>
        </form>
      )}

      {note && <p className="mt-2 text-sm text-muted">{note}</p>}
    </Card>
  );
}
