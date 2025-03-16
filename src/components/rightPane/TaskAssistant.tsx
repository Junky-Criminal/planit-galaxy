
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface TaskSummary {
  title: string;
  description: string;
  priority: string;
  tags: string[];
  timeSlot?: string;
  duration?: string;
  deadline?: string;
}

const TaskAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your task assistant. Describe your task and I'll help organize it."
    }
  ]);
  const [input, setInput] = useState("");
  const [taskSummary, setTaskSummary] = useState<TaskSummary | null>(null);
  const { addTask } = useTaskContext();

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate assistant response
    setTimeout(() => {
      // In a real app, this would be an API call to an LLM
      const assistantMessage: Message = {
        role: "assistant",
        content: "I've analyzed your task. Here's a summary:"
      };
      
      // Mock task summary - in a real app, this would come from the LLM
      const summary: TaskSummary = {
        title: input.length > 30 ? `${input.substring(0, 30)}...` : input,
        description: "Auto-generated description based on your input.",
        priority: "medium",
        tags: ["work"],
        timeSlot: "09:00-10:00",
        duration: "1 hr",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      setTaskSummary(summary);
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleCreateTask = () => {
    if (!taskSummary) return;
    
    addTask({
      title: taskSummary.title,
      description: taskSummary.description,
      priority: taskSummary.priority as any,
      tags: taskSummary.tags as any,
      timeSlot: taskSummary.timeSlot,
      duration: taskSummary.duration,
      deadline: taskSummary.deadline,
      notificationsEnabled: false
    });
    
    toast.success("Task created successfully!");
    
    // Reset the summary and add a confirmation message
    setTaskSummary(null);
    setMessages(prev => [
      ...prev, 
      { 
        role: "assistant", 
        content: "Task has been created! What else can I help you with?" 
      }
    ]);
  };

  const handleModifyRequest = () => {
    setInput("Please modify the task summary to...");
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b">
        <Bot className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Task Assistant</h3>
      </div>

      <div className="flex-1 overflow-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {taskSummary && (
          <div className="bg-muted rounded-lg p-3 border">
            <h4 className="font-medium text-sm mb-2">Task Summary:</h4>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="font-medium pr-2">Title:</td>
                  <td>{taskSummary.title}</td>
                </tr>
                <tr>
                  <td className="font-medium pr-2">Description:</td>
                  <td>{taskSummary.description}</td>
                </tr>
                <tr>
                  <td className="font-medium pr-2">Priority:</td>
                  <td className="capitalize">{taskSummary.priority}</td>
                </tr>
                <tr>
                  <td className="font-medium pr-2">Tags:</td>
                  <td>{taskSummary.tags.join(", ")}</td>
                </tr>
                {taskSummary.timeSlot && (
                  <tr>
                    <td className="font-medium pr-2">Time Slot:</td>
                    <td>{taskSummary.timeSlot}</td>
                  </tr>
                )}
                {taskSummary.duration && (
                  <tr>
                    <td className="font-medium pr-2">Duration:</td>
                    <td>{taskSummary.duration}</td>
                  </tr>
                )}
                {taskSummary.deadline && (
                  <tr>
                    <td className="font-medium pr-2">Deadline:</td>
                    <td>{taskSummary.deadline}</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={handleCreateTask}>Create Task</Button>
              <Button size="sm" variant="outline" onClick={handleModifyRequest}>
                Modify
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-end gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your task..."
          className="min-h-24 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskAssistant;
