
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronsRight, ChevronsLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import TaskAssistant from "./TaskAssistant";

interface RightPaneProps {
  className?: string;
}

const RightPane = ({ className }: RightPaneProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const togglePane = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={cn(
        "fixed top-20 right-0 h-[calc(100vh-5rem)] transition-all duration-300 ease-in-out bg-background border-l border-border shadow-lg z-10",
        isOpen ? "w-[380px]" : "w-12",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePane}
        className="absolute -left-3 top-4 h-8 w-8 rounded-full border bg-background shadow-md z-20"
        aria-label={isOpen ? "Close right pane" : "Open right pane"}
      >
        {isOpen ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
      </Button>

      {/* Always render the content, but control visibility with classes */}
      <div className={cn("h-full", isOpen ? "opacity-100 visible" : "opacity-0 invisible")}>
        <TaskAssistant />
      </div>
    </div>
  );
};

export default RightPane;
