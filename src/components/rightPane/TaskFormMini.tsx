
import React, { useState } from "react";
import { useTaskContext, TagType, PriorityType } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

const TaskFormMini = () => {
  const { addTask } = useTaskContext();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as PriorityType,
    tags: ["work"] as TagType[],
    timeSlot: "",
    deadline: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, tags: [value as TagType] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter a task title");
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
            <Label htmlFor="mini-tag" className="text-xs">Tag</Label>
            <select
              id="mini-tag"
              name="tags"
              value={formData.tags[0]}
              onChange={handleTagChange}
              className="w-full h-8 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
