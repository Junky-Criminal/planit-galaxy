
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";
import { Toaster } from "@/components/ui/sonner";
import { useTaskContext } from "@/context/TaskContext";
import { TaskProvider } from "@/context/TaskContext";
import { ThemeProvider } from "@/context/ThemeContext";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useTaskContext();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Index />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" closeButton />
        </Router>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
