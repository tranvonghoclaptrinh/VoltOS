import React from 'react';
import { Plus, X } from 'lucide-react';

interface PollCreatorProps {
  options: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onClose: () => void;
}

export const PollCreator: React.FC<PollCreatorProps> = ({ options, onChange, onAdd, onRemove, onClose }) => {
  return (
    <div className="mt-4 p-4 rounded-2xl border space-y-3" style={{ backgroundColor: 'var(--hover-bg)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Poll Options</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X size={16} />
        </button>
      </div>
      
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => onChange(index, e.target.value)}
            className="flex-1 bg-white dark:bg-slate-800 rounded-xl px-4 py-2 text-sm outline-none border"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
          {options.length > 2 && (
            <button onClick={() => onRemove(index)} className="text-slate-400 hover:text-rose-500">
              <X size={18} />
            </button>
          )}
        </div>
      ))}
      
      {options.length < 5 && (
        <button 
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed text-xs font-bold transition-colors"
          style={{ borderColor: 'var(--border-color)', color: 'var(--accent)' }}
        >
          <Plus size={14} />
          Add Option
        </button>
      )}
    </div>
  );
};
