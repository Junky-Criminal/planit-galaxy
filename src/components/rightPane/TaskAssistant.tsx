
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, Mic, MicOff, Loader2 } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

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

// The system prompt for the assistant
const SYSTEM_PROMPT = `You are an intelligent task management assistant integrated into a productivity tool. Your role is to assist users in creating tasks by extracting structured details from their inputs (provided via text or voice) and presenting them in a clear tabular summary for review. Follow these instructions:

1. **Task Title and Description**:
   - Generate a concise and meaningful title for the task based on the user's input.
   - Create a brief description summarizing the task's purpose or key details.

2. **Attribute Extraction**:
   - Extract key attributes from the user's input, including:
     - **Priority**: High, Medium, or Low.
     - **Duration**: Estimated time required to complete the task.
     - **Deadline**: Specific date and/or time mentioned by the user.
     - **Tags**: Categorize the task into one or more user-defined tags (e.g., "Work," "Personal," "SOP").
   - If any attribute is missing or ambiguous, ask clarifying questions to ensure accuracy.

3. **Output Format**:
   - Present the extracted information in a tabular format with the following columns:
     - Task Title
     - Description
     - Priority
     - Duration
     - Deadline
     - Tags
   - Ensure the table is well-structured and easy to read.

4. **Error Handling**:
   - If the input is incomplete or unclear, politely ask for additional details.
   - Handle edge cases (e.g., invalid dates or missing priorities) by providing default suggestions or asking for corrections.

5. **Tone and Style**:
   - Maintain a professional yet conversational tone.
   - Be concise but thorough in your responses.

6. **Notification Integration**:
   - If the user specifies a notification preference (e.g., email alerts), include this detail in the summary.
   - Validate email addresses if provided.

7. **Context Awareness**:
   - Recognize and process both text-based and voice-based inputs.
   - Adapt dynamically to user preferences for light or dark themes when generating outputs, ensuring visual consistency with the app's UI.

Your primary goal is to make task creation intuitive and efficient while ensuring all necessary details are captured accurately.`;

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
  const [isProcessing, setIsProcessing] = useState(false);
  const { addTask } = useTaskContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    try {
      // Call the Edge Function to process the message with Gemini
      const allMessages = [...messages, userMessage];
      const { data, error } = await supabase.functions.invoke('gemini-task-assistant', {
        body: {
          messages: allMessages,
          systemPrompt: SYSTEM_PROMPT
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Add the assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content: data.generatedText
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Set task summary if available
      if (data.taskSummary) {
        setTaskSummary(data.taskSummary);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      toast.error("Failed to process your request. Please try again.");
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble processing your request right now. Please try again later."
        }
      ]);
    } finally {
      setIsProcessing(false);
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

      <ScrollArea className="flex-1 pr-2 max-h-[calc(100vh-14rem)]">
        <div className="space-y-3">
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

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}

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
      </ScrollArea>

      <div className="flex items-end gap-2 mt-2">
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
          disabled={isProcessing}
        />
        <div className="flex flex-col gap-1">
          <Button 
            size="icon" 
            onClick={handleVoiceInput} 
            disabled={isRecording || isProcessing} 
            className={`h-8 w-8 ${isRecording ? "bg-red-500 hover:bg-red-600" : ""}`}
            variant={isRecording ? "default" : "outline"}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            <span className="sr-only">Voice input</span>
          </Button>
          <Button 
            size="icon" 
            onClick={handleSend} 
            disabled={!input.trim() || isProcessing} 
            className="h-8 w-8"
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskAssistant;
