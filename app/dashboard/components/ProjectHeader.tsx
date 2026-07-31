import { Sparkles } from "lucide-react";

export default function ProjectHeader() {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-medium">
          <span>Projects</span>
          <span>›</span>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
            WorkAI Redesign
          </span>
        </div>
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight text-slate-900">
          WorkAI Redesign
        </h1>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> On Track
          </span>
          <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Due: Oct 24, 2026
          </span>
        </div>
      </div>

      <div className="w-full md:w-72 bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-end mb-3">
          <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" /> Project Progress
          </span>
          <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">68%</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100/80 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full relative" 
            style={{ width: "68%" }}
          >
            {/* Hiệu ứng bóng bẩy cho thanh progress */}
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-b from-white/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}