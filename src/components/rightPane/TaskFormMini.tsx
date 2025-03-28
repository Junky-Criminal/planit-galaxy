import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Link, Bell, Plus, X } from 'lucide-react';
import { TagType, PriorityType } from '@/types';

const TaskFormMini = () => {
  const { addTask, availableTags, addCustomTag } = useTaskContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    review: '',
    priority: 'medium' as PriorityType,
    status: false,
    tag: '' as TagType,
    links: '',
    timeRequired: '',
    scheduledTimeFrom: '',
    scheduledTimeTo: '',
    scheduledDate: '',
  });

  const [customTag, setCustomTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagSelect = (tag: TagType) => {
    setFormData(prev => ({ ...prev, tag }));
  };

  const handleAddCustomTag = () => {
    if (customTag.trim()) {
      addCustomTag(customTag.trim() as TagType);
      handleTagSelect(customTag.trim() as TagType);
      setShowTagInput(false);
      setCustomTag('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTask(formData);
    setFormData({
      title: '',
      description: '',
      review: '',
      priority: 'medium',
      status: false,
      tag: '' as TagType,
      links: '',
      timeRequired: '',
      scheduledTimeFrom: '',
      scheduledTimeTo: '',
      scheduledDate: '',
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
          <Label htmlFor="title" className="text-xs">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Task title"
            className="h-8 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-xs">Description</Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Task description"
            className="h-8 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="review" className="text-xs">Review</Label>
          <Input
            id="review"
            name="review"
            value={formData.review}
            onChange={handleInputChange}
            placeholder="Task review"
            className="h-8 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="priority" className="text-xs">Priority</Label>
            <select
              id="priority"
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
            <Label htmlFor="status" className="text-xs">Status</Label>
            <div className="flex items-center h-8">
              <Switch
                id="status"
                checked={formData.status}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked }))}
              />
              <span className="ml-2 text-xs">{formData.status ? 'Complete' : 'Incomplete'}</span>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="tag" className="text-xs">Tag</Label>
          <div className="space-y-1">
            {!showTagInput ? (
              <Select
                value={formData.tag}
                onValueChange={(value: string) => {
                  if (value === "custom") {
                    setShowTagInput(true);
                  } else {
                    handleTagSelect(value as TagType);
                  }
                }}
              >
                <SelectTrigger className="h-6 text-xs">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  {availableTags.map(tag => (
                    <SelectItem key={tag} value={tag} className="text-xs">
                      {tag}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom" className="text-xs">+ Add custom tag</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex gap-1">
                <Input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="Enter custom tag"
                  className="h-6 text-xs"
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

        <div>
          <Label htmlFor="links" className="text-xs">Links and Resources</Label>
          <div className="relative">
            <Link className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              id="links"
              name="links"
              value={formData.links}
              onChange={handleInputChange}
              placeholder="Resources or URLs"
              className="h-8 text-sm pl-7"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="timeRequired" className="text-xs">Time Required (hrs)</Label>
          <Input
            id="timeRequired"
            name="timeRequired"
            type="number"
            value={formData.timeRequired}
            onChange={handleInputChange}
            placeholder="e.g. 2"
            className="h-8 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="scheduledTimeFrom" className="text-xs">From Time</Label>
            <Input
              id="scheduledTimeFrom"
              name="scheduledTimeFrom"
              type="time"
              value={formData.scheduledTimeFrom}
              onChange={handleInputChange}
              className="h-8 text-sm"
            />
          </div>

          <div>
            <Label htmlFor="scheduledTimeTo" className="text-xs">To Time</Label>
            <Input
              id="scheduledTimeTo"
              name="scheduledTimeTo"
              type="time"
              value={formData.scheduledTimeTo}
              onChange={handleInputChange}
              className="h-8 text-sm"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="scheduledDate" className="text-xs">Scheduled Date</Label>
          <Input
            id="scheduledDate"
            type="date"
            name="scheduledDate"
            value={formData.scheduledDate}
            onChange={handleInputChange}
            className="h-8 text-sm"
          />
        </div>

        <Button type="submit" className="w-full">
          Add Task
        </Button>
      </form>
    </div>
  );
};

export default TaskFormMini;