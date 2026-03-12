import React from 'react';
import { Globe, Users, Lock, ChevronDown } from 'lucide-react';

type Visibility = 'public' | 'friends' | 'private';

interface VisibilitySelectorProps {
  value: Visibility;
  onChange: (value: Visibility) => void;
}

export const VisibilitySelector: React.FC<VisibilitySelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const options = [
    { id: 'public', label: 'Public', icon: Globe },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'private', label: 'Only Me', icon: Lock },
  ];

  const current = options.find(o => o.id === value) || options[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-[var(--hover-bg)] transition-colors text-xs font-bold"
        style={{ color: 'var(--text-secondary)' }}
      >
        <current.icon size={14} />
        {current.label}
        <ChevronDown size={12} />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-32 rounded-xl shadow-xl border z-50 overflow-hidden"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => {
                onChange(opt.id as Visibility);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[var(--hover-bg)] transition-colors"
              style={{ color: value === opt.id ? 'var(--accent)' : 'var(--text-primary)' }}
            >
              <opt.icon size={14} />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
