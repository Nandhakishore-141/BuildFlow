import { motion } from 'framer-motion';

function MiniSidebar() {
  const items = [
    { active: true },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
  ];

  return (
    <div className="w-12 bg-neutral-900 rounded-l-xl flex flex-col items-center py-4 gap-3 shrink-0">
      <div className="w-6 h-6 rounded-md gradient-gold mb-2" />
      {items.map((item, i) => (
        <div
          key={i}
          className={`w-7 h-7 rounded-md ${
            item.active ? 'bg-gold-500/20 ring-1 ring-gold-500/40' : 'bg-neutral-800'
          }`}
        />
      ))}
    </div>
  );
}

function MetricCard({ label, value, trend, color }) {
  return (
    <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700/50">
      <p className="text-[10px] text-neutral-400 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-lg font-bold text-white">{value}</span>
        <span className={`text-[10px] font-medium ${color}`}>{trend}</span>
      </div>
    </div>
  );
}

function MiniChart() {
  const bars = [40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95];
  return (
    <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700/50">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] text-neutral-400 font-medium">Expense Overview</p>
        <span className="text-[9px] text-neutral-500">Last 12 months</span>
      </div>
      <div className="flex items-end gap-1 h-16">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: 0.8 + i * 0.05, duration: 0.4, ease: 'easeOut' }}
            className="flex-1 rounded-sm bg-gold-500/60 hover:bg-gold-500 transition-colors"
          />
        ))}
      </div>
    </div>
  );
}

function MiniTimeline() {
  const items = [
    { label: 'Foundation', progress: 100, color: 'bg-emerald-500' },
    { label: 'Framing', progress: 75, color: 'bg-gold-500' },
    { label: 'Electrical', progress: 30, color: 'bg-blue-500' },
    { label: 'Finishing', progress: 0, color: 'bg-neutral-600' },
  ];

  return (
    <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700/50">
      <p className="text-[10px] text-neutral-400 font-medium mb-3">Timeline</p>
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-neutral-300">{item.label}</span>
              <span className="text-[9px] text-neutral-500">{item.progress}%</span>
            </div>
            <div className="h-1.5 bg-neutral-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.progress}%` }}
                transition={{ delay: 1 + i * 0.15, duration: 0.6, ease: 'easeOut' }}
                className={`h-full rounded-full ${item.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniNotifications() {
  const notifications = [
    { text: 'Task "Wiring Phase 2" completed', time: '2m ago', dot: 'bg-emerald-500' },
    { text: 'New worker request received', time: '15m ago', dot: 'bg-gold-500' },
    { text: 'Material delivery confirmed', time: '1h ago', dot: 'bg-blue-500' },
  ];

  return (
    <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700/50">
      <p className="text-[10px] text-neutral-400 font-medium mb-3">Notifications</p>
      <div className="space-y-2.5">
        {notifications.map((n, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
            <div className="min-w-0">
              <p className="text-[10px] text-neutral-300 truncate">{n.text}</p>
              <p className="text-[9px] text-neutral-500">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniTasks() {
  const tasks = [
    { label: 'Review floor plans', done: true },
    { label: 'Order cement (50 bags)', done: true },
    { label: 'Inspect plumbing work', done: false },
    { label: 'Schedule electrician', done: false },
  ];

  return (
    <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700/50">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] text-neutral-400 font-medium">Today&apos;s Tasks</p>
        <span className="text-[9px] text-gold-500 font-medium">2/4</span>
      </div>
      <div className="space-y-2">
        {tasks.map((task, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center ${
                task.done
                  ? 'bg-gold-500 border-gold-500'
                  : 'border-neutral-600 bg-transparent'
              }`}
            >
              {task.done && (
                <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6L5 8.5L9.5 3.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-[10px] ${
                task.done
                  ? 'text-neutral-500 line-through'
                  : 'text-neutral-300'
              }`}
            >
              {task.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
      className="relative"
    >
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-b from-gold-500/10 via-gold-500/5 to-transparent rounded-2xl blur-2xl" />

      {/* Dashboard Container */}
      <div className="relative bg-neutral-900 rounded-xl border border-neutral-700/50 shadow-2xl shadow-black/40 overflow-hidden">
        {/* Window Controls */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-neutral-900 border-b border-neutral-800">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <div className="flex-1 flex justify-center">
            <div className="px-8 py-0.5 bg-neutral-800 rounded text-[9px] text-neutral-500">
              app.buildflow.io/dashboard
            </div>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="flex">
          <MiniSidebar />

          <div className="flex-1 p-3 space-y-3 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-white">
                  Project Dashboard
                </h3>
                <p className="text-[9px] text-neutral-500">
                  Welcome back, Anand
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                </div>
                <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-[8px] font-bold text-gold-400">
                  AM
                </div>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-4 gap-2">
              <MetricCard
                label="Active Projects"
                value="12"
                trend="+2 this week"
                color="text-emerald-400"
              />
              <MetricCard
                label="Workers Online"
                value="45"
                trend="89% present"
                color="text-emerald-400"
              />
              <MetricCard
                label="Pending Tasks"
                value="28"
                trend="6 overdue"
                color="text-amber-400"
              />
              <MetricCard
                label="Monthly Expense"
                value="₹24L"
                trend="-8% vs last"
                color="text-emerald-400"
              />
            </div>

            {/* Charts + Notifications */}
            <div className="grid grid-cols-2 gap-2">
              <MiniChart />
              <MiniTasks />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <MiniTimeline />
              <MiniNotifications />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
