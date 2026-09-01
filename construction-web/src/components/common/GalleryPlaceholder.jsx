import { Image as ImageIcon } from 'lucide-react';

export const GalleryPlaceholder = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-square bg-zinc-900/60 rounded-xl border border-zinc-800 flex flex-col items-center justify-center text-zinc-500 hover:border-zinc-700 transition-colors">
          <ImageIcon className="w-8 h-8 mb-2 opacity-60 text-zinc-400" />
          <span className="text-xs font-medium text-zinc-400">Image {i + 1}</span>
        </div>
      ))}
    </div>
  );
};
