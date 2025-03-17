
import React, { useState, useEffect } from "react";
import { useTaskContext } from "@/context/TaskContext";
import TaskCard from "@/components/tasks/TaskCard";
import { cn } from "@/lib/utils";
import { PriorityType, TagType } from "@/context/TaskContext";

interface TaskListProps {
  completed: boolean;
  className?: string;
  dateFilter: string;
  priorityFilter: PriorityType | "all";
  tagFilter: TagType | "all";
}

const TaskList = ({ 
  completed, 
  className, 
  dateFilter, 
  priorityFilter, 
  tagFilter 
}: TaskListProps) => {
  const { getFilteredTasks, toggleTaskCompletion } = useTaskContext();
  const tasks = getFilteredTasks(completed, dateFilter, priorityFilter, tagFilter);
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
              ? "No completed tasks found with the selected filters."
              : "No pending tasks found with the selected filters."}
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
