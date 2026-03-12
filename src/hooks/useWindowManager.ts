import { useState, useCallback, useEffect } from 'react';
import { WindowState, AppConfig } from '../types';
import { storage } from '../utils/storage';

const WINDOWS_STORAGE_KEY = 'volt_windows_state';

export const useWindowManager = (availableApps: AppConfig[]) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedWindows = storage.get(WINDOWS_STORAGE_KEY, [] as WindowState[]);
    if (savedWindows.length > 0) {
      // Re-map icons from availableApps since they can't be stringified
      const restoredWindows = savedWindows.map(win => {
        const app = availableApps.find(a => a.id === win.appId);
        return { ...win, icon: app?.icon || win.icon };
      });
      setWindows(restoredWindows);
    }
  }, [availableApps]);

  // Save state to localStorage whenever windows change
  useEffect(() => {
    // Don't save the icon component itself
    const windowsToSave = windows.map(({ icon, ...rest }) => rest);
    storage.set(WINDOWS_STORAGE_KEY, windowsToSave);
  }, [windows]);

  const openApp = useCallback((appId: string) => {
    const app = availableApps.find(a => a.id === appId);
    if (!app) return;

    setWindows(prev => {
      const existing = prev.find(w => w.appId === appId);
      if (existing) {
        setActiveWindowId(existing.id);
        return prev.map(w => w.appId === appId ? { ...w, isMinimized: false, isOpen: true } : w);
      }

      const width = typeof app.defaultSize?.width === 'number' ? app.defaultSize.width : 800;
      const height = typeof app.defaultSize?.height === 'number' ? app.defaultSize.height : 600;
      const x = (window.innerWidth - width) / 2;
      const y = (window.innerHeight - height) / 2;

      const newWindow: WindowState = {
        id: `win-${Date.now()}`,
        appId: app.id,
        title: app.name,
        icon: app.icon,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: prev.length + 10,
        position: { x, y },
        size: { width, height }
      };

      setActiveWindowId(newWindow.id);
      return [...prev, newWindow];
    });
  }, [availableApps]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  }, [activeWindowId]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    if (activeWindowId === id) setActiveWindowId(null);
  }, [activeWindowId]);

  const toggleMaximize = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex), 0);
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w);
    });
    setActiveWindowId(id);
  }, []);

  const updatePosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x, y } } : w));
  }, []);

  return {
    windows,
    activeWindowId,
    openApp,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    updatePosition
  };
};
