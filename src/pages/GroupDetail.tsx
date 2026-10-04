import { useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Settings, Loader2, Copy, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarStack, InitialsAvatar } from "@/components/Avatar";
import { groupService } from "@/services/group.service";
import { expenseService } from "@/services/expense.service";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const GroupDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const { data: group, isLoading: groupLoading } = useQuery({
    queryKey: ["group", id],
    queryFn: () => groupService.getGroupById(id),
  });

  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ["group-expenses", id],
    queryFn: () => expenseService.getExpensesByGroup(id),
  });

  const { data: settlements, isLoading: settlementsLoading } = useQuery({
    queryKey: ["group-settlement", id],
    queryFn: () => expenseService.getGroupSettlement(id),
  });

  if (groupLoading || expensesLoading || settlementsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Group not found.</p>
        <Link to="/groups" className="mt-4 inline-block text-primary underline">Back to groups</Link>
      </div>
    );
  }

  const total = expenses?.reduce((s, e) => s + e.amount, 0) || 0;
  
  // Calculate current user's balance within this group
  // This is a simplified frontend calculation; the "real" balance is in the summary
  const myBalance = expenses?.reduce((acc, exp) => {
    const isPayer = exp.paidBy.userId === currentUser?.userId;
    const mySplit = exp.splits.find(s => s.userId === currentUser?.userId);
    const amountOwedByMe = mySplit ? mySplit.amountOwed : 0;
    
    if (isPayer) {
      return acc + (exp.amount - amountOwedByMe);
    } else {
      return acc - amountOwedByMe;
    }
  }, 0) || 0;

  const copyInviteCode = () => {
    navigator.clipboard.writeText(group.inviteCode);
    toast.success("Invite code copied to clipboard!");
  };

  const handleSettle = async (fromUser: any, toUser: any, amount: number) => {
    try {
      await expenseService.settle({
        groupId: id,
        fromUserId: fromUser.userId,
        toUserId: toUser.userId,
        amount: amount,
      });
      toast.success("Settlement recorded!");
      // Refresh all related data
      queryClient.invalidateQueries({ queryKey: ["group-expenses", id] });
      queryClient.invalidateQueries({ queryKey: ["group-settlement", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-balance"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to record settlement");
    }
  };

  return (
    <div className="space-y-8">
      <Link to="/groups" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All groups
      </Link>

      {/* Hero */}
      <header className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-2xl">
              {group.groupName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{group.groupName}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
              <div className="mt-3 flex items-center gap-4">
                {/* Fixed AvatarStack to use group.members */}
                <AvatarStack members={group.members?.map(m => ({ id: m.userId, name: m.fullName, avatar: m.profilePictureUrl })) || []} />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-[10px] font-mono uppercase tracking-widest"
                  onClick={copyInviteCode}
                >
                  <Copy className="mr-1.5 h-3 w-3" /> {group.inviteCode}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Your balance</p>
              <p className={`mt-1 text-2xl font-semibold ${myBalance >= 0 ? "text-owed" : "text-owe"}`}>
                {myBalance >= 0 ? "+" : "-"}{formatCurrency(Math.abs(myBalance), group.currency)}
              </p>
              <p className="text-xs text-muted-foreground">Group total: {formatCurrency(total, group.currency)}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Settings className="mr-2 h-4 w-4" /> Settings</Button>
              <Button
                size="sm"
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                onClick={() => navigate(`/expenses/new?group=${group.groupId}`)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add expense
              </Button>
            </div>
          </div>
        </div>
      </header>

      <Tabs defaultValue="expenses" className="space-y-5">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="settlement">Settlement</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            {[...(expenses || [])]
              .sort((a, b) => {
                const aTime = new Date(a.createdAt.endsWith('Z') ? a.createdAt : a.createdAt + 'Z').getTime();
                const bTime = new Date(b.createdAt.endsWith('Z') ? b.createdAt : b.createdAt + 'Z').getTime();
                return bTime - aTime;
              })
              .map((e, i) => {
              const d = new Date(e.expenseDate);
              const createdDate = new Date(e.createdAt.endsWith('Z') ? e.createdAt : e.createdAt + 'Z');
              const timeString = createdDate.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
              const isPayer = e.paidBy.userId === currentUser?.userId;
              const mySplit = e.splits.find(s => s.userId === currentUser?.userId);
              const amountOwedByMe = mySplit ? mySplit.amountOwed : 0;
              const delta = isPayer ? e.amount - amountOwedByMe : -amountOwedByMe;

              return (
                <Link
                  to={`/expenses/${e.expenseId}`}
                  key={e.expenseId}
                  className={`flex items-center gap-4 px-5 py-4 transition-smooth hover:bg-secondary/40 ${i ? "border-t border-border" : ""}`}
                >
                  <div className="flex w-12 flex-col items-center rounded-lg bg-secondary py-1.5 text-center">
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {d.toLocaleString("en-IN", { month: "short" })}
                    </span>
                    <span className="text-sm font-semibold">{d.getDate()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{e.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {e.paidBy.fullName} paid {formatCurrency(e.amount, e.currency)} · {e.category} · {timeString}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${delta >= 0 ? "text-owed" : "text-owe"}`}>
                      {(delta >= 0 ? "+" : "-") + formatCurrency(Math.abs(delta), e.currency)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {delta >= 0 ? "you lent" : "you borrowed"}
                    </div>
                  </div>
                </Link>
              );
            })}
            {(!expenses || expenses.length === 0) && (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">No expenses yet.</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settlement" className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            {(!settlements || settlements.balances.length === 0) && (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">All settled up 🎉</div>
            )}
            {settlements?.balances.map((pair, i) => {
              const isRelevant = pair.fromUser.userId === currentUser?.userId || pair.toUser.userId === currentUser?.userId;
              return (
                <div key={i} className={`flex items-center gap-4 px-5 py-4 ${i ? "border-t border-border" : ""} ${isRelevant ? "bg-primary/5" : ""}`}>
                  <div className="flex -space-x-3">
                    <InitialsAvatar member={{ name: pair.fromUser.fullName, avatar: pair.fromUser.profilePictureUrl }} size="sm" />
                    <InitialsAvatar member={{ name: pair.toUser.fullName, avatar: pair.toUser.profilePictureUrl }} size="sm" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {pair.fromUser.fullName} → {pair.toUser.fullName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Settlement transaction
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{formatCurrency(pair.amount, group.currency)}</div>
                    <div className="text-[10px] text-muted-foreground">minimize transactions</div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleSettle(pair.fromUser, pair.toUser, pair.amount)}
                  >
                    Settle
                  </Button>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            {group.members?.map((m, i) => (
              <div key={m.userId} className={`flex items-center gap-4 px-5 py-4 ${i ? "border-t border-border" : ""}`}>
                <InitialsAvatar member={{ name: m.fullName, avatar: m.profilePictureUrl }} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{m.fullName}</div>
                  <div className="text-xs text-muted-foreground">{m.role} {m.userId === currentUser?.userId ? "· You" : ""}</div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full">
            <UserPlus className="mr-2 h-4 w-4" /> Add members
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupDetail;
