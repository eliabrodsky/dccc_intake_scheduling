import { GoogleGenAI, Chat, Part } from "@google/genai";
import { tools } from '../constants';

const executeToolCall = async (call: any) => {
    try {
        if (call.name === 'get_travel_info') {
            const { origin, destination } = call.args;
            console.log(`Simulating travel info call for: ${origin} to ${destination}`);
            
            // --- REAL API CALL WOULD GO HERE ---
            // In a real-world deployment, you would replace this simulation
            // with a fetch() call to the Google Maps Distance Matrix API.
            // You would need to provide your own Google Maps API key.
            // const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY_HERE';
            // const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${GOOGLE_MAPS_API_KEY}`;
            // const response = await fetch(url);
            // const data = await response.json();
            // const result = data.rows[0].elements[0];
            // return { distance: result.distance.text, duration: result.duration.text };

            // For now, we return a simulated result for the demo.
            return {
                distance: `${Math.floor(Math.random() * 10) + 2} miles`,
                duration: `${Math.floor(Math.random() * 15) + 10} minutes`
            };
        }
    } catch (error) {
        console.error("Error executing tool call:", error);
        // Return a structured error so the AI knows the tool failed.
        return { error: "Failed to get travel information." };
    }
    return { error: "Unknown tool call." };
};

export const processAiResponse = async (chatSession: Chat | null, prompt: string, systemInstruction?: string) => {
    let session = chatSession;
    if (!session) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        session = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
                tools: tools,
            },
        });
    }
    
    let response = await session.sendMessage({ message: prompt });
    let functionResponse = response.functionCalls?.[0];

    while (functionResponse) {
        try {
            const apiResult = await executeToolCall(functionResponse);
            
            const toolResponse: Part[] = [{
                functionResponse: {
                    name: functionResponse.name,
                    response: apiResult,
                },
            }];

            response = await session.sendMessage({ message: { parts: toolResponse }});
            
            functionResponse = response.functionCalls?.[0];
        } catch(e) {
            console.error("Error processing tool call response", e);
            functionResponse = undefined;
        }
    }
    return { responseText: response.text, session: session };
}