import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Expense {
  id: string;
  category: "Rent" | "Food" | "Transport" | "Subscriptions" | "Entertainment" | "Other";
  amount: number;
  name: string;
}

export interface FinancialGoal {
  name: string;
  targetAmount: number;
  timeframeMonths: number;
}

export interface FinanceData {
  monthlyIncome: number;
  monthlySavings: number;
  expenses: Expense[];
  goal: FinancialGoal;
}

interface FinanceContextType {
  data: FinanceData;
  updateIncome: (income: number) => void;
  updateSavings: (savings: number) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
  updateGoal: (goal: FinancialGoal) => void;
  totalExpenses: number;
  savingsRate: number;
  disposableIncome: number;
  monthlyGoalTarget: number;
  goalProgress: number;
}

const defaultData: FinanceData = {
  monthlyIncome: 5000,
  monthlySavings: 800,
  expenses: [
    { id: "1", category: "Rent", amount: 1500, name: "Apartment Rent" },
    { id: "2", category: "Food", amount: 400, name: "Groceries & Dining" },
    { id: "3", category: "Transport", amount: 200, name: "Gas & Transit" },
    { id: "4", category: "Subscriptions", amount: 80, name: "Streaming & Apps" },
    { id: "5", category: "Entertainment", amount: 150, name: "Hobbies & Events" },
  ],
  goal: {
    name: "Emergency Fund",
    targetAmount: 10000,
    timeframeMonths: 12,
  },
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FinanceData>(defaultData);

  const updateIncome = (income: number) => {
    setData((prev) => ({ ...prev, monthlyIncome: income }));
  };

  const updateSavings = (savings: number) => {
    setData((prev) => ({ ...prev, monthlySavings: savings }));
  };

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = { ...expense, id: crypto.randomUUID() };
    setData((prev) => ({ ...prev, expenses: [...prev.expenses, newExpense] }));
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    }));
  };

  const removeExpense = (id: string) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((exp) => exp.id !== id),
    }));
  };

  const updateGoal = (goal: FinancialGoal) => {
    setData((prev) => ({ ...prev, goal }));
  };

  const totalExpenses = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savingsRate = data.monthlyIncome > 0 
    ? Math.round((data.monthlySavings / data.monthlyIncome) * 100) 
    : 0;
  const disposableIncome = data.monthlyIncome - totalExpenses - data.monthlySavings;
  const monthlyGoalTarget = data.goal.timeframeMonths > 0 
    ? data.goal.targetAmount / data.goal.timeframeMonths 
    : 0;
  const goalProgress = data.goal.targetAmount > 0 
    ? Math.min(100, Math.round((data.monthlySavings * data.goal.timeframeMonths / data.goal.targetAmount) * 100))
    : 0;

  return (
    <FinanceContext.Provider
      value={{
        data,
        updateIncome,
        updateSavings,
        addExpense,
        updateExpense,
        removeExpense,
        updateGoal,
        totalExpenses,
        savingsRate,
        disposableIncome,
        monthlyGoalTarget,
        goalProgress,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
