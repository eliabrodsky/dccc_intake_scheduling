
const API_BASE_URL = '/api';

export const startChatSession = async (
    patientContext: string,
    initialPrompt: string
): Promise<{ sessionId: string; responseText: string }> => {
    const response = await fetch(`${API_BASE_URL}/chat/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientContext, initialPrompt }),
    });

    if (!response.ok) {
        throw new Error('Failed to start chat session with the backend.');
    }
    return response.json();
};

export const sendMessage = async (
    sessionId: string,
    message: string
): Promise<{ responseText:string }> => {
    const response = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message }),
    });
    
    if (!response.ok) {
        throw new Error('Failed to send message to the backend.');
    }
    return response.json();
};
