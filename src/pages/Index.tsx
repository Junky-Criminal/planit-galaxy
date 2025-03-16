
import React, { useState } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { TaskProvider } from "@/context/TaskContext";
import Header from "@/components/layout/Header";
import TabNavigation from "@/components/layout/TabNavigation";
import TaskList from "@/components/tasks/TaskList";
import AnalyticsSection from "@/components/analytics/AnalyticsSection";
import MobileMenu from "@/components/ui/MobileMenu";
import RightPane from "@/components/rightPane/RightPane";
import LeftPane from "@/components/leftPane/LeftPane";
import { cn } from "@/lib/utils";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const [activeTab, setActiveTab] = useState("todo");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <ThemeProvider>
      <TaskProvider>
        <div className="min-h-screen flex flex-col">
          <Header toggleMobileMenu={toggleMobileMenu} />
          
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          
          <div className="flex flex-1">
            <ResizablePanelGroup direction="horizontal" className="flex-1">
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <ScrollArea className="h-[calc(100vh-5rem)]">
                  <LeftPane />
                </ScrollArea>
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={80}>
                <ScrollArea className="h-[calc(100vh-5rem)]">
                  <main className="px-4 py-8">
                    <div className="max-w-4xl mx-auto mb-8">
                      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                    
                    <div className="max-w-5xl mx-auto">
                      {activeTab === "todo" && (
                        <div className="space-y-6">
                          <TaskList completed={false} />
                        </div>
                      )}
                      
                      {activeTab === "done" && (
                        <TaskList completed={true} />
                      )}
                      
                      {activeTab === "analytics" && (
                        <AnalyticsSection />
                      )}
                    </div>
                  </main>
                </ScrollArea>
              </ResizablePanel>
            </ResizablePanelGroup>
            
            <RightPane />
          </div>
        </div>
      </TaskProvider>
    </ThemeProvider>
  );
};

export default Index;
