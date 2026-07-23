import { Image as ImageIcon } from 'lucide-react';

export const GalleryPlaceholder = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-square bg-neutral-100 rounded-xl border border-neutral-200 flex flex-col items-center justify-center text-neutral-400">
          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
          <span className="text-xs font-medium">Image {i + 1}</span>
        </div>
      ))}
    </div>
  );
};
