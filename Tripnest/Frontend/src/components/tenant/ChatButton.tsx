import { useNavigate } from 'react-router-dom';
import { ChatIcon } from './icons';
import { useSession } from '../../store/authStore';

/** Floating "Chat with us" support button shown across the marketplace. */
export default function ChatButton() {
  const navigate = useNavigate();
  const session = useSession();
  const target = session?.role === 'landlord' ? '/landlord/messages' : '/messages';
  return (
    <button
      onClick={() => navigate(target)}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-brand/90"
    >
      <ChatIcon size={18} />
      Chat with us
    </button>
  );
}
