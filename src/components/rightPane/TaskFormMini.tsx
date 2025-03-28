import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { TagType, PriorityType } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
// Placeholder components -  replace with actual implementations
const TagManager = ({ selectedTag, onTagSelect }) => (
  <Select value={selectedTag} onValueChange={onTagSelect}>
    <SelectTrigger>
      <SelectValue placeholder="Select tag" />
    </SelectTrigger>
    <SelectContent>
      {/*  Replace with actual tag selection logic */}
      <SelectItem value="tag1">Tag 1</SelectItem>
      <SelectItem value="tag2">Tag 2</SelectItem>
    </SelectContent>
  </Select>
);

const DatePicker = ({ date, setDate }) => (
  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-8 text-sm" />
);


const TaskFormMini = () => {
  const { addTask, availableTags } = useTaskContext();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    review: "",
    priority: "medium" as PriorityType,
    status: false,
    tag: "" as TagType,
    links: "",
    timeRequired: "",
    scheduledDate: "",
    scheduleFrom: "",
    scheduleTo: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTask({
        ...formData,
        timeRequired: formData.timeRequired || "00:00"
      });
      setFormData({
        title: "",
        description: "",
        review: "",
        priority: "medium",
        status: false,
        tag: "",
        links: "",
        timeRequired: "",
        scheduledDate: "",
        scheduleFrom: "",
        scheduleTo: ""
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <ScrollArea className="h-[500px] w-[350px] rounded-md border p-4 text-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Quick Add Task</h3>
          </div>
          <Button size="sm" onClick={handleSubmit} className="px-2">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>

        <form className="space-y-3 text-sm">
          <div>
            <Label className="text-xs" htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="h-8 text-sm"
            />
          </div>

          <div>
            <Label className="text-xs" htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="h-8 text-sm"
            />
          </div>

          <div>
            <Label className="text-xs" htmlFor="review">Review</Label>
            <Input
              id="review"
              name="review"
              value={formData.review}
              onChange={handleInputChange}
              className="h-8 text-sm"
            />
          </div>

          <div>
            <Label className="text-xs" htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleSelectChange("priority", value)}
              className="text-sm"
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs" htmlFor="tag">Tag</Label>
            <TagManager
              selectedTag={formData.tag}
              onTagSelect={(tag) => setFormData({ ...formData, tag: tag as TagType })}
            />
          </div>

          <div>
            <Label className="text-xs" htmlFor="links">Links & Resources</Label>
            <Input
              id="links"
              name="links"
              value={formData.links}
              onChange={handleInputChange}
              className="h-8 text-sm"
            />
          </div>

          <div>
            <Label className="text-xs" htmlFor="timeRequired">Time Required (HH:MM)</Label>
            <Input
              id="timeRequired"
              name="timeRequired"
              value={formData.timeRequired}
              onChange={handleInputChange}
              placeholder="00:00"
              pattern="[0-9]{2}:[0-9]{2}"
              className="h-8 text-sm"
            />
          </div>

          <div>
            <Label className="text-xs" htmlFor="scheduledDate">Scheduled Date</Label>
            <DatePicker
              date={formData.scheduledDate}
              setDate={(date) => setFormData({ ...formData, scheduledDate: date })}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs" htmlFor="scheduleFrom">From</Label>
              <Input
                id="scheduleFrom"
                name="scheduleFrom"
                type="time"
                value={formData.scheduleFrom}
                onChange={handleInputChange}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs" htmlFor="scheduleTo">To</Label>
              <Input
                id="scheduleTo"
                name="scheduleTo"
                type="time"
                value={formData.scheduleTo}
                onChange={handleInputChange}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </form>
      </div>
    </ScrollArea>
  );
};

export default TaskFormMini;