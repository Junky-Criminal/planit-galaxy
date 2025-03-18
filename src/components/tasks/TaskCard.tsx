
import React, { useState } from "react";
import { Task, PriorityType, useTaskContext } from "@/context/TaskContext";
import TagBadge from "@/components/tasks/TagBadge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Calendar, Clock, Link, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TaskCardProps {
  task: Task;
  onToggleCompletion: (id: string) => void;
}

const TaskCard = ({ task, onToggleCompletion }: TaskCardProps) => {
  const { updateTask } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [notificationData, setNotificationData] = useState({
    notificationsEnabled: task.notificationsEnabled || false,
    emailNotification: task.emailNotification || "",
    notificationTime: task.notificationTime || "09:00",
  });

  const getDeadlineStatus = () => {
    if (!task.deadline) return "";
    
    const now = new Date();
    const deadline = new Date(task.deadline);
    
    if (deadline < now) {
      return "text-red-500";
    }
    
    // Check if deadline is within 2 days
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
    if (deadline.getTime() - now.getTime() < twoDaysInMs) {
      return "text-amber-500";
    }
    
    return "text-green-500";
  };

  const getPriorityColor = (priority: PriorityType) => {
    switch (priority) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-orange-500";
      case "high":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleNotificationToggle = async () => {
    if (!notificationData.notificationsEnabled && !notificationData.emailNotification) {
      // If enabling notifications but no email is set, open the dialog
      setIsEditing(true);
      return;
    }
    
    const updatedState = !notificationData.notificationsEnabled;
    setNotificationData(prev => ({
      ...prev,
      notificationsEnabled: updatedState
    }));
    
    await updateTask(task.id, {
      notificationsEnabled: updatedState,
      emailNotification: notificationData.emailNotification,
      notificationTime: notificationData.notificationTime
    });
    
    toast.success(`Notifications ${updatedState ? "enabled" : "disabled"} for this task`);
  };

  const handleSaveNotifications = async () => {
    if (notificationData.notificationsEnabled && !notificationData.emailNotification) {
      toast.error("Please enter an email for notifications");
      return;
    }
    
    await updateTask(task.id, {
      notificationsEnabled: notificationData.notificationsEnabled,
      emailNotification: notificationData.emailNotification,
      notificationTime: notificationData.notificationTime
    });
    
    setIsEditing(false);
    toast.success("Notification settings updated");
  };

  return (
    <div className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-300",
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
            <div>
              <h3 className={cn(
                "font-medium line-clamp-2",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <div className={cn(
              "h-3 w-3 rounded-full",
              getPriorityColor(task.priority)
            )} />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 pt-1">
          {task.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-muted-foreground">
          {task.timeSlot && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{task.timeSlot}</span>
            </div>
          )}
          
          {task.deadline && (
            <div className={cn("flex items-center gap-1", getDeadlineStatus())}>
              <Calendar className="h-3 w-3" />
              <span>{task.deadline}</span>
            </div>
          )}
        </div>
        
        {task.links && (
          <div className="pt-1 text-xs">
            <div className="flex items-center gap-1 text-primary">
              <Link className="h-3 w-3" />
              <a href={task.links.startsWith("http") ? task.links : `https://${task.links}`} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="truncate hover:underline"
              >
                {task.links}
              </a>
            </div>
          </div>
        )}
        
        <div className="pt-1 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={handleNotificationToggle}
          >
            {notificationData.notificationsEnabled ? (
              <Bell className="h-3 w-3 mr-1 text-primary" />
            ) : (
              <BellOff className="h-3 w-3 mr-1 text-muted-foreground" />
            )}
            {notificationData.notificationsEnabled ? "Notifications On" : "Notifications Off"}
          </Button>
          
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setIsEditing(true)}
              >
                Edit Notifications
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Notification Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-notifications-enabled"
                    checked={notificationData.notificationsEnabled}
                    onCheckedChange={(checked) => 
                      setNotificationData(prev => ({ ...prev, notificationsEnabled: checked }))
                    }
                  />
                  <Label htmlFor="edit-notifications-enabled">Enable notifications</Label>
                </div>
                
                {notificationData.notificationsEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email-notification">Email for notifications</Label>
                      <Input
                        id="edit-email-notification"
                        type="email"
                        value={notificationData.emailNotification}
                        onChange={(e) => 
                          setNotificationData(prev => ({ ...prev, emailNotification: e.target.value }))
                        }
                        placeholder="Enter email for notifications"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-notification-time">Time to send notification</Label>
                      <Input
                        id="edit-notification-time"
                        type="time"
                        value={notificationData.notificationTime}
                        onChange={(e) => 
                          setNotificationData(prev => ({ ...prev, notificationTime: e.target.value }))
                        }
                      />
                    </div>
                  </>
                )}
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleSaveNotifications}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
