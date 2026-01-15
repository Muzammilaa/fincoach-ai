import { motion } from "framer-motion";
import { X, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  type: "success" | "warning" | "danger";
  title: string;
  message: string;
  onDismiss?: () => void;
  delay?: number;
}

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  danger: AlertTriangle,
};

export function InsightCard({
  type,
  title,
  message,
  onDismiss,
  delay = 0,
}: InsightCardProps) {
  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay }}
      className={cn("insight-card", type)}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0",
            type === "success" && "text-success",
            type === "warning" && "text-warning",
            type === "danger" && "text-destructive"
          )}
        />
        <div className="flex-1 space-y-1">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="rounded p-1 hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
