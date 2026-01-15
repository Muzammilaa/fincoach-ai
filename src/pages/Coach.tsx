import { AppLayout } from "@/components/layout/AppLayout";
import { AICoachChat } from "@/components/coach/AICoachChat";
import { motion } from "framer-motion";

export default function Coach() {
  return (
    <AppLayout>
      <div className="space-y-6 pb-20 lg:pb-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-bold tracking-tight">AI Coach</h1>
          <p className="text-muted-foreground">
            Get personalized financial advice based on your data
          </p>
        </motion.div>

        {/* Chat */}
        <AICoachChat />
      </div>
    </AppLayout>
  );
}
