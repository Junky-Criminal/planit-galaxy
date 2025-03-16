
import React, { useState } from "react";
import { Task, TagType, PriorityType, useTaskContext } from "@/context/TaskContext";
import TagBadge from "@/components/tasks/TagBadge";
import { Bell, Calendar, Clock, Link as LinkIcon, Edit, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

interface TaskCardProps {
  task: Task;
  onToggleCompletion: (id: string) => void;
}

const TaskCard = ({ task, onToggleCompletion }: TaskCardProps) => {
  const { updateTask } = useTaskContext();
  
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
          <div className="flex items-center gap-2">
            {task.notificationsEnabled && (
              <div className="rounded-full bg-primary/10 p-1.5">
                <Bell className="h-4 w-4 text-primary" />
              </div>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit task</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <TaskEditForm task={task} />
              </SheetContent>
            </Sheet>
          </div>
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

interface TaskEditFormProps {
  task: Task;
}

const TaskEditForm = ({ task }: TaskEditFormProps) => {
  const { updateTask } = useTaskContext();
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    tags: task.tags,
    timeSlot: task.timeSlot || "",
    duration: task.duration || "",
    deadline: task.deadline || "",
    notificationsEnabled: task.notificationsEnabled || false,
    emailNotification: task.emailNotification || "",
    notificationTime: task.notificationTime || ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, tags: [value as TagType] }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    
    updateTask(task.id, formData);
    toast.success("Task updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-auto">
      <SheetHeader>
        <SheetTitle>Edit Task</SheetTitle>
        <SheetDescription>
          Make changes to your task here.
        </SheetDescription>
      </SheetHeader>
      
      <div>
        <Label htmlFor="edit-title">Title</Label>
        <Input
          id="edit-title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Task title"
        />
      </div>
      
      <div>
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description (Optional)"
          className="resize-none h-20"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-priority">Priority</Label>
          <select
            id="edit-priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="edit-tag">Tag</Label>
          <select
            id="edit-tag"
            name="tags"
            value={formData.tags[0]}
            onChange={handleTagChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="health">Health</option>
            <option value="finance">Finance</option>
            <option value="education">Education</option>
            <option value="social">Social</option>
            <option value="home">Home</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-timeSlot">Time Slot</Label>
          <Input
            id="edit-timeSlot"
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleInputChange}
            placeholder="e.g. 14:00-15:30"
            type="text"
          />
        </div>
        
        <div>
          <Label htmlFor="edit-duration">Duration</Label>
          <Input
            id="edit-duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="e.g. 1.5 hrs"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="edit-deadline">Deadline</Label>
        <Input
          id="edit-deadline"
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="edit-notifications"
            name="notificationsEnabled"
            checked={formData.notificationsEnabled}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="edit-notifications" className="text-sm font-medium">
            Enable notifications
          </Label>
        </div>
        
        {formData.notificationsEnabled && (
          <>
            <div>
              <Label htmlFor="edit-email">Notification Email</Label>
              <Input
                id="edit-email"
                type="email"
                name="emailNotification"
                value={formData.emailNotification}
                onChange={handleInputChange}
                placeholder="Enter email for notifications"
              />
            </div>
            <div>
              <Label htmlFor="edit-notification-time">Send Notification At</Label>
              <Input
                id="edit-notification-time"
                type="time"
                name="notificationTime"
                value={formData.notificationTime}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <SheetClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </SheetClose>
        <SheetClose asChild>
          <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
        </SheetClose>
      </div>
    </form>
  );
};

export default TaskCard;
