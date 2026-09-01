export const TablePlaceholder = ({ columns = 4, rows = 5 }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-zinc-800/80 bg-zinc-900/60">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr className="bg-zinc-950/40 border-b border-zinc-800">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-6 py-4">
                <div className="h-4 bg-zinc-800 rounded-md w-24 animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-zinc-800/20 transition-colors">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <div className={`h-4 bg-zinc-800/80 rounded-md animate-pulse ${colIndex === 0 ? 'w-32' : colIndex === columns - 1 ? 'w-16' : 'w-24'}`}></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
