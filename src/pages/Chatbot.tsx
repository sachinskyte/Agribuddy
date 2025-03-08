import { useState } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Mic, Image, RefreshCw, Languages, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type MessageSender = "ai" | "user";

interface ChatMessage {
  id: number;
  sender: MessageSender;
  content: string;
  timestamp: Date;
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    sender: "ai",
    content: "नमस्ते! मैं आपका AgriBuddy AI सहायक हूँ। आज मैं आपकी किस प्रकार से सहायता कर सकता हूँ?",
    timestamp: new Date(Date.now() - 60000 * 10),
  },
  {
    id: 2,
    sender: "ai",
    content: "Hello! I'm your AgriBuddy AI assistant. How can I help you with farming today?",
    timestamp: new Date(Date.now() - 60000 * 9),
  },
];

const suggestions = [
  "How to prevent pest infestation in wheat?",
  "Best irrigation practices for rice cultivation",
  "Recommended fertilizers for cotton",
  "How to improve soil health naturally?",
  "Weather suitable for harvesting wheat",
];

const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      sender: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setInput("");
    
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: messages.length + 2,
        sender: "ai",
        content: "Thank you for your question. Based on agricultural best practices, I would recommend monitoring soil moisture levels regularly and applying irrigation when the top 1-2 inches of soil feels dry. For wheat specifically, critical irrigation times are during the tillering, jointing, and grain filling stages. Would you like more specific information about irrigation methods?",
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    }, 1000);
  };

  const handleMicrophoneClick = () => {
    toast({
      title: "Voice Input",
      description: "Voice input feature will be available in the next update.",
    });
  };

  return (
    <Dashboard>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">AI Farming Assistant</h2>
          <div className="flex items-center">
            <Select defaultValue="en">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
          <Card className="lg:col-span-3">
            <Tabs defaultValue="chat">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Chat with AgriBuddy AI</CardTitle>
                  <TabsList>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="image">Image Analysis</TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription>
                  Get expert farming advice powered by agricultural AI
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <TabsContent value="chat" className="mt-0">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`flex max-w-[80%] ${
                              message.sender === 'user' 
                                ? 'flex-row-reverse' 
                                : 'flex-row'
                            }`}
                          >
                            {message.sender === 'ai' && (
                              <Avatar className={`h-8 w-8 ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback className="bg-agribuddy-primary text-white">AI</AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <div 
                                className={`px-4 py-2 rounded-lg ${
                                  message.sender === 'user' 
                                    ? 'bg-agribuddy-primary text-white' 
                                    : 'bg-muted'
                                }`}
                              >
                                <p>{message.content}</p>
                              </div>
                              <div 
                                className={`text-xs text-muted-foreground mt-1 ${
                                  message.sender === 'user' ? 'text-right' : 'text-left'
                                }`}
                              >
                                {message.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                              {message.sender === 'ai' && (
                                <div className="flex mt-1 gap-2">
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ThumbsUp className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ThumbsDown className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="image" className="mt-0">
                  <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg p-12 text-center">
                    <Image className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Upload Crop Image</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload an image of your crop, plant, or pest for AI analysis
                    </p>
                    <Button>
                      Upload Image
                    </Button>
                  </div>
                </TabsContent>
              </CardContent>
              
              <CardFooter>
                <div className="flex w-full items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={handleMicrophoneClick}>
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type your farming question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button size="icon" onClick={handleSendMessage} disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Tabs>
          </Card>
          
          <Card className="lg:row-span-1">
            <CardHeader>
              <CardTitle>Suggested Questions</CardTitle>
              <CardDescription>
                Try asking one of these questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => {
                      setInput(suggestion);
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="line-clamp-2">{suggestion}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" onClick={() => setMessages(initialMessages)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Conversation
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>What Can I Ask?</CardTitle>
            <CardDescription>
              The AI assistant can help with various farming topics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <Badge className="mr-2 bg-agribuddy-primary text-white">1</Badge>
                  Crop Management
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ask about pest control, disease management, and proper crop care techniques.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <Badge className="mr-2 bg-agribuddy-primary text-white">2</Badge>
                  Soil Health
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get advice on fertilizers, soil testing, and improving soil fertility.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <Badge className="mr-2 bg-agribuddy-primary text-white">3</Badge>
                  Weather Impact
                </h3>
                <p className="text-sm text-muted-foreground">
                  Learn how weather changes might affect your crops and how to prepare.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Dashboard>
  );
};

export default Chatbot;
