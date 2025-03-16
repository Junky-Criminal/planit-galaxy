
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, Mic } from "lucide-react";
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
  const [isRecording, setIsRecording] = useState(false);
  const { addTask } = useTaskContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
      
      // Generate more sophisticated title and description based on user input
      const inputText = userMessage.content;
      const words = inputText.split(' ');
      
      // Extract key parts for title (first 3-5 significant words)
      const titleWords = words.filter(word => word.length > 3).slice(0, 4);
      const title = titleWords.length > 0 
        ? titleWords.join(' ').charAt(0).toUpperCase() + titleWords.join(' ').slice(1)
        : inputText.length > 30 ? `${inputText.substring(0, 30)}...` : inputText;
      
      // Generate description
      const description = `Task generated from your input: "${inputText}". You can edit this description to add more details.`;
      
      // Generate timeSlot in 24-hour format
      const now = new Date();
      const hour = now.getHours();
      const nextHour = (hour + 1) % 24;
      const timeSlot = `${hour.toString().padStart(2, '0')}:00-${nextHour.toString().padStart(2, '0')}:00`;
      
      // Mock task summary - in a real app, this would come from the LLM
      const summary: TaskSummary = {
        title: title,
        description: description,
        priority: "medium",
        tags: ["work"],
        timeSlot: timeSlot,
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

  const handleVoiceInput = () => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Voice input not supported in this browser.");
      return;
    }

    setIsRecording(true);
    
    // In a real implementation, this would use the Web Speech API
    // For now, we'll simulate a voice input after a brief delay
    setTimeout(() => {
      setIsRecording(false);
      setInput("Sample voice input for creating a task");
      toast.success("Voice input captured");
    }, 2000);
    
    // Real implementation would look like:
    /*
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsRecording(false);
    };
    recognition.onerror = () => {
      setIsRecording(false);
      toast.error("Error capturing voice");
    };
    recognition.start();
    */
  };

  return (
    <div className="flex flex-col h-full p-2">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b">
        <Bot className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Task Assistant</h3>
      </div>

      <div className="flex-1 overflow-auto mb-2 space-y-3 pr-1 max-h-[calc(65vh-5rem)]">
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
                  <td className="text-xs">{taskSummary.description}</td>
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
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-end gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your task..."
          className="min-h-16 resize-none text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <div className="flex flex-col gap-1">
          <Button 
            size="icon" 
            onClick={handleVoiceInput} 
            disabled={isRecording} 
            className="h-8 w-8"
            variant="outline"
          >
            <Mic className="h-4 w-4" color={isRecording ? "red" : undefined} />
            <span className="sr-only">Voice input</span>
          </Button>
          <Button size="icon" onClick={handleSend} disabled={!input.trim()} className="h-8 w-8">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskAssistant;
