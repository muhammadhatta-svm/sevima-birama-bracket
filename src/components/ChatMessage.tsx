import { useState, useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";
import { getAudioProxyUrl } from "@/lib/api";

interface ChatMessageProps {
  content: string;
  role: "user" | "ai";
  /** URL audio (contoh vokal dari AI); ditampilkan sebagai pemutar audio */
  audioUrl?: string;
  /** Animasikan respons AI seperti efek mengetik (typewriter) */
  animateTypewriter?: boolean;
}

const ALLOWED_TAGS = /<\/?(?:br|strong|em|b|i|p|div|span|table|thead|tbody|tr|th|td|ul|ol|li|h3|blockquote)(?:\s[^>]*)?\/?>/gi;

/** Sanitasi: hanya tag aman yang diperbolehkan */
function sanitizeHtml(html: string): string {
  return html.replace(ALLOWED_TAGS, (tag) => tag);
}

/**
 * Format respons AI: bold **teks**, miring //teks//, paragraf, daftar, tabel.
 * Mendukung kaidah tampilan bahasa Jawa (paragraf rapi, tabel aturan macapat).
 */
function formatMessageContent(raw: string): string {
  if (!raw?.trim()) return "";

  let s = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Simpan blok HTML tabel dari AI, ganti dengan placeholder
  const tableBlocks: string[] = [];
  s = s.replace(/<table[\s\S]*?<\/table>/gi, (match) => {
    tableBlocks.push(sanitizeHtml(match));
    return `\n{{TABLE_${tableBlocks.length - 1}}}\n`;
  });

  // Escape HTML berbahaya
  s = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  // Bold **teks** dan miring //teks//
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\/\/(.+?)\/\//g, "<em>$1</em>");

  // Paragraf: dua newline = pemisah paragraf
  const paragraphs = s.split(/\n\n+/);
  const formattedParagraphs = paragraphs.map((p) => {
    const block = p.trim();
    if (!block) return "";

    // Placeholder tabel → kembalikan blok tabel (sudah disimpan sebelum escape)
    const tablePlaceholder = block.match(/^\{\{TABLE_(\d+)\}\}$/);
    if (tablePlaceholder) {
      const idx = parseInt(tablePlaceholder[1], 10);
      const table = tableBlocks[idx];
      if (table) {
        return `<div class="my-3 overflow-x-auto rounded-md border border-border"><div class="[&_table]:w-full [&_th]:border-b [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_td]:border-b [&_td]:border-border [&_td]:px-3 [&_td]:py-2">${table}</div></div>`;
      }
    }

    // Satu baris yang hanya **...** = subjudul
    if (/^<strong>[^<]+<\/strong>$/.test(block)) {
      return `<p class="font-semibold text-foreground mt-3 mb-1 first:mt-0">${block}</p>`;
    }

    // Beberapa baris dengan | = tabel teks (format markdown-like)
    const lines = block.split("\n");
    const pipeRows = lines.filter((l) => l.trim().includes("|"));
    if (pipeRows.length >= 1 && pipeRows.length === lines.length) {
      const trs = pipeRows
        .map((row, i) => {
          const cells = row.split("|").map((c) => c.trim());
          const tag = i === 0 ? "th" : "td";
          return `<tr>${cells.map((c) => `<${tag}>${c}</${tag}>`).join("")}</tr>`;
        })
        .join("");
      return `<div class="my-3 overflow-x-auto rounded-md border border-border"><table class="w-full text-sm"><tbody>${trs}</tbody></table></div>`;
    }

    // Paragraf biasa: newline → <br />
    const withBr = block.replace(/\n/g, "<br />");
    return `<p class="mb-2 last:mb-0 leading-relaxed">${withBr}</p>`;
  });

  let result = formattedParagraphs.filter(Boolean).join("\n");

  // Restore tabel yang ada di dalam paragraf (placeholder belum di-expand)
  tableBlocks.forEach((tb, i) => {
    result = result.replace(
      new RegExp(`\\{\\{TABLE_${i}\\}\\}`, "g"),
      () =>
        `<div class="my-3 overflow-x-auto rounded-md border border-border"><div class="[&_table]:w-full [&_th]:border-b [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_td]:border-b [&_td]:border-border [&_td]:px-3 [&_td]:py-2">${tb}</div></div>`
    );
  });

  return result;
}

const TYPEWRITER_INTERVAL_MS = 20;
const TYPEWRITER_CHARS_PER_STEP = 2;
const TYPEWRITER_MAX_DURATION_MS = 2800;

export function ChatMessage({
  content,
  role,
  audioUrl,
  animateTypewriter = false,
}: ChatMessageProps) {
  const isUser = role === "user";
  const [displayLength, setDisplayLength] = useState(0);
  const [typewriterDone, setTypewriterDone] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  const shouldAnimate = Boolean(animateTypewriter && !isUser && content.length > 0);
  const isTyping = shouldAnimate && !typewriterDone;

  useEffect(() => {
    if (!animateTypewriter || isUser) {
      setDisplayLength(content.length);
      setTypewriterDone(true);
      return;
    }
    setDisplayLength(0);
    setTypewriterDone(false);
    startTimeRef.current = Date.now();

    const id = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current ?? 0);
      if (elapsed >= TYPEWRITER_MAX_DURATION_MS) {
        setDisplayLength(content.length);
        setTypewriterDone(true);
        return;
      }
      setDisplayLength((prev) => {
        const next = Math.min(prev + TYPEWRITER_CHARS_PER_STEP, content.length);
        if (next >= content.length) setTypewriterDone(true);
        return next;
      });
    }, TYPEWRITER_INTERVAL_MS);

    return () => clearInterval(id);
  }, [content, animateTypewriter, isUser]);

  const visibleContent =
    shouldAnimate && isTyping ? content.slice(0, displayLength) : content;
  const formatted = formatMessageContent(visibleContent);
  // Gunakan proxy agar audio bisa diputar dan durasi terbaca (termasuk pesan lama dari localStorage)
  const displayAudioUrl =
    audioUrl && !audioUrl.includes("/chatbot/audio?uri=")
      ? getAudioProxyUrl(audioUrl)
      : audioUrl;

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      {/* Avatar */}
      <div
        className={`
          shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}
        `}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message bubble */}
      <div
        className={`
          max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl
          ${
            isUser
              ? "bg-accent text-accent-foreground rounded-tr-md"
              : "bg-secondary text-secondary-foreground rounded-tl-md"
          }
        `}
      >
        <div
          className="format-response chat-message-content text-sm md:text-base leading-relaxed [&_strong]:font-semibold [&_em]:italic [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-2 [&_li]:mb-0.5 [&_table]:border-collapse"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
        {isTyping && (
          <span
            className="inline-block w-px h-4 ml-0.5 bg-current align-middle animate-pulse"
            style={{ animationDuration: "0.6s" }}
            aria-hidden
          />
        )}
        {displayAudioUrl && !isUser && typewriterDone && (
          <div className="mt-3">
            <audio
              controls
              src={displayAudioUrl}
              className="w-full max-w-sm"
              preload="metadata"
            >
              Browser tidak mendukung pemutaran audio.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}
