# Chatbot Tembung Macapat

Frontend untuk AI Pembelajaran Tembang Macapat (conto vokal + evaluasi nyanyian).

## Menjalankan layanan

1. **Backend** dulu (di folder `chatbot-tembungmacapat-be`):  
   `npm run start:dev` → http://localhost:3001  
2. **Frontend** (di folder ini):  
   `npm install && npm run dev` → http://localhost:8181  

Request ke `/api` di-frontend akan di-proxy ke backend (lihat `vite.config.ts`).

- **Conto vokal (audio):** ketik di chat (mis. "minta conto nembang Sinom") → AI mengirim lirik, aturan, dan pemutar audio.
- **Evaluasi vokal:** klik ikon unggah audio, pilih file rekaman (mp3/wav/m4a) → AI memberi penilaian (skor, saran) dalam bahasa Jawa.
