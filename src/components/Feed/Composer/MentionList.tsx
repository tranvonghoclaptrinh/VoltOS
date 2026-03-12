import React from 'react';
import { motion } from 'motion/react';
import { MOCK_USERS } from '../../../mock/mockData';

interface MentionListProps {
  query: string;
  onSelect: (username: string) => void;
}

export const MentionList: React.FC<MentionListProps> = ({ query, onSelect }) => {
  const filtered = MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(query.toLowerCase()) || 
    u.username.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  if (filtered.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-full left-0 mb-2 w-64 rounded-2xl shadow-2xl border z-50 overflow-hidden"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
    >
      <div className="p-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Suggestions</span>
      </div>
      {filtered.map(user => (
        <button
          key={user.id}
          onClick={() => onSelect(user.username)}
          className="w-full flex items-center gap-3 p-3 hover:bg-[var(--hover-bg)] transition-colors text-left"
        >
          <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>@{user.username}</p>
          </div>
        </button>
      ))}
    </motion.div>
  );
};
