import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Bell, Shield, Sparkles, Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { InitialsAvatar } from "@/components/Avatar";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/user.service";
import { expenseService } from "@/services/expense.service";
import { groupService } from "@/services/group.service";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");

  const { data: balance } = useQuery({
    queryKey: ["dashboard-balance"],
    queryFn: () => expenseService.getDashboardBalance(),
  });

  const { data: groups } = useQuery({
    queryKey: ["my-groups"],
    queryFn: () => groupService.getMyGroups(),
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updatedUser = await userService.updateProfile({ fullName });
      updateUser(updatedUser);
      toast.success("Profile updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage how you appear and get notified.</p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-4">
          <InitialsAvatar member={{ name: user?.fullName || "User", avatar: user?.profilePictureUrl }} size="lg" />
          <div className="flex-1">
            <div className="text-lg font-semibold">{user?.fullName || "User"}</div>
            <div className="text-sm text-muted-foreground">{user?.email || user?.username}</div>
          </div>
          <div className="hidden sm:grid grid-cols-3 gap-3 text-center">
            <Stat label="Net" value={formatCurrency(Math.abs(balance?.netBalance ?? 0))} tone={(balance?.netBalance ?? 0) >= 0 ? "owed" : "owe"} />
            <Stat label="Owed" value={formatCurrency(balance?.totalOwed ?? 0)} tone="owed" />
            <Stat label="Owe" value={formatCurrency(balance?.totalOwe ?? 0)} tone="owe" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Account Details</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Full name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="space-y-1.5 opacity-60">
              <Label className="text-xs text-muted-foreground">Username (readonly)</Label>
              <Input value={user?.username || ""} readOnly disabled />
            </div>
            <div className="space-y-1.5 opacity-60">
              <Label className="text-xs text-muted-foreground">Email (readonly)</Label>
              <Input value={user?.email || ""} readOnly disabled />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isUpdating} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
              <ChangePasswordDialog />
            </div>
          </form>
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Preferences</h2>
          <Toggle icon={<Bell className="h-4 w-4" />}      title="Push notifications" desc="New expenses and settlements" defaultChecked />
          <Toggle icon={<Sparkles className="h-4 w-4" />}  title="Smart reminders"     desc="Nudge friends to settle up" />
          <Toggle icon={<Shield className="h-4 w-4" />}    title="Two-factor auth"     desc="Extra layer of security" />

          <div className="border-t border-border pt-4">
            <Button variant="outline" className="w-full text-owe border-owe/20 hover:bg-owe/5 hover:text-owe hover:border-owe/40" onClick={() => { logout(); toast.info("Signed out"); }}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Active groups</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {groups?.map((g) => (
            <Link
              key={g.groupId}
              to={`/groups/${g.groupId}`}
              className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs hover:border-primary/40 transition-smooth"
            >
              {g.groupName}
            </Link>
          ))}
          {(!groups || groups.length === 0) && <p className="text-xs text-muted-foreground italic">No groups yet.</p>}
        </div>
      </section>
    </div>
  );
};

const ChangePasswordDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      await userService.changePassword(formData);
      toast.success("Password changed successfully!");
      setOpen(false);
      setFormData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          <KeyRound className="mr-2 h-4 w-4" /> Change password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Change password</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="oldPassword">Current password</Label>
            <Input id="oldPassword" type="password" value={formData.oldPassword} onChange={(e) => setFormData({...formData, oldPassword: e.target.value})} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" type="password" value={formData.newPassword} onChange={(e) => setFormData({...formData, newPassword: e.target.value})} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmNewPassword">Confirm new password</Label>
            <Input id="confirmNewPassword" type="password" value={formData.confirmNewPassword} onChange={(e) => setFormData({...formData, confirmNewPassword: e.target.value})} required />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update password
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Stat = ({ label, value, tone }: { label: string; value: string; tone: "owed" | "owe" }) => (
  <div>
    <div className={`text-sm font-semibold ${tone === "owed" ? "text-owed" : "text-owe"}`}>{value}</div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
  </div>
);

const Toggle = ({
  icon, title, desc, defaultChecked,
}: { icon: React.ReactNode; title: string; desc: string; defaultChecked?: boolean }) => (
  <div className="flex items-center gap-3 rounded-xl bg-secondary/40 p-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground">{icon}</div>
    <div className="flex-1">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
    <Switch defaultChecked={defaultChecked} />
  </div>
);

export default Profile;
