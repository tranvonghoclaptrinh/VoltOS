import React, { useCallback } from 'react';
import { X, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MediaFile {
  type: 'image' | 'video';
  url: string;
}

interface MediaUploadProps {
  media: MediaFile[];
  onRemove: (index: number) => void;
  onAdd: (files: FileList | null) => void;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({ media, onRemove, onAdd }) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    onAdd(e.dataTransfer.files);
  }, [onAdd]);

  if (media.length === 0) return null;

  return (
    <div 
      className="mt-4 grid gap-2"
      style={{ 
        gridTemplateColumns: media.length === 1 ? '1fr' : media.length === 2 ? '1fr 1fr' : 'repeat(auto-fill, minmax(150px, 1fr))'
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <AnimatePresence>
        {media.map((item, index) => (
          <motion.div
            key={item.url + index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative aspect-square rounded-2xl overflow-hidden border group"
            style={{ borderColor: 'var(--border-color)' }}
          >
            {item.type === 'image' ? (
              <img src={item.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center relative">
                <video src={item.url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play size={32} className="text-white fill-white" />
                </div>
              </div>
            )}
            
            <button
              onClick={() => onRemove(index)}
              className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
