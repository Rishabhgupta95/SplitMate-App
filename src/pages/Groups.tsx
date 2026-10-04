import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Loader2, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupService } from "@/services/group.service";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const Groups = () => {
  const [q, setQ] = useState("");
  const { data: groups, isLoading } = useQuery({
    queryKey: ["my-groups"],
    queryFn: () => groupService.getMyGroups(),
  });

  const filtered = groups?.filter((g) => g.groupName.toLowerCase().includes(q.toLowerCase())) || [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Groups</h1>
          <p className="mt-1 text-sm text-muted-foreground">All your shared spaces in one place.</p>
        </div>
        <div className="flex gap-2">
          <JoinGroupDialog />
          <NewGroupDialog />
        </div>
      </header>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search groups…" className="pl-9" />
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center text-muted-foreground">
          <p className="text-sm">No groups found.</p>
          <p className="mt-1 text-xs">Create a new group to start splitting bills!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((g) => (
            <Link
              key={g.groupId}
              to={`/groups/${g.groupId}`}
              className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-2xl">
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
                <div className="h-6" /> {/* Placeholder for AvatarStack */}
                <span className="text-xs text-muted-foreground truncate max-w-[150px]">{g.description}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const NewGroupDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ groupName: "", description: "", currency: "INR" });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: groupService.createGroup,
    onSuccess: (newGroup) => {
      queryClient.invalidateQueries({ queryKey: ["my-groups"] });
      toast.success("Group created!");
      setOpen(false);
      navigate(`/groups/${newGroup.groupId}`);
    },
    onError: (err: any) => toast.error(err.message || "Failed to create group"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" /> New group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create a new group</DialogTitle></DialogHeader>
        <form 
          className="space-y-4" 
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(formData);
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="groupName">Group name</Label>
            <Input 
              id="groupName" 
              placeholder="e.g. Manali Trip" 
              value={formData.groupName}
              onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
              required 
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description (optional)</Label>
            <Input 
              id="description" 
              placeholder="Short note for context"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="currency">Currency</Label>
            <Input 
              id="currency" 
              placeholder="INR, USD, etc."
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full bg-gradient-primary text-primary-foreground"
          >
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create group
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const JoinGroupDialog = () => {
  const [open, setOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: groupService.joinByCode,
    onSuccess: (group) => {
      queryClient.invalidateQueries({ queryKey: ["my-groups"] });
      toast.success(`Joined ${group.groupName}!`);
      setOpen(false);
      navigate(`/groups/${group.groupId}`);
    },
    onError: (err: any) => toast.error(err.message || "Invalid invite code"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Key className="mr-2 h-4 w-4" /> Join group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Join a group</DialogTitle></DialogHeader>
        <form 
          className="space-y-4" 
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(inviteCode);
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input 
              id="inviteCode" 
              placeholder="Enter the code shared with you" 
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required 
              className="uppercase tracking-widest font-mono"
            />
          </div>
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full bg-primary text-primary-foreground"
          >
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Join group
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Groups;
