import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useFinance } from "@/contexts/FinanceContext";
import { motion } from "framer-motion";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-popover px-3 py-2 shadow-lg border border-border">
        <p className="font-medium text-popover-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function IncomeExpenseChart() {
  const { data, totalExpenses } = useFinance();

  const chartData = useMemo(() => [
    { name: "Income", value: data.monthlyIncome, color: "hsl(var(--chart-1))" },
    { name: "Expenses", value: totalExpenses, color: "hsl(var(--chart-6))" },
    { name: "Savings", value: data.monthlySavings, color: "hsl(var(--chart-3))" },
  ], [data.monthlyIncome, totalExpenses, data.monthlySavings]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card rounded-xl p-6"
    >
      <h3 className="mb-4 text-lg font-semibold">Income vs Expenses</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              fontSize={12}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              type="category"
              dataKey="name"
              width={80}
              fontSize={12}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
