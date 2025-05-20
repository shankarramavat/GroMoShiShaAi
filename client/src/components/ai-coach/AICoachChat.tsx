import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RiSendPlaneFill, 
  RiMicLine, 
  RiAttachmentLine, 
  RiRobot2Line,
  RiUserLine,
  RiFileUploadLine,
  RiArrowDownSLine,
  RiLoaderLine
} from "react-icons/ri";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: number;
  partner_id: number;
  messages: Message[];
  created_at: string;
  updated_at: string;
}

export default function AICoachChat() {
  const [activeTab, setActiveTab] = useState("chat");
  const [messageInput, setMessageInput] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch chat history
  const { data: chatSession, isLoading } = useQuery({
    queryKey: ['/api/coach/chat-history'],
    enabled: true,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest('/api/coach/chat', 'POST', { message: content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coach/chat-history'] });
      setMessageInput("");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: "Please try again later.",
      });
    }
  });

  // Submit call analysis mutation
  const analyzeCallMutation = useMutation({
    mutationFn: async (transcript: string) => {
      return apiRequest('/api/coach/analyze-call', 'POST', { transcript });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coach/chat-history'] });
      setTranscript("");
      setActiveTab("chat");
      toast({
        title: "Call analysis submitted",
        description: "Your AI coach is analyzing the call.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error submitting call analysis",
        description: "Please try again later.",
      });
    }
  });

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    sendMessageMutation.mutate(messageInput);
  };

  const handleAnalyzeCall = () => {
    if (!transcript.trim()) {
      toast({
        variant: "destructive",
        title: "Empty transcript",
        description: "Please provide a call transcript or recording.",
      });
      return;
    }
    analyzeCallMutation.mutate(transcript);
  };

  const simulateRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording...",
      description: "This is a simulated recording for demo purposes.",
    });
    
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      setTranscript(
        "Customer: I'm interested in term insurance, but I'm not sure if it's right for me.\n\n" +
        "Agent: Term insurance is a great option. It provides coverage for a specific period and is quite affordable. May I ask what's your primary concern?\n\n" +
        "Customer: I'm worried about the cost. I've heard these policies can be expensive.\n\n" +
        "Agent: I understand your concern. Actually, term insurance is one of the most affordable types of life insurance. For someone your age, we can find policies starting at just ₹500 per month for a 1 crore coverage.\n\n" +
        "Customer: That doesn't sound too bad. But what about the claims process? Is it complicated?\n\n" +
        "Agent: Not at all. Our company has a 98% claim settlement ratio, and most claims are processed within 7 days. We also provide a dedicated claims assistant to help your nominees through the process."
      );
      
      toast({
        title: "Recording complete",
        description: "Your call transcript is ready for analysis.",
      });
    }, 3000);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatSession]);

  const messages = chatSession?.messages || [];

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)] shadow-lg">
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-xl flex items-center">
          <RiRobot2Line className="mr-2 h-6 w-6 text-primary" />
          AI Coach SHISHA
        </CardTitle>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="analyze">Analyze Call</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <RiLoaderLine className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <RiRobot2Line className="h-12 w-12 mb-4 text-muted-foreground/60" />
              <h3 className="text-lg font-medium">Welcome to your AI Coach</h3>
              <p className="max-w-md mt-2">
                Ask any question about sales techniques, objection handling, or product knowledge. You can also submit call recordings for analysis.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex items-start ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div 
                  className={`rounded-lg p-3 max-w-[85%] shadow-sm ${
                    message.sender === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {message.sender === "ai" ? (
                      <RiRobot2Line className="h-4 w-4 mr-1" />
                    ) : (
                      <RiUserLine className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-xs font-medium">
                      {message.sender === "user" ? "You" : "SHISHA"}
                    </span>
                    <span className="text-xs ml-auto opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <CardFooter className="border-t p-3">
          <div className="flex w-full gap-2">
            <Input
              placeholder="Ask your AI coach anything..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1"
              disabled={sendMessageMutation.isPending}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!messageInput.trim() || sendMessageMutation.isPending}
            >
              {sendMessageMutation.isPending ? (
                <RiLoaderLine className="h-5 w-5 animate-spin" />
              ) : (
                <RiSendPlaneFill className="h-5 w-5" />
              )}
            </Button>
          </div>
        </CardFooter>
      </TabsContent>

      <TabsContent value="analyze" className="flex-1 flex flex-col mt-0">
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Analyze Your Sales Call</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a call recording or paste a transcript to receive AI feedback on your sales skills, objection handling, and suggested improvements.
            </p>
            
            <div className="grid gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={simulateRecording}
                    disabled={isRecording || analyzeCallMutation.isPending}
                  >
                    {isRecording ? (
                      <RiLoaderLine className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RiMicLine className="h-4 w-4 mr-2" />
                    )}
                    {isRecording ? "Recording..." : "Record Call"}
                  </Button>
                  
                  <span className="text-xs text-muted-foreground">or</span>
                  
                  <Button 
                    variant="outline"
                    disabled={isRecording || analyzeCallMutation.isPending}
                  >
                    <RiAttachmentLine className="h-4 w-4 mr-2" />
                    Upload Recording
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supports MP3 or WAV files up to 10MB
                </p>
              </div>
              
              <div className="border-t my-2 pt-2">
                <label className="text-sm font-medium mb-2 block">
                  Call Transcript
                </label>
                <Textarea 
                  placeholder="Paste your call transcript here..." 
                  className="min-h-[12rem]"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  disabled={analyzeCallMutation.isPending}
                />
              </div>
              
              <Button 
                onClick={handleAnalyzeCall}
                disabled={!transcript.trim() || analyzeCallMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {analyzeCallMutation.isPending ? (
                  <>
                    <RiLoaderLine className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RiFileUploadLine className="h-4 w-4 mr-2" />
                    Submit for Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </TabsContent>
    </Card>
  );
}