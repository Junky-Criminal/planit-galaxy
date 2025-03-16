
import React, { createContext, useContext, useState, useEffect } from "react";

// Define task tag types with their colors
export type TagType = 
  | "work" 
  | "personal" 
  | "health" 
  | "finance" 
  | "education" 
  | "social" 
  | "home" 
  | "other";

export type PriorityType = "low" | "medium" | "high";

// Define a Task interface
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: PriorityType;
  tags: TagType[];
  timeSlot?: string;
  duration?: string;
  expectedHours?: string;
  links?: string;
  deadline?: string;
  createdAt: Date;
  notificationsEnabled?: boolean;
  emailNotification?: string;
}

// Define the Task Context interface
interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "completed">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  getTasksByStatus: (completed: boolean) => Task[];
}

// Create the context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Sample initial tasks
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Study about GNN",
    description: "Read research papers on GNN and watch yt videos on it.",
    completed: false,
    priority: "medium",
    tags: ["education"],
    timeSlot: "16:25-17:30",
    duration: "3.25 hrs",
    links: "https://example.com/gnn-research",
    deadline: "2023-09-30",
    createdAt: new Date(),
    notificationsEnabled: true
  },
  {
    id: "2",
    title: "Complete project proposal",
    description: "Finalize the draft and send it to the team for review.",
    completed: false,
    priority: "high",
    tags: ["work"],
    timeSlot: "10:00-12:00",
    duration: "2 hrs",
    deadline: "2023-09-25",
    createdAt: new Date(),
    notificationsEnabled: false
  },
  {
    id: "3",
    title: "Morning run",
    description: "5km around the park",
    completed: true,
    priority: "low",
    tags: ["health"],
    timeSlot: "06:30-07:15",
    duration: "0.75 hrs",
    createdAt: new Date(),
    notificationsEnabled: true
  }
];

// Provider component
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Try to load tasks from localStorage
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "completed">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date()
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // Update an existing task
  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...taskData } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Toggle task completion status
  const toggleTaskCompletion = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Get tasks by completion status
  const getTasksByStatus = (completed: boolean) => {
    return tasks.filter((task) => task.completed === completed);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        getTasksByStatus
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

// Custom hook to use the task context
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}

// Map tag types to colors
export const tagColors: Record<TagType, string> = {
  work: "tag-blue",
  personal: "tag-purple",
  health: "tag-green",
  finance: "tag-yellow",
  education: "tag-orange",
  social: "tag-pink",
  home: "tag-teal",
  other: "tag-gray"
};

// Map priority to colors
export const priorityColors: Record<PriorityType, string> = {
  low: "bg-green-500",
  medium: "bg-orange-500",
  high: "bg-red-500"
};
