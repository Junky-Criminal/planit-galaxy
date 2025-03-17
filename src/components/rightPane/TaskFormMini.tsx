
import React, { useState } from "react";
import { useTaskContext, TagType, PriorityType } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PlusCircle, X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TaskFormMini = () => {
  const { addTask } = useTaskContext();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as PriorityType,
    tags: ["work"] as TagType[],
    timeSlot: "",
    deadline: "",
    scheduledDate: "",
  });
  
  const [availableTags, setAvailableTags] = useState<TagType[]>(["work", "personal", "health", "finance", "education", "social", "home", "other"]);
  const [customTag, setCustomTag] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag: TagType) => {
    setFormData((prev) => {
      const currentTags = [...prev.tags];
      
      if (currentTags.includes(tag)) {
        // Remove tag if it exists
        return { ...prev, tags: currentTags.filter(t => t !== tag) };
      } else {
        // Add tag if it doesn't exist
        return { ...prev, tags: [...currentTags, tag] };
      }
    });
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
      ...formData,
      notificationsEnabled: false
    });
    
    toast.success("Task added successfully!");
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      tags: ["work"],
      timeSlot: "",
      deadline: "",
      scheduledDate: "",
    });
  };

  return (
    <div className="p-2 h-full overflow-hidden">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b">
        <PlusCircle className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Quick Add Task</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-2 text-sm">
        <div>
          <Label htmlFor="mini-title" className="text-xs">Title</Label>
          <Input
            id="mini-title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Task title"
            className="h-8 text-sm"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="mini-priority" className="text-xs">Priority</Label>
            <select
              id="mini-priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full h-8 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="mini-scheduledDate" className="text-xs">Scheduled Date</Label>
            <Input
              id="mini-scheduledDate"
              type="date"
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleInputChange}
              className="h-8 text-sm"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="mini-tags" className="text-xs">Tags</Label>
          <div className="flex flex-wrap gap-1 mb-1">
            {formData.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="flex items-center gap-1 px-1.5 py-0.5 text-xs"
              >
                {tag}
                <button 
                  type="button" 
                  onClick={() => handleRemoveTag(tag)}
                  className="rounded-full hover:bg-muted p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="space-y-1">
            {!showTagInput ? (
              <Select
                onValueChange={(value: string) => {
                  if (value === "custom") {
                    setShowTagInput(true);
                  } else if (value) {
                    handleTagToggle(value as TagType);
                  }
                }}
              >
                <SelectTrigger className="h-6 text-xs">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  {availableTags
                    .filter(tag => !formData.tags.includes(tag))
                    .map(tag => (
                      <SelectItem key={tag} value={tag} className="text-xs">
                        {tag}
                      </SelectItem>
                  ))}
                  <SelectItem value="custom" className="text-xs">+ Add custom tag</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex gap-1">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="Enter custom tag"
                  className="flex-1 h-6 rounded-md border border-input bg-background px-2 py-0.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline" 
                  onClick={handleAddCustomTag}
                  disabled={!customTag}
                  className="h-6 w-6"
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline" 
                  onClick={() => {
                    setShowTagInput(false);
                    setCustomTag("");
                  }}
                  className="h-6 w-6"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="mini-timeSlot" className="text-xs">Time Slot</Label>
            <Input
              id="mini-timeSlot"
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleInputChange}
              placeholder="e.g. 14:00-15:30"
              className="h-8 text-sm"
            />
          </div>
          
          <div>
            <Label htmlFor="mini-deadline" className="text-xs">Deadline</Label>
            <Input
              id="mini-deadline"
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="h-8 text-sm"
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full h-8 text-sm">Add Task</Button>
      </form>
    </div>
  );
};

export default TaskFormMini;
