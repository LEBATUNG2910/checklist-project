import { MoreVertical, Sparkles } from "lucide-react";

export default function MiddleCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

      {/* Chart 1: Sprint Burn-down (Gradient Bars) */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-colors duration-300">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg transition-colors">Sprint Burn-down</h3>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><MoreVertical className="w-5 h-5" /></button>
        </div>
        <div className="h-48 flex items-end justify-between gap-3 px-2">
          <div className="flex gap-1.5 w-full justify-center items-end group"><div className="w-7 bg-slate-100 dark:bg-slate-800 h-40 rounded-t-md group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors"></div><div className="w-7 bg-gradient-to-t from-blue-600 to-indigo-400 h-32 rounded-t-md shadow-sm shadow-blue-200 dark:shadow-none"></div></div>
          <div className="flex gap-1.5 w-full justify-center items-end group"><div className="w-7 bg-slate-100 dark:bg-slate-800 h-32 rounded-t-md group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors"></div><div className="w-7 bg-gradient-to-t from-blue-600 to-indigo-400 h-24 rounded-t-md shadow-sm shadow-blue-200 dark:shadow-none"></div></div>
          <div className="flex gap-1.5 w-full justify-center items-end group"><div className="w-7 bg-slate-100 dark:bg-slate-800 h-24 rounded-t-md group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors"></div><div className="w-7 bg-gradient-to-t from-blue-600 to-indigo-400 h-16 rounded-t-md shadow-sm shadow-blue-200 dark:shadow-none"></div></div>
          <div className="flex gap-1.5 w-full justify-center items-end group"><div className="w-7 bg-slate-100 dark:bg-slate-800 h-16 rounded-t-md group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors"></div><div className="w-7 bg-gradient-to-t from-blue-600 to-indigo-400 h-12 rounded-t-md shadow-sm shadow-blue-200 dark:shadow-none"></div></div>
        </div>
        <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 font-bold tracking-wider mt-5 px-5 transition-colors">
          <span>MON</span><span>WED</span><span>FRI</span><span>SUN</span>
        </div>
      </div>

      {/* Chart 2: Work Distribution (SVG Donut - Fixed) */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col transition-colors duration-300">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-6 transition-colors">Work Distribution</h3>
        <div className="flex-1 flex flex-col items-center justify-center relative">

          {/* Donut chart container — w-48 h-48 to match r=70 viewBox */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg
              className="w-full h-full absolute inset-0"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>

              {/* Background track - đổi stroke màu sáng/tối tự động bằng currentColor */}
              <circle
                cx="100" cy="100" r="70"
                fill="none"
                className="text-slate-100 dark:text-slate-800 transition-colors duration-300"
                stroke="currentColor"
                strokeWidth="14"
              />

              <circle
                cx="100" cy="100" r="70"
                fill="none"
                stroke="url(#blueGrad)"
                strokeWidth="14"
                strokeDasharray="259.89 179.93"
                strokeDashoffset="109.96"
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />

              <circle
                cx="100" cy="100" r="70"
                fill="none"
                stroke="url(#orangeGrad)"
                strokeWidth="14"
                strokeDasharray="127.95 311.87"
                strokeDashoffset="109.96"
                strokeLinecap="round"
                transform="rotate(117.6 100 100)"
              />
            </svg>

            {/* Center label — sized to sit inside r=70 ring */}
            <div className="bg-white dark:bg-slate-900 w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-inner dark:shadow-none z-10 transition-colors duration-300">
              <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">124</span>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-1">Tasks</span>
            </div>
          </div>

          <div className="w-full mt-8 space-y-3 px-2">
            <div className="flex justify-between items-center text-sm bg-slate-50 dark:bg-slate-800/50 py-2 px-4 rounded-xl transition-colors duration-300">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm dark:shadow-none"></span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">Engineering</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">60%</span>
            </div>
            <div className="flex justify-between items-center text-sm bg-slate-50 dark:bg-slate-800/50 py-2 px-4 rounded-xl transition-colors duration-300">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-600 shadow-sm dark:shadow-none"></span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">Design</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">30%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blue Card: AI Insights (Futuristic Glassmorphism) */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-3xl p-7 shadow-xl shadow-indigo-200/50 dark:shadow-none flex flex-col relative overflow-hidden group">
        {/* Abstract glowing backgrounds */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/10 blur-3xl rounded-full group-hover:bg-white/20 transition-colors duration-500"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 blur-2xl rounded-full"></div>

        <div className="flex items-center gap-4 mb-7 relative z-10">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg leading-tight">AI Insights</h3>
            <p className="text-xs text-blue-200 mt-0.5">Refreshed 2m ago</p>
          </div>
        </div>

        <div className="space-y-3 flex-1 relative z-10">
          <div className="bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-colors rounded-2xl p-4 border border-white/10">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">Peak Productivity</h4>
            <p className="text-xs text-blue-100/90 mt-1.5 leading-relaxed">Optimal flow detected between 10 AM and 12 PM.</p>
          </div>
          <div className="bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-colors rounded-2xl p-4 border border-white/10">
            <h4 className="text-sm font-bold text-white">Workload Alert</h4>
            <p className="text-xs text-blue-100/90 mt-1.5 leading-relaxed">Reassign 2 backend tasks from Leslie to balance capacity.</p>
          </div>
          <div className="bg-rose-500/10 hover:bg-rose-500/20 backdrop-blur-sm transition-colors rounded-2xl p-4 border border-rose-500/20">
            <h4 className="text-sm font-bold text-rose-100">Risk Found</h4>
            <p className="text-xs text-rose-200/90 mt-1.5 leading-relaxed">&quot;Auth Module&quot; task trending towards a 48h delay.</p>
          </div>
        </div>

        <button className="relative z-10 w-full mt-6 bg-white/95 text-indigo-700 hover:bg-white py-3 rounded-2xl text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          View Audit Report
        </button>
      </div>

    </div>
  );
}