import React, { useState, useRef } from 'react';
import { MoreHorizontal, Heart, MessageCircle, Share2, Send, Repeat2, MapPin, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Post } from '../../types';
import { CURRENT_USER } from '../../mock/mockData';

interface PostCardProps {
  post: Post;
  onLike: (id: string, userId: string) => void;
  onComment: (id: string, content: string) => void;
  onRepost?: (id: string) => void;
  onReaction?: (id: string, userId: string, emoji: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment, onRepost, onReaction }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showReactions, setShowReactions] = useState(false);
  const reactionsTimeoutRef = useRef<any>(null);
  
  const userReaction = Object.keys(post.reactions || {}).find(key => 
    post.reactions?.[key].includes(CURRENT_USER.id)
  );
  
  const totalReactions = Object.values(post.reactions || {}).reduce<number>((acc, ids) => acc + (ids as string[]).length, 0);

  const reactions = ['❤️', '👍', '😂', '😮', '🔥', '😢'];

  const handleReactionMouseEnter = () => {
    if (reactionsTimeoutRef.current) clearTimeout(reactionsTimeoutRef.current);
    setShowReactions(true);
  };

  const handleReactionMouseLeave = () => {
    reactionsTimeoutRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 250);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(url);
    // Use a custom toast instead of alert in a real app
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText('');
  };

  const formatContent = (text: string) => {
    return text.split(' ').map((word, i) => {
      if (word.startsWith('#')) {
        return <span key={i} className="font-bold hover:underline cursor-pointer" style={{ color: 'var(--accent)' }}>{word} </span>;
      }
      if (word.startsWith('@')) {
        return <span key={i} className="font-bold hover:underline cursor-pointer" style={{ color: 'var(--accent)' }}>{word} </span>;
      }
      return word + ' ';
    });
  };

  const renderMedia = () => {
    if (!post.media || post.media.length === 0) return null;

    const gridClass = post.media.length === 1 ? 'grid-cols-1' : post.media.length === 2 ? 'grid-cols-2' : 'grid-cols-2';

    return (
      <div className={`grid ${gridClass} gap-2 mb-4 rounded-2xl overflow-hidden border`} style={{ borderColor: 'var(--border-color)' }}>
        {post.media.map((item, i) => (
          <div key={i} className={`relative ${post.media!.length === 3 && i === 0 ? 'row-span-2' : 'aspect-square'} overflow-hidden bg-black/5`}>
            {item.type === 'image' ? (
              <img src={item.url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full relative">
                <video src={item.url} className="w-full h-full object-cover" muted loop autoPlay />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <Play size={40} className="text-white fill-white opacity-80" />
                </div>
              </div>
            )}
            {post.media!.length > 4 && i === 3 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl">
                +{post.media!.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderPoll = () => {
    if (!post.poll) return null;

    const totalVotes = post.poll.options.reduce((acc, opt) => acc + opt.votes.length, 0);

    return (
      <div className="mb-4 p-4 rounded-2xl border space-y-3" style={{ backgroundColor: 'var(--hover-bg)', borderColor: 'var(--border-color)' }}>
        <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{post.poll.question}</h4>
        <div className="space-y-2">
          {post.poll.options.map(opt => {
            const percentage = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
            const hasVoted = opt.votes.includes(CURRENT_USER.id);

            return (
              <button 
                key={opt.id}
                className="w-full relative h-10 rounded-xl overflow-hidden border transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}
              >
                <div 
                  className="absolute inset-y-0 left-0 transition-all duration-1000"
                  style={{ 
                    width: `${percentage}%`, 
                    backgroundColor: hasVoted ? 'rgba(var(--accent-rgb), 0.2)' : 'var(--hover-bg)' 
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-bold">
                  <span style={{ color: 'var(--text-primary)' }}>{opt.text}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{percentage}%</span>
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          {totalVotes} votes • 2 days left
        </p>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-volt p-5 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover border-2" style={{ borderColor: 'var(--hover-bg)' }} referrerPolicy="no-referrer" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{post.authorName}</h3>
              {post.location && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                  <MapPin size={10} />
                  {post.location}
                </div>
              )}
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.time}</p>
          </div>
        </div>
        <button className="p-1 rounded-lg hover:bg-[var(--hover-bg)] transition-colors" style={{ color: 'var(--text-muted)' }}>
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-primary)' }}>{formatContent(post.content)}</p>
      
      {renderMedia()}
      {renderPoll()}
      
      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-4">
          <div 
            className="relative"
            onMouseEnter={handleReactionMouseEnter}
            onMouseLeave={handleReactionMouseLeave}
          >
            <AnimatePresence>
              {showReactions && (
                <motion.div 
                  initial={{ opacity: 0, y: 5, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.9 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-0 bottom-full mb-2.5 flex gap-1 z-50 border border-black/5"
                  style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '24px', 
                    padding: '6px 10px', 
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)' 
                  }}
                >
                  {reactions.map(emoji => (
                    <button 
                      key={emoji}
                      onClick={(e) => {
                        e.stopPropagation();
                        onReaction?.(post.id, CURRENT_USER.id, emoji);
                        setShowReactions(false);
                      }}
                      className="text-xl hover:scale-[1.35] transition-transform px-1 duration-150 origin-bottom"
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={() => onReaction?.(post.id, CURRENT_USER.id, userReaction || '❤️')}
              className={`flex items-center gap-2 transition-colors group`}
              style={{ color: userReaction ? 'var(--accent)' : 'var(--text-secondary)' }}
            >
              <motion.div 
                key={userReaction || 'none'}
                animate={userReaction ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.2 }}
                className={`p-2 rounded-full ${userReaction ? 'bg-[var(--accent)]/10' : 'group-hover:bg-rose-500/10'}`}
              >
                {userReaction ? (
                  <span className="text-lg leading-none">{userReaction}</span>
                ) : (
                  <Heart size={20} fill="none" />
                )}
              </motion.div>
              <span className="text-sm font-medium">{totalReactions}</span>
            </button>
          </div>

          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 transition-colors group"
            style={{ color: 'var(--text-secondary)' }}
          >
            <div className="p-2 rounded-full group-hover:bg-[var(--hover-bg)]">
              <MessageCircle size={20} />
            </div>
            <span className="text-sm font-medium">{post.comments.length}</span>
          </button>

          <button 
            onClick={() => onRepost?.(post.id)}
            className="flex items-center gap-2 transition-colors group"
            style={{ color: 'var(--text-secondary)' }}
          >
            <div className="p-2 rounded-full group-hover:bg-[var(--hover-bg)]">
              <Repeat2 size={20} />
            </div>
            <span className="text-sm font-medium">{post.reposts || 0}</span>
          </button>
        </div>

        <button 
          onClick={handleShare}
          className="flex items-center gap-2 transition-colors group"
          style={{ color: 'var(--text-secondary)' }}
        >
          <div className="p-2 rounded-full group-hover:bg-[var(--hover-bg)]">
            <Share2 size={20} />
          </div>
          <span className="text-sm font-medium">Share</span>
        </button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t space-y-4" style={{ borderColor: 'var(--border-color)' }}>
              {post.comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <img src={comment.authorAvatar} alt="" className="w-8 h-8 rounded-full shrink-0" />
                  <div className="flex-1 p-3 rounded-2xl text-sm" style={{ backgroundColor: 'var(--hover-bg)' }}>
                    <div className="flex justify-between mb-1">
                      <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{comment.authorName}</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{comment.time}</span>
                    </div>
                    <p style={{ color: 'var(--text-primary)' }}>{comment.content}</p>
                  </div>
                </div>
              ))}
              
              <form onSubmit={handleSubmitComment} className="flex gap-3 pt-2">
                <img src={CURRENT_USER.avatar} alt="" className="w-8 h-8 rounded-full shrink-0" />
                <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--hover-bg)' }}>
                  <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                    style={{ color: 'var(--text-primary)' }}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button type="submit" className="hover:scale-110 transition-transform" style={{ color: 'var(--accent)' }}>
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
