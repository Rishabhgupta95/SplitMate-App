import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Receipt, Activity, User, Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/groups",    label: "Groups",    icon: Users },
  { to: "/activity",  label: "Activity",  icon: Activity },
  { to: "/expenses",  label: "Expenses",  icon: Receipt },
  { to: "/profile",   label: "Profile",   icon: User },
];

const AppLayout = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-sidebar md:flex">
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-elevated">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="text-base font-semibold tracking-tight">Splitmate</div>
              <div className="text-xs text-muted-foreground">Share. Settle. Smile.</div>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <nav className="mt-2 flex-1 space-y-1 px-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3">
          <Button
            variant="default"
            className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
            onClick={() => navigate("/expenses/new")}
          >
            <Plus className="mr-2 h-4 w-4" /> Add expense
          </Button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border bg-sidebar/95 px-2 py-2 backdrop-blur md:hidden">
        {nav.slice(0, 4).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[10px] font-medium",
                isActive ? "text-primary" : "text-muted-foreground",
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
        <button
          onClick={() => navigate("/expenses/new")}
          className="flex flex-1 flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[10px] font-medium text-primary"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
            <Plus className="h-4 w-4" />
          </div>
          Add
        </button>
      </nav>

      <main className="md:pl-64">
        <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-8 md:px-10 md:pb-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
