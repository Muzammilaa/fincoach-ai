import { useFinance } from "@/contexts/FinanceContext";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

export function GoalProgress() {
  const { data, goalProgress, monthlyGoalTarget } = useFinance();

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (goalProgress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Goal Progress</h3>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative h-32 w-32">
          <svg className="h-32 w-32 -rotate-90 transform">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              cx="64"
              cy="64"
              r="45"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{goalProgress}%</span>
            <span className="text-xs text-muted-foreground">complete</span>
          </div>
        </div>

        <div className="mt-4 w-full space-y-2 text-center">
          <p className="font-medium">{data.goal.name}</p>
          <p className="text-sm text-muted-foreground">
            ${data.goal.targetAmount.toLocaleString()} in {data.goal.timeframeMonths} months
          </p>
          <p className="text-xs text-primary">
            Need ${monthlyGoalTarget.toLocaleString()}/mo
          </p>
        </div>
      </div>
    </motion.div>
  );
}
