import { DASHBOARD_METRICS } from "@/lib/mock-data";
import { Zap, Users, Timer, ShieldCheck } from "lucide-react";

// Helper hàm để áp dụng dải gradient cho từng loại thẻ
const getMetricStyles = (id: string) => {
  switch (id) {
    case "m1": return { 
      bgGrad: "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-200 dark:shadow-none", 
      icon: <Zap className="w-5 h-5 text-white" />,
      textGrad: "from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
    };
    case "m2": return { 
      bgGrad: "bg-gradient-to-br from-orange-400 to-amber-500 shadow-orange-200 dark:shadow-none", 
      icon: <Users className="w-5 h-5 text-white" />,
      textGrad: "from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400"
    };
    case "m3": return { 
      bgGrad: "bg-gradient-to-br from-rose-500 to-red-600 shadow-red-200 dark:shadow-none", 
      icon: <Timer className="w-5 h-5 text-white" />,
      textGrad: "from-rose-600 to-red-600 dark:from-rose-400 dark:to-red-400"
    };
    case "m4": return { 
      bgGrad: "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-200 dark:shadow-none", 
      icon: <ShieldCheck className="w-5 h-5 text-white" />,
      textGrad: "from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400"
    };
    default: return { bgGrad: "bg-slate-500", icon: null, textGrad: "" };
  }
};

export default function MetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {DASHBOARD_METRICS.map((metric) => {
        const styles = getMetricStyles(metric.id);
        
        return (
          <div key={metric.id} className="bg-white dark:bg-slate-900/50 border border-slate-100/80 dark:border-slate-800 p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg dark:hover:bg-slate-800/50 transition-all duration-300 relative overflow-hidden group">
            {/* Vệt sáng mờ ở background khi hover */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-2xl ${styles.bgGrad}`}></div>
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-none ${styles.bgGrad}`}>
                {styles.icon}
              </div>
              <span className={`text-xs font-bold bg-gradient-to-r ${styles.textGrad} bg-clip-text text-transparent`}>
                {metric.status}
              </span>
            </div>
            
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-1.5 transition-colors">{metric.title}</p>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-none tracking-tight transition-colors">{metric.value}</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">{metric.suffix}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}