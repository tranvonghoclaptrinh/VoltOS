import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Hash, 
  Image as ImageIcon, 
  Smile, 
  BarChart2, 
  MapPin, 
  Send, 
  X,
  Globe,
  Users,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CURRENT_USER } from '../../../mock/mockData';
import { EmojiPicker } from './EmojiPicker';
import { MediaUpload } from './MediaUpload';
import { PollCreator } from './PollCreator';
import { VisibilitySelector } from './VisibilitySelector';
import { MentionList } from './MentionList';

interface PostComposerProps {
  onPost: (
    content: string, 
    media?: { type: 'image' | 'video'; url: string }[],
    poll?: any,
    location?: string,
    visibility?: 'public' | 'friends' | 'private'
  ) => void;
}

export const PostComposer: React.FC<PostComposerProps> = ({ onPost }) => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [media, setMedia] = useState<{ type: 'image' | 'video'; url: string }[]>([]);
  const [pollOptions, setPollOptions] = useState<string[]>([]);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private'>('public');
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);

    // Mention detection
    const lastWord = value.split(/\s/).pop() || '';
    if (lastWord.startsWith('@') && lastWord.length > 1) {
      setMentionQuery(lastWord.slice(1));
    } else {
      setMentionQuery(null);
    }
  };

  const handleMentionSelect = (username: string) => {
    const words = content.split(/\s/);
    words.pop();
    setContent([...words, `@${username} `].join(' '));
    setMentionQuery(null);
    textareaRef.current?.focus();
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newMedia = Array.from(files).map(file => {
      const type = file.type.startsWith('video') ? 'video' : 'image';
      // In a real app, we'd upload to a server. Here we use object URLs.
      return { type: type as 'image' | 'video', url: URL.createObjectURL(file) };
    });
    
    setMedia(prev => [...prev, ...newMedia]);
    setIsExpanded(true);
  };

  const handleSubmit = async () => {
    if ((!content.trim() && media.length === 0) || isPosting) return;
    
    setIsPosting(true);
    
    const poll = showPollCreator && pollOptions.filter(o => o.trim()).length >= 2 ? {
      question: content.split('\n')[0] || 'Poll',
      options: pollOptions.filter(o => o.trim()).map(text => ({
        id: `opt-${Math.random()}`,
        text,
        votes: []
      }))
    } : undefined;

    await onPost(content, media, poll, location || undefined, visibility);
    
    // Reset state
    setContent('');
    setMedia([]);
    setPollOptions([]);
    setShowPollCreator(false);
    setLocation(null);
    setIsExpanded(false);
    setIsPosting(false);
  };

  const canPost = content.trim().length > 0 || media.length > 0;

  return (
    <div className="card-volt p-5 mb-6 relative overflow-visible">
      <div className="flex gap-4">
        <img src={CURRENT_USER.avatar} alt="User" className="w-10 h-10 rounded-full shrink-0" referrerPolicy="no-referrer" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <VisibilitySelector value={visibility} onChange={setVisibility} />
            {location && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <MapPin size={10} />
                {location}
                <button onClick={() => setLocation(null)} className="ml-1 hover:text-emerald-700">
                  <X size={10} />
                </button>
              </div>
            )}
          </div>
          
          <textarea 
            ref={textareaRef}
            placeholder={`What's happening in your world, ${CURRENT_USER.name.split(' ')[0]}?`} 
            className="w-full bg-transparent text-sm outline-none resize-none transition-all min-h-[44px]"
            style={{ color: 'var(--text-primary)' }}
            value={content}
            onChange={handleContentChange}
            onFocus={() => setIsExpanded(true)}
            disabled={isPosting}
          />

          <MediaUpload 
            media={media} 
            onRemove={(index) => setMedia(prev => prev.filter((_, i) => i !== index))}
            onAdd={handleFileUpload}
          />

          {showPollCreator && (
            <PollCreator 
              options={pollOptions}
              onChange={(i, v) => {
                const newOpts = [...pollOptions];
                newOpts[i] = v;
                setPollOptions(newOpts);
              }}
              onAdd={() => setPollOptions([...pollOptions, ''])}
              onRemove={(i) => setPollOptions(pollOptions.filter((_, idx) => idx !== i))}
              onClose={() => {
                setShowPollCreator(false);
                setPollOptions([]);
              }}
            />
          )}

          <AnimatePresence>
            {mentionQuery !== null && (
              <MentionList query={mentionQuery} onSelect={handleMentionSelect} />
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {isExpanded && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-1">
            <label className="p-2 rounded-xl hover:bg-[var(--hover-bg)] transition-colors cursor-pointer group relative" title="Media">
              <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />
              <ImageIcon size={20} style={{ color: 'var(--accent)' }} />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Media</span>
            </label>
            
            <div className="relative">
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 rounded-xl hover:bg-[var(--hover-bg)] transition-colors group"
                title="Emoji"
              >
                <Smile size={20} style={{ color: '#eab308' }} />
              </button>
              <AnimatePresence>
                {showEmojiPicker && (
                  <EmojiPicker 
                    onSelect={(emoji) => setContent(prev => prev + emoji)} 
                    onClose={() => setShowEmojiPicker(false)} 
                  />
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => {
                if (!showPollCreator) {
                  setPollOptions(['', '']);
                  setShowPollCreator(true);
                } else {
                  setShowPollCreator(false);
                }
              }}
              className="p-2 rounded-xl hover:bg-[var(--hover-bg)] transition-colors group"
              title="Poll"
            >
              <BarChart2 size={20} style={{ color: '#6366f1' }} />
            </button>

            <button 
              onClick={() => {
                const loc = prompt('Enter location:');
                if (loc) setLocation(loc);
              }}
              className="p-2 rounded-xl hover:bg-[var(--hover-bg)] transition-colors group"
              title="Location"
            >
              <MapPin size={20} style={{ color: '#f43f5e' }} />
            </button>

            <button 
              onClick={() => setContent(prev => prev + '#')}
              className="p-2 rounded-xl hover:bg-[var(--hover-bg)] transition-colors group"
              title="Hashtag"
            >
              <Hash size={20} style={{ color: '#f97316' }} />
            </button>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => {
                setIsExpanded(false);
                setContent('');
                setMedia([]);
                setShowPollCreator(false);
                setLocation(null);
              }}
              className="px-4 py-2 text-sm font-bold"
              style={{ color: 'var(--text-muted)' }}
              disabled={isPosting}
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!canPost || isPosting}
              className={`text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 ${(!canPost || isPosting) ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ 
                backgroundColor: 'var(--accent)',
                boxShadow: canPost ? '0 10px 15px -3px rgba(var(--accent-rgb), 0.2)' : 'none'
              }}
            >
              {isPosting && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
