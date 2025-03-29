
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaskContext } from "@/context/TaskContext";
import { getTagCardColor, getPriorityColor } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onToggleCompletion: (id: string) => void;
}

const TaskCard = ({ task, onToggleCompletion }: TaskCardProps) => {
  const { updateTask } = useTaskContext();
  const [isEditingTask, setIsEditingTask] = useState(false);
  const tagCardColor = getTagCardColor(task.tag);
  const priorityColor = getPriorityColor(task.priority);

  return (
    <div className={cn(
      "rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300",
      tagCardColor,
      task.Status && "opacity-70"
    )}>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 w-full">
            <div>
              <input
                type="checkbox"
                checked={task.Status}
                onChange={() => onToggleCompletion(task.id)}
                className="h-5 w-5 rounded border-gray-300"
              />
            </div>
            <div className="space-y-2 w-full">
              <div className="flex justify-between items-start">
                <h3 className={cn(
                  "font-medium line-clamp-2",
                  task.completed && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setIsEditingTask(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}

              {task.review && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Review:</span> {task.review}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className={cn("font-medium", priorityColor)}>
                  Priority: {task.priority}
                </div>
                <div>Tag: {task.tag}</div>
                {task.timeRequired && (
                  <div>Time Required: {task.timeRequired}hrs</div>
                )}
              </div>

              {task.scheduleFrom && task.scheduleTo && (
                <div className="text-sm">
                  Schedule: {task.scheduleFrom} - {task.scheduleTo}
                </div>
              )}

              {task.scheduledDate && (
                <div className="text-sm">
                  Date: {task.scheduledDate}
                </div>
              )}

              {task.links && (
                <div className="text-sm">
                  <span className="font-medium">Resources:</span>
                  <a href={task.links} className="text-blue-500 ml-1 hover:underline" target="_blank" rel="noopener noreferrer">
                    {task.links}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
