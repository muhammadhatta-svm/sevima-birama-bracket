import { useEffect, useRef } from "react";
import { MessageSquare, Bot, Menu } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { LearningStageBadge } from "./LearningStageBadge";
import { Button } from "@/components/ui/button";
import type { LearningStage } from "@/lib/learningProgress";

interface Message {
  id: string;
  content: string;
  role: "user" | "ai";
  timestamp: Date;
  audioUrl?: string;
}

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onUploadAudio?: (file: File) => Promise<void>;
  chatTitle?: string;
  isSending?: boolean;
  isAssessingAudio?: boolean;
  learningStage?: LearningStage;
  showSidebarToggle?: boolean;
  onToggleSidebar?: () => void;
}

export function ChatArea({
  messages,
  onSendMessage,
  onUploadAudio,
  chatTitle,
  isSending,
  isAssessingAudio,
  learningStage = "penginderaan",
  showSidebarToggle = false,
  onToggleSidebar,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-app">
      <div className="border-b border-white/10 bg-transparent px-4 py-3 md:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showSidebarToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 bg-white/90 text-foreground shadow-md hover:bg-white"
              onClick={onToggleSidebar}
              aria-label="Buka sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h2 className="text-lg font-semibold text-white truncate">
            {chatTitle || "Sinumapat-AI"}
          </h2>
        </div>
        <LearningStageBadge stage={learningStage} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white px-4 py-8 gap-6">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-accent" />
            </div>
            <div className="text-center max-w-md space-y-2">
              <h3 className="text-xl font-semibold text-white">
                Sinau Tembang Macapat karo AI
              </h3>
              <p className="text-sm leading-relaxed text-white">
                Leluhur biyen nganggo tembang macapat kanggo pitutur urip saben dina.
                Sinau <strong>Sinom, Pangkur, Maskumambang</strong> karo kosa kata endah saka
                geguritan lan serat naskah Jawa.
              </p>
            </div>
            <p className="text-xs text-center max-w-sm text-white">
              Ketik pitakonmu langsung ing kothak ngisor.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto py-6 px-4 md:px-6 space-y-6">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                content={message.content}
                role={message.role}
                audioUrl={message.audioUrl}
                animateTypewriter={
                  index === messages.length - 1 && message.role === "ai"
                }
              />
            ))}
            {(isSending || isAssessingAudio) && (
              <div className="flex justify-start animate-in fade-in duration-200">
                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground">
                    <Bot className="h-4 w-4" aria-hidden />
                  </div>
                  <div className="max-w-[70%] px-4 py-3 rounded-2xl rounded-tl-md bg-secondary text-secondary-foreground flex gap-2 items-center min-h-[52px]">
                    <div className="flex gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full bg-current animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-current animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-current animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {isAssessingAudio
                        ? "Ngapusi audio, ngenteni penilaian..."
                        : "Ngenteni..."}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput
        onSendMessage={onSendMessage}
        onUploadAudio={onUploadAudio}
        disabled={isSending || isAssessingAudio}
      />
    </div>
  );
}
