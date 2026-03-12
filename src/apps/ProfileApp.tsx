import React, { useState } from 'react';
import { usePosts } from '../hooks/usePosts';
import { useUser } from '../hooks/useUser';
import { PostCard } from '../components/Feed/PostCard';
import { Edit3, MapPin, Link as LinkIcon, Calendar, Check, X } from 'lucide-react';

export const ProfileApp: React.FC = () => {
  const { posts, likePost, addComment } = usePosts();
  const { user, loading, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(user?.bio || '');

  if (loading || !user) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-volt-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const myPosts = posts.filter(p => p.authorId === user.id);

  const handleSave = async () => {
    await updateProfile({ bio: editedBio });
    setIsEditing(false);
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar" style={{ backgroundColor: 'var(--window-bg)' }}>
      {/* Cover & Header */}
      <div className="relative h-48 bg-gradient-to-r from-volt-primary via-volt-purple to-volt-orange">
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <img src={user.avatar} alt="" className="w-32 h-32 rounded-3xl border-4 shadow-xl" style={{ borderColor: 'var(--window-bg)' }} />
          <div className="mb-4">
            <h1 className="text-3xl font-display font-bold drop-shadow-sm" style={{ color: 'var(--text-primary)' }}>{user.name}</h1>
            <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>@{user.username}</p>
          </div>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => {
              setEditedBio(user.bio);
              setIsEditing(true);
            }}
            className="absolute bottom-4 right-8 bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/30 transition-all"
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        ) : (
          <div className="absolute bottom-4 right-8 flex gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/30 transition-all"
            >
              <X size={16} /> Cancel
            </button>
            <button 
              onClick={handleSave}
              className="bg-volt-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-volt-primary/20 hover:scale-105 transition-all"
            >
              <Check size={16} /> Save
            </button>
          </div>
        )}
      </div>

      <div className="pt-20 px-8 pb-8 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="card-volt p-6">
            <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>About</h3>
            {isEditing ? (
              <textarea 
                className="w-full border rounded-xl p-3 text-sm outline-none h-32 resize-none"
                style={{ backgroundColor: 'var(--hover-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
              />
            ) : (
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>{user.bio}</p>
            )}
            
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
                <MapPin size={16} /> <span className="text-xs font-medium">San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-3" style={{ color: 'var(--accent)' }}>
                <LinkIcon size={16} /> <span className="text-xs font-bold hover:underline cursor-pointer">voltos.io/{user.username}</span>
              </div>
              <div className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
                <Calendar size={16} /> <span className="text-xs font-medium">Joined March 2024</span>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{user.followers}</div>
                <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Followers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{user.following}</div>
                <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Following</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{user.postsCount}</div>
                <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Posts</div>
              </div>
            </div>
          </div>

          <div className="card-volt p-6">
            <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Photos</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <img key={i} src={`https://picsum.photos/seed/profile${i}/200/200`} className="w-full aspect-square rounded-lg object-cover" />
              ))}
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <button className="text-sm font-bold border-b-2 pb-2 px-2" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}>Posts</button>
            <button className="text-sm font-bold pb-2 px-2 hover:opacity-80 transition-colors" style={{ color: 'var(--text-muted)' }}>Media</button>
            <button className="text-sm font-bold pb-2 px-2 hover:opacity-80 transition-colors" style={{ color: 'var(--text-muted)' }}>Likes</button>
          </div>
          
          {myPosts.map(post => (
            <PostCard key={post.id} post={post} onLike={likePost} onComment={addComment} />
          ))}
        </div>
      </div>
    </div>
  );
};
