import { ACTIVE_CONTRIBUTORS } from "@/lib/mock-data";
import Image from "next/image";

export default function ActiveContributors() {
  return (
    <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-8 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 transition-colors">Active Contributors</h3>
        <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">Manage Team ›</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ACTIVE_CONTRIBUTORS.map(user => (
          <div key={user.id} className="flex items-center gap-3 p-3 border border-slate-100 dark:border-slate-800/60 rounded-xl hover:shadow-md dark:hover:bg-slate-800/50 transition-all duration-300">
            <Image src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800" width={40} height={40} />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight transition-colors">{user.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">{user.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}