export interface MessageDto {
  role: string;
  content: string;
}

export interface ChatbotRequestDto {
  prev_messages?: MessageDto[];
  message: string;
}

export interface ChatbotResponseDto {
  status: string;
  message: string;
  data: {
    type: 'text' | 'audio';
    content?: string;
    response?: string; // For backward compatibility
    audioUrl?: string;
  };
}

// Same concept as chatbot-jawa-fe: VITE_API_URL for production (e.g. https://api.sinumapat-ai.id/api), /api in dev via Vite proxy
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "/api" : "https://api.sinumapat-ai.id/api");

/** URL untuk memutar audio lewat proxy backend agar tidak CORS/hotlink dan durasi terbaca. */
export function getAudioProxyUrl(audioUrl: string): string {
  return `${API_URL.replace(/\/$/, '')}/chatbot/audio?uri=${encodeURIComponent(audioUrl)}`;
}

export interface AssessAudioResponseDto {
  status: string;
  message: string;
  data: {
    type: "text";
    content: string;
    response?: string;
  };
}

export interface TembungEntry {
  tembung: string;
  teges: string;
  jenis: string;
  sumber?: string;
}

export interface MacapatRule {
  id: string;
  name: string;
  guruGatra: number;
  guruWilangan: number[];
  watak: string;
  deskripsi: string;
  contoBait: string[];
}

export class ApiService {
  static async sendMessage(payload: ChatbotRequestDto): Promise<ChatbotResponseDto> {
    try {
      const response = await fetch(`${API_URL}/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errText =
          data?.data?.content ||
          data?.data?.response ||
          data?.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errText);
      }

      return data as ChatbotResponseDto;
    } catch (error) {
      console.error('Error sending message to API:', error, 'API_URL=', API_URL);
      throw error;
    }
  }

  /** Unggah file audio untuk dinilai (rekaman nyanyian tembang macapat). */
  static async assessAudio(
    file: File,
    contextMessage?: string
  ): Promise<AssessAudioResponseDto> {
    const formData = new FormData();
    formData.append("audio", file);
    if (contextMessage?.trim()) {
      formData.append("message", contextMessage.trim());
    }
    const response = await fetch(`${API_URL}/chatbot/assess-audio`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async getMacapatRules(): Promise<{ status: string; data: MacapatRule[] }> {
    const response = await fetch(`${API_URL}/chatbot/macapat`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  static async getTemaList(): Promise<{ status: string; data: { id: string; label: string }[] }> {
    const response = await fetch(`${API_URL}/chatbot/tema`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  static async getTembungByTema(tema: string): Promise<{
    status: string;
    data: { tema: string; tembung: TembungEntry[] };
  }> {
    const response = await fetch(`${API_URL}/chatbot/tembung?tema=${encodeURIComponent(tema)}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }
}