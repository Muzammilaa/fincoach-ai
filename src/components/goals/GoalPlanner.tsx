import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinance } from "@/contexts/FinanceContext";
import {
  Target,
  Sparkles,
  Loader2,
  CheckCircle,
  ArrowRight,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

interface SavingsPlan {
  monthlyTarget: number;
  suggestions: string[];
  steps: string[];
}

export function GoalPlanner() {
  const { data, updateGoal, totalExpenses, goalProgress, monthlyGoalTarget } = useFinance();
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<SavingsPlan | null>(null);

  const generatePlan = async () => {
    setIsGenerating(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const deficit = Math.max(0, monthlyGoalTarget - data.monthlySavings);
    const expensesByCategory = data.expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const sortedCategories = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)
      .filter(([cat]) => cat !== "Rent");

    const suggestions: string[] = [];
    let potentialSavings = 0;

    if (sortedCategories.length > 0) {
      const [topCat, topAmount] = sortedCategories[0];
      const reduction = Math.round(topAmount * 0.2);
      suggestions.push(`Reduce ${topCat} by 20% (-$${reduction}/mo)`);
      potentialSavings += reduction;
    }

    if (sortedCategories.length > 1) {
      const [secondCat, secondAmount] = sortedCategories[1];
      const reduction = Math.round(secondAmount * 0.15);
      suggestions.push(`Cut ${secondCat} by 15% (-$${reduction}/mo)`);
      potentialSavings += reduction;
    }

    if (expensesByCategory["Subscriptions"]) {
      suggestions.push(`Audit subscriptions for unused services`);
    }

    suggestions.push(`Set up automatic savings on payday`);

    const newPlan: SavingsPlan = {
      monthlyTarget: monthlyGoalTarget,
      suggestions,
      steps: [
        `Track all expenses for one week to identify waste`,
        `Set up a separate savings account for your "${data.goal.name}" goal`,
        `Automate $${Math.round(monthlyGoalTarget).toLocaleString()} transfer on the 1st of each month`,
        `Review progress monthly and adjust as needed`,
        `Celebrate small wins along the way!`,
      ],
    };

    setPlan(newPlan);
    setIsGenerating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Goal Settings */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Your Financial Goal</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="goalName">Goal Name</Label>
            <Input
              id="goalName"
              value={data.goal.name}
              onChange={(e) =>
                updateGoal({ ...data.goal, name: e.target.value })
              }
              placeholder="Emergency Fund"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount ($)</Label>
            <Input
              id="targetAmount"
              type="number"
              value={data.goal.targetAmount}
              onChange={(e) =>
                updateGoal({
                  ...data.goal,
                  targetAmount: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeframe">Timeframe (months)</Label>
            <Input
              id="timeframe"
              type="number"
              value={data.goal.timeframeMonths}
              onChange={(e) =>
                updateGoal({
                  ...data.goal,
                  timeframeMonths: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{goalProgress}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${goalProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            You need to save ${monthlyGoalTarget.toLocaleString()}/month to reach your goal
          </p>
        </div>

        {/* Generate Plan Button */}
        <Button
          onClick={generatePlan}
          disabled={isGenerating}
          className="mt-6 w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Your Plan...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate My Savings Plan
            </>
          )}
        </Button>
      </div>

      {/* Generated Plan */}
      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Monthly Target Card */}
          <div className="glass-card rounded-xl p-6 gradient-border">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <PiggyBank className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Savings Target</p>
                <p className="text-3xl font-bold gradient-text">
                  ${plan.monthlyTarget.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="h-5 w-5 text-warning" />
              <h4 className="font-semibold">Suggested Expense Reductions</h4>
            </div>
            <ul className="space-y-3">
              {plan.suggestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm">{suggestion}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Action Steps */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-success" />
              <h4 className="font-semibold">Your Action Plan</h4>
            </div>
            <ol className="space-y-4">
              {plan.steps.map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 text-sm">{step}</span>
                </motion.li>
              ))}
            </ol>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
