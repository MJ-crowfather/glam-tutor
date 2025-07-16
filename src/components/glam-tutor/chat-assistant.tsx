"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Bot, User, Send, Sparkles } from "lucide-react";
import { getExplanationAction } from "@/app/(actions)/ai-actions";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: "Hi! I'm your AI makeup assistant. Ask me anything about products, techniques, or routines!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] =useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const result = await getExplanationAction(input);
    
    let assistantMessageContent = "Sorry, I had trouble finding an answer for that. Please try rephrasing your question.";
    if(result.success) {
      assistantMessageContent = result.data.explanation;
    }

    const assistantMessage: Message = { id: Date.now() + 1, role: "assistant", content: assistantMessageContent };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg animate-pulse" size="icon">
          <Bot size={32} />
          <span className="sr-only">Open Chat Assistant</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl flex items-center"><Sparkles className="mr-2 text-primary" />AI Assistant</SheetTitle>
          <SheetDescription>
            Your personal makeup expert. Ask me anything!
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 my-4 pr-4">
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={cn(
                "flex items-start gap-3",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}>
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback>
                  </Avatar>
                )}
                <div className={cn(
                  "p-3 rounded-lg max-w-[80%]",
                  message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                 {message.role === 'user' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback><User size={20} /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                 <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20} /></AvatarFallback>
                  </Avatar>
                <div className="p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Sparkles className="animate-spin h-4 w-4" />
                        <span>Thinking...</span>
                    </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <SheetFooter>
           <div className="flex w-full gap-2">
            <Input
              type="text"
              placeholder="e.g., What is 'baking'?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
              <Send size={16} />
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
