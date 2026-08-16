import { useState, useRef, KeyboardEvent } from "react";
import { Send, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  /** Unggah audio untuk penilaian nyanyian tembang macapat */
  onUploadAudio?: (file: File) => Promise<void>;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, onUploadAudio, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadAudio) return;
    setUploading(true);
    try {
      await onUploadAudio(file);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-2">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2 bg-muted rounded-2xl p-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tulis pitakonmu ing kene..."
            disabled={disabled}
            className="
              min-h-[44px] max-h-[200px] resize-none
              bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0
              text-foreground placeholder:text-muted-foreground
              py-3 px-4
            "
            rows={1}
          />
          {onUploadAudio && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/mpeg,.mp3"
                className="hidden"
                onChange={handleFileChange}
                disabled={disabled || uploading}
                aria-label="Unggah file MP3 untuk evaluasi vokal"
              />
              <Button
                type="button"
                onClick={handleUploadClick}
                disabled={disabled || uploading}
                size="sm"
                variant="outline"
                className="shrink-0 h-10 rounded-xl gap-1.5 px-3"
                title="Evaluasi vokal: unggah file MP3 (rekaman nembang) kanggo tak nilai"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || disabled}
            size="icon"
            className="
              shrink-0 h-10 w-10 rounded-xl
              bg-accent hover:bg-accent/90 text-accent-foreground
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            "
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-white text-center mt-2">
          {onUploadAudio
            ? "Tulis pitakonmu utawa klik \"Unggah MP3\" kanggo unggah file rekaman nembang (évaluasi vokal — tak nilai skor lan saran)."
            : "Pencet Enter kanggo ngirim, Shift + Enter kanggo baris anyar"}
        </p>
      </div>
    </div>
  );
}
