
import React from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header = ({ toggleMobileMenu }: HeaderProps) => {
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
