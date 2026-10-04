import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Onboarding = () => {
  const navigate = useNavigate();
  const { updateUser, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    gender: user?.gender || "PREFER_NOT_TO_SAY",
    dob: user?.dob || "",
  });

  // Redirect if already onboarded
  if (user?.isOnboarded) {
    navigate("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedUser = await authService.completeOnboarding(formData);
      updateUser(updatedUser);
      toast.success("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-glow" />
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col px-6 py-12">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Splitmate</span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">Tell us a bit about you</h1>
        <p className="mt-2 text-sm text-muted-foreground">Just three quick fields. You can edit anytime.</p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card"
        >
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs text-muted-foreground">Full name</Label>
            <Input 
              id="fullName" 
              placeholder="e.g. Aarav Sharma" 
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required 
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Gender</Label>
            <Select 
              value={formData.gender} 
              onValueChange={(val) => setFormData({ ...formData, gender: val })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
                <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dob" className="text-xs text-muted-foreground">Date of birth</Label>
            <Input 
              id="dob" 
              type="date" 
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              required 
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Complete setup
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
