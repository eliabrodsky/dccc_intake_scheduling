import { initialExamplePrompts } from "../constants";

export const generateNewPrompts = async (): Promise<string[]> => {
    try {
        const response = await fetch('/api/prompts');
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
        const newPrompts = await response.json();
        
        if (Array.isArray(newPrompts) && newPrompts.length > 0) {
            return newPrompts;
        }
        console.warn("Received empty or invalid prompts from backend.");
        return initialExamplePrompts;
    } catch (error) {
        console.error("Failed to fetch new prompts:", error);
        return initialExamplePrompts;
    }
};
