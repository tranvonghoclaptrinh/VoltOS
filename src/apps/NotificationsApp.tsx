import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Bell, Heart, MessageCircle, Users, CheckCircle } from 'lucide-react';

export const NotificationsApp: React.FC = () => {
  const { notifications, markAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={16} className="text-volt-orange" fill="currentColor" />;
      case 'comment': return <MessageCircle size={16} className="text-volt-teal" />;
      case 'community': return <Users size={16} className="text-volt-primary" />;
      default: return <Bell size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--window-bg)' }}>
      <div className="p-6 border-b shrink-0 flex items-center justify-between" style={{ backgroundColor: 'var(--window-bg)', borderColor: 'var(--border-color)' }}>
        <h2 className="text-2xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</h2>
        <button 
          onClick={markAsRead}
          className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
          style={{ color: 'var(--accent)', backgroundColor: 'var(--hover-bg)' }}
        >
          <CheckCircle size={14} /> Mark all as read
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-3">
          {notifications.length > 0 ? notifications.map(n => (
            <div 
              key={n.id} 
              className={`card-volt p-4 flex items-center gap-4 transition-all hover:scale-[1.01] cursor-pointer ${
                n.read ? 'opacity-70 grayscale-[0.2]' : 'border-l-4'
              }`}
              style={{ 
                borderLeftColor: n.read ? 'transparent' : 'var(--accent)',
                backgroundColor: 'var(--card-bg)'
              }}
            >
              <div className="relative">
                <img src={n.senderAvatar} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full shadow-sm flex items-center justify-center" style={{ backgroundColor: 'var(--window-bg)' }}>
                  {getIcon(n.type)}
                </div>
              </div>
              
              <div className="flex-1">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{n.senderName}</span> {n.content}
                </p>
                <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{n.time}</span>
              </div>
              
              {!n.read && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></div>}
            </div>
          )) : (
            <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
              <Bell size={48} className="mx-auto mb-4 opacity-20" />
              <p>No notifications yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
