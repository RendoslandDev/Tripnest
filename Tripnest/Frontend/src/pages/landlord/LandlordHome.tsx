import { useNavigate } from 'react-router-dom';
import { HexIcon } from '../../components/tenant/icons';
import Button from '../../components/ui/Button';

/**
 * Placeholder for the landlord marketplace surface — a distinct view from the
 * tenant area and the /dashboard host tools, to be designed later.
 */
export default function LandlordHome() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
        <HexIcon size={28} />
      </span>
      <h1 className="text-3xl font-bold text-ink">Landlord</h1>
      <p className="max-w-md text-muted">
        The landlord marketplace view is scaffolded and will be designed next.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => navigate('/')}>Switch to Tenant</Button>
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          Open host dashboard
        </Button>
      </div>
    </div>
  );
}
