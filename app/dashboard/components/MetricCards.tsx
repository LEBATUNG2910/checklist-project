import { DASHBOARD_METRICS } from "@/lib/mock-data";
import { Zap, Users, Timer, ShieldCheck } from "lucide-react";

// Helper hàm để áp dụng dải gradient cho từng loại thẻ
const getMetricStyles = (id: string) => {
  switch (id) {
    case "m1": return { 
      bgGrad: "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-200", 
      icon: <Zap className="w-5 h-5 text-white" />,
      textGrad: "from-blue-600 to-indigo-600"
    };
    case "m2": return { 
      bgGrad: "bg-gradient-to-br from-orange-400 to-amber-500 shadow-orange-200", 
      icon: <Users className="w-5 h-5 text-white" />,
      textGrad: "from-orange-600 to-amber-600"
    };
    case "m3": return { 
      bgGrad: "bg-gradient-to-br from-rose-500 to-red-600 shadow-red-200", 
      icon: <Timer className="w-5 h-5 text-white" />,
      textGrad: "from-rose-600 to-red-600"
    };
    case "m4": return { 
      bgGrad: "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-200", 
      icon: <ShieldCheck className="w-5 h-5 text-white" />,
      textGrad: "from-emerald-600 to-teal-600"
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
          <div key={metric.id} className="bg-white border border-slate-100/80 p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all relative overflow-hidden group">
            {/* Vệt sáng mờ ở background khi hover */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-2xl ${styles.bgGrad}`}></div>
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ${styles.bgGrad}`}>
                {styles.icon}
              </div>
              <span className={`text-xs font-bold bg-gradient-to-r ${styles.textGrad} bg-clip-text text-transparent`}>
                {metric.status}
              </span>
            </div>
            
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1.5">{metric.title}</p>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-3xl font-extrabold text-slate-900 leading-none tracking-tight">{metric.value}</h3>
                <span className="text-xs text-slate-500 font-medium">{metric.suffix}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}