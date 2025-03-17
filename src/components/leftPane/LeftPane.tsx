
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTaskContext, TagType, PriorityType } from "@/context/TaskContext";
import { toast } from "sonner";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LeftPane = () => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    <aside className="w-full h-full bg-background border-r p-4">
      <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
      <Separator className="mb-4" />
      
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Task title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Task description"
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
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
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
          
          <div className="space-y-2">
            <Label htmlFor="timeSlot">Time Slot (24h format)</Label>
            <Input
              id="timeSlot"
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleInputChange}
              placeholder="e.g. 14:00-15:30"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
            />
          </div>
          
          <Button type="submit" className="w-full">Add Task</Button>
        </form>
      </ScrollArea>
    </aside>
  );
};

export default LeftPane;
