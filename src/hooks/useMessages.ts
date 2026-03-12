import { useState, useEffect, useCallback } from 'react';
import { Message } from '../types';
import { mockApi } from '../mock/mockApi';

export const useMessages = (chatId: string | null = null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    setLoading(true);
    const data = await mockApi.getMessages(chatId);
    setMessages(data);
    setLoading(false);
    updateUnreadCount();
  }, [chatId]);

  const updateUnreadCount = useCallback(async () => {
    const count = await mockApi.getUnreadMessageCount();
    setUnreadCount(count);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    const handleNewMessage = (e: any) => {
      const msg = e.detail;
      if (chatId && (msg.senderId === chatId || msg.receiverId === chatId)) {
        setMessages(prev => [...prev, msg]);
        setIsTyping(false);
      }
      updateUnreadCount();
    };
    
    const handleTyping = (e: any) => {
      if (chatId && e.detail.senderId === chatId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    };

    window.addEventListener('volt_new_message', handleNewMessage);
    window.addEventListener('volt_user_typing', handleTyping);
    return () => {
      window.removeEventListener('volt_new_message', handleNewMessage);
      window.removeEventListener('volt_user_typing', handleTyping);
    };
  }, [chatId, updateUnreadCount]);

  const sendMessage = async (content: string) => {
    if (!chatId) return;
    const newMsg = await mockApi.sendMessage(chatId, content);
    setMessages(prev => [...prev, newMsg]);
    
    // Simulate typing indicator from other user
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('volt_user_typing', { detail: { senderId: chatId } }));
    }, 1000);
  };

  return { messages, loading, isTyping, unreadCount, sendMessage };
};
