import { useState, useMemo } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { InsightCard } from "./InsightCard";
import { Lightbulb } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Insight {
  id: string;
  type: "success" | "warning" | "danger";
  title: string;
  message: string;
}

export function SmartInsights() {
  const { data, totalExpenses, savingsRate, goalProgress } = useFinance();
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const insights = useMemo<Insight[]>(() => {
    const result: Insight[] = [];

    // Overspending warning
    if (totalExpenses > data.monthlyIncome) {
      result.push({
        id: "overspending",
        type: "danger",
        title: "Overspending Alert",
        message: `Your expenses ($${totalExpenses.toLocaleString()}) exceed your income ($${data.monthlyIncome.toLocaleString()}). Consider reducing non-essential spending.`,
      });
    }

    // Low savings rate
    if (savingsRate < 20 && savingsRate > 0) {
      result.push({
        id: "low-savings",
        type: "warning",
        title: "Savings Opportunity",
        message: `Your savings rate is ${savingsRate}%. Financial experts recommend saving at least 20% of your income. Try to identify areas to cut back.`,
      });
    }

    // Good goal progress
    if (goalProgress >= 80) {
      result.push({
        id: "goal-progress",
        type: "success",
        title: "Great Progress! 🎉",
        message: `You're ${goalProgress}% on track to reach your goal of ${data.goal.name}. Keep up the excellent work!`,
      });
    }

    // Healthy savings
    if (savingsRate >= 20) {
      result.push({
        id: "healthy-savings",
        type: "success",
        title: "Healthy Savings Rate",
        message: `You're saving ${savingsRate}% of your income - above the recommended 20%. Excellent financial discipline!`,
      });
    }

    return result.filter((insight) => !dismissedIds.has(insight.id));
  }, [data, totalExpenses, savingsRate, goalProgress, dismissedIds]);

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  if (insights.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Lightbulb className="h-5 w-5 text-primary" />
        Smart Insights
      </div>
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {insights.map((insight, index) => (
            <InsightCard
              key={insight.id}
              {...insight}
              onDismiss={() => handleDismiss(insight.id)}
              delay={index * 0.1}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
