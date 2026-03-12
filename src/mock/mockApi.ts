import { Post, Message, Notification, Comment, User, Poll } from '../types';
import { MOCK_POSTS, MOCK_NOTIFICATIONS, CURRENT_USER, MOCK_MESSAGES, MOCK_USERS } from './mockData';
import { storage } from '../utils/storage';

const POSTS_KEY = 'volt_posts';
const MESSAGES_KEY = 'volt_messages';
const NOTIFICATIONS_KEY = 'volt_notifications';
const USER_KEY = 'volt_user';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // System
  resetData: async () => {
    await delay(1000);
    storage.set(POSTS_KEY, MOCK_POSTS);
    storage.set(MESSAGES_KEY, MOCK_MESSAGES);
    storage.set(NOTIFICATIONS_KEY, MOCK_NOTIFICATIONS);
    storage.set(USER_KEY, CURRENT_USER);
    window.location.reload();
  },

  // User
  getCurrentUser: async (): Promise<User> => {
    await delay(200);
    return storage.get(USER_KEY, CURRENT_USER);
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    await delay(500);
    const user = storage.get(USER_KEY, CURRENT_USER);
    const updated = { ...user, ...updates };
    storage.set(USER_KEY, updated);
    return updated;
  },

  // Posts
  getPosts: async (page: number = 1, limit: number = 5): Promise<Post[]> => {
    await delay(800);
    const allPosts = storage.get(POSTS_KEY, MOCK_POSTS);
    return allPosts.slice(0, page * limit);
  },

  createPost: async (
    content: string, 
    media?: { type: 'image' | 'video'; url: string }[],
    poll?: Poll,
    location?: string,
    visibility: 'public' | 'friends' | 'private' = 'public'
  ): Promise<Post> => {
    await delay(800);
    const posts = storage.get(POSTS_KEY, MOCK_POSTS);
    const user = storage.get(USER_KEY, CURRENT_USER);
    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      time: 'Just now',
      content,
      media,
      poll,
      location,
      visibility,
      likes: [],
      reactions: {},
      comments: []
    };
    storage.set(POSTS_KEY, [newPost, ...posts]);
    return newPost;
  },

  likePost: async (postId: string, userId: string): Promise<Post> => {
    return mockApi.reactToPost(postId, userId, '❤️');
  },

  reactToPost: async (postId: string, userId: string, emoji: string): Promise<Post> => {
    await delay(200);
    const posts = storage.get(POSTS_KEY, MOCK_POSTS);
    const user = storage.get(USER_KEY, CURRENT_USER);
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        const reactions = p.reactions || {};
        const newReactions = { ...reactions };
        
        // Find if user already has a reaction
        let existingEmoji: string | null = null;
        Object.keys(newReactions).forEach(key => {
          if (newReactions[key].includes(userId)) {
            existingEmoji = key;
          }
        });

        if (existingEmoji === emoji) {
          // Toggle off
          newReactions[emoji] = newReactions[emoji].filter(id => id !== userId);
        } else {
          // Remove old reaction if exists
          if (existingEmoji) {
            newReactions[existingEmoji] = newReactions[existingEmoji].filter(id => id !== userId);
          }
          // Add new reaction
          newReactions[emoji] = [...(newReactions[emoji] || []), userId];
          
          if (p.authorId !== userId) {
            mockApi.createNotification('like', user.name, user.avatar, `reacted ${emoji} to your post.`);
          }
        }

        return { ...p, reactions: newReactions };
      }
      return p;
    });
    storage.set(POSTS_KEY, updatedPosts);
    return updatedPosts.find(p => p.id === postId)!;
  },

  addComment: async (postId: string, content: string): Promise<Post> => {
    await delay(400);
    const posts = storage.get(POSTS_KEY, MOCK_POSTS);
    const user = storage.get(USER_KEY, CURRENT_USER);
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        const newComment: Comment = {
          id: `c-${Date.now()}`,
          authorId: user.id,
          authorName: user.name,
          authorAvatar: user.avatar,
          content,
          time: 'Just now'
        };
        
        if (p.authorId !== user.id) {
          mockApi.createNotification('comment', user.name, user.avatar, 'commented on your post.');
        }
        
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });
    storage.set(POSTS_KEY, updatedPosts);
    return updatedPosts.find(p => p.id === postId)!;
  },

  // Messages
  getMessages: async (chatId: string): Promise<Message[]> => {
    await delay(300);
    const user = storage.get(USER_KEY, CURRENT_USER);
    const allMessages = storage.get(MESSAGES_KEY, MOCK_MESSAGES);
    const chatMessages = allMessages.filter(m => 
      (m.senderId === user.id && m.receiverId === chatId) ||
      (m.senderId === chatId && m.receiverId === user.id)
    );
    
    // Mark as read
    const updatedAll = allMessages.map(m => {
      if (m.senderId === chatId && m.receiverId === user.id) {
        return { ...m, read: true };
      }
      return m;
    });
    storage.set(MESSAGES_KEY, updatedAll);
    
    return chatMessages;
  },

  sendMessage: async (receiverId: string, content: string): Promise<Message> => {
    await delay(300);
    const user = storage.get(USER_KEY, CURRENT_USER);
    const allMessages = storage.get(MESSAGES_KEY, MOCK_MESSAGES);
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: user.id,
      receiverId,
      content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    storage.set(MESSAGES_KEY, [...allMessages, newMessage]);

    // Simulate auto-reply
    setTimeout(async () => {
      const receiver = MOCK_USERS.find(u => u.id === receiverId);
      const reply: Message = {
        id: `m-${Date.now() + 1}`,
        senderId: receiverId,
        receiverId: user.id,
        content: `Hey! Thanks for reaching out. I'm currently busy working on Volt OS, but I'll get back to you soon!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      const currentMessages = storage.get(MESSAGES_KEY, MOCK_MESSAGES);
      storage.set(MESSAGES_KEY, [...currentMessages, reply]);
      
      mockApi.createNotification('message', receiver?.name || 'User', receiver?.avatar || '', 'sent you a message.');
      window.dispatchEvent(new CustomEvent('volt_new_message', { detail: reply }));
    }, 2000);

    return newMessage;
  },

  getUnreadMessageCount: async (): Promise<number> => {
    const user = storage.get(USER_KEY, CURRENT_USER);
    const allMessages = storage.get(MESSAGES_KEY, MOCK_MESSAGES);
    return allMessages.filter(m => m.receiverId === user.id && !m.read).length;
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    await delay(300);
    return storage.get(NOTIFICATIONS_KEY, MOCK_NOTIFICATIONS);
  },

  createNotification: (type: any, senderName: string, senderAvatar: string, content: string) => {
    const notifications = storage.get(NOTIFICATIONS_KEY, MOCK_NOTIFICATIONS);
    const newNotif: Notification = {
      id: `n-${Date.now()}`,
      type,
      senderName,
      senderAvatar,
      content,
      time: 'Just now',
      read: false
    };
    storage.set(NOTIFICATIONS_KEY, [newNotif, ...notifications]);
    window.dispatchEvent(new CustomEvent('volt_new_notification', { detail: newNotif }));
  },

  markNotificationsRead: async () => {
    const notifications = storage.get(NOTIFICATIONS_KEY, MOCK_NOTIFICATIONS);
    const updated = notifications.map(n => ({ ...n, read: true }));
    storage.set(NOTIFICATIONS_KEY, updated);
    return updated;
  }
};
