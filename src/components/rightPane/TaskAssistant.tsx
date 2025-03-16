
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, Mic, MicOff } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import { toast } from "sonner";

// Add TypeScript declarations for the Web Speech API
interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

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
      
      // Extract keywords for title (first 3-5 significant words)
      const titleWords = words.filter(word => word.length > 3).slice(0, 4);
      const title = titleWords.length > 0 
        ? titleWords.join(' ').charAt(0).toUpperCase() + titleWords.join(' ').slice(1)
        : inputText.length > 30 ? `${inputText.substring(0, 30)}...` : inputText;
      
      // Generate description
      const description = `Task based on: "${inputText}". ${generateContextBasedDescription(inputText)}`;
      
      // Generate timeSlot in 24-hour format
      const now = new Date();
      const hour = now.getHours();
      const nextHour = (hour + 1) % 24;
      const timeSlot = `${hour.toString().padStart(2, '0')}:00-${nextHour.toString().padStart(2, '0')}:00`;
      
      // Determine likely tag and priority based on input
      const tag = determineTag(inputText);
      const priority = determinePriority(inputText);
      
      // Mock task summary - in a real app, this would come from the LLM
      const summary: TaskSummary = {
        title: title,
        description: description,
        priority: priority,
        tags: [tag],
        timeSlot: timeSlot,
        duration: "1 hr",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      setTaskSummary(summary);
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  // Helper function to generate a more contextual description
  const generateContextBasedDescription = (text: string): string => {
    if (text.toLowerCase().includes("meeting")) {
      return "Prepare all necessary documents and talking points. Make sure to review the agenda beforehand.";
    } else if (text.toLowerCase().includes("report") || text.toLowerCase().includes("write")) {
      return "Gather all relevant data and information. Set aside uninterrupted time for writing and editing.";
    } else if (text.toLowerCase().includes("call") || text.toLowerCase().includes("phone")) {
      return "Prepare key discussion points. Have any reference materials ready before the call.";
    } else if (text.toLowerCase().includes("research")) {
      return "Define the scope and key questions. Identify main sources of information needed.";
    } else {
      return "Break this task into smaller steps. Consider what resources you might need to complete it efficiently.";
    }
  };

  // Helper function to determine tag based on input
  const determineTag = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("work") || lowerText.includes("meeting") || lowerText.includes("client") || lowerText.includes("project")) {
      return "work";
    } else if (lowerText.includes("gym") || lowerText.includes("exercise") || lowerText.includes("workout") || lowerText.includes("run")) {
      return "health";
    } else if (lowerText.includes("study") || lowerText.includes("read") || lowerText.includes("learn") || lowerText.includes("course")) {
      return "education";
    } else if (lowerText.includes("friend") || lowerText.includes("family") || lowerText.includes("party")) {
      return "social";
    } else if (lowerText.includes("buy") || lowerText.includes("shop") || lowerText.includes("pay") || lowerText.includes("bill")) {
      return "finance";
    } else if (lowerText.includes("clean") || lowerText.includes("fix") || lowerText.includes("repair") || lowerText.includes("house")) {
      return "home";
    } else {
      return "personal";
    }
  };

  // Helper function to determine priority based on input
  const determinePriority = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("urgent") || lowerText.includes("asap") || lowerText.includes("critical") || lowerText.includes("important")) {
      return "high";
    } else if (lowerText.includes("soon") || lowerText.includes("next week") || lowerText.includes("tomorrow")) {
      return "medium";
    } else {
      return "medium"; // Default to medium
    }
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

    try {
      // Use type assertion to help TypeScript recognize these properties
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                                  (window as any).webkitSpeechRecognition;
      
      const recognition = new SpeechRecognitionAPI();
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
        toast.success("Voice input captured");
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        toast.error(`Error capturing voice: ${event.error}`);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognition.start();
    } catch (error) {
      console.error('Speech recognition error:', error);
      setIsRecording(false);
      toast.error("Error initializing voice input");
      
      // Fallback for testing
      setTimeout(() => {
        setInput("Sample voice input for creating a task");
        setIsRecording(false);
        toast.success("Voice input simulated (fallback mode)");
      }, 2000);
    }
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
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
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
          <div className="bg-muted rounded-lg p-3 border text-xs">
            <h4 className="font-medium mb-2">Task Summary:</h4>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="font-medium pr-2">Title:</td>
                  <td>{taskSummary.title}</td>
                </tr>
                <tr>
                  <td className="font-medium pr-2 align-top">Description:</td>
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
                    <td className="font-medium pr-2">Time:</td>
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
          className="min-h-12 max-h-16 resize-none text-sm"
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
            className={`h-8 w-8 ${isRecording ? "bg-red-500 hover:bg-red-600" : ""}`}
            variant={isRecording ? "default" : "outline"}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
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
