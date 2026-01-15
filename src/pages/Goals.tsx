import { AppLayout } from "@/components/layout/AppLayout";
import { GoalPlanner } from "@/components/goals/GoalPlanner";
import { motion } from "framer-motion";

export default function Goals() {
  return (
    <AppLayout>
      <div className="space-y-6 pb-20 lg:pb-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            Financial Goals
          </h1>
          <p className="text-muted-foreground">
            Plan and track your path to financial success
          </p>
        </motion.div>

        {/* Goal Planner */}
        <GoalPlanner />
      </div>
    </AppLayout>
  );
}
