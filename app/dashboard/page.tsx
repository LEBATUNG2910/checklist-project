import ProjectHeader from "./components/ProjectHeader";
import MetricCards from "./components/MetricCards";
import MiddleCharts from "./components/MiddleCharts";
import ActiveContributors from "./components/ActiveContributors";
import { motion } from "framer-motion";

export default function DashboardView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto p-8"
    >
      <ProjectHeader />
      <MetricCards />
      <MiddleCharts />
      <ActiveContributors />
    </motion.div>
  );
}