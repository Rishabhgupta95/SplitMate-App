import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, Plus, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvatarStack, InitialsAvatar } from "@/components/Avatar";
import { useQuery } from "@tanstack/react-query";
import { groupService } from "@/services/group.service";
import { expenseService } from "@/services/expense.service";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";

const Dashboard = () => {
  const { user } = useAuth();

  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: ["dashboard-balance"],
    queryFn: () => expenseService.getDashboardBalance(),
  });

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ["my-groups"],
    queryFn: () => groupService.getMyGroups(),
  });

  if (balanceLoading || groupsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h1 className="text-3xl font-semibold tracking-tight">Hey, {user?.fullName || user?.username || 'User'} 👋</h1>
      </header>

      {/* Balance hero */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card md:col-span-1">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Net balance</p>
          <p className={`mt-2 text-4xl font-semibold ${(balance?.netBalance ?? 0) >= 0 ? "text-owed" : "text-owe"}`}>
            {formatCurrency(Math.abs(balance?.netBalance ?? 0))}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Across {groups?.length || 0} groups</p>
        </div>

        <StatCard
          tone="owed"
          label="You are owed"
          value={formatCurrency(balance?.totalOwed ?? 0)}
          icon={<ArrowUpRight className="h-4 w-4" />}
        />
        <StatCard
          tone="owe"
          label="You owe"
          value={formatCurrency(balance?.totalOwe ?? 0)}
          icon={<ArrowDownRight className="h-4 w-4" />}
        />
      </section>

      {/* Groups */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Your groups</h2>
          <Link to="/groups">
            <Button variant="ghost" size="sm">View all</Button>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups?.map((g) => (
            <Link
              key={g.groupId}
              to={`/groups/${g.groupId}`}
              className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-2xl">
                    {/* Fallback to initials if no emoji (add emoji to entity later if needed) */}
                    {g.groupName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{g.groupName}</div>
                    <div className="text-xs text-muted-foreground">{g.memberCount} members</div>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${g.balance >= 0 ? "bg-owed-soft text-owed" : "bg-owe-soft text-owe"}`}>
                  {(g.balance >= 0 ? "+" : "-") + formatCurrency(Math.abs(g.balance), g.currency)}
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between">
                {/* Fixed AvatarStack to be empty or generic for now since summary doesn't have all members */}
                <div className="h-6" /> 
                <span className="text-xs text-muted-foreground truncate max-w-[150px]">{g.description}</span>
              </div>
            </Link>
          ))}

          <Link
            to="/groups"
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card/40 p-5 text-muted-foreground transition-smooth hover:border-primary/60 hover:text-foreground"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">New group</span>
          </Link>
        </div>
      </section>

      {/* Recent activity stub - will be implemented in Activity Integration Task */}
      <section className="space-y-4 pb-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Recent activity</h2>
          <Button variant="ghost" size="sm" disabled>View all</Button>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/40 p-12 text-center text-muted-foreground shadow-card">
          <p className="text-sm">No recent activity found.</p>
          <p className="mt-1 text-xs">When you add expenses, they will appear here.</p>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({
  tone, label, value, icon,
}: { tone: "owed" | "owe"; label: string; value: string; icon: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
    <div className="flex items-center justify-between">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${tone === "owed" ? "bg-owed-soft text-owed" : "bg-owe-soft text-owe"}`}>
        {icon}
      </span>
    </div>
    <p className={`mt-3 text-3xl font-semibold ${tone === "owed" ? "text-owed" : "text-owe"}`}>{value}</p>
    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
      <TrendingUp className="h-3 w-3" /> updated just now
    </p>
  </div>
);

export default Dashboard;
