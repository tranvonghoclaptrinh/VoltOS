import React from 'react';
import { motion } from 'motion/react';
import { AppConfig } from '../types';
import { useMessages } from '../hooks/useMessages';
import { useNotifications } from '../hooks/useNotifications';

interface DesktopIconProps {
  app: AppConfig;
  onClick: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ app, onClick }) => {
  const { unreadCount: messengerUnread } = useMessages();
  const { notifications } = useNotifications();
  const notificationUnread = notifications.filter(n => !n.read).length;

  let badge = 0;
  if (app.id === 'messenger') badge = messengerUnread;
  if (app.id === 'notifications') badge = notificationUnread;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="w-24 h-24 flex flex-col items-center justify-center gap-2 rounded-2xl hover:bg-white/10 transition-all group relative"
    >
      <div className="w-14 h-14 rounded-2xl glass-panel flex items-center justify-center text-volt-primary shadow-lg shadow-black/5 group-hover:shadow-volt-primary/20 transition-all relative">
        <app.icon size={28} />
        {badge > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] shadow-lg border border-white">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[11px] font-bold text-white drop-shadow-md text-center px-1">
        {app.name}
      </span>
    </motion.button>
  );
};
