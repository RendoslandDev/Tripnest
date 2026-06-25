import type { Message } from '../types';

interface Props { messages: Message[]; }

export default function RecentMessages({ messages }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <h4>Recent Messages</h4>
        <a className="view-all" style={{ cursor: 'pointer' }}>View all →</a>
      </div>
      <div className="msg-list">
        {messages.map((msg, index) => (
          <>
            <div key={msg.name} className="msg-item">
              <div className={`avatar avatar--${msg.avatarColor}`}>{msg.initials}</div>
              <div className="msg-body">
                <p className="msg-name">{msg.name}</p>
                <p className="msg-preview">{msg.preview}</p>
                <p className="msg-time">{msg.time}</p>
              </div>
              {msg.unread !== undefined && (
                <span className="badge badge--red">{msg.unread}</span>
              )}
            </div>
            {index < messages.length - 1 && <div className="msg-divider"></div>}
          </>
        ))}
      </div>
    </div>
  );
}