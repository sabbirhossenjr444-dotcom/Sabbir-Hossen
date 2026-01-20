
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client inside the function to ensure it uses the most up-to-date API key.
export async function getGamingAdvice(matchType: string, format: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give me 3 short gaming tips for a Free Fire ${matchType} (${format}) match in a mix of Bangla and English (BD gaming style). Keep it aggressive and energetic. Use emojis.`,
      config: {
        systemInstruction: "You are a professional Bangladeshi Free Fire gamer and coach. You talk in 'Banglish' - a mix of Bangla and English commonly used by the youth in Bangladesh.",
        temperature: 0.8,
      }
    });
    return response.text || "Servers busy! Just play safe and get that Booyah!";
  } catch (error) {
    console.error("Gemini error:", error);
    return "Net e problem! Keep fighting for the Booyah! 🔥";
  }
}
