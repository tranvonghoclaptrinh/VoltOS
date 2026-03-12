import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { WindowState } from '../types';

interface WindowProps {
  window: WindowState;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onPositionChange: (x: number, y: number) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  window,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  children
}) => {
  const nodeRef = useRef(null);

  if (!window.isOpen || window.isMinimized) return null;

  const style: React.CSSProperties = {
    zIndex: window.zIndex,
    position: 'absolute',
    width: window.isMaximized ? '100%' : window.size.width,
    height: window.isMaximized ? 'calc(100% - 48px)' : window.size.height,
    top: window.isMaximized ? 0 : undefined,
    left: window.isMaximized ? 0 : undefined,
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-header"
      bounds="parent"
      defaultPosition={window.position}
      position={window.isMaximized ? { x: 0, y: 0 } : undefined}
      onStart={onFocus}
      onStop={(_, data) => onPositionChange(data.x, data.y)}
      disabled={window.isMaximized}
    >
      <motion.div
        ref={nodeRef}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        style={style}
        className={`flex flex-col glass-panel rounded-xl overflow-hidden shadow-2xl transition-shadow duration-200 ${
          isActive ? 'ring-1 ring-[var(--accent)]/30 shadow-volt-primary/10' : 'opacity-95'
        }`}
        onClick={onFocus}
      >
        {/* Window Header */}
        <div className="window-header h-12 flex items-center justify-between px-5 cursor-default select-none">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--hover-bg)' }}>
              <window.icon size={14} style={{ color: 'var(--accent)' }} />
            </div>
            <span className="text-xs font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{window.title}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
              className="p-2 rounded-xl transition-colors hover:bg-[var(--hover-bg)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Minus size={14} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onMaximize(); }}
              className="p-2 rounded-xl transition-colors hover:bg-[var(--hover-bg)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              {window.isMaximized ? <Square size={12} /> : <Maximize2 size={14} />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="p-2 rounded-xl hover:bg-rose-500 hover:text-white transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-hidden" style={{ backgroundColor: 'var(--window-bg)' }}>
          {children}
        </div>
      </motion.div>
    </Draggable>
  );
};
