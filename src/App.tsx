import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Auth from "./pages/Auth.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import AppLayout from "./components/AppLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Groups from "./pages/Groups.tsx";
import GroupDetail from "./pages/GroupDetail.tsx";
import AddExpense from "./pages/AddExpense.tsx";
import ExpenseDetail from "./pages/ExpenseDetail.tsx";
import Activity from "./pages/Activity.tsx";
import Expenses from "./pages/Expenses.tsx";
import Profile from "./pages/Profile.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import TermsPrivacy from "./pages/TermsPrivacy.tsx";

import { AuthProvider } from "./contexts/AuthContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { ThemeProvider } from "./components/ThemeProvider.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="splitmate-theme" attribute="class">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/splitmate-about" element={<About />} />
              <Route path="/splitmate-contact" element={<Contact />} />
              <Route path="/splitmate-terms" element={<TermsPrivacy />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/onboarding" element={<Onboarding />} />
                
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/groups" element={<Groups />} />
                  <Route path="/groups/:id" element={<GroupDetail />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/expenses/new" element={<AddExpense />} />
                  <Route path="/expenses/:id" element={<ExpenseDetail />} />
                  <Route path="/activity" element={<Activity />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
