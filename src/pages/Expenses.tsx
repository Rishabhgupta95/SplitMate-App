import { Link } from "react-router-dom";
import { Plus, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { expenseService } from "@/services/expense.service";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const Expenses = () => {
  const [q, setQ] = useState("");
  
  const { data: expenses, isLoading } = useQuery({
    queryKey: ["all-expenses"],
    queryFn: () => expenseService.getAllExpenses(),
  });

  const filtered = expenses?.filter(e => 
    e.description.toLowerCase().includes(q.toLowerCase()) || 
    e.category.toLowerCase().includes(q.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 pb-20">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">All expenses</h1>
          <p className="mt-1 text-sm text-muted-foreground">Every expense you're a part of.</p>
        </div>
        <Link to="/expenses/new">
          <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" /> Add expense
          </Button>
        </Link>
      </header>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search expenses…" className="pl-9" />
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center text-muted-foreground shadow-card">
          <p className="text-sm">No expenses found.</p>
          <p className="mt-1 text-xs">When you add expenses, they will appear here across all your groups.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="hidden md:grid grid-cols-12 gap-4 border-b border-border bg-secondary/40 px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <div className="col-span-5">Description</div>
            <div className="col-span-3">Category</div>
            <div className="col-span-2">Paid by</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
          {filtered.map((e, i) => (
            <Link
              to={`/expenses/${e.expenseId}`}
              key={e.expenseId}
              className={`flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 text-sm transition-smooth hover:bg-secondary/40 ${i ? "border-t border-border" : ""}`}
            >
              <div className="col-span-5">
                <div className="font-medium text-base md:text-sm">{e.description}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(e.expenseDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
              <div className="col-span-3 flex items-center md:text-muted-foreground">
                <span className="md:hidden text-xs text-muted-foreground mr-2 font-medium uppercase tracking-wider">Category:</span>
                {e.category}
              </div>
              <div className="col-span-2 flex items-center md:text-muted-foreground">
                 <span className="md:hidden text-xs text-muted-foreground mr-2 font-medium uppercase tracking-wider">By:</span>
                 {e.paidBy.fullName}
              </div>
              <div className="col-span-2 flex items-center justify-end font-semibold text-primary text-lg md:text-sm">
                {formatCurrency(e.amount, e.currency)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Expenses;
