import { useEffect, useRef, useState } from 'react';
import { getSignatureInfo, uploadSignature, type SignatureInfo } from '../../api/profile';
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
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getSignatureInfo().then(setInfo).catch(() => setInfo(null));
  }, []);

  const replacing = Boolean(info?.hasSignature);
  const cooldownActive =
    replacing && info?.editableFrom != null && new Date(info.editableFrom).getTime() > Date.now();

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
      <h2 className="text-lg font-bold text-ink">Signature</h2>
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
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm"
            aria-label="Signature image"
          />
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
