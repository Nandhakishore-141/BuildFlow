import { cn } from '@/utils/cn';

export const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "gold", className, subtitle }) => {
  const colorMap = {
    gold: "bg-gold-50 text-gold-600 border-gold-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-emerald-50 text-emerald-600 border-emerald-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    red: "bg-red-50 text-red-600 border-red-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    neutral: "bg-neutral-50 text-neutral-600 border-neutral-200",
  };

  const displayValue = (value !== undefined && value !== null && !Number.isNaN(value) && value !== '') ? value : 0;

  return (
    <div className={cn("bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col justify-between min-h-[110px]", className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-neutral-500">{title}</span>
        {Icon && (
          <div className={cn("p-2 rounded-lg border shrink-0", colorMap[color] || colorMap.gold)}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-neutral-900 tracking-tight">{displayValue}</span>
          {trend && (
            <span className={cn(
              "text-xs font-semibold flex items-center",
              trend === 'up' ? "text-emerald-600" : trend === 'down' ? "text-red-600" : "text-neutral-500"
            )}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '−'} {trendValue}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-neutral-400 mt-1 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
