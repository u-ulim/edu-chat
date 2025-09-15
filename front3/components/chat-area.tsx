"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendIcon, UserIcon, BotIcon, SparklesIcon } from "lucide-react";
import type { ChatSession, Message } from "./chat-interface";
import { cn } from "@/lib/utils";

interface ChatAreaProps {
  session?: ChatSession;
  onSendMessage: (content: string, role: "user" | "assistant") => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function ChatArea({
  session,
  onSendMessage,
  sidebarOpen,
  onToggleSidebar,
}: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const hasMessages = session && session.messages.length > 0;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message
    onSendMessage(userMessage, "user");

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "안녕하세요! 무엇을 도와드릴까요? 😊",
        "좋은 질문이네요. 더 자세히 설명해 주시겠어요?",
        "그에 대해 생각해보겠습니다. 잠시만 기다려주세요.",
        "흥미로운 주제입니다. 다른 관점에서 살펴보면...",
        "도움이 되었기를 바랍니다. 다른 질문이 있으시면 언제든 말씀해 주세요!",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      onSendMessage(randomResponse, "assistant");
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  // 메시지가 변경될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages, isLoading]);

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background",
        sidebarOpen ? "flex-1" : "w-full"
      )}
    >
      <div className="p-4 flex items-center justify-center bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <SparklesIcon className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">
              {session?.title || "AI 채팅 어시스턴트"}
            </h1>
            <p className="text-xs text-muted-foreground">실시간 AI 대화</p>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 - 채팅 유무에 따라 레이아웃 변경 */}
      <div className="flex-1 flex flex-col relative overflow-hidden transition-all duration-300 ease-in-out">
        {!hasMessages ? (
          // 채팅이 없을 때: 중앙 정렬된 웰컴 메시지와 입력창
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
            <div className="text-center space-y-6 max-w-md transform transition-all duration-700 ease-out">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <SparklesIcon className="w-10 h-10 text-accent-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full animate-pulse"></div>
              </div>

              <div className="w-54 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"></div>
            </div>

            {/* 중앙에 위치한 입력창 */}
            <div className="w-full max-w-2xl animate-in fade-in duration-500">
              <div className="relative flex justify-between items-center relative border border-border/50 rounded-2xl shadow-sm p-1.5">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="무엇이든 물어보세요!"
                  className="min-h-[0px] resize-none focus:outline-none focus:ring-0 focus:ring-offset-0 border-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="absolute right-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl shadow-sm transition-all duration-200 bottom-2"
                >
                  <SendIcon className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                <kbd className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium">
                  Enter
                </kbd>
                를 눌러 전송,
                <kbd className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium ml-1">
                  Shift+Enter
                </kbd>
                로 줄바꿈
              </p>
            </div>
          </div>
        ) : (
          // 채팅이 있을 때: 메시지 영역과 하단 고정 입력창
          <>
            <ScrollArea className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6 max-w-4xl mx-auto animate-in slide-in-from-top-4 duration-500">
                {session.messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex items-start gap-4 animate-in fade-in duration-300">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <BotIcon className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div className="bg-card p-4 rounded-2xl max-w-3xl border border-border/50 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-accent rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-accent rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                {/* 스크롤 타겟 요소 */}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* 하단 고정 입력창 */}
            <div className="p-6 bg-card/30 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-700">
              <div className="max-w-4xl mx-auto">
                <div className="relative flex justify-between items-center relative border border-border/50 rounded-2xl shadow-sm p-1.5">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="무엇이든 물어보세요!"
                    className="min-h-[0px] resize-none focus:outline-none focus:ring-0 focus:ring-offset-0 border-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="sm"
                    className="absolute right-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl shadow-sm transition-all duration-200 bottom-2"
                  >
                    <SendIcon className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  <kbd className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium">
                    Enter
                  </kbd>
                  를 눌러 전송,
                  <kbd className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium ml-1">
                    Shift+Enter
                  </kbd>
                  로 줄바꿈
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-4 animate-in slide-in-from-bottom-2 duration-400",
        isUser && "flex-row-reverse"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
          isUser ? "bg-primary" : "bg-accent"
        )}
      >
        {isUser ? (
          <UserIcon className="w-5 h-5 text-primary-foreground" />
        ) : (
          <BotIcon className="w-5 h-5 text-accent-foreground" />
        )}
      </div>
      <div
        className={cn(
          "p-4 rounded-2xl max-w-3xl shadow-sm border",
          isUser
            ? "bg-primary text-primary-foreground ml-auto border-primary/20"
            : "bg-card text-card-foreground border-border/50"
        )}
      >
        <p className="whitespace-pre-wrap text-balance leading-relaxed">
          {message.content}
        </p>
        <div
          className={cn(
            "text-xs mt-2 opacity-70",
            isUser ? "text-primary-foreground" : "text-muted-foreground"
          )}
        >
          {message.timestamp.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
