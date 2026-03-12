import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppConfig, User } from '../types';
import { Search, Settings, LogOut, Power } from 'lucide-react';

interface AppLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppConfig[];
  onAppClick: (appId: string) => void;
  currentUser: User;
}

export const AppLauncher: React.FC<AppLauncherProps> = ({
  isOpen,
  onClose,
  apps,
  onAppClick,
  currentUser
}) => {
  const [search, setSearch] = React.useState('');

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-[9997]" onClick={onClose}></div>
          
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-16 left-1/2 -translate-x-1/2 w-[540px] h-[600px] glass-panel rounded-3xl shadow-2xl z-[9998] overflow-hidden flex flex-col"
          >
            {/* Search Bar */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 border transition-all" style={{ backgroundColor: 'var(--hover-bg)', borderColor: 'var(--border-color)' }}>
                <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="Search apps, files, and people..." 
                  className="bg-transparent border-none outline-none text-sm w-full"
                  style={{ color: 'var(--text-primary)' }}
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Apps Grid */}
            <div className="flex-1 overflow-y-auto px-6 py-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                  {search ? 'Search Results' : 'Pinned Apps'}
                </h3>
                {!search && <button className="text-[10px] font-bold hover:underline" style={{ color: 'var(--accent)' }}>All Apps</button>}
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {filteredApps.map(app => (
                  <button
                    key={app.id}
                    onClick={() => { onAppClick(app.id); onClose(); }}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all group hover:bg-[var(--hover-bg)]"
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-all" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--accent)' }}>
                      <app.icon size={24} />
                    </div>
                    <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>{app.name}</span>
                  </button>
                ))}
                {filteredApps.length === 0 && (
                  <div className="col-span-4 py-10 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                    No apps found matching "{search}"
                  </div>
                )}
              </div>

              {!search && (
                <div className="mt-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)' }}>Recommended</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Recent Project.pdf', 'Volt OS Assets', 'Meeting Notes', 'Profile Draft'].map(item => (
                      <div key={item} className="flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all hover:bg-[var(--hover-bg)]">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-primary)' }}>
                          <div className="w-4 h-5 border-2 border-current rounded-sm"></div>
                        </div>
                        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex items-center justify-between px-6" style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-center gap-3">
                <img src={currentUser?.avatar} alt="" className="w-8 h-8 rounded-full border" style={{ borderColor: 'var(--border-color)' }} />
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{currentUser?.name || 'Guest User'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { onAppClick('settings'); onClose(); }}
                  className="p-2 rounded-xl transition-colors hover:bg-[var(--hover-bg)]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Settings size={18} />
                </button>
                <button className="p-2 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors">
                  <Power size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
