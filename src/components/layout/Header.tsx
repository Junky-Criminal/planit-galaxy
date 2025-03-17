
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

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header = ({ toggleMobileMenu }: HeaderProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
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
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="User avatar" 
                      className="rounded-full h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user.user_metadata?.full_name || user.email}
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
              onClick={handleSignInWithGoogle}
              className="flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Login with Google
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
    </header>
  );
};

export default Header;
