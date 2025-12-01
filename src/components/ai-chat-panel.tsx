"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, User, Bot, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: string;
  content: string;
  model?: string | null;
  createdAt: Date;
}

interface AIChatPanelProps {
  projectId: string;
  model: string;
  messages: Message[];
  onMessagesChange: (messages: Message[]) => void;
  onCodeGenerated: (code: string, filename: string) => void;
}

export function AIChatPanel({
  projectId,
  model,
  messages,
  onMessagesChange,
  onCodeGenerated,
}: AIChatPanelProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    // Optimistically add user message
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: userMessage,
      createdAt: new Date(),
    };
    onMessagesChange([...messages, tempUserMessage]);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          message: userMessage,
          model,
        }),
      });

      if (!response.ok) throw new Error("Failed to get AI response");

      const data = await response.json();
      
      // Extract code blocks from response
      const codeBlockRegex = /```([^\n]*)\n([\s\S]*?)```/g;
      let match;
      while ((match = codeBlockRegex.exec(data.response)) !== null) {
        const filename = match[1].trim() || "component.tsx";
        const code = match[2].trim();
        onCodeGenerated(code, filename.includes("/") ? filename : `src/${filename}`);
      }

      // Update messages with actual response
      onMessagesChange([
        ...messages.filter((m) => m.id !== tempUserMessage.id),
        { ...tempUserMessage, id: `user-${Date.now()}` },
        data.message,
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      // Remove optimistic message on error
      onMessagesChange(messages.filter((m) => m.id !== tempUserMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const lines = part.slice(3, -3).split("\n");
        const language = lines[0];
        const code = lines.slice(1).join("\n");
        
        return (
          <div key={i} className="my-2 rounded-lg bg-muted overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1 bg-muted-foreground/10 text-xs">
              <span className="text-muted-foreground">{language || "code"}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleCopy(code, `${i}`)}
              >
                {copiedId === `${i}` ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <pre className="p-3 overflow-x-auto text-sm">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      
      return (
        <span key={i} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="font-medium mb-2">AI Assistant</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Describe what you want to build and I&apos;ll generate the code for you.
              </p>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>Try asking:</p>
                <ul className="space-y-1">
                  <li>&quot;Create a landing page with hero section&quot;</li>
                  <li>&quot;Add a navigation bar component&quot;</li>
                  <li>&quot;Create a contact form with validation&quot;</li>
                </ul>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.role === "user"
                    ? "bg-blue-500"
                    : "bg-violet-500"
                )}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={cn(
                  "flex-1 rounded-lg p-3 max-w-[85%]",
                  message.role === "user"
                    ? "bg-blue-500/10 ml-auto"
                    : "bg-muted"
                )}
              >
                <div className="text-sm">{formatMessage(message.content)}</div>
                {message.model && (
                  <p className="text-xs text-muted-foreground mt-2">
                    via {message.model}
                  </p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Generating...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            placeholder="Describe what you want to build..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="min-h-[60px] max-h-[120px] resize-none"
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading || !input.trim()}
            className="h-[60px] w-[60px] bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
