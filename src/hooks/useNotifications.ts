import { useState, useEffect, useCallback } from 'react';
import { Notification } from '../types';
import { mockApi } from '../mock/mockApi';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastNotification, setLastNotification] = useState<Notification | null>(null);

  const fetchNotifications = useCallback(async () => {
    const data = await mockApi.getNotifications();
    setNotifications(data);
    setUnreadCount(data.filter(n => !n.read).length);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handleUpdate = (e: any) => {
      fetchNotifications();
      if (e.detail) {
        setLastNotification(e.detail);
        setTimeout(() => setLastNotification(null), 5000);
      }
    };
    window.addEventListener('volt_new_notification', handleUpdate);
    return () => window.removeEventListener('volt_new_notification', handleUpdate);
  }, [fetchNotifications]);

  const markAsRead = async () => {
    const updated = await mockApi.markNotificationsRead();
    setNotifications(updated);
    setUnreadCount(0);
  };

  return { notifications, unreadCount, lastNotification, markAsRead };
};
