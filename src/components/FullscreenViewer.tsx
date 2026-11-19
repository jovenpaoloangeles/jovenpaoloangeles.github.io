import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// The viewer's whole state: closed (null) or open on one image of a gallery.
// A single value makes "open with no gallery" unrepresentable, and keeping the
// component mounted while closed lets AnimatePresence play the exit fade.
export type ViewerState = { images: string[]; index: number } | null;

interface FullscreenViewerProps {
  state: ViewerState;
  onChange: (next: ViewerState) => void;
}

export function FullscreenViewer({ state, onChange }: FullscreenViewerProps) {
  const step = (delta: number) => {
    if (!state) return;
    const n = state.images.length;
    onChange({ ...state, index: (state.index + delta + n) % n });
  };

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={(e) => e.target === e.currentTarget && onChange(null)}
        >
          {/* Close button */}
          <button
            onClick={() => onChange(null)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Close viewer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Next image"
          >
            →
          </button>

          {/* Image container */}
          <motion.div
            key={state.index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-[90vw] h-[90vh] flex items-center justify-center"
          >
            <img
              src={state.images[state.index]}
              alt={`Image ${state.index + 1} of ${state.images.length}`}
              className="max-w-full max-h-full object-contain"
              style={{ margin: 'auto' }}
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
