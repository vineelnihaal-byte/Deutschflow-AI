import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const MODELS = {
  text: "gemini-3-flash-preview",
  live: "gemini-3.1-flash-live-preview",
  tts: "gemini-3.1-flash-tts-preview",
  image: "gemini-2.5-flash-image",
};

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: {
    inlineData: {
      data: string;
      mimeType: string;
    };
  };
}

export async function getGeminiResponse(prompt: string, history: ChatMessage[] = [], systemInstruction?: string, imageData?: { data: string, mimeType: string }) {
  try {
    const userParts: any[] = [{ text: prompt }];
    if (imageData) {
      userParts.push({ inlineData: imageData });
    }

    const contents = [
      ...history.map(m => {
        const parts: any[] = [{ text: m.text }];
        if (m.image) {
          parts.push({ inlineData: m.image.inlineData });
        }
        return { role: m.role, parts };
      }),
      { role: 'user', parts: userParts }
    ];

    const response = await ai.models.generateContent({
      model: MODELS.text,
      contents,
      config: {
        systemInstruction,
      }
    });

    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error communicating with the German tutor AI.";
  }
}

export async function generateTTS(text: string) {
  try {
    // Better clean text for TTS - remove bracketed translations and markdown
    const cleanText = text.replace(/\[.*?\]/g, '').replace(/[*#_`]/g, '').trim();
    
    const response = await ai.models.generateContent({
      model: MODELS.tts,
      contents: [{ parts: [{ text: cleanText }] }],
      config: {
        responseModalities: ["AUDIO" as any],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' }, // Changed to Puck for potentially better clarity
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
}
