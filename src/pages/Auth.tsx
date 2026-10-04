import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, Mail, Lock, AtSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Auth = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "username">("email");
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (user && !user.isOnboarded) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const googleTokenClientRef = useRef<any>(null);

  useEffect(() => {
    /* global google */
    // @ts-ignore
    if (window.google && window.google.accounts && window.google.accounts.oauth2) {
      // @ts-ignore
      googleTokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "800959589094-24346938rhfneelhddsq3dtiik997c3d.apps.googleusercontent.com",
        scope: "profile email https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read",
        callback: handleGoogleLoginResponse,
      });
    }
  }, [mode]); // Render again when mode switches to ensure container is available if it was re-mounted

  async function handleGoogleLoginResponse(response: any) {
    if (response.error) {
      toast.error("Google authentication failed or was cancelled.");
      return;
    }
    setIsLoading(true);
    try {
      const authData = await authService.googleLogin(response.access_token);
      login(authData);
      toast.success("Welcome back with Google!");
      
      if (!authData.user.isOnboarded) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleClick = () => {
    if (googleTokenClientRef.current) {
      googleTokenClientRef.current.requestAccessToken();
    } else {
      toast.error("Google authentication service not loaded yet. Please refresh.");
    }
  };

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          setIsLoading(false);
          return;
        }

        let response;
        if (authMethod === "email") {
          response = await authService.signupEmail({
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          });
        } else {
          response = await authService.signupUsername({
            username: formData.username,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          });
        }
        login(response);
        toast.success("Account created successfully!");
        navigate("/onboarding");
      } else {
        // Sign in
        const response = await authService.login({
          emailOrUsername: authMethod === "email" ? formData.email : formData.username,
          password: formData.password,
        });
        login(response);
        toast.success("Welcome back!");
        
        if (!response.user.isOnboarded) {
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-glow" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Splitmate</span>
        </Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Home</Link>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col px-6 pb-16 pt-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to settle the score with friends."
              : "Track shared expenses without the awkward math."}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-5 grid grid-cols-2 rounded-lg bg-secondary p-1 text-sm font-medium">
            <button
              onClick={() => setMode("signin")}
              className={`rounded-md py-2 transition-smooth ${mode === "signin" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`rounded-md py-2 transition-smooth ${mode === "signup" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Create account
            </button>
          </div>

          <Tabs 
            value={authMethod} 
            onValueChange={(val) => setAuthMethod(val as "email" | "username")} 
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="username">Username</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <Field 
                  id="email" 
                  label="Email" 
                  icon={<Mail className="h-4 w-4" />} 
                  type="email" 
                  placeholder="you@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Field 
                  id="password" 
                  label="Password" 
                  icon={<Lock className="h-4 w-4" />} 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {mode === "signup" && (
                  <Field 
                    id="confirmPassword" 
                    label="Confirm password" 
                    icon={<Lock className="h-4 w-4" />} 
                    type="password" 
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                )}
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {mode === "signin" ? "Sign in" : "Create account"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="username">
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <Field 
                  id="username" 
                  label="Username" 
                  icon={<AtSign className="h-4 w-4" />} 
                  placeholder="yourhandle"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <Field 
                  id="password" 
                  label="Password" 
                  icon={<Lock className="h-4 w-4" />} 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {mode === "signup" && (
                  <Field 
                    id="confirmPassword" 
                    label="Confirm password" 
                    icon={<Lock className="h-4 w-4" />} 
                    type="password" 
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                )}
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {mode === "signin" ? "Sign in" : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-[40px] text-foreground font-medium"
            onClick={handleGoogleClick}
          >
            <GoogleIcon />
            Sign in with Google
          </Button>
          
          <p className="mt-4 text-center text-xs text-muted-foreground italic">
            Trouble with Google? Try email or username sign in below.
          </p>

          {mode === "signin" && (
            <button className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground">
              Forgot password?
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

const Field = ({
  id, label, icon, ...rest
}: { id: string; label: string; icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">{label}</Label>
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">{icon}</span>
      <Input id={id} {...rest} className="pl-9" />
    </div>
  </div>
);

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 6.4 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 6.9 29.1 5 24 5 16.3 5 9.7 9 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 43c5 0 9.5-1.9 12.9-5l-6-5C29 34.5 26.6 35.5 24 35.5c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39 16.2 43 24 43z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.4 5.5l6 5C40.6 35 43.5 29.9 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
  </svg>
);

export default Auth;
