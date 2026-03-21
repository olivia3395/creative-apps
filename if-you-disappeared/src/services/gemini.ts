import { GoogleGenAI, Type } from "@google/genai";
import { StoryChapter, UserInput } from "../types";
import { Language } from "../i18n";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const StorySchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    openingLine: { type: Type.STRING },
    scenes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING },
          location: { type: Type.STRING },
          content: { type: Type.STRING }
        },
        required: ["time", "location", "content"]
      }
    },
    youSaw: { type: Type.ARRAY, items: { type: Type.STRING } },
    youAte: { type: Type.ARRAY, items: { type: Type.STRING } },
    youPhotographed: { type: Type.ARRAY, items: { type: Type.STRING } },
    youWroteDown: { type: Type.STRING },
    endingLine: { type: Type.STRING },
    suggestedFollowUps: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: [
    "title",
    "openingLine",
    "scenes",
    "youSaw",
    "youAte",
    "youPhotographed",
    "youWroteDown",
    "endingLine",
    "suggestedFollowUps"
  ]
};

const getSystemInstruction = (lang: Language) => `You are a cinematic, healing, and gently humorous travel writer.
Your goal is to generate a "micro travel theater" - a structured, immersive travel slice-of-life.
The writing should be 70% healing/cinematic, 20% everyday humor, 10% self-aware tenderness.
It must feel grounded, lived-in, and concrete. Use real cities and recognizable places.
Include concrete sensory details, time-based scenes, what the user saw, ate, photographed, and wrote down.

CRITICAL: All generated content MUST be in ${lang === 'zh' ? 'Chinese (Simplified)' : 'English'}.

Avoid generic travel brochure language, flat itinerary summaries, overly dramatic melodrama, cliché motivational quotes, and empty poetic vagueness.
The humor should be observant, gentle, slightly self-mocking, and rooted in real travel moments.

When the user asks for a continuation or follow-up, generate the next "chapter" of this trip using the same structure. The title should reflect that it's a continuation (e.g., "Later That Night", "The Next Morning").
`;

export async function generateStory(input: UserInput, lang: Language): Promise<{ chapter: StoryChapter, chatSession: any }> {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: getSystemInstruction(lang),
      responseMimeType: "application/json",
      responseSchema: StorySchema,
      temperature: 0.7,
    }
  });

  let prompt = `I want to disappear on a trip.
Mood: ${input.mood}`;

  if (input.destination) {
    prompt += `\nDestination: ${input.destination}`;
  }
  if (input.tone) {
    prompt += `\nTone: ${input.tone}`;
  }
  if (input.travelWith) {
    prompt += `\nTraveling with: ${input.travelWith}`;
  }

  prompt += `\n\nRemember: Write everything in ${lang === 'zh' ? 'Chinese' : 'English'}.`;

  try {
    const response = await chat.sendMessage({ message: prompt });
    const text = response.text || "{}";
    const chapter = JSON.parse(text) as StoryChapter;
    return { chapter, chatSession: chat };
  } catch (e: any) {
    console.error("Gemini API Error:", e);
    if (e?.status === 429 || e?.message?.includes('429') || e?.message?.toLowerCase().includes('quota') || e?.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error(lang === 'zh' ? "AI 服务目前额度已满或受到频率限制。请检查您的计划和账单详情，或稍后再试。" : "The AI service is currently out of quota or rate limited. Please check your plan and billing details, or try again later.");
    }
    throw new Error(lang === 'zh' ? "生成故事失败，请重试。" : "Failed to generate your trip. Please try again.");
  }
}

export async function continueStory(chatSession: any, prompt: string, lang: Language): Promise<StoryChapter> {
  try {
    const response = await chatSession.sendMessage({ message: prompt + ` (Write in ${lang === 'zh' ? 'Chinese' : 'English'})` });
    const text = response.text || "{}";
    return JSON.parse(text) as StoryChapter;
  } catch (e: any) {
    console.error("Gemini API Error:", e);
    if (e?.status === 429 || e?.message?.includes('429') || e?.message?.toLowerCase().includes('quota') || e?.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error(lang === 'zh' ? "AI 服务目前额度已满或受到频率限制。请检查您的计划和账单详情，或稍后再试。" : "The AI service is currently out of quota or rate limited. Please check your plan and billing details, or try again later.");
    }
    throw new Error(lang === 'zh' ? "继续故事失败，请重试。" : "Failed to continue the story. Please try again.");
  }
}
