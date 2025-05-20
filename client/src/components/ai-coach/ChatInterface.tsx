import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

interface ChatInterfaceProps {
  initialMessages: Message[];
}

export default function ChatInterface({ initialMessages }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage("");
    setIsLoading(true);
    
    try {
      // Send message to API
      const response = await apiRequest("POST", "/api/coach/chat", {
        message: newMessage
      });
      
      const aiResponse = await response.json();
      
      // Add AI response to chat
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "ai",
        content: aiResponse.response,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUploadRecording = () => {
    // Implement upload recording functionality
    toast({
      title: "Upload Recording",
      description: "This feature is coming soon!",
    });
  };

  const handleViewSkillAssessment = () => {
    // Implement view skill assessment functionality
    toast({
      title: "Skill Assessment",
      description: "This feature is coming soon!",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden flex flex-col h-[calc(100vh-180px)]">
      <div className="p-4 border-b border-neutral-100 flex items-center">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
          <i className="ri-robot-line"></i>
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-neutral-800">SHISHA</h3>
          <p className="text-xs text-neutral-500">AI Sales Coach</p>
        </div>
      </div>
      
      <div className="flex-grow p-4 overflow-y-auto flex flex-col">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`ai-chat-bubble max-w-[80%] p-[12px_16px] rounded-[18px] mb-2 ${
              message.sender === "user" 
                ? "sent bg-primary text-white rounded-br-[4px] self-end" 
                : "received bg-[#E9ECEF] text-[#343A40] rounded-bl-[4px] self-start"
            }`}
          >
            {message.content.split('\n').map((paragraph, i) => (
              <p key={i} className={i > 0 ? "mt-2" : ""}>{paragraph}</p>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t border-neutral-100">
        <div className="flex items-center">
          <button className="h-10 w-10 flex items-center justify-center text-neutral-500 hover:text-primary">
            <i className="ri-mic-line text-xl"></i>
          </button>
          <div className="flex-grow mx-2">
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>
          <button 
            className="h-10 w-10 flex items-center justify-center text-white bg-primary rounded-full disabled:bg-neutral-300"
            onClick={handleSendMessage}
            disabled={isLoading || !newMessage.trim()}
          >
            <i className="ri-send-plane-fill"></i>
          </button>
        </div>
        
        <div className="mt-3 flex justify-between">
          <button 
            className="text-sm text-primary font-medium flex items-center"
            onClick={handleUploadRecording}
          >
            <i className="ri-upload-line mr-1"></i>
            Upload Call Recording
          </button>
          <button 
            className="text-sm text-primary font-medium flex items-center"
            onClick={handleViewSkillAssessment}
          >
            <i className="ri-book-open-line mr-1"></i>
            View Skill Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
