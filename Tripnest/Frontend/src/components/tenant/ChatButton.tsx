import { ChatIcon } from './icons';

/** Floating "Chat with us" support button shown across the marketplace. */
export default function ChatButton() {
  return (
    <button className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-brand/90">
      <ChatIcon size={18} />
      Chat with us
    </button>
  );
}
