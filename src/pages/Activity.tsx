import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { expenseService } from "@/services/expense.service";
import { formatCurrency } from "@/lib/utils";
import { InitialsAvatar } from "@/components/Avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, PlusCircle } from "lucide-react";

const Activity = () => {
  const { user: currentUser } = useAuth();
  
  const { data: expenses, isLoading } = useQuery({
    queryKey: ["all-expenses"],
    queryFn: () => expenseService.getAllExpenses(),
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Activity</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every recent move across your groups.</p>
      </header>

      {(!expenses || expenses.length === 0) ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center text-muted-foreground shadow-card">
          <p className="text-sm">No recent activity.</p>
          <p className="mt-1 text-xs">Start by creating a group and adding expenses.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {expenses.map((e, i) => {
            const isPayer = e.paidBy.userId === currentUser?.userId;
            const mySplit = e.splits.find(s => s.userId === currentUser?.userId);
            const amountOwedByMe = mySplit ? mySplit.amountOwed : 0;
            const delta = isPayer ? e.amount - amountOwedByMe : -amountOwedByMe;
            
            return (
              <Link
                to={`/expenses/${e.expenseId}`}
                key={e.expenseId}
                className={`flex items-center gap-4 px-5 py-5 transition-smooth hover:bg-secondary/40 ${i ? "border-t border-border" : ""}`}
              >
                <div className="relative">
                   <InitialsAvatar member={{ name: e.createdBy.fullName, avatar: e.createdBy.profilePictureUrl }} size="sm" />
                   <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5 shadow-sm">
                      <PlusCircle className="h-3 w-3 text-primary" />
                   </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">
                    <span className="font-semibold">{e.createdBy.fullName}</span> added "{e.description}"
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {e.paidBy.userId === e.createdBy.userId ? "They paid " : `${e.paidBy.fullName} paid `}
                    {formatCurrency(e.amount, e.currency)}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${delta >= 0 ? "text-owed" : "text-owe"}`}>
                    {(delta >= 0 ? "+" : "-") + formatCurrency(Math.abs(delta), e.currency)}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-tight font-medium mt-0.5">
                    {new Date(e.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Activity;
