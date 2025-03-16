
import React from "react";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation = ({ activeTab, setActiveTab }: TabNavigationProps) => {
  const tabs = [
    { id: "todo", label: "To be done" },
    { id: "done", label: "Done" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="glass-panel rounded-full p-1.5 flex justify-between items-center max-w-md mx-auto">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out",
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md"
                  : "hover:bg-white/50 dark:hover:bg-white/10"
              )}
            >
              <span className="relative z-10">{tab.label}</span>
              {activeTab === tab.id && (
                <span className="absolute inset-0 bg-primary rounded-full animate-in fade-in" />
              )}
            </button>
          ))}
        </div>
        <button
          className="h-9 w-9 flex items-center justify-center rounded-full bg-primary text-white shadow-md"
          aria-label="Filter tasks"
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
