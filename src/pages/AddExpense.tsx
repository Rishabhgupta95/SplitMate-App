import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { InitialsAvatar } from "@/components/Avatar";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupService } from "@/services/group.service";
import { expenseService } from "@/services/expense.service";
import { formatCurrency } from "@/lib/utils";

const categories = ["FOOD", "ACCOMMODATION", "TRANSPORT", "ENTERTAINMENT", "SHOPPING", "UTILITIES", "OTHER"] as const;

const AddExpense = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const queryClient = useQueryClient();
  
  const initialGroupId = params.get("group") || "";

  const [groupId, setGroupId] = useState(initialGroupId);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState<string>("FOOD");
  const [splitType, setSplitType] = useState<"EQUAL" | "CUSTOM">("EQUAL");
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});

  // Fetch groups for the dropdown
  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ["my-groups"],
    queryFn: () => groupService.getMyGroups(),
  });

  // Fetch full group details for members when group changes
  const { data: fullGroup, isLoading: fullGroupLoading } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => groupService.getGroupById(groupId),
    enabled: !!groupId,
  });

  useEffect(() => {
    if (fullGroup && splitType === "EQUAL") {
      // Clear custom splits if switching back to equal
      setCustomSplits({});
    }
  }, [fullGroup, splitType]);

  const numericAmount = Number(amount) || 0;
  const mems = fullGroup?.members || [];
  
  const equalSplit = useMemo(() => 
    mems.length > 0 ? +(numericAmount / mems.length).toFixed(2) : 0, 
    [numericAmount, mems.length]
  );
  
  const customTotal = useMemo(
    () => Object.values(customSplits).reduce((s, v) => s + (Number(v) || 0), 0),
    [customSplits],
  );
  const customDelta = +(numericAmount - customTotal).toFixed(2);

  const mutation = useMutation({
    mutationFn: expenseService.createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-expenses", groupId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-balance"] });
      queryClient.invalidateQueries({ queryKey: ["my-groups"] });
      toast.success("Expense added successfully!");
      navigate(`/groups/${groupId}`);
    },
    onError: (err: any) => toast.error(err.message || "Failed to add expense"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupId) {
      toast.error("Please select a group");
      return;
    }
    if (!description) {
      toast.error("Add a description");
      return;
    }
    if (numericAmount <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }

    const payload: any = {
      groupId,
      description,
      amount: numericAmount,
      category,
      expenseDate: date,
      splitType,
    };

    if (splitType === "CUSTOM") {
      if (Math.abs(customDelta) > 0.01) {
        toast.error(`Splits must total ${formatCurrency(numericAmount, fullGroup?.currency)}`);
        return;
      }
      payload.customSplits = Object.entries(customSplits).map(([userId, amt]) => ({
        userId,
        amount: Number(amt),
      }));
    }

    mutation.mutate(payload);
  };

  if (groupsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-20">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Add expense</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track a shared cost and split it cleanly.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="space-y-1.5">
          <Label>Select Group</Label>
          <Select value={groupId} onValueChange={setGroupId}>
            <SelectTrigger><SelectValue placeholder="Choose a group" /></SelectTrigger>
            <SelectContent>
              {groups?.map((g) => (
                <SelectItem key={g.groupId} value={g.groupId}>{g.groupName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Dinner at Toscana" required />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount ({fullGroup?.currency || "₹"})</Label>
            <Input id="amount" inputMode="decimal" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {fullGroup && (
          <div className="space-y-3">
            <Label>Split type</Label>
            <RadioGroup
              value={splitType}
              onValueChange={(v) => setSplitType(v as "EQUAL" | "CUSTOM")}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { v: "EQUAL",  label: "Split equally", body: numericAmount > 0 ? `${formatCurrency(equalSplit, fullGroup.currency)} each` : "Even share for everyone" },
                { v: "CUSTOM", label: "Custom split",  body: "Set each person's amount" },
              ].map((o) => (
                <label
                  key={o.v}
                  className={`cursor-pointer rounded-xl border p-4 transition-smooth ${splitType === o.v ? "border-primary bg-primary/5" : "border-border bg-secondary/40 hover:border-border"}`}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={o.v} id={o.v} />
                    <span className="text-sm font-medium">{o.label}</span>
                  </div>
                  <p className="mt-1 pl-6 text-xs text-muted-foreground">{o.body}</p>
                </label>
              ))}
            </RadioGroup>

            {splitType === "CUSTOM" && (
              <div className="space-y-3 mt-4 rounded-xl border border-border bg-secondary/30 p-4">
                {mems.map((m) => (
                  <div key={m.userId} className="flex items-center gap-3">
                    <InitialsAvatar member={{ name: m.fullName, avatar: m.profilePictureUrl }} size="sm" />
                    <span className="flex-1 text-sm">{m.fullName}</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{fullGroup.currency}</span>
                      <Input
                        inputMode="decimal"
                        type="number"
                        step="0.01"
                        value={customSplits[m.userId] ?? ""}
                        onChange={(e) => setCustomSplits({ ...customSplits, [m.userId]: e.target.value })}
                        placeholder="0.00"
                        className="w-32 pl-9"
                      />
                    </div>
                  </div>
                ))}
                <div className={`pt-2 text-right text-xs font-medium ${Math.abs(customDelta) < 0.01 ? "text-primary" : "text-owe"}`}>
                  {Math.abs(customDelta) < 0.01
                    ? `Splits add up to ${formatCurrency(customTotal, fullGroup.currency)}`
                    : `${formatCurrency(Math.abs(customDelta), fullGroup.currency)} ${customDelta > 0 ? "left" : "over"}`}
                </div>
              </div>
            )}
          </div>
        )}

        {fullGroupLoading && (
          <div className="flex justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button 
            type="submit" 
            disabled={mutation.isPending || !groupId || (splitType === "CUSTOM" && Math.abs(customDelta) > 0.01)}
            className="bg-gradient-primary text-primary-foreground hover:opacity-90"
          >
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save expense
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;
