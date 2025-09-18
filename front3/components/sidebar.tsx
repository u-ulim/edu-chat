"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MoreHorizontalIcon,
  ChevronLeftIcon,
  MessageSquareIcon,
  SettingsIcon,
  SearchIcon,
  FolderIcon,
  MenuIcon,
} from "lucide-react";
import type { ChatSession } from "./chat-interface";
import { cn } from "@/lib/utils";

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onSessionSelect: (id: string) => void;
  onNewChat: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewChat,
  isCollapsed,
  onToggle,
}: SidebarProps) {
  const menuItems = [
    { icon: MessageSquareIcon, label: "새 채팅", action: onNewChat },
    { icon: SearchIcon, label: "채팅 검색", action: () => {} },
    { icon: FolderIcon, label: "라이브러리", action: () => {} },
  ];

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border flex flex-col h-full shadow-sm transition-all duration-300 ease-in-out overflow-hidden",
        isCollapsed ? "w-16" : "w-72"
      )}
    >
      {/* Header */}
      <div className="py-3 px-2.5 flex items-center  min-h-[60px]">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-8 h-8 p-0 hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors duration-200 flex-shrink-0"
            title={isCollapsed ? "사이드바 열기" : "사이드바 닫기"}
          >
            <MenuIcon className="w-4 h-4" />
          </Button>
          <div
            className={cn(
              "flex items-center gap-1 min-w-0 transition-all duration-300",
              isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            )}
          >
            <span className="font-semibold text-sidebar-foreground truncate whitespace-nowrap">
              Eduwill 챗봇
            </span>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        <div className="flex flex-col">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={item.action}
              className={cn(
                "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-all duration-200 mb-1",
                isCollapsed
                  ? "h-10 w-10 p-0 justify-start"
                  : "w-full justify-start h-10 px-3"
              )}
              title={item.label}
            >
              <item.icon
                className={cn("w-5 h-5 flex-shrink-0", !isCollapsed && "mr-3")}
              />
              <span
                className={cn(
                  " whitespace-nowrap",
                  isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                )}
              >
                {item.label}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Chat History - 축소 시 숨김 */}
      {!isCollapsed && (
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-2">
              <div className="px-2 py-1">
                <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                  채팅
                </h3>
              </div>
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSessionSelect(session.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl hover:bg-sidebar-accent transition-all duration-200 group flex items-center justify-between border border-transparent hover:border-sidebar-border/50",
                    currentSessionId === session.id
                      ? "bg-accent text-accent-foreground shadow-sm border-accent/20"
                      : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
                  )}
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mr-3 flex-shrink-0",
                        currentSessionId === session.id
                          ? "bg-accent-foreground"
                          : "bg-sidebar-foreground/30"
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium leading-tight">
                        {session.title}
                      </span>
                      <span className="block text-xs opacity-60 mt-0.5">
                        {session.createdAt.toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </div>
                  <MoreHorizontalIcon className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" />
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4  bg-sidebar/50">
            <div className="text-center">
              <div className="text-xs text-sidebar-foreground/70 mb-1">
                Powered by
              </div>
              <div className="text-sm font-semibold text-sidebar-primary">
                Eduwill Chat v2.0
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 축소 시 하단 설정 아이콘 */}
      {isCollapsed && (
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 p-0 mx-auto hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors duration-200"
            title="설정"
          >
            <SettingsIcon className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
