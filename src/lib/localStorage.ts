/** Format chatbot-jawa (Conversation dengan isUser) – untuk kompatibilitas */
export interface Conversation {
  id: string;
  title: string;
  messages: MessageLegacy[];
  lastMessage: string;
  timestamp: string;
}

export interface MessageLegacy {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  isError?: boolean;
  errorKey?: string;
  originalMessage?: string;
  type?: 'text' | 'audio';
  audioUrl?: string;
}

/** Format chatbot-tembungmacapat (Chat dengan role & timestamp Date) */
export interface Chat {
  id: string;
  title: string;
  messages: StoredMessage[];
}

export interface StoredMessage {
  id: string;
  content: string;
  role: 'user' | 'ai';
  timestamp: string; // ISO string di localStorage
  audioUrl?: string;
}

const STORAGE_KEY = 'chatbot-conversations';
const STORAGE_KEY_TEMBUNGMACAPAT = 'chatbot-tembungmacapat-chats';

export class LocalStorageService {
  /**
   * Simpan daftar chat (tembang macapat) ke localStorage.
   * Dipanggil setiap kali chats berubah (submit pesan, chat baru, hapus).
   */
  static saveChats(chats: { id: string; title: string; messages: { id: string; content: string; role: 'user' | 'ai'; timestamp: Date; audioUrl?: string }[] }[]): void {
    try {
      const toStore: Chat[] = chats.map((c) => ({
        id: c.id,
        title: c.title,
        messages: c.messages.map((m) => ({
          id: m.id,
          content: m.content,
          role: m.role,
          timestamp: typeof m.timestamp === 'string' ? m.timestamp : (m.timestamp as Date).toISOString(),
          audioUrl: m.audioUrl,
        })),
      }));
      const data = JSON.stringify(toStore);
      localStorage.setItem(STORAGE_KEY_TEMBUNGMACAPAT, data);
    } catch (error) {
      console.error('Error saving chats to localStorage:', error);
      if (error instanceof DOMException && error.code === 22) {
        console.warn('localStorage is full. Consider clearing old conversations.');
      }
    }
  }

  /**
   * Muat daftar chat dari localStorage.
   * Timestamp dikonversi ke Date.
   */
  static loadChats(): { id: string; title: string; messages: { id: string; content: string; role: 'user' | 'ai'; timestamp: Date; audioUrl?: string }[] }[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_TEMBUNGMACAPAT);
      if (!data) return [];

      const parsed: Chat[] = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];

      return parsed.map((c) => ({
        id: c.id,
        title: c.title,
        messages: (c.messages || []).map((m) => ({
          id: m.id,
          content: m.content,
          role: m.role === 'user' || m.role === 'ai' ? m.role : 'ai',
          timestamp: new Date(m.timestamp || Date.now()),
          audioUrl: m.audioUrl,
        })),
      }));
    } catch (error) {
      console.error('Error loading chats from localStorage:', error);
      return [];
    }
  }

  /**
   * Save conversations (format lama chatbot-jawa)
   */
  static saveConversations(conversations: Conversation[]): void {
    try {
      const data = JSON.stringify(conversations);
      localStorage.setItem(STORAGE_KEY, data);
    } catch (error) {
      console.error('Error saving conversations to localStorage:', error);
      if (error instanceof DOMException && error.code === 22) {
        console.warn('localStorage is full. Consider clearing old conversations.');
      }
    }
  }

  /**
   * Load conversations (format lama chatbot-jawa)
   */
  static loadConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const conversations = JSON.parse(data);
      if (!Array.isArray(conversations)) return [];
      return conversations;
    } catch (error) {
      console.error('Error loading conversations from localStorage:', error);
      return [];
    }
  }

  static clearConversations(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY_TEMBUNGMACAPAT);
    } catch (error) {
      console.error('Error clearing conversations from localStorage:', error);
    }
  }

  static isStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  static getStorageInfo(): { used: number; available: boolean } {
    if (!this.isStorageAvailable()) return { used: 0, available: false };
    try {
      const data = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(STORAGE_KEY_TEMBUNGMACAPAT);
      const used = data ? new Blob([data]).size : 0;
      return { used, available: true };
    } catch {
      return { used: 0, available: false };
    }
  }
}