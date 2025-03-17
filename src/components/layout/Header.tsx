
import React from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Menu, LogIn, LogOut, User } from "lucide-react";
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

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header = ({ toggleMobileMenu }: HeaderProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };

    checkSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setUser(session?.user || null);
        
        if (event === 'SIGNED_IN') {
          toast.success("Successfully signed in!");
        } else if (event === 'SIGNED_OUT') {
          toast.success("Successfully signed out!");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error);
        toast.error(`Login failed: ${error.message}`);
      } else {
        setShowAuthModal(false);
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error("Sign in exception:", err);
      toast.error("An unexpected error occurred during login");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign up error:", error);
        toast.error(`Registration failed: ${error.message}`);
      } else {
        toast.success("Check your email for a confirmation link!");
        setShowAuthModal(false);
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error("Sign up exception:", err);
      toast.error("An unexpected error occurred during registration");
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
              onClick={() => {
                setIsLogin(true);
                setShowAuthModal(true);
              }}
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

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{isLogin ? "Login" : "Register"}</h2>
            
            <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowAuthModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">{isLogin ? "Login" : "Register"}</Button>
              </div>
              
              <div className="text-center text-sm">
                {isLogin ? (
                  <p>
                    Don't have an account?{" "}
                    <button 
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className="text-primary hover:underline"
                    >
                      Register
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button 
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className="text-primary hover:underline"
                    >
                      Login
                    </button>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
