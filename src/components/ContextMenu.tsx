import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Layout, Image, Settings } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onRefresh: () => void;
  onNewPost: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onRefresh, onNewPost }) => {
  useEffect(() => {
    const handleScroll = () => onClose();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{ top: y, left: x }}
      className="fixed z-[10000] w-56 glass-panel rounded-xl shadow-2xl border border-white/20 p-1.5 overflow-hidden"
    >
      <div className="space-y-0.5">
        <ContextMenuItem icon={RefreshCw} label="Refresh Desktop" onClick={() => { onRefresh(); onClose(); }} />
        <div className="h-[1px] bg-slate-100 dark:bg-white/10 my-1 mx-2"></div>
        <ContextMenuItem icon={Layout} label="New Post" onClick={() => { onNewPost(); onClose(); }} />
        <ContextMenuItem icon={Image} label="Change Wallpaper" onClick={onClose} />
        <div className="h-[1px] bg-slate-100 dark:bg-white/10 my-1 mx-2"></div>
        <ContextMenuItem icon={Settings} label="Display Settings" onClick={onClose} />
      </div>
    </motion.div>
  );
};

const ContextMenuItem = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-volt-primary hover:text-white text-slate-900 dark:text-dark-text-primary transition-all group"
  >
    <Icon size={16} className="text-slate-500 dark:text-dark-text-secondary group-hover:text-white" />
    <span className="text-xs font-bold">{label}</span>
  </button>
);
