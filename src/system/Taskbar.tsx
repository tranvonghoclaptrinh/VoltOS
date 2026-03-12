import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WindowState, AppConfig } from '../types';
import { Bell, Search, Wifi, Battery, Volume2 } from 'lucide-react';
import { useMessages } from '../hooks/useMessages';
import { useNotifications } from '../hooks/useNotifications';

interface TaskbarProps {
  windows: WindowState[];
  activeWindowId: string | null;
  onAppClick: (appId: string) => void;
  onWindowClick: (winId: string) => void;
  onStartClick: () => void;
  availableApps: AppConfig[];
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindowId,
  onAppClick,
  onWindowClick,
  onStartClick,
  availableApps
}) => {
  const [time, setTime] = useState(new Date());
  const { unreadCount: messengerUnread } = useMessages();
  const { notifications } = useNotifications();
  const notificationUnread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-14 w-full glass-panel fixed bottom-0 left-0 z-[9999] flex items-center justify-between px-4" style={{ borderTop: '1px solid var(--border-color)' }}>
      <div className="flex items-center gap-1">
        {/* Start Button */}
        <button 
          onClick={onStartClick}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-volt-primary/20 hover:scale-105 active:scale-95 transition-all"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45 flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </button>
      </div>

      {/* Running Apps (Centered) */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 rounded-2xl border" style={{ backgroundColor: 'var(--hover-bg)', opacity: 0.8, borderColor: 'var(--border-color)' }}>
        {windows.map(win => {
          let badge = 0;
          if (win.appId === 'messenger') badge = messengerUnread;
          if (win.appId === 'notifications') badge = notificationUnread;

          return (
            <button
              key={win.id}
              onClick={() => onWindowClick(win.id)}
              className={`h-10 px-3 taskbar-item flex items-center gap-2 relative group ${
                activeWindowId === win.id 
                  ? 'shadow-inner' 
                  : ''
              }`}
              style={{ backgroundColor: activeWindowId === win.id ? 'var(--hover-bg)' : 'transparent' }}
            >
              <div className="relative">
                <win.icon size={18} style={{ color: activeWindowId === win.id ? 'var(--accent)' : 'var(--text-secondary)' }} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] h-3.5 flex items-center justify-center border border-white">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold hidden lg:block" style={{ color: 'var(--text-primary)' }}>{win.title}</span>
              
              {/* Active Indicator */}
              <div 
                className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all ${
                  activeWindowId === win.id ? 'w-4' : 'w-1 group-hover:w-2'
                }`}
                style={{ backgroundColor: activeWindowId === win.id ? 'var(--accent)' : 'var(--text-muted)' }}
              ></div>
            </button>
          );
        })}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-3 px-3">
        <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
          <Wifi size={14} />
          <Volume2 size={14} />
          <Battery size={14} />
        </div>
        
        <div className="h-6 w-[1px]" style={{ backgroundColor: 'var(--border-color)' }}></div>

        <div className="flex flex-col items-end cursor-default select-none">
          <span className="text-[11px] font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-[9px] font-medium leading-none mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        </div>
        
        <button 
          onClick={() => onAppClick('notifications')}
          className="p-1.5 rounded-lg transition-colors relative hover:bg-[var(--hover-bg)]"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Bell size={16} />
          {notificationUnread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
          )}
        </button>
      </div>
    </div>
  );
};
