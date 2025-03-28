import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { TagType, PriorityType } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, ChevronsUpDown, Trash2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DatePicker = ({ date, setDate }) => (
  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-8 text-sm" />
);


const TaskFormMini = () => {
  const { addTask, availableTags, removeTag } = useTaskContext(); // Assumes removeTag is available in context
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
  const [open, setOpen] = useState(false);

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
          {/* ... other form elements ... */}

          <div>
            <Label className="text-xs" htmlFor="tag">Tag</Label>
            <div className="flex flex-col gap-1">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between text-left font-normal"
                  >
                    {formData.tag ? formData.tag : "Select tag..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search tag..." />
                    <CommandEmpty>No tag found.</CommandEmpty>
                    <CommandGroup>
                      {availableTags.map((tag) => (
                        <CommandItem
                          key={tag}
                          value={tag}
                          onSelect={() => {
                            setFormData({ ...formData, tag: tag as TagType });
                            setOpen(false);
                          }}
                          className="flex justify-between"
                        >
                          <span>{tag}</span>
                          {tag !== 'other' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTag(tag as TagType);
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* ... rest of the form elements ... */}
        </form>
      </div>
    </ScrollArea>
  );
};

export default TaskFormMini;