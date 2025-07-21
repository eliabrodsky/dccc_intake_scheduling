import React, { useState } from 'react';

import { LandingPage } from './components/LandingPage';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ChatInterface } from './components/ChatInterface';
import { NewPatientModal } from './components/NewPatientModal';

import { Patient, SessionData, ChatRecord, Message } from './types';
import { patients, initialExamplePrompts } from './constants';
import { startChatSession, sendMessage } from './services/geminiService';
import { generateNewPrompts as generatePromptsFromApi } from './services/promptService';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<'landing' | 'chat' | 'analytics'>('landing');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
    const [sessionData, setSessionData] = useState<SessionData>({});
    const [chatSessions, setChatSessions] = useState<ChatRecord[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
    const [newPatientInfo, setNewPatientInfo] = useState({ name: '', phone: '', age: '' });
    const [dynamicPrompts, setDynamicPrompts] = useState<string[]>(initialExamplePrompts);
    const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
    const [simulatingPrompt, setSimulatingPrompt] = useState<string | null>(null);

    const addMessage = (content: string, sender: 'ai' | 'user') => {
        setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            content,
            sender,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
    };
    
    const processAndAddAiResponse = (responseText: string) => {
        let processedText = responseText;
        const needsIdentified: string[] = [];
        const notes: string[] = [];

        const needsTagRegex = /\[NEEDS_IDENTIFIED:\s*(\w+)\s*\]/g;
        processedText = processedText.replace(needsTagRegex, (match, tag) => {
            needsIdentified.push(tag.toUpperCase());
            return '';
        });

        const noteTagRegex = /\[NOTE:\s*(.*?)\s*\]/g;
        processedText = processedText.replace(noteTagRegex, (match, note) => {
            notes.push(note);
            return '';
        });
        
        if (needsIdentified.length > 0 || notes.length > 0) {
            setSessionData(prev => ({
                ...prev,
                needsIdentified: [...(prev.needsIdentified || []), ...needsIdentified],
                notes: [...(prev.notes || []), ...notes],
            }));
        }
        
        addMessage(processedText.trim(), 'ai');
    };

    const startConversation = async (patient: Patient) => {
        setCurrentPatient(patient);
        setMessages([]);
        setCurrentView('chat');
        setIsAiTyping(true);
        setSessionId(null);

        const patientContext = `This chat is with ${patient.name}. 
Patient details:
- Age: ${patient.age}
- Last Visit: ${patient.lastVisit || 'N/A'}
- Last Provider: ${patient.lastProvider || 'N/A'}
- Risk Level: ${patient.riskLevel}
- Address: ${patient.address}
- Preferred Language: ${patient.preferredLanguage}`;
    
        const initialPrompt = "Start the conversation.";
    
        try {
            const { sessionId, responseText } = await startChatSession(patientContext, initialPrompt);
            
            const newSessionData: SessionData = { sessionId, patientId: patient.id, startTime: new Date().toISOString(), needsIdentified: [], notes: [] };

            setSessionData(newSessionData);
            setSessionId(sessionId);
            processAndAddAiResponse(responseText);
        } catch (error) {
            console.error("Error starting conversation:", error);
            addMessage("I'm sorry, I'm having trouble connecting right now. Please try again later.", 'ai');
        } finally {
            setIsAiTyping(false);
        }
    };
    
    const handleResponse = async (userMessage: string) => {
        if (!userMessage.trim() || !sessionId) return;
        addMessage(userMessage, 'user');
        setIsAiTyping(true);

        try {
            const { responseText } = await sendMessage(sessionId, userMessage);
            processAndAddAiResponse(responseText);
        } catch (error) {
            console.error("Error sending message:", error);
            addMessage("I'm having some trouble at the moment. Please give me a minute and try again.", 'ai');
        } finally {
            setIsAiTyping(false);
        }
    };
    
    const trackConversion = () => {
        setSessionData(prev => ({ ...prev, outcome: "Clicked 'Schedule Online'" }));
    };
    
    const handleSend = () => {
        if (inputValue.trim()) {
            handleResponse(inputValue);
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isAiTyping) handleSend();
    };
    
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const completeChatSession = () => {
        if (!sessionData.startTime || !currentPatient) return;

        const duration = Math.round((Date.now() - new Date(sessionData.startTime).getTime()) / 1000);
        const chatRecord: ChatRecord = {
            id: sessionData.sessionId || `session_${Date.now()}`,
            patientName: currentPatient.name,
            patientPhone: currentPatient.phone,
            dateTime: new Date().toISOString(),
            chatLengthSeconds: duration,
            chatLengthFormatted: formatDuration(duration),
            outcomeSummary: sessionData.outcome || 'Session ended',
            appointmentScheduled: sessionData.outcome === "Clicked 'Schedule Online'" ? 'Yes' : 'No',
            appointmentDateTime: 'N/A',
            appointmentProvider: 'N/A',
            appointmentLocation: 'N/A',
            needsIdentified: sessionData.needsIdentified?.join(', ') || 'None',
            notes: sessionData.notes?.join('; ') || 'None'
        };
        setChatSessions(prev => [...prev, chatRecord]);
    };
    
    const endChatAndGoHome = () => {
        completeChatSession();
        setCurrentView('landing');
        setCurrentPatient(null);
        setSessionId(null);
        setSessionData({});
        setMessages([]);
    };

    const handleNewPatientSubmit = (info: {name: string, phone: string, age: string}) => {
        const newPatient: Patient = {
            id: Date.now(),
            name: info.name,
            phone: info.phone || 'N/A',
            age: parseInt(info.age, 10) || 0,
            address: 'N/A',
            gender: 'N/A',
            lastProvider: 'N/A',
            lastVisit: '', 
            preferredLanguage: 'English',
            riskLevel: 'Low'
        };
        setIsNewPatientModalOpen(false);
        setNewPatientInfo({ name: '', phone: '', age: '' });
        startConversation(newPatient);
    };

    const startSimulatedChat = async (prompt: string) => {
        setSimulatingPrompt(prompt);
        const patient = patients.find(p => p.name === "James Washington") || patients[1];
        
        setCurrentPatient(patient);
        setMessages([]);
        setCurrentView('chat');
        setIsAiTyping(true);
        setSessionId(null);

        const patientContext = `This chat is with ${patient.name}. 
Patient details:
- Age: ${patient.age}
- Last Visit: ${patient.lastVisit || 'N/A'}
- Last Provider: ${patient.lastProvider || 'N/A'}
- Risk Level: ${patient.riskLevel}
- Address: ${patient.address}
- Preferred Language: ${patient.preferredLanguage}`;
    
        try {
            // 1. Start chat and get welcome message
            const { sessionId: newSessionId, responseText: welcomeText } = await startChatSession(patientContext, "Start the conversation.");
            
            // Set up UI for chat
            setSessionData({ sessionId: newSessionId, patientId: patient.id, startTime: new Date().toISOString(), needsIdentified: [], notes: [] });
            setSessionId(newSessionId);
            
            setMessages([
                { id: Date.now() + 1, content: welcomeText, sender: 'ai', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                { id: Date.now() + 2, content: prompt, sender: 'user', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            ]);
            setIsAiTyping(true); // Keep typing indicator on

            // 2. Send the user's prompt to get the next response
            const { responseText: promptResponseText } = await sendMessage(newSessionId, prompt);

            // Delay showing AI response for simulation effect
            setTimeout(() => {
                setIsAiTyping(false);
                processAndAddAiResponse(promptResponseText);
            }, 1000);
    
        } catch (error) {
            console.error("Error starting simulated chat:", error);
            alert("Sorry, there was an error generating the chat simulation. Please try again.");
            setCurrentView('landing');
        } finally {
            setSimulatingPrompt(null);
        }
    };
    
    const handleGenerateNewPrompts = async () => {
        setIsGeneratingPrompts(true);
        try {
            const newPrompts = await generatePromptsFromApi();
            setDynamicPrompts(newPrompts);
        } catch (error) {
            console.error("Failed to generate new prompts, using initial set.", error);
        } finally {
            setIsGeneratingPrompts(false);
        }
    };
    
    const renderContent = () => {
        switch (currentView) {
            case 'chat':
                return currentPatient && <ChatInterface currentPatient={currentPatient} sessionData={sessionData} messages={messages} inputValue={inputValue} setInputValue={setInputValue} handleSend={handleSend} handleKeyPress={handleKeyPress} endChatAndGoHome={endChatAndGoHome} isAiTyping={isAiTyping} trackConversion={trackConversion} />;
            case 'analytics':
                return <AnalyticsDashboard setCurrentView={setCurrentView} chatSessions={chatSessions} formatDuration={formatDuration} />;
            case 'landing':
            default:
                return <LandingPage setCurrentView={setCurrentView} startConversation={startConversation} onNewChatClick={() => setIsNewPatientModalOpen(true)} handlePromptClick={startSimulatedChat} examplePrompts={dynamicPrompts} onGenerateNewPrompts={handleGenerateNewPrompts} isGeneratingPrompts={isGeneratingPrompts} simulatingPrompt={simulatingPrompt} />;
        }
    }

    return (
        <div className="bg-gray-50 font-sans">
            {renderContent()}
            <NewPatientModal isOpen={isNewPatientModalOpen} onClose={() => setIsNewPatientModalOpen(false)} onSubmit={handleNewPatientSubmit} newPatientInfo={newPatientInfo} setNewPatientInfo={setNewPatientInfo} />
        </div>
    );
};

export default App;
