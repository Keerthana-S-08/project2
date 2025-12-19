
import { GoogleGenAI, Type } from "@google/genai";
import { ItemCategory, ItemCondition, SwappableItem } from "../types";

// Fix: Initialize the GoogleGenAI client using the required named parameter and environment variable directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeItemImage = async (base64Image: string) => {
  const model = 'gemini-3-flash-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: "Analyze this item for a community swap app. Suggest a title, category, condition, brief description, and relevant tags. Return in JSON format.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          category: { type: Type.STRING, description: "One of: Book, Electronics, Home & Garden, Fashion, Toys, Other" },
          condition: { type: Type.STRING, description: "One of: New, Like New, Good, Fair" },
          description: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "category", "condition", "description", "tags"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return null;
  }
};

export const findBestMatches = async (userItems: SwappableItem[], communityItems: SwappableItem[], userWants: string[]) => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    I have a user who has these items: ${JSON.stringify(userItems.map(i => ({ title: i.title, category: i.category })))}.
    The user is looking for: ${userWants.join(', ')}.
    
    Here is the available community catalog: ${JSON.stringify(communityItems.map(i => ({ id: i.id, title: i.title, category: i.category, tags: i.tags })))}.
    
    Match the community items to the user's "Wants" and "Have" categories. 
    Rank the top 3 items they should swap for. 
    Return as JSON array of { itemId, score (0-100), reason }.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            itemId: { type: Type.STRING },
            score: { type: Type.NUMBER },
            reason: { type: Type.STRING }
          },
          required: ["itemId", "score", "reason"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse matching response", e);
    return [];
  }
};
