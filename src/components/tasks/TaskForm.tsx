
import React, { useState } from "react";
import { useTaskContext, TagType, PriorityType } from "@/context/TaskContext";
import { cn } from "@/lib/utils";
import VoiceInputButton from "@/components/ui/VoiceInputButton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bell, Calendar, Clock, Link as LinkIcon, X, Plus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    scheduledDate: "",
    notificationsEnabled: false,
    emailNotification: "",
    notificationTime: ""
  });
  
  const [availableTags, setAvailableTags] = useState<TagType[]>(["work", "personal", "health", "finance", "education", "social", "home", "other"]);
  const [customTag, setCustomTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
  
  const handleAddCustomTag = () => {
    if (!customTag.trim()) {
      return;
    }
    
    const normalizedTag = customTag.toLowerCase().trim() as TagType;
    
    // Check if tag is already selected
    if (formData.tags.includes(normalizedTag)) {
      toast.info("This tag is already added");
      return;
    }
    
    // If tag doesn't exist in available tags, add it
    if (!availableTags.includes(normalizedTag)) {
      setAvailableTags(prev => [...prev, normalizedTag]);
    }
    
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, normalizedTag]
    }));
    
    setCustomTag("");
    setShowTagInput(false);
  };
  
  const handleTagToggle = (tag: TagType) => {
    setFormData(prev => {
      if (prev.tags.includes(tag)) {
        return {
          ...prev,
          tags: prev.tags.filter(t => t !== tag)
        };
      } else {
        return {
          ...prev,
          tags: [...prev.tags, tag]
        };
      }
    });
  };
  
  const handleRemoveTag = (tag: TagType) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    
    if (formData.tags.length === 0) {
      toast.error("Please add at least one tag");
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
      scheduledDate: "",
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
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-1"
                >
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(tag)}
                    className="rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            
            <div className="space-y-2">
              {!showTagInput ? (
                <div className="flex gap-2">
                  <Select
                    onValueChange={(value: string) => {
                      if (value === "custom") {
                        setShowTagInput(true);
                      } else if (value) {
                        handleTagToggle(value as TagType);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTags
                        .filter(tag => !formData.tags.includes(tag))
                        .map(tag => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                      ))}
                      <SelectItem value="custom">+ Add custom tag</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="Enter custom tag"
                    className="flex-1 rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="outline" 
                    onClick={handleAddCustomTag}
                    disabled={!customTag}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="outline" 
                    onClick={() => {
                      setShowTagInput(false);
                      setCustomTag("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
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
        
        <div className="grid grid-cols-2 gap-4">
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
          
          <div>
            <label className="block text-sm font-medium mb-1">Scheduled Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              />
            </div>
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
