import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { GoalProgress } from "@/components/dashboard/GoalProgress";
import { SmartInsights } from "@/components/dashboard/SmartInsights";
import { FinancialInputPanel } from "@/components/dashboard/FinancialInputPanel";
import { useFinance } from "@/contexts/FinanceContext";
import { DollarSign, TrendingDown, Percent, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data, totalExpenses, savingsRate, disposableIncome } = useFinance();

  return (
    <AppLayout>
      <div className="space-y-8 pb-20 lg:pb-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your finances and make smarter decisions
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Monthly Income"
            value={`$${data.monthlyIncome.toLocaleString()}`}
            icon={DollarSign}
            variant="success"
            delay={0}
          />
          <StatCard
            title="Total Expenses"
            value={`$${totalExpenses.toLocaleString()}`}
            icon={TrendingDown}
            variant={totalExpenses > data.monthlyIncome ? "danger" : "default"}
            delay={0.1}
          />
          <StatCard
            title="Savings Rate"
            value={`${savingsRate}%`}
            subtitle={savingsRate >= 20 ? "Excellent!" : "Target: 20%"}
            icon={Percent}
            variant={savingsRate >= 20 ? "success" : savingsRate >= 10 ? "warning" : "danger"}
            delay={0.2}
          />
          <StatCard
            title="Disposable Income"
            value={`$${Math.abs(disposableIncome).toLocaleString()}`}
            subtitle={disposableIncome < 0 ? "Deficit" : "Available"}
            icon={Wallet}
            variant={disposableIncome >= 0 ? "primary" : "danger"}
            delay={0.3}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <ExpenseChart />
          <IncomeExpenseChart />
          <GoalProgress />
        </div>

        {/* Insights */}
        <SmartInsights />

        {/* Financial Input */}
        <FinancialInputPanel />
      </div>
    </AppLayout>
  );
}
