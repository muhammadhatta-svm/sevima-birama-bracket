import { useState, useMemo } from "react";
import { Plus, MessageSquare, Trash2, X, PanelLeftClose, PanelLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

interface Message {
  id: string;
  content: string;
  role: "user" | "ai";
  timestamp: Date;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  onCollapseToggle: () => void;
}

export function ChatSidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isOpen,
  onToggle,
  isCollapsed,
  onCollapseToggle,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter chats by title or message content
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    
    const query = searchQuery.toLowerCase();
    return chats.filter((chat) => {
      // Check title
      if (chat.title.toLowerCase().includes(query)) return true;
      // Check message contents
      return chat.messages.some((msg) => 
        msg.content.toLowerCase().includes(query)
      );
    });
  }, [chats, searchQuery]);

  return (
    <>
      {/* Overlay when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 h-full
          ${isCollapsed ? "w-16" : "w-72"} bg-sidebar border-r border-sidebar-border
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className={`p-4 border-b border-sidebar-border ${isCollapsed ? "px-2" : ""}`}>
          <div className="flex items-center justify-between mb-4">
            {!isCollapsed && (
              <h1 className="text-lg font-semibold text-sidebar-foreground">Chats</h1>
            )}
            <div className="flex items-center gap-1">
              {/* Collapse toggle - desktop only */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={onCollapseToggle}
              >
                {isCollapsed ? (
                  <PanelLeft className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
              </Button>
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={onToggle}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <Button
            onClick={onNewChat}
            className={`w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium ${isCollapsed ? "px-0" : ""}`}
          >
            <Plus className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Chat Baru</span>}
          </Button>
          
          {/* Search input */}
          {!isCollapsed && (
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
              <Input
                type="text"
                placeholder="Cari chat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-sidebar-accent/30 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50 focus-visible:ring-accent"
              />
            </div>
          )}
        </div>

        {/* Chat List */}
        <div className={`flex-1 overflow-y-auto p-2 space-y-1 ${isCollapsed ? "px-1" : ""}`}>
          {filteredChats.length === 0 ? (
            <div className={`text-center text-sidebar-foreground/60 py-8 ${isCollapsed ? "px-1" : "px-4"}`}>
              <MessageSquare className={`mx-auto mb-3 opacity-40 ${isCollapsed ? "h-6 w-6" : "h-10 w-10"}`} />
              {!isCollapsed && (
                <p className="text-sm">
                  {searchQuery ? "Tidak ada chat yang cocok" : "Belum ada chat. Mulai chat baru!"}
                </p>
              )}
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`
                  group flex items-center gap-2 p-3 rounded-lg cursor-pointer
                  transition-all duration-200
                  ${isCollapsed ? "justify-center px-2" : ""}
                  ${
                    activeChatId === chat.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                  }
                `}
                onClick={() => onSelectChat(chat.id)}
                title={isCollapsed ? chat.title : undefined}
              >
                <MessageSquare className="h-4 w-4 shrink-0 opacity-70" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 truncate text-sm font-medium">
                      {chat.title}
                    </span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Chat?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Chat "{chat.title}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-muted hover:bg-muted/80">Batal</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            onClick={() => onDeleteChat(chat.id)}
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </aside>

    </>
  );
}
