
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import TaskForm from "../tasks/TaskForm";

const LeftPane = () => {
  const [isOpen, setIsOpen] = useState(true);

  const togglePane = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={cn(
        "fixed top-20 left-0 h-[calc(100vh-5rem)] transition-all duration-300 ease-in-out bg-background border-r border-border shadow-lg z-10",
        isOpen ? "w-[380px]" : "w-12"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePane}
        className="absolute -right-3 top-4 h-8 w-8 rounded-full border bg-background shadow-md z-20"
        aria-label={isOpen ? "Close left pane" : "Open left pane"}
      >
        {isOpen ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
      </Button>

      <div className={cn("h-full overflow-hidden", isOpen ? "opacity-100" : "opacity-0")}>
        <div className="p-4 h-full overflow-auto">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b">
            <PlusCircle className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Add New Task</h3>
          </div>
          
          <TaskForm className="max-h-[calc(100vh-12rem)] overflow-auto" />
        </div>
      </div>
    </div>
  );
};

export default LeftPane;
