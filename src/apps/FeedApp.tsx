import React, { useState, useRef } from 'react';
import { usePosts } from '../hooks/usePosts';
import { PostCard } from '../components/Feed/PostCard';
import { PostComposer } from '../components/Feed/Composer/PostComposer';
import { Search } from 'lucide-react';

export const FeedApp: React.FC = () => {
  const { posts, loading, loadingMore, hasMore, loadMore, createPost, likePost, reactToPost, addComment } = usePosts();
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredPosts = posts.filter(p => 
    p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleScroll = () => {
    if (!scrollRef.current || loadingMore || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      loadMore();
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--desktop-bg)' }}>
      {/* App Header */}
      <div className="h-14 border-b flex items-center justify-between px-6 shrink-0" style={{ backgroundColor: 'var(--window-bg)', borderColor: 'var(--border-color)' }}>
        <h2 className="font-display font-bold text-lg" style={{ color: 'var(--accent)' }}>Ecosystem Feed</h2>
        <div className="flex items-center gap-2 rounded-xl px-3 py-1.5 w-64" style={{ backgroundColor: 'var(--hover-bg)' }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search feed..." 
            className="bg-transparent border-none outline-none text-xs w-full"
            style={{ color: 'var(--text-primary)' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* App Content */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 custom-scrollbar"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <PostComposer onPost={createPost} />
          
          {loading && posts.length === 0 ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <>
              {filteredPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={likePost} 
                  onReaction={reactToPost}
                  onComment={addComment} 
                />
              ))}
              {loadingMore && (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}></div>
                </div>
              )}
              {!hasMore && (
                <div className="text-center py-8 text-xs italic" style={{ color: 'var(--text-muted)' }}>
                  You've reached the end of the ecosystem.
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
              No posts found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
