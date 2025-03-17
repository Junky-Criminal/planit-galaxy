
import React, { useState, useEffect } from "react";
import { useTaskContext } from "@/context/TaskContext";
import TaskCard from "@/components/tasks/TaskCard";
import { cn } from "@/lib/utils";

interface TaskListProps {
  completed: boolean;
  className?: string;
}

const TaskList = ({ completed, className }: TaskListProps) => {
  const { getTasksByStatus, toggleTaskCompletion } = useTaskContext();
  const tasks = getTasksByStatus(completed);
  const [rightPaneOpen, setRightPaneOpen] = useState(true);

  // Listen for the custom event from RightPane
  useEffect(() => {
    const handleRightPaneToggle = (event: CustomEvent<{isOpen: boolean}>) => {
      setRightPaneOpen(event.detail.isOpen);
    };

    // Add event listener with type assertion
    window.addEventListener('rightpane-toggle', handleRightPaneToggle as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('rightpane-toggle', handleRightPaneToggle as EventListener);
    };
  }, []);

  return (
    <div 
      className={cn(
        "space-y-4 transition-all duration-300", 
        rightPaneOpen ? "pr-[380px] md:pr-[380px]" : "pr-0", 
        className
      )}
    >
      {tasks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {completed 
              ? "No completed tasks yet. Get productive!"
              : "No pending tasks. Add a new task to get started!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleCompletion={toggleTaskCompletion}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
