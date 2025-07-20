
import { GoogleGenAI } from "@google/genai";

export const generateNewPrompts = async (): Promise<string[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Generate 6 unique, one-sentence example questions a patient might ask a healthcare chatbot. The questions should cover a range of topics like scheduling, specific services (e.g., podiatry, pediatrics), insurance, finding locations, and asking for weekend/evening hours. Return the response as a valid JSON array of strings. Example format: ["Question 1", "Question 2"]`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        
        const jsonText = response.text.trim();
        const jsonMatch = jsonText.match(/```json\n([\s\S]*?)\n```/);
        const parsableText = jsonMatch ? jsonMatch[1] : jsonText;

        const newPrompts = JSON.parse(parsableText);
        if (Array.isArray(newPrompts) && newPrompts.length > 0) {
            return newPrompts;
        }
    } catch (error) {
        console.error("Error generating new prompts in service:", error);
        // Fallback to initial prompts on error
    }

    return [
        "I need to schedule an appointment online.",
        "Which of your locations have Saturday or evening hours?",
        "Do you offer podiatry services?",
        "My mom needs help with transportation to her appointment, can you help?",
        "What's the closest clinic to the French Quarter?",
        "I need to see a doctor about pediatric obesity."
      ];
};
