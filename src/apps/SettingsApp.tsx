import React, { useState, useEffect } from 'react';
import { 
  Settings, Moon, Sun, Bell, Shield, User, Globe, 
  HelpCircle, RefreshCw, Trash2, Monitor, Volume2, 
  Clock, CheckCircle2, AlertCircle, Camera
} from 'lucide-react';
import { useUser } from '../hooks/useUser';

export const SettingsApp: React.FC = () => {
  const { user, updateProfile } = useUser();
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('volt_settings_last_section') || 'General';
  });

  // Settings State
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

  // Persist settings and apply global effects
  useEffect(() => {
    localStorage.setItem('volt_settings', JSON.stringify(settings));
    localStorage.setItem('volt_settings_last_section', activeSection);

    // Dark Mode Effect
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }

    // Dispatch event for other components to sync
    window.dispatchEvent(new Event('volt_settings_updated'));
  }, [settings, activeSection]);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all local data? This will reset your profile and settings.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Reset all settings to default?')) {
      setSettings({
        darkMode: false,
        demoMode: false,
        activityTracking: true,
        notificationsEnabled: true,
        notificationSound: true,
        language: 'English',
        timeFormat: '24h'
      });
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        updateProfile({ avatar: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const sections = [
    { id: 'General', icon: Settings },
    { id: 'Account', icon: User },
    { id: 'Privacy', icon: Shield },
    { id: 'Notifications', icon: Bell },
    { id: 'Language', icon: Globe },
    { id: 'Help', icon: HelpCircle },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'General':
        return (
          <div className="space-y-6">
            <div className="group">
              <h4 className="text-xs font-bold text-slate-500 dark:text-dark-text-secondary uppercase tracking-widest mb-4">Appearance</h4>
              <div className="card-volt p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-dark-hover transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-dark-text-primary">
                    {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-dark-text-primary">Dark Mode</p>
                    <p className="text-xs text-slate-500 dark:text-dark-text-secondary">Switch between light and dark themes.</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSetting('darkMode')}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings.darkMode ? 'bg-volt-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.darkMode ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>

            <div className="group">
              <h4 className="text-xs font-bold text-slate-500 dark:text-dark-text-secondary uppercase tracking-widest mb-4">System Behavior</h4>
              <div className="card-volt p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-dark-hover transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-dark-text-primary">
                    <RefreshCw size={20} className={settings.demoMode ? 'animate-spin' : ''} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-dark-text-primary">Demo Mode</p>
                    <p className="text-xs text-slate-500 dark:text-dark-text-secondary">Simulate notifications and system activity.</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSetting('demoMode')}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings.demoMode ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.demoMode ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>
        );

      case 'Account':
        return (
          <div className="space-y-6">
            <div className="group">
              <h4 className="text-xs font-bold text-slate-500 dark:text-dark-text-secondary uppercase tracking-widest mb-4">Profile Information</h4>
              <div className="card-volt p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative group/avatar">
                    <img 
                      src={user?.avatar || 'https://picsum.photos/seed/volt/200'} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white/10"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="text-white" size={24} />
                      <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-dark-text-secondary uppercase mb-1 block">Username</label>
                    <input 
                      type="text" 
                      value={user?.name || ''} 
                      onChange={(e) => updateProfile({ name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-dark-divider rounded-xl px-4 py-2 text-slate-900 dark:text-dark-text-primary font-bold focus:outline-none focus:border-volt-primary transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Privacy':
        return (
          <div className="space-y-6">
            <div className="group">
              <h4 className="text-xs font-bold text-slate-500 dark:text-dark-text-secondary uppercase tracking-widest mb-4">Data & Security</h4>
              <div className="card-volt p-4 flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-dark-text-primary">
                    <Monitor size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-dark-text-primary">Activity Tracking</p>
                    <p className="text-xs text-slate-500 dark:text-dark-text-secondary">Allow Volt OS to collect usage data.</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSetting('activityTracking')}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings.activityTracking ? 'bg-volt-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.activityTracking ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="card-volt p-6 border-t border-slate-100 dark:border-dark-divider">
                <p className="text-sm text-slate-600 dark:text-dark-text-secondary mb-4">
                  Clearing local data will remove all your personalized settings, profile information, and cached content.
                </p>
                <button 
                  onClick={handleClearData}
                  className="w-full py-3 rounded-xl bg-rose-500/10 text-rose-500 font-bold hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Clear Local Data
                </button>
              </div>
            </div>
          </div>
        );

      case 'Notifications':
        return (
          <div className="space-y-6">
            <div className="group">
              <h4 className="text-xs font-bold text-slate-500 dark:text-dark-text-secondary uppercase tracking-widest mb-4">Alert Preferences</h4>
              <div className="space-y-3">
                <div className="card-volt p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-dark-text-primary">
                      <Bell size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-dark-text-primary">Enable Notifications</p>
                      <p className="text-xs text-slate-500 dark:text-dark-text-secondary">Receive popups for system alerts.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleSetting('notificationsEnabled')}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.notificationsEnabled ? 'bg-volt-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.notificationsEnabled ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="card-volt p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-dark-text-primary">
                      <Volume2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-dark-text-primary">Notification Sound</p>
                      <p className="text-xs text-slate-500 dark:text-dark-text-secondary">Play a sound when an alert arrives.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleSetting('notificationSound')}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.notificationSound ? 'bg-volt-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.notificationSound ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Language':
        return (
          <div className="space-y-6">
            <div className="group">
              <h4 className="text-xs font-bold text-slate-500 dark:text-dark-text-secondary uppercase tracking-widest mb-4">Regional Settings</h4>
              <div className="card-volt p-6 space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-dark-text-secondary uppercase mb-2 block">System Language</label>
                  <select 
                    value={settings.language}
                    onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-dark-divider rounded-xl px-4 py-3 text-slate-900 dark:text-dark-text-primary font-bold focus:outline-none focus:border-volt-primary appearance-none"
                  >
                    <option value="English">English</option>
                    <option value="Vietnamese">Vietnamese</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-dark-divider">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-dark-text-primary">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-dark-text-primary">24-Hour Format</p>
                      <p className="text-xs text-slate-500 dark:text-dark-text-secondary">Use military time for system clock.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSettings(prev => ({ ...prev, timeFormat: prev.timeFormat === '24h' ? '12h' : '24h' }))}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.timeFormat === '24h' ? 'bg-volt-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.timeFormat === '24h' ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Help':
        return (
          <div className="space-y-6">
            <div className="group">
              <h4 className="text-xs font-bold text-slate-500 dark:text-dark-text-secondary uppercase tracking-widest mb-4">System Information</h4>
              <div className="card-volt p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-dark-text-secondary">Volt OS Version</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-dark-text-primary">v2.4.0-stable</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-dark-text-secondary">Browser</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-dark-text-primary">{navigator.userAgent.split(' ').pop()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-dark-text-secondary">Resolution</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-dark-text-primary">{window.screen.width} x {window.screen.height}</span>
                </div>
              </div>
            </div>

            <div className="group">
              <h4 className="text-xs font-bold text-slate-500 dark:text-dark-text-secondary uppercase tracking-widest mb-4">Maintenance</h4>
              <button 
                onClick={handleResetSettings}
                className="w-full card-volt p-4 flex items-center justify-center gap-3 text-volt-primary font-bold hover:bg-volt-primary hover:text-white transition-all"
              >
                <RefreshCw size={18} />
                Reset All Settings
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex transition-all duration-300" style={{ backgroundColor: 'var(--window-bg)' }}>
      {/* Sidebar */}
      <div className="w-64 border-r p-6 flex flex-col transition-all duration-300" style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: 'var(--accent)' }}>
            <Settings size={18} />
          </div>
          <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Settings</h2>
        </div>
        
        <div className="flex-1 space-y-1">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeSection === section.id 
                  ? 'shadow-sm' 
                  : 'hover:bg-[var(--hover-bg)]'
              }`}
              style={{ 
                backgroundColor: activeSection === section.id ? 'var(--accent)' : 'transparent',
                color: activeSection === section.id ? '#ffffff' : 'var(--text-secondary)'
              }}
            >
              <section.icon size={18} />
              <span className="text-sm font-bold">{section.id}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3 px-2">
            <img src={user?.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
              <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>Standard User</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto p-12">
          <div className="flex items-center gap-4 mb-12">
            <h3 className="text-4xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>{activeSection}</h3>
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-color)' }}></div>
          </div>
          
          <div className="space-y-6">
            {activeSection === 'General' && (
              <div className="space-y-6">
                <div className="group">
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Appearance</h4>
                  <div className="card-volt p-4 flex items-center justify-between transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-primary)' }}>
                        {settings.darkMode ? <Moon size={20} /> : <Sun size={20} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Dark Mode</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Switch between light and dark themes.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleSetting('darkMode')}
                      className="w-12 h-6 rounded-full transition-all relative"
                      style={{ backgroundColor: settings.darkMode ? 'var(--toggle-on)' : 'var(--toggle-off)' }}
                    >
                      <div 
                        className={`absolute top-1 w-4 h-4 rounded-full transition-all ${settings.darkMode ? 'left-7' : 'left-1'}`}
                        style={{ backgroundColor: 'var(--toggle-knob)' }}
                      ></div>
                    </button>
                  </div>
                </div>

                <div className="group">
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>System Behavior</h4>
                  <div className="card-volt p-4 flex items-center justify-between transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-primary)' }}>
                        <RefreshCw size={20} className={settings.demoMode ? 'animate-spin' : ''} />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Demo Mode</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Simulate notifications and system activity.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleSetting('demoMode')}
                      className="w-12 h-6 rounded-full transition-all relative"
                      style={{ backgroundColor: settings.demoMode ? 'var(--toggle-on)' : 'var(--toggle-off)' }}
                    >
                      <div 
                        className={`absolute top-1 w-4 h-4 rounded-full transition-all ${settings.demoMode ? 'left-7' : 'left-1'}`}
                        style={{ backgroundColor: 'var(--toggle-knob)' }}
                      ></div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'Account' && (
              <div className="space-y-6">
                <div className="group">
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Profile Information</h4>
                  <div className="card-volt p-6 space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="relative group/avatar">
                        <img 
                          src={user?.avatar || 'https://picsum.photos/seed/volt/200'} 
                          alt="Avatar" 
                          className="w-24 h-24 rounded-2xl object-cover border-4"
                          style={{ borderColor: 'var(--border-color)' }}
                        />
                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                          <Camera className="text-white" size={24} />
                          <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                        </label>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-bold uppercase mb-1 block" style={{ color: 'var(--text-muted)' }}>Username</label>
                        <input 
                          type="text" 
                          value={user?.name || ''} 
                          onChange={(e) => updateProfile({ name: e.target.value })}
                          className="w-full border rounded-xl px-4 py-2 font-bold focus:outline-none transition-colors"
                          style={{ backgroundColor: 'var(--hover-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'Privacy' && (
              <div className="space-y-6">
                <div className="group">
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Data & Security</h4>
                  <div className="card-volt p-4 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-primary)' }}>
                        <Monitor size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Activity Tracking</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Allow Volt OS to collect usage data.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleSetting('activityTracking')}
                      className="w-12 h-6 rounded-full transition-all relative"
                      style={{ backgroundColor: settings.activityTracking ? 'var(--toggle-on)' : 'var(--toggle-off)' }}
                    >
                      <div 
                        className={`absolute top-1 w-4 h-4 rounded-full transition-all ${settings.activityTracking ? 'left-7' : 'left-1'}`}
                        style={{ backgroundColor: 'var(--toggle-knob)' }}
                      ></div>
                    </button>
                  </div>

                  <div className="card-volt p-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                      Clearing local data will remove all your personalized settings, profile information, and cached content.
                    </p>
                    <button 
                      onClick={handleClearData}
                      className="w-full py-3 rounded-xl bg-rose-500/10 text-rose-500 font-bold hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                      Clear Local Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'Notifications' && (
              <div className="space-y-6">
                <div className="group">
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Alert Preferences</h4>
                  <div className="space-y-3">
                    <div className="card-volt p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-primary)' }}>
                          <Bell size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Enable Notifications</p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Receive popups for system alerts.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleSetting('notificationsEnabled')}
                        className="w-12 h-6 rounded-full transition-all relative"
                        style={{ backgroundColor: settings.notificationsEnabled ? 'var(--toggle-on)' : 'var(--toggle-off)' }}
                      >
                        <div 
                          className={`absolute top-1 w-4 h-4 rounded-full transition-all ${settings.notificationsEnabled ? 'left-7' : 'left-1'}`}
                          style={{ backgroundColor: 'var(--toggle-knob)' }}
                        ></div>
                      </button>
                    </div>

                    <div className="card-volt p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-primary)' }}>
                          <Volume2 size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Notification Sound</p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Play a sound when an alert arrives.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleSetting('notificationSound')}
                        className="w-12 h-6 rounded-full transition-all relative"
                        style={{ backgroundColor: settings.notificationSound ? 'var(--toggle-on)' : 'var(--toggle-off)' }}
                      >
                        <div 
                          className={`absolute top-1 w-4 h-4 rounded-full transition-all ${settings.notificationSound ? 'left-7' : 'left-1'}`}
                          style={{ backgroundColor: 'var(--toggle-knob)' }}
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'Language' && (
              <div className="space-y-6">
                <div className="group">
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Regional Settings</h4>
                  <div className="card-volt p-6 space-y-6">
                    <div>
                      <label className="text-xs font-bold uppercase mb-2 block" style={{ color: 'var(--text-muted)' }}>System Language</label>
                      <select 
                        value={settings.language}
                        onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full border rounded-xl px-4 py-3 font-bold focus:outline-none appearance-none"
                        style={{ backgroundColor: 'var(--hover-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                      >
                        <option value="English">English</option>
                        <option value="Vietnamese">Vietnamese</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-primary)' }}>
                          <Clock size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>24-Hour Format</p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Use military time for system clock.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSettings(prev => ({ ...prev, timeFormat: prev.timeFormat === '24h' ? '12h' : '24h' }))}
                        className="w-12 h-6 rounded-full transition-all relative"
                        style={{ backgroundColor: settings.timeFormat === '24h' ? 'var(--toggle-on)' : 'var(--toggle-off)' }}
                      >
                        <div 
                          className={`absolute top-1 w-4 h-4 rounded-full transition-all ${settings.timeFormat === '24h' ? 'left-7' : 'left-1'}`}
                          style={{ backgroundColor: 'var(--toggle-knob)' }}
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'Help' && (
              <div className="space-y-6">
                <div className="group">
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>System Information</h4>
                  <div className="card-volt p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Volt OS Version</span>
                      <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>v2.4.0-stable</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Browser</span>
                      <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{navigator.userAgent.split(' ').pop()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Resolution</span>
                      <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{window.screen.width} x {window.screen.height}</span>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Maintenance</h4>
                  <button 
                    onClick={handleResetSettings}
                    className="w-full card-volt p-4 flex items-center justify-center gap-3 font-bold transition-all hover:opacity-80"
                    style={{ color: 'var(--accent)' }}
                  >
                    <RefreshCw size={18} />
                    Reset All Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
