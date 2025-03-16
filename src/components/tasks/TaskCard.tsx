
import React from "react";
import { Task, TagType, PriorityType } from "@/context/TaskContext";
import TagBadge from "@/components/tasks/TagBadge";
import { Bell, Calendar, Clock, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onToggleCompletion: (id: string) => void;
}

const TaskCard = ({ task, onToggleCompletion }: TaskCardProps) => {
  // Function to get tag-based background color for the card
  const getCardStyle = (tags: TagType[]) => {
    if (tags.length === 0) return "";
    
    // Use the first tag to determine the card color
    const primaryTag = tags[0];
    
    switch (primaryTag) {
      case "work":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50";
      case "personal":
        return "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50";
      case "health":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50";
      case "finance":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50";
      case "education":
        return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50";
      case "social":
        return "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800/50";
      case "home":
        return "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/50";
      case "other":
        return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800/50";
      default:
        return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800/50";
    }
  };

  // Function to get priority badge color
  const getPriorityBadgeStyle = (priority: PriorityType) => {
    switch (priority) {
      case "low":
        return "bg-green-500 text-white";
      case "medium":
        return "bg-orange-500 text-white";
      case "high":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border p-4 shadow-sm transition-all duration-200 hover-lift task-transition",
        "animate-in slide-in",
        getCardStyle(task.tags)
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleCompletion(task.id)}
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <h3 className={cn(
              "font-medium text-lg",
              task.completed && "line-through text-gray-500 dark:text-gray-400"
            )}>
              {task.title}
            </h3>
          </div>
          {task.notificationsEnabled && (
            <div className="rounded-full bg-primary/10 p-1.5">
              <Bell className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2">
          <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-medium",
            getPriorityBadgeStyle(task.priority)
          )}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          
          {task.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
          
          {task.timeSlot && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {task.timeSlot}
            </span>
          )}
          
          {task.duration && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {task.duration}
            </span>
          )}
        </div>
        
        {task.links && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <LinkIcon className="mr-1 h-3.5 w-3.5" />
            <span>Links and Resources</span>
          </div>
        )}
        
        {task.deadline && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="mr-1 h-3.5 w-3.5" />
            <span>Deadline: {task.deadline}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
