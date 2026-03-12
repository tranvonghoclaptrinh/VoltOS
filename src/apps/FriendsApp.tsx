import React, { useState } from 'react';
import { MOCK_USERS } from '../mock/mockData';
import { Search, MessageSquare, UserPlus, MoreVertical } from 'lucide-react';

export const FriendsApp: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredUsers = MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--window-bg)' }}>
      <div className="p-6 border-b shrink-0" style={{ backgroundColor: 'var(--window-bg)', borderColor: 'var(--border-color)' }}>
        <h2 className="text-2xl font-display font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Friends & Connections</h2>
        <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 max-w-md" style={{ backgroundColor: 'var(--hover-bg)' }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search for people..." 
            className="bg-transparent border-none outline-none text-sm w-full"
            style={{ color: 'var(--text-primary)' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="card-volt p-4 flex items-center gap-4 group">
              <div className="relative">
                <img src={user.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                <div 
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                    user.status === 'online' ? 'bg-emerald-500' : ''
                  }`}
                  style={{ 
                    borderColor: 'var(--window-bg)',
                    backgroundColor: user.status === 'online' ? undefined : 'var(--toggle-off)'
                  }}
                ></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</h4>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Mutual Friends: 12</p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('volt_open_app', { detail: { appId: 'messenger', userId: user.id } }));
                    }}
                    className="flex-1 text-white py-1.5 rounded-lg text-[10px] font-bold shadow-sm hover:scale-105 transition-all"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    Message
                  </button>
                  <button className="p-1.5 rounded-lg transition-all hover:opacity-80" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-secondary)' }}><UserPlus size={14} /></button>
                  <button className="p-1.5 rounded-lg transition-all hover:opacity-80" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-secondary)' }}><MoreVertical size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
