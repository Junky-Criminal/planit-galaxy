
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, Mic, MicOff } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

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

    // Simulate assistant response - in a real app, this would call an actual LLM API
    setTimeout(() => {
      // Mock LLM processing with the new system prompt
      const assistantMessage: Message = {
        role: "assistant",
        content: "I've analyzed your task request. Here's what I understand:"
      };
      
      // Generate more sophisticated title and description based on user input
      const inputText = userMessage.content;
      
      // Extract a meaningful title (first sentence or first 5-7 words)
      const titleContent = inputText.split('.')[0];
      const title = titleContent.length > 40 
        ? titleContent.split(' ').slice(0, 5).join(' ') + '...'
        : titleContent;
      
      // Generate a more detailed description
      const description = generateTaskDescription(inputText);
      
      // Determine deadline - default to 7 days from now if not specified
      const deadlineMatch = inputText.match(/by\s(tomorrow|next week|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}\/\d{1,2}|\d{1,2}-\d{1,2}-\d{4}|\d{4}-\d{1,2}-\d{1,2})/i);
      const deadline = deadlineMatch 
        ? parseDeadline(deadlineMatch[1]) 
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Parse duration if mentioned
      const durationMatch = inputText.match(/(\d+)\s*(hour|hr|hours|minute|min|minutes)/i);
      const duration = durationMatch ? `${durationMatch[1]} ${durationMatch[2]}` : "1 hr";
      
      // Determine time slot in 24-hour format
      const timeSlotMatch = inputText.match(/at\s*(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
      let timeSlot = "";
      if (timeSlotMatch) {
        let hours = parseInt(timeSlotMatch[1]);
        const minutes = timeSlotMatch[2] ? timeSlotMatch[2] : "00";
        const meridian = timeSlotMatch[3] ? timeSlotMatch[3].toLowerCase() : null;
        
        // Convert to 24-hour format
        if (meridian === "pm" && hours < 12) hours += 12;
        if (meridian === "am" && hours === 12) hours = 0;
        
        const endHours = (hours + 1) % 24;
        timeSlot = `${hours.toString().padStart(2, '0')}:${minutes}-${endHours.toString().padStart(2, '0')}:${minutes}`;
      } else {
        // Default time slot: current hour to next hour
        const now = new Date();
        const hour = now.getHours();
        const nextHour = (hour + 1) % 24;
        timeSlot = `${hour.toString().padStart(2, '0')}:00-${nextHour.toString().padStart(2, '0')}:00`;
      }
      
      // Determine likely tag and priority based on input
      const tag = determineTag(inputText);
      const priority = determinePriority(inputText);
      
      // Create task summary
      const summary: TaskSummary = {
        title: title.charAt(0).toUpperCase() + title.slice(1),
        description: description,
        priority: priority,
        tags: [tag],
        timeSlot: timeSlot,
        duration: duration,
        deadline: deadline
      };

      setTaskSummary(summary);
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  // Helper function to generate a more detailed description
  const generateTaskDescription = (text: string): string => {
    // Create a more comprehensive description
    const keyPhrases = [
      "Remember to", 
      "Make sure to", 
      "Important points:", 
      "Focus on", 
      "Key objectives:"
    ];
    
    // Select random phrase to start with
    const phrase = keyPhrases[Math.floor(Math.random() * keyPhrases.length)];
    
    if (text.length < 60) {
      return `${text}. ${phrase} complete this task efficiently and document any outcomes.`;
    } else {
      // For longer inputs, use the original text but format it better
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      if (sentences.length > 1) {
        return `${sentences[0]}. ${sentences.slice(1, 3).join('. ')}`;
      } else {
        return text;
      }
    }
  };

  // Helper function to parse deadline text into a date
  const parseDeadline = (text: string): string => {
    const today = new Date();
    let deadlineDate = new Date();
    
    const lowercaseText = text.toLowerCase();
    
    if (lowercaseText === 'tomorrow') {
      deadlineDate.setDate(today.getDate() + 1);
    } else if (lowercaseText === 'next week') {
      deadlineDate.setDate(today.getDate() + 7);
    } else if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(lowercaseText)) {
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const targetDay = daysOfWeek.indexOf(lowercaseText);
      const currentDay = today.getDay();
      let daysToAdd = targetDay - currentDay;
      if (daysToAdd <= 0) daysToAdd += 7; // If the day has passed this week, get next week
      
      deadlineDate.setDate(today.getDate() + daysToAdd);
    } else if (text.match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
      // Format: MM/DD/YYYY
      const [month, day, year] = text.split('/').map(Number);
      deadlineDate = new Date(year, month - 1, day);
    } else if (text.match(/\d{1,2}\/\d{1,2}/)) {
      // Format: MM/DD (current year)
      const [month, day] = text.split('/').map(Number);
      deadlineDate = new Date(today.getFullYear(), month - 1, day);
    } else if (text.match(/\d{4}-\d{1,2}-\d{1,2}/)) {
      // Format: YYYY-MM-DD
      return text; // Already in ISO format
    }
    
    return deadlineDate.toISOString().split('T')[0];
  };

  // Helper function to determine tag based on input
  const determineTag = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('work') || lowerText.includes('meeting') || lowerText.includes('client') || lowerText.includes('project')) {
      return "work";
    } else if (lowerText.includes('gym') || lowerText.includes('exercise') || lowerText.includes('workout') || lowerText.includes('run')) {
      return "health";
    } else if (lowerText.includes('study') || lowerText.includes('read') || lowerText.includes('learn') || lowerText.includes('course')) {
      return "education";
    } else if (lowerText.includes('friend') || lowerText.includes('family') || lowerText.includes('party')) {
      return "social";
    } else if (lowerText.includes('buy') || lowerText.includes('shop') || lowerText.includes('pay') || lowerText.includes('bill')) {
      return "finance";
    } else if (lowerText.includes('clean') || lowerText.includes('fix') || lowerText.includes('repair') || lowerText.includes('house')) {
      return "home";
    } else {
      return "personal";
    }
  };

  // Helper function to determine priority based on input
  const determinePriority = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('urgent') || lowerText.includes('asap') || lowerText.includes('critical') || lowerText.includes('important')) {
      return "high";
    } else if (lowerText.includes('soon') || lowerText.includes('next week') || lowerText.includes('tomorrow')) {
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
