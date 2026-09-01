export const TimelinePlaceholder = ({ items = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-zinc-600 ring-4 ring-zinc-900"></div>
            {index < items - 1 && <div className="w-px h-full bg-zinc-800 my-1"></div>}
          </div>
          <div className="pb-6 w-full">
            <div className="h-4 bg-zinc-800 rounded-md w-1/4 animate-pulse mb-2"></div>
            <div className="h-3 bg-zinc-800/60 rounded-md w-3/4 animate-pulse mb-1"></div>
            <div className="h-3 bg-zinc-800/60 rounded-md w-1/2 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
