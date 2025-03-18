
import React from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Menu, LogIn, LogOut, User, Mail, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header = ({ toggleMobileMenu }: HeaderProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session check error:", error);
        } else {
          setUser(data.session?.user || null);
        }
      } catch (err) {
        console.error("Unexpected error checking session:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setUser(session?.user || null);
        
        if (event === 'SIGNED_IN') {
          toast.success("Successfully signed in!");
          setShowAuthDialog(false);
        } else if (event === 'SIGNED_OUT') {
          toast.success("Successfully signed out!");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setAuthError("");
    setForgotPassword(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error);
        setAuthError(error.message);
        toast.error(`Login failed: ${error.message}`);
      }
    } catch (err) {
      console.error("Sign in exception:", err);
      setAuthError("An unexpected error occurred");
      toast.error("An unexpected error occurred during login");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) {
        console.error("Sign up error:", error);
        setAuthError(error.message);
        toast.error(`Registration failed: ${error.message}`);
      } else {
        toast.success("Check your email for a confirmation link!");
        resetForm();
        setShowAuthDialog(false);
      }
    } catch (err) {
      console.error("Sign up exception:", err);
      setAuthError("An unexpected error occurred");
      toast.error("An unexpected error occurred during registration");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      
      if (error) {
        console.error("Reset password error:", error);
        setAuthError(error.message);
        toast.error(`Password reset failed: ${error.message}`);
      } else {
        toast.success("Check your email for a password reset link!");
        resetForm();
        setShowAuthDialog(false);
      }
    } catch (err) {
      console.error("Reset password exception:", err);
      setAuthError("An unexpected error occurred");
      toast.error("An unexpected error occurred during password reset");
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast.error(`Logout failed: ${error.message}`);
      }
    } catch (err) {
      console.error("Sign out exception:", err);
      toast.error("An unexpected error occurred during logout");
    }
  };

  const openAuthDialog = (loginMode = true) => {
    resetForm();
    setIsLogin(loginMode);
    setShowAuthDialog(true);
  };

  return (
    <header className="relative z-10 w-full">
      <div className="container flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient animate-in slide-in">
            Say Hello to Productivity!
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {loading ? (
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-10 w-10 p-0 bg-secondary/80 hover:bg-secondary"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => openAuthDialog(true)}
              className="flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          )}
          
          <button
            onClick={toggleMobileMenu}
            className={cn(
              "md:hidden h-10 w-10 rounded-full flex items-center justify-center",
              "bg-secondary/80 hover:bg-secondary dark:bg-secondary/30 dark:hover:bg-secondary/40",
              "backdrop-blur-sm border border-white/20 dark:border-white/10",
              "focus:outline-none focus:ring-2 focus:ring-primary/80"
            )}
            aria-label="Toggle mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {forgotPassword 
                ? "Reset Password" 
                : isLogin 
                  ? "Login to Your Account" 
                  : "Create an Account"}
            </DialogTitle>
            <DialogDescription>
              {forgotPassword 
                ? "Enter your email to receive a password reset link." 
                : isLogin 
                  ? "Enter your credentials to login." 
                  : "Sign up to track your tasks and boost productivity."}
            </DialogDescription>
          </DialogHeader>
          
          {authError && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {authError}
            </div>
          )}
          
          <form onSubmit={forgotPassword ? handleResetPassword : isLogin ? handleSignIn : handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            {!forgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">
                  <Key className="h-4 w-4 inline mr-2" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            )}
            
            <DialogFooter className="flex-col sm:flex-row sm:justify-between sm:space-x-0">
              <div className="flex flex-col space-y-2">
                {isLogin && !forgotPassword && (
                  <button 
                    type="button"
                    onClick={() => setForgotPassword(true)}
                    className="text-sm text-primary hover:underline text-left"
                  >
                    Forgot password?
                  </button>
                )}
                
                {forgotPassword && (
                  <button 
                    type="button"
                    onClick={() => setForgotPassword(false)}
                    className="text-sm text-primary hover:underline text-left"
                  >
                    Back to login
                  </button>
                )}
                
                {!forgotPassword && (
                  <button 
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-primary hover:underline text-left"
                  >
                    {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
                  </button>
                )}
              </div>
              
              <Button type="submit">
                {forgotPassword 
                  ? "Send Reset Link" 
                  : isLogin 
                    ? "Sign In" 
                    : "Sign Up"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
