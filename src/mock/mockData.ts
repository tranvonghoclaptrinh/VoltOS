import { User, Post, Community, Notification, Message } from '../types';

export const CURRENT_USER: User = {
  id: 'user-1',
  name: 'Alex Rivera',
  username: 'alex_rivera',
  avatar: 'https://picsum.photos/seed/user1/100/100',
  bio: 'Product Designer @ Volt OS • Coffee Enthusiast ☕️',
  followers: 8420,
  following: 1240,
  postsCount: 452,
  status: 'online'
};

export const MOCK_USERS: User[] = [
  CURRENT_USER,
  { id: 'user-2', name: 'Jordan Smith', username: 'jordan_s', avatar: 'https://picsum.photos/seed/user2/100/100', status: 'online', bio: 'Building the future of web.' },
  { id: 'user-3', name: 'Elena Gilbert', username: 'elena_g', avatar: 'https://picsum.photos/seed/user3/100/100', status: 'away', bio: 'Traveler & Photographer' },
  { id: 'user-4', name: 'Marcus Wright', username: 'marcus_w', avatar: 'https://picsum.photos/seed/user4/100/100', status: 'online', bio: 'Software Engineer @ TechCorp' },
  { id: 'user-5', name: 'Lila Vance', username: 'lila_v', avatar: 'https://picsum.photos/seed/user5/100/100', status: 'offline', bio: 'Digital Artist' },
  { id: 'user-6', name: 'Sarah Chen', username: 'sarah_c', avatar: 'https://picsum.photos/seed/user6/100/100', status: 'online', bio: 'UX Researcher' },
  { id: 'user-7', name: 'David Miller', username: 'david_m', avatar: 'https://picsum.photos/seed/user7/100/100', status: 'away', bio: 'Fitness Coach' },
  { id: 'user-8', name: 'Emma Wilson', username: 'emma_w', avatar: 'https://picsum.photos/seed/user8/100/100', status: 'online', bio: 'Content Creator' },
  { id: 'user-9', name: 'James Bond', username: '007', avatar: 'https://picsum.photos/seed/user9/100/100', status: 'offline', bio: 'Secret Agent' },
  { id: 'user-10', name: 'Olivia Brown', username: 'olivia_b', avatar: 'https://picsum.photos/seed/user10/100/100', status: 'online', bio: 'Marketing Specialist' },
];

const generatePosts = (): Post[] => {
  const posts: Post[] = [];
  const contents = [
    "Just finished setting up the new workspace at Volt HQ! The view is incredible. 🚀 #VoltOS #TechLife",
    "Does anyone have recommendations for the best UI patterns for ecosystem dashboards? Looking for something minimal but powerful. #UI #Design",
    "Exploring the mountains this weekend. Nature is the best reset. 🏔️ #Adventure #Nature",
    "Just released a new open-source project! Check it out on my profile. 💻 #OpenSource #Coding",
    "The new update for Volt OS is looking sharp. Great job team! 👏 #VoltOS #Update",
    "Coffee and code. The perfect morning. ☕️💻 #DeveloperLife #MorningRoutine",
    "Finally caught the sunset today. Absolutely breathtaking. 🌅 #Sunset #Photography",
    "Learning React Server Components today. It's a game changer! ⚛️ #React #WebDev",
    "Who's excited for the upcoming tech conference? Can't wait to see the new innovations. 🚀 #TechConf #Innovation",
    "Just hit 8k followers! Thank you all for the support. ❤️ #Milestone #Grateful"
  ];

  for (let i = 1; i <= 38; i++) {
    const user = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
    const hasMedia = i % 4 === 0;
    const hasPoll = i % 7 === 0;
    
    posts.push({
      id: `post-${i}`,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      time: `${Math.floor(Math.random() * 24)}h ago`,
      content: contents[i % contents.length],
      visibility: 'public',
      media: hasMedia ? [
        { type: 'image', url: `https://picsum.photos/seed/post${i}a/800/600` },
        { type: 'image', url: `https://picsum.photos/seed/post${i}b/800/600` }
      ] : undefined,
      poll: hasPoll ? {
        question: "What's your favorite OS feature?",
        options: [
          { id: 'o1', text: 'Window Management', votes: ['user-1', 'user-2'] },
          { id: 'o2', text: 'Social Feed', votes: ['user-3'] },
          { id: 'o3', text: 'Messenger', votes: [] }
        ]
      } : undefined,
      reactions: {
        '❤️': MOCK_USERS.slice(0, Math.floor(Math.random() * 4)).map(u => u.id),
        '👍': MOCK_USERS.slice(4, Math.floor(Math.random() * 8)).map(u => u.id)
      },
      likes: [],
      comments: [
        {
          id: `c-${i}-1`,
          authorId: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)].id,
          authorName: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)].name,
          authorAvatar: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)].avatar,
          content: "Great post!",
          time: "1h ago"
        }
      ]
    });
  }
  return posts;
};

export const MOCK_POSTS: Post[] = generatePosts();

export const MOCK_COMMUNITIES: Community[] = [
  { id: 'comm-1', name: 'Design Systems', members: '12.4k', icon: '🎨', description: 'A place for designers and developers to share patterns and components.' },
  { id: 'comm-2', name: 'React Developers', members: '45.2k', icon: '⚛️', description: 'Everything React, from hooks to server components.' },
  { id: 'comm-3', name: 'Future Tech', members: '8.9k', icon: '🔮', description: 'Exploring the next frontier of human-computer interaction.' },
];

export const MOCK_FRIENDS: User[] = MOCK_USERS.filter(u => u.id !== CURRENT_USER.id);

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'like', senderName: 'Sarah Chen', senderAvatar: 'https://picsum.photos/seed/user6/100/100', content: 'liked your post.', time: '2m ago', read: false },
  { id: 'n2', type: 'comment', senderName: 'Jordan Smith', senderAvatar: 'https://picsum.photos/seed/user2/100/100', content: 'commented on your post.', time: '15m ago', read: false },
  { id: 'n3', type: 'community', senderName: 'Design Systems', senderAvatar: '🎨', content: 'has 12 new posts.', time: '1h ago', read: true },
  { id: 'n4', type: 'message', senderName: 'Elena Gilbert', senderAvatar: 'https://picsum.photos/seed/user3/100/100', content: 'sent you a message.', time: '2h ago', read: true },
];

export const MOCK_MESSAGES: Message[] = [
  { id: 'm1', senderId: 'user-2', receiverId: 'user-1', content: 'Hey Alex, how is the new OS coming along?', time: '10:30 AM' },
  { id: 'm2', senderId: 'user-1', receiverId: 'user-2', content: 'It is going great! Just working on the window management system now.', time: '10:32 AM' },
  { id: 'm3', senderId: 'user-2', receiverId: 'user-1', content: 'Awesome, can’t wait to try it out.', time: '10:35 AM' },
];
