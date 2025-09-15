"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { ChatArea } from "./chat-area"

export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

export function ChatInterface() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "AI 어시스턴트와의 첫 대화",
      messages: [
        {
          id: "1",
          content: "안녕하세요! 무엇을 도와드릴까요?",
          role: "assistant",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    },
  ])

  const [currentSessionId, setCurrentSessionId] = useState<string>("1")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const currentSession = sessions.find((s) => s.id === currentSessionId)

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "새로운 채팅",
      messages: [],
      createdAt: new Date(),
    }
    setSessions((prev) => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
  }

  const addMessage = (content: string, role: "user" | "assistant") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
    }

    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, newMessage],
              title: session.messages.length === 0 ? content.slice(0, 30) + "..." : session.title,
            }
          : session,
      ),
    )
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <>
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSessionSelect={setCurrentSessionId}
        onNewChat={createNewChat}
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />
      <ChatArea
        session={currentSession}
        onSendMessage={addMessage}
        sidebarOpen={!sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />
    </>
  )
}
