import React, { useState, useEffect } from "react";
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

  return (
    <div className={cn(
      "rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300",
      tagCardColor,
      task.completed && "opacity-70"
    )}>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleCompletion(task.id)}
                className="h-5 w-5 rounded border-gray-300"
              />
            </div>
            <div className="space-y-2 w-full">
              <h3 className={cn(
                "font-medium line-clamp-2",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>

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
                <div>
                  <span className="font-medium">Priority:</span> {task.priority}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {task.status}
                </div>
                <div>
                  <span className="font-medium">Tag:</span> {task.tag}
                </div>
                <div>
                  <span className="font-medium">Time Required:</span> {task.timeRequired}hrs
                </div>
              </div>

              {task.linksAndResources && (
                <div className="text-sm">
                  <span className="font-medium">Links & Resources:</span>
                  <p className="text-blue-500">{task.linksAndResources}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Schedule:</span>
                  <p>{task.scheduleFrom} - {task.scheduleTo}</p>
                </div>
                <div>
                  <span className="font-medium">Date:</span> {task.scheduledDate}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={cn(
              "h-3 w-3 rounded-full",
              getPriorityColor(task.priority)
            )} />

            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setIsEditingTask(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;