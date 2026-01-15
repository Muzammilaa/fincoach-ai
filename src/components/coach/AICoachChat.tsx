import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFinance } from "@/contexts/FinanceContext";
import { MessageSquare, Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Mock AI responses - Replace with actual AI integration
const mockResponses: Record<string, string> = {
  overspending: `Based on your financial data, I can see your highest expenses are in **Rent** and **Food** categories. Here are some suggestions:

1. **Review subscriptions** ($80/mo) - Cancel unused services
2. **Meal planning** - Could reduce food costs by 20-30%
3. **Entertainment** - Consider free alternatives

Your current savings rate of {savingsRate}% is {savingsNote}. Small changes can compound!`,
  
  save: `To boost your savings, consider the **50/30/20 rule**:
- **50%** for needs (rent, utilities, food)
- **30%** for wants (entertainment, dining out)  
- **20%** for savings

Currently you're saving **{savingsRate}%** of your income. To reach 20%, you'd need to save an additional **${Math.max(0, Math.round(5000 * 0.2 - 800)).toLocaleString()}/month**.

Focus on reducing variable expenses first - they're easier to adjust!`,

  goal: `Looking at your goal of **{goalName}**:

📊 **Target**: ${10000..toLocaleString()}
⏰ **Timeline**: {timeframe} months  
💰 **Required monthly savings**: ${Math.round(10000 / 12).toLocaleString()}

You're currently saving ${800..toLocaleString()}/month, which puts you **{progressNote}**.

Recommendation: {recommendation}`,

  default: `I'm here to help with your finances! Based on your current data:

💰 **Income**: ${5000..toLocaleString()}/month
📊 **Expenses**: ${2330..toLocaleString()}/month
🏦 **Savings**: ${800..toLocaleString()}/month ({savingsRate}%)

What would you like to explore? Try asking:
- "Where am I overspending?"
- "How can I save more?"
- "Am I on track for my goal?"`
};

export function AICoachChat() {
  const { data, totalExpenses, savingsRate, goalProgress, monthlyGoalTarget } = useFinance();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    let template = mockResponses.default;

    if (lowerMessage.includes("overspend") || lowerMessage.includes("spending")) {
      template = mockResponses.overspending;
    } else if (lowerMessage.includes("save") || lowerMessage.includes("saving")) {
      template = mockResponses.save;
    } else if (lowerMessage.includes("goal") || lowerMessage.includes("track")) {
      template = mockResponses.goal;
    }

    // Replace placeholders with actual data
    const savingsNote = savingsRate >= 20 ? "excellent" : savingsRate >= 10 ? "good" : "below recommended";
    const progressNote = goalProgress >= 80 ? "on track to exceed your goal!" : 
                        goalProgress >= 50 ? "making good progress" : 
                        "behind schedule - let's fix that";
    const recommendation = data.monthlySavings >= monthlyGoalTarget 
      ? "You're on track! Consider increasing your goal."
      : `Try to save an extra $${Math.round(monthlyGoalTarget - data.monthlySavings).toLocaleString()}/month to hit your target.`;

    return template
      .replace(/{savingsRate}/g, savingsRate.toString())
      .replace(/{savingsNote}/g, savingsNote)
      .replace(/{goalName}/g, data.goal.name)
      .replace(/{timeframe}/g, data.goal.timeframeMonths.toString())
      .replace(/{progressNote}/g, progressNote)
      .replace(/{recommendation}/g, recommendation)
      .replace(/\$5000/g, `$${data.monthlyIncome.toLocaleString()}`)
      .replace(/\$2330/g, `$${totalExpenses.toLocaleString()}`)
      .replace(/\$800/g, `$${data.monthlySavings.toLocaleString()}`)
      .replace(/\$10000/g, `$${data.goal.targetAmount.toLocaleString()}`);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const aiResponse: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: getAIResponse(userMessage.content),
    };

    setMessages((prev) => [...prev, aiResponse]);
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card flex h-[600px] flex-col rounded-xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">Your AI Financial Coach</h3>
          <p className="text-xs text-muted-foreground">
            Ask me anything about your finances
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h4 className="font-medium mb-2">Start a Conversation</h4>
            <p className="text-sm text-muted-foreground max-w-xs">
              Ask questions like "Where am I overspending?" or "How can I save more money?"
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["Where am I overspending?", "How can I save more?", "Am I on track?"].map(
                (q) => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(q)}
                    className="text-xs"
                  >
                    {q}
                  </Button>
                )
              )}
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    message.role === "assistant"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.role === "assistant" ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-xl px-4 py-3 max-w-[80%]",
                    message.role === "assistant"
                      ? "bg-muted"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-xl bg-muted px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-border p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your finances..."
            className="min-h-[44px] max-h-32 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
