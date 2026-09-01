import { cn } from '@/utils/cn';

export const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "gold", className, subtitle }) => {
  const colorMap = {
    gold: "bg-gold-500/10 text-gold-400 border-gold-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    neutral: "bg-zinc-800 text-zinc-400 border-zinc-700",
  };

  const displayValue = (value !== undefined && value !== null && !Number.isNaN(value) && value !== '') ? value : 0;

  return (
    <div className={cn("bg-zinc-900/80 p-5 rounded-xl border border-zinc-800/80 flex flex-col justify-between min-h-[110px] backdrop-blur-sm hover:border-zinc-700/80 transition-colors duration-200", className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-zinc-400">{title}</span>
        {Icon && (
          <div className={cn("p-2 rounded-lg border shrink-0", colorMap[color] || colorMap.gold)}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-zinc-100 tracking-tight">{displayValue}</span>
          {trend && (
            <span className={cn(
              "text-xs font-semibold flex items-center",
              trend === 'up' ? "text-emerald-400" : trend === 'down' ? "text-red-400" : "text-zinc-500"
            )}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '−'} {trendValue}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-zinc-500 mt-1 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
