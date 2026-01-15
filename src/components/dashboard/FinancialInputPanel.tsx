import { useState } from "react";
import { useFinance, Expense } from "@/contexts/FinanceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, DollarSign, Wallet, PiggyBank } from "lucide-react";

const CATEGORIES: Expense["category"][] = [
  "Rent",
  "Food",
  "Transport",
  "Subscriptions",
  "Entertainment",
  "Other",
];

export function FinancialInputPanel() {
  const {
    data,
    updateIncome,
    updateSavings,
    addExpense,
    updateExpense,
    removeExpense,
  } = useFinance();

  const [newExpense, setNewExpense] = useState({
    name: "",
    category: "Other" as Expense["category"],
    amount: "",
  });

  const handleAddExpense = () => {
    if (newExpense.name && newExpense.amount) {
      addExpense({
        name: newExpense.name,
        category: newExpense.category,
        amount: parseFloat(newExpense.amount) || 0,
      });
      setNewExpense({ name: "", category: "Other", amount: "" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card space-y-6 rounded-xl p-6"
    >
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <Wallet className="h-5 w-5 text-primary" />
        Financial Details
      </h3>

      {/* Income & Savings */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="income" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-success" />
            Monthly Income
          </Label>
          <Input
            id="income"
            type="number"
            value={data.monthlyIncome}
            onChange={(e) => updateIncome(parseFloat(e.target.value) || 0)}
            className="text-lg font-medium"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="savings" className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-primary" />
            Monthly Savings
          </Label>
          <Input
            id="savings"
            type="number"
            value={data.monthlySavings}
            onChange={(e) => updateSavings(parseFloat(e.target.value) || 0)}
            className="text-lg font-medium"
          />
        </div>
      </div>

      {/* Expenses List */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Expenses</Label>
        <AnimatePresence mode="popLayout">
          {data.expenses.map((expense) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2"
            >
              <Input
                value={expense.name}
                onChange={(e) =>
                  updateExpense(expense.id, { name: e.target.value })
                }
                className="flex-1"
                placeholder="Expense name"
              />
              <Select
                value={expense.category}
                onValueChange={(value: Expense["category"]) =>
                  updateExpense(expense.id, { category: value })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={expense.amount}
                onChange={(e) =>
                  updateExpense(expense.id, {
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-24 text-right"
                placeholder="$0"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeExpense(expense.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add New Expense */}
      <div className="space-y-3 rounded-lg bg-muted/50 p-4">
        <Label className="text-sm font-medium text-muted-foreground">
          Add New Expense
        </Label>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={newExpense.name}
            onChange={(e) =>
              setNewExpense((prev) => ({ ...prev, name: e.target.value }))
            }
            className="flex-1 min-w-[120px]"
            placeholder="Expense name"
          />
          <Select
            value={newExpense.category}
            onValueChange={(value: Expense["category"]) =>
              setNewExpense((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense((prev) => ({ ...prev, amount: e.target.value }))
            }
            className="w-24 text-right"
            placeholder="$0"
          />
          <Button onClick={handleAddExpense} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
