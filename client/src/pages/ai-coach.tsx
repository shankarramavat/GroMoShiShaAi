import { useQuery } from "@tanstack/react-query";
import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";
import ChatInterface from "@/components/ai-coach/ChatInterface";

export default function AICoach() {
  const { data: chatHistory, isLoading } = useQuery({
    queryKey: ["/api/coach/chat/history"],
  });

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      
      <main className="flex-grow pb-20">
        <div className="container mx-auto px-4 py-6">
          <h2 className="text-xl font-semibold text-neutral-800 mb-6">AI Coach Chat</h2>
          
          <ChatInterface 
            initialMessages={chatHistory || [
              {
                id: 1,
                sender: "ai",
                content: "Hi! I'm your AI Sales Coach. How can I help you improve your sales skills today?",
                timestamp: new Date().toISOString()
              }
            ]} 
          />
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
