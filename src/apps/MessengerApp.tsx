import React, { useState, useEffect, useRef } from 'react';
import { useMessages } from '../hooks/useMessages';
import { MOCK_USERS, CURRENT_USER } from '../mock/mockData';
import { Send, Search, Phone, Video, Info } from 'lucide-react';

export const MessengerApp: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(MOCK_USERS[0].id);
  const { messages, sendMessage, isTyping, unreadCount } = useMessages(selectedUserId);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle opening messenger with a specific user
  useEffect(() => {
    const handleOpenApp = (e: any) => {
      if (e.detail?.appId === 'messenger' && e.detail?.userId) {
        setSelectedUserId(e.detail.userId);
      }
    };
    window.addEventListener('volt_open_app', handleOpenApp);
    return () => window.removeEventListener('volt_open_app', handleOpenApp);
  }, []);

  const selectedUser = MOCK_USERS.find(u => u.id === selectedUserId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="h-full flex" style={{ backgroundColor: 'var(--window-bg)' }}>
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col" style={{ borderColor: 'var(--border-color)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--text-primary)' }}>Messages</h2>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--hover-bg)' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="bg-transparent border-none outline-none text-xs w-full" 
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {MOCK_USERS.map(user => (
            <button
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              className={`w-full flex items-center gap-3 p-4 transition-colors relative ${
                selectedUserId === user.id ? 'border-r-4' : 'hover:bg-[var(--hover-bg)]'
              }`}
              style={{ 
                borderRightColor: selectedUserId === user.id ? 'var(--accent)' : 'transparent',
                backgroundColor: selectedUserId === user.id ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent'
              }}
            >
              <div className="relative">
                <img src={user.avatar} alt="" className="w-12 h-12 rounded-full" />
                <div 
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                    user.status === 'online' ? 'bg-emerald-500' : ''
                  }`}
                  style={{ 
                    borderColor: 'var(--window-bg)',
                    backgroundColor: user.status === 'online' ? undefined : 'var(--toggle-off)'
                  }}
                ></div>
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <h4 className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</h4>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>Hey, how are you doing?</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>2m</span>
                {unreadCount > 0 && selectedUserId !== user.id && (
                  <span className="text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center" style={{ backgroundColor: 'var(--accent)' }}>
                    {unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
        {selectedUser ? (
          <>
            <div className="h-16 border-b flex items-center justify-between px-6 shrink-0" style={{ backgroundColor: 'var(--window-bg)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-3">
                <img src={selectedUser.avatar} alt="" className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{selectedUser.name}</h3>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                    {selectedUser.status === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4" style={{ color: 'var(--text-muted)' }}>
                <button className="hover:opacity-80 transition-colors" style={{ color: 'var(--accent)' }}><Phone size={18} /></button>
                <button className="hover:opacity-80 transition-colors" style={{ color: 'var(--accent)' }}><Video size={18} /></button>
                <button className="hover:opacity-80 transition-colors" style={{ color: 'var(--accent)' }}><Info size={18} /></button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderId === CURRENT_USER.id ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${
                      msg.senderId === CURRENT_USER.id 
                        ? 'text-white rounded-tr-none' 
                        : 'rounded-tl-none border'
                    }`}
                    style={{ 
                      backgroundColor: msg.senderId === CURRENT_USER.id ? 'var(--accent)' : 'var(--card-bg)',
                      borderColor: msg.senderId === CURRENT_USER.id ? 'transparent' : 'var(--border-color)',
                      color: msg.senderId === CURRENT_USER.id ? '#ffffff' : 'var(--text-primary)'
                    }}
                  >
                    {msg.content}
                    <div className={`text-[9px] mt-1 flex items-center gap-1 ${msg.senderId === CURRENT_USER.id ? 'text-white/70 justify-end' : 'justify-start'}`} style={{ color: msg.senderId === CURRENT_USER.id ? undefined : 'var(--text-muted)' }}>
                      {msg.time}
                      {msg.senderId === CURRENT_USER.id && msg.read && (
                        <span className="text-[8px] font-bold">READ</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl rounded-tl-none border shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--toggle-off)' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.2s]" style={{ backgroundColor: 'var(--toggle-off)' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.4s]" style={{ backgroundColor: 'var(--toggle-off)' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t" style={{ backgroundColor: 'var(--window-bg)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ backgroundColor: 'var(--hover-bg)' }}>
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                  style={{ color: 'var(--text-primary)' }}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit" className="hover:scale-110 transition-transform" style={{ color: 'var(--accent)' }}>
                  <Send size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center" style={{ color: 'var(--text-muted)' }}>
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--hover-bg)' }}>
              <Send size={40} />
            </div>
            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Your Messages</h3>
            <p className="text-sm">Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};
