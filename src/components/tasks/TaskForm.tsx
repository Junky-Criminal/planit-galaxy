
import React, { useState } from "react";
import { useTaskContext, TagType, PriorityType } from "@/context/TaskContext";
import { cn } from "@/lib/utils";
import VoiceInputButton from "@/components/ui/VoiceInputButton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bell, Calendar, Clock, Link as LinkIcon } from "lucide-react";

interface TaskFormProps {
  className?: string;
}

const TaskForm = ({ className }: TaskFormProps) => {
  const { addTask } = useTaskContext();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as PriorityType,
    tags: ["work"] as TagType[],
    timeSlot: "",
    duration: "",
    expectedHours: "",
    links: "",
    deadline: "",
    notificationsEnabled: false,
    emailNotification: "",
    notificationTime: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, tags: [value as TagType] }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleVoiceInput = (text: string) => {
    // In a real app, we would parse the text to extract task details
    // For now, we'll just set the title
    setFormData((prev) => ({ ...prev, title: text }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    
    addTask({
      ...formData
    });
    
    toast.success("Task added successfully!");
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      tags: ["work"],
      timeSlot: "",
      duration: "",
      expectedHours: "",
      links: "",
      deadline: "",
      notificationsEnabled: false,
      emailNotification: "",
      notificationTime: ""
    });
  };

  return (
    <div className={cn(
      "glass-panel rounded-2xl p-6 animate-in slide-in",
      className
    )}>
      <h2 className="text-xl font-bold mb-4">Add New Task</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Task Title"
            className="flex-1 rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          />
          <VoiceInputButton onVoiceInput={handleVoiceInput} />
        </div>
        
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description (Optional)"
          className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[100px]"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tag</label>
            <select
              name="tags"
              value={formData.tags[0]}
              onChange={handleTagChange}
              className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
            <label className="block text-sm font-medium mb-1">Time Slot</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleInputChange}
                placeholder="e.g. 10:00-11:30"
                className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="e.g. 1.5 hrs"
              className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Links and Resources</label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="links"
              value={formData.links}
              onChange={handleInputChange}
              placeholder="Add URLs or resource notes"
              className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Deadline</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notificationsEnabled"
              name="notificationsEnabled"
              checked={formData.notificationsEnabled}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="notificationsEnabled" className="text-sm font-medium">
              Enable Notifications
            </label>
          </div>
          
          {formData.notificationsEnabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email Notification</label>
                <div className="relative">
                  <Bell className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="emailNotification"
                    value={formData.emailNotification}
                    onChange={handleInputChange}
                    placeholder="Enter email for notifications"
                    className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Send Notification At</label>
                <input
                  type="time"
                  name="notificationTime"
                  value={formData.notificationTime}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                />
              </div>
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-xl transition-colors"
        >
          Add Task
        </Button>
      </form>
    </div>
  );
};

export default TaskForm;
