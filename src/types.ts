import React from 'react';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status?: 'online' | 'away' | 'offline';
  bio?: string;
  followers?: number;
  following?: number;
  postsCount?: number;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  time: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // User IDs
}

export interface Poll {
  question: string;
  options: PollOption[];
  expiresAt?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  time: string;
  content: string;
  media?: { type: 'image' | 'video'; url: string }[];
  poll?: Poll;
  location?: string;
  visibility: 'public' | 'friends' | 'private';
  likes: string[]; // Array of user IDs
  reactions?: { [key: string]: string[] }; // e.g., { '❤️': ['user1'], '👍': ['user2'] }
  comments: Comment[];
  reposts?: number;
  isRepost?: boolean;
  originalAuthor?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  time: string;
  read?: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'community' | 'message';
  senderName: string;
  senderAvatar: string;
  content: string;
  time: string;
  read: boolean;
}

export interface Community {
  id: string;
  name: string;
  members: string;
  icon: string;
  description: string;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: any;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
}

export interface AppConfig {
  id: string;
  name: string;
  icon: any;
  component: React.ComponentType<any>;
  defaultSize?: { width: number | string; height: number | string };
}
