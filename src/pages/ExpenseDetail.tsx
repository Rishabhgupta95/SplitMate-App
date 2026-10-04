import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Tag, Trash2, Pencil, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InitialsAvatar } from "@/components/Avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseService } from "@/services/expense.service";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

const ExpenseDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: expense, isLoading } = useQuery({
    queryKey: ["expense", id],
    queryFn: () => expenseService.getExpenseById(id),
  });

  const deleteMutation = useMutation({
    mutationFn: (expenseId: string) => expenseService.deleteExpense(expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-expenses", expense?.groupId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-balance"] });
      toast.success("Expense deleted successfully");
      navigate(`/groups/${expense?.groupId}`);
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete expense"),
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Expense not found.</p>
        <Link to="/expenses" className="mt-4 inline-block text-primary underline">Back to expenses</Link>
      </div>
    );
  }

  const isPayer = expense.paidBy.userId === currentUser?.userId;
  const isCreator = expense.createdBy.userId === currentUser?.userId;
  const mySplit = expense.splits.find((s) => s.userId === currentUser?.userId);
  const amountOwedByMe = mySplit ? mySplit.amountOwed : 0;
  const delta = isPayer ? expense.amount - amountOwedByMe : -amountOwedByMe;
  const d = new Date(expense.expenseDate);

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-20">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Hero */}
      <header className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-3xl">
              {expense.description.charAt(0)}
            </div>
            <div>
              <Link to={`/groups/${expense.groupId}`} className="text-xs text-muted-foreground hover:text-foreground">
                Back to Group
              </Link>
              <h1 className="text-2xl font-semibold tracking-tight">{expense.description}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                <span className="inline-flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> {expense.category}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Paid</p>
            <p className="mt-1 text-3xl font-semibold">{formatCurrency(expense.amount, expense.currency)}</p>
            <p className={`mt-1 text-xs font-medium ${delta >= 0 ? "text-owed" : "text-owe"}`}>
              {delta >= 0 ? "You lent " : "You borrowed "}
              {formatCurrency(Math.abs(delta), expense.currency)}
            </p>
          </div>
        </div>
      </header>

      {/* Paid by */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Paid by</h2>
        <div className="mt-3 flex items-center gap-3">
          <InitialsAvatar member={{ name: expense.paidBy.fullName, avatar: expense.paidBy.profilePictureUrl }} />
          <div className="flex-1">
            <div className="text-sm font-medium">{expense.paidBy.fullName} {isPayer && <span className="text-muted-foreground">(you)</span>}</div>
            <div className="text-xs text-muted-foreground">Paid {formatCurrency(expense.amount, expense.currency)} on {d.toLocaleDateString("en-IN")}</div>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Payer</span>
        </div>
      </section>

      {/* Split breakdown */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Split breakdown</h2>
          <p className="mt-1 text-xs text-muted-foreground">{expense.splits.length} people · {formatCurrency(expense.amount, expense.currency)} total</p>
        </div>
        {expense.splits.map((s, i) => {
          const isPayerOfExpense = s.userId === expense.paidBy.userId;
          return (
            <div key={s.userId} className={`flex items-center gap-4 px-6 py-4 ${i ? "border-t border-border" : ""}`}>
              <InitialsAvatar member={{ name: s.fullName, avatar: s.profilePictureUrl }} size="sm" />
              <div className="flex-1">
                <div className="text-sm font-medium">{s.fullName} {s.userId === currentUser?.userId && <span className="text-muted-foreground">(you)</span>}</div>
                <div className="text-xs text-muted-foreground">
                  {isPayerOfExpense ? "Paid full bill" : `Owes ${expense.paidBy.fullName}`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{formatCurrency(s.amountOwed, expense.currency)}</div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Actions */}
      <section className="flex flex-wrap gap-2">
        {/* Only show delete if user is creator or an admin (admin check done by backend) */}
        {(isCreator || true) && (
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-owe hover:text-owe border-owe/20 hover:bg-owe/5 hover:border-owe/40"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Expense</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{expense.description}"? This action cannot be undone and will affect group balances.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                <Button 
                  variant="destructive" 
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(expense.expenseId)}
                >
                  {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete Forever
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        <p className="w-full text-xs text-muted-foreground pt-2">
          Created by {expense.createdBy.fullName} on {new Date(expense.createdAt).toLocaleDateString()}
        </p>
      </section>
    </div>
  );
};

export default ExpenseDetail;
