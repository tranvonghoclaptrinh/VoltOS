import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layout, MessageSquare, User, Bell, Users, Settings, Home, X } from 'lucide-react';

// System Components
import { Window } from './components/Window';
import { Taskbar } from './system/Taskbar';
import { AppLauncher } from './system/AppLauncher';
import { DesktopIcon } from './components/DesktopIcon';
import { ContextMenu } from './components/ContextMenu';

// Apps
import { FeedApp } from './apps/FeedApp';
import { MessengerApp } from './apps/MessengerApp';
import { ProfileApp } from './apps/ProfileApp';
import { FriendsApp } from './apps/FriendsApp';
import { SettingsApp } from './apps/SettingsApp';
import { NotificationsApp } from './apps/NotificationsApp';

// Hooks & Data
import { useWindowManager } from './hooks/useWindowManager';
import { useNotifications } from './hooks/useNotifications';
import { useUser } from './hooks/useUser';
import { AppConfig } from './types';

const AVAILABLE_APPS: AppConfig[] = [
  { id: 'feed', name: 'Feed', icon: Home, component: FeedApp, defaultSize: { width: 900, height: 700 } },
  { id: 'messenger', name: 'Messenger', icon: MessageSquare, component: MessengerApp, defaultSize: { width: 1000, height: 650 } },
  { id: 'profile', name: 'Profile', icon: User, component: ProfileApp, defaultSize: { width: 1100, height: 750 } },
  { id: 'notifications', name: 'Alerts', icon: Bell, component: NotificationsApp, defaultSize: { width: 600, height: 500 } },
  { id: 'friends', name: 'Friends', icon: Users, component: FriendsApp, defaultSize: { width: 850, height: 600 } },
  { id: 'settings', name: 'Settings', icon: Settings, component: SettingsApp, defaultSize: { width: 800, height: 550 } },
];

export default function App() {
  const {
    windows,
    activeWindowId,
    openApp,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    updatePosition
  } = useWindowManager(AVAILABLE_APPS);

  const { user } = useUser();
  const { lastNotification } = useNotifications();
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Settings state
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('volt_settings');
    return saved ? JSON.parse(saved) : {
      darkMode: false,
      demoMode: false,
      activityTracking: true,
      notificationsEnabled: true,
      notificationSound: true,
      language: 'English',
      timeFormat: '24h'
    };
  });

  // Theme management
  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [settings.darkMode]);

  // Sync settings
  useEffect(() => {
    const syncSettings = () => {
      const saved = localStorage.getItem('volt_settings');
      if (saved) setSettings(JSON.parse(saved));
    };
    window.addEventListener('volt_settings_updated', syncSettings);
    return () => window.removeEventListener('volt_settings_updated', syncSettings);
  }, []);

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Demo Mode Simulation
  useEffect(() => {
    if (!settings.demoMode) return;

    const demoInterval = setInterval(() => {
      const messages = [
        "System update available",
        "New friend request from Alex",
        "Security scan completed",
        "Cloud sync successful",
        "Battery at 85%"
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      
      if (settings.notificationsEnabled) {
        window.dispatchEvent(new CustomEvent('volt_new_notification', {
          detail: {
            id: Date.now().toString(),
            senderName: "System",
            senderAvatar: "https://picsum.photos/seed/system/100",
            content: randomMsg,
            timestamp: new Date().toISOString(),
            read: false
          }
        }));
      }
    }, 8000);

    return () => clearInterval(demoInterval);
  }, [settings.demoMode, settings.notificationsEnabled]);

  // Notification Sound
  useEffect(() => {
    if (lastNotification && settings.notificationSound && settings.notificationsEnabled) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {}); // Ignore autoplay blocks
    }
  }, [lastNotification, settings.notificationSound, settings.notificationsEnabled]);

  // Listen for app opening events from other apps
  useEffect(() => {
    const handleOpenApp = (e: any) => {
      if (e.detail?.appId) {
        openApp(e.detail.appId);
      }
    };
    window.addEventListener('volt_open_app', handleOpenApp);
    return () => window.removeEventListener('volt_open_app', handleOpenApp);
  }, [openApp]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  if (!user) return null;

  const timeString = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: settings.timeFormat === '12h' 
  });

  return (
    <div 
      className={`h-screen w-screen overflow-hidden relative font-sans select-none transition-all duration-500 ${settings.darkMode ? 'dark' : ''}`}
      onContextMenu={handleContextMenu}
      onClick={() => {
        setContextMenu(null);
        if (isLauncherOpen) setIsLauncherOpen(false);
      }}
    >
      {/* Desktop Wallpaper */}
      <div className="absolute inset-0 z-0">
        <img 
          src={settings.darkMode 
            ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop"
            : "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop"
          } 
          alt="Wallpaper" 
          className="w-full h-full object-cover transition-all duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute inset-0 backdrop-blur-[2px] transition-colors duration-500 ${settings.darkMode ? 'bg-black/40' : 'bg-black/20'}`}></div>
      </div>

      <AnimatePresence>
        {contextMenu && (
          <ContextMenu 
            x={contextMenu.x} 
            y={contextMenu.y} 
            onClose={() => setContextMenu(null)} 
          />
        )}
      </AnimatePresence>

      {/* Desktop Icons Grid */}
      <div className="absolute inset-0 p-6 flex flex-col flex-wrap gap-4 content-start z-10">
        {AVAILABLE_APPS.map(app => (
          <DesktopIcon 
            key={app.id} 
            app={app} 
            onClick={() => openApp(app.id)} 
          />
        ))}
      </div>

      {/* Windows Manager */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <AnimatePresence>
          {windows.map(win => {
            const app = AVAILABLE_APPS.find(a => a.id === win.appId);
            if (!app) return null;
            const AppComponent = app.component;

            return (
              <div key={win.id} className="pointer-events-auto">
                <Window
                  window={win}
                  isActive={activeWindowId === win.id}
                  onClose={() => closeWindow(win.id)}
                  onMinimize={() => minimizeWindow(win.id)}
                  onMaximize={() => toggleMaximize(win.id)}
                  onFocus={() => focusWindow(win.id)}
                  onPositionChange={(x, y) => updatePosition(win.id, x, y)}
                >
                  <AppComponent />
                </Window>
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* App Launcher (Start Menu) */}
      <AppLauncher 
        isOpen={isLauncherOpen}
        onClose={() => setIsLauncherOpen(false)}
        apps={AVAILABLE_APPS}
        onAppClick={openApp}
        currentUser={user}
      />

      {/* Taskbar */}
      <Taskbar 
        windows={windows}
        activeWindowId={activeWindowId}
        onAppClick={openApp}
        onWindowClick={(id) => {
          const win = windows.find(w => w.id === id);
          if (win?.isMinimized) {
            focusWindow(id);
          } else if (activeWindowId === id) {
            minimizeWindow(id);
          } else {
            focusWindow(id);
          }
        }}
        onStartClick={() => setIsLauncherOpen(!isLauncherOpen)}
        availableApps={AVAILABLE_APPS}
      />

      {/* Toast Notifications */}
      <AnimatePresence>
        {lastNotification && settings.notificationsEnabled && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="fixed top-8 right-8 z-[10001] w-80 glass-panel p-4 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-4 cursor-pointer hover:bg-white/20 transition-all"
            onClick={() => openApp('notifications')}
          >
            <img src={lastNotification.senderAvatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{lastNotification.senderName}</p>
              <p className="text-xs line-clamp-1" style={{ color: 'var(--text-muted)' }}>{lastNotification.content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Widgets / Info */}
      <div className="absolute top-12 right-12 text-right text-white drop-shadow-2xl z-0 pointer-events-none">
        <h1 className="text-8xl font-display font-bold mb-0 tracking-tighter">
          {timeString}
        </h1>
        <p className="text-2xl font-medium opacity-80 tracking-widest uppercase">
          {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <div className="mt-8 flex flex-col items-end gap-2">
          <div className="px-4 py-2 glass-panel rounded-xl text-sm font-bold flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${settings.demoMode ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
            Volt OS v2.4.0 {settings.demoMode && '(Demo Mode)'}
          </div>
          <div className="px-4 py-2 glass-panel rounded-xl text-xs font-medium opacity-70">
            {settings.demoMode ? 'Simulating system activity...' : 'All systems operational'}
          </div>
        </div>
      </div>
    </div>
  );
}
