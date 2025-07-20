
import React, { useState, useEffect, useRef } from 'react';
import { Chat } from "@google/genai";

import { LandingPage } from './components/LandingPage';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ChatInterface } from './components/ChatInterface';
import { NewPatientModal } from './components/NewPatientModal';

import { Patient, SessionData, ChatRecord, Message } from './types';
import { patients, initialExamplePrompts, getSystemInstruction, tools } from './constants';
import { processAiResponse } from './services/geminiService';
import { generateNewPrompts as generatePrompts } from './services/promptService';


// --- MAIN APP COMPONENT ---
const DePaulPatientEngagementPlatform = () => {
    const [currentView, setCurrentView] = useState('landing'); // 'landing', 'chat', 'analytics'
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
    const [sessionData, setSessionData] = useState<SessionData>({});
    const [chatSessions, setChatSessions] = useState<ChatRecord[]>([]);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
    const [newPatientInfo, setNewPatientInfo] = useState({ name: '', phone: '', age: '' });
    const [dynamicPrompts, setDynamicPrompts] = useState(initialExamplePrompts);
    const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
    const [simulatingPrompt, setSimulatingPrompt] = useState<string | null>(null);

    const addMessage = (content: string, sender: 'ai' | 'user') => {
        setMessages(prev => [...prev, {
            id: Date.now() + prev.length, // more robust key
            content,
            sender,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
    };

    const startConversation = async (patient: Patient) => {
        setCurrentPatient(patient);
        setMessages([]);
        const newSessionData: SessionData = { sessionId: `session_${Date.now()}`, patientId: patient.id, startTime: new Date().toISOString(), needsIdentified: [], notes: [] };
        setSessionData(newSessionData);
        setCurrentView('chat');
    
        try {
            const chat = await processAiResponse(null, "Start the conversation.", getSystemInstruction(patient));
            setActiveChat(chat.session);
            setIsAiTyping(false);
            
            addMessage(chat.responseText, 'ai');

        } catch (error) {
            console.error("Error starting conversation:", error);
            addMessage("I'm sorry, I'm having trouble connecting right now. Please try again later.", 'ai');
            setIsAiTyping(false);
        }
    };
    
    const handleResponse = async (userMessage: string) => {
        if (!userMessage.trim() || !activeChat) return;
        addMessage(userMessage, 'user');
        setIsAiTyping(true);

        try {
            const chatResponse = await processAiResponse(activeChat, userMessage);
            
            let aiResponseText = chatResponse.responseText;
            const needsTagRegex = /\[NEEDS_IDENTIFIED:\s*(\w+)\s*\]/g;
            const newNeeds: string[] = [];
            let needsMatch;
            while ((needsMatch = needsTagRegex.exec(aiResponseText)) !== null) {
                newNeeds.push(needsMatch[1]);
            }
            if (newNeeds.length > 0) {
                setSessionData(prev => ({
                    ...prev,
                    needsIdentified: [...(prev.needsIdentified || []), ...newNeeds]
                }));
            }
            aiResponseText = aiResponseText.replace(needsTagRegex, '').trim();

            const noteTagRegex = /\[NOTE:\s*(.*?)\s*\]/g;
            const newNotes: string[] = [];
            let noteMatch;
            while ((noteMatch = noteTagRegex.exec(aiResponseText)) !== null) {
                newNotes.push(noteMatch[1]);
            }
            if (newNotes.length > 0) {
                setSessionData(prev => ({
                    ...prev,
                    notes: [...(prev.notes || []), ...newNotes]
                }));
            }
            aiResponseText = aiResponseText.replace(noteTagRegex, '').trim();

            addMessage(aiResponseText, 'ai');

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
        if (e.key === 'Enter') handleSend();
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
            appointmentDateTime: sessionData.appointmentDetails?.time || 'N/A',
            appointmentProvider: sessionData.appointmentDetails?.provider || 'N/A',
            appointmentLocation: sessionData.appointmentDetails?.location || 'N/A',
            needsIdentified: sessionData.needsIdentified?.join(', ') || '',
            notes: sessionData.notes?.join('; ') || ''
        };
        setChatSessions(prev => [...prev, chatRecord]);
    };
    
    const endChatAndGoHome = () => {
        completeChatSession();
        setCurrentView('landing');
        setCurrentPatient(null);
        setActiveChat(null);
        setSessionData({});
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const openNewPatientModal = () => setIsNewPatientModalOpen(true);
    const closeNewPatientModal = () => {
        setIsNewPatientModalOpen(false);
        setNewPatientInfo({ name: '', phone: '', age: '' });
    };
    
    const handleNewPatientSubmit = (info: {name: string, phone: string, age: string}) => {
        const newPatient: Patient = {
            id: Date.now(),
            name: info.name,
            phone: info.phone || 'N/A',
            age: parseInt(info.age, 10),
            address: 'N/A',
            gender: 'N/A',
            lastProvider: 'N/A',
            lastVisit: '', // Empty lastVisit indicates a new patient
            preferredLanguage: 'English',
            riskLevel: 'Low'
        };
        closeNewPatientModal();
        startConversation(newPatient);
    };

    const startSimulatedChat = async (prompt: string) => {
        setSimulatingPrompt(prompt);
        
        const patient = patients.find(p => p.name === "James Washington") || patients[0];
        const newSessionData: SessionData = { 
            sessionId: `session_${Date.now()}`, 
            patientId: patient.id, 
            startTime: new Date().toISOString(), 
            needsIdentified: [],
            notes: []
        };
        
        try {
            const systemInstruction = getSystemInstruction(patient);
            const welcomeChat = await processAiResponse(null, "Start the conversation.", systemInstruction);
            const promptResponse = await processAiResponse(welcomeChat.session, prompt);
    
            // Parse needs and notes from the final response
            let finalAiText = promptResponse.responseText;
            const needsTagRegex = /\[NEEDS_IDENTIFIED:\s*(\w+)\s*\]/g;
            let needsMatch;
            while ((needsMatch = needsTagRegex.exec(finalAiText)) !== null) {
                if (newSessionData.needsIdentified) {
                    newSessionData.needsIdentified.push(needsMatch[1].toUpperCase());
                }
            }
            finalAiText = finalAiText.replace(needsTagRegex, '').trim();

            const noteTagRegex = /\[NOTE:\s*(.*?)\s*\]/g;
            let noteMatch;
            while ((noteMatch = noteTagRegex.exec(finalAiText)) !== null) {
                if(newSessionData.notes){
                    newSessionData.notes.push(noteMatch[1]);
                }
            }
            finalAiText = finalAiText.replace(noteTagRegex, '').trim();
    
            const simulatedMessages: Message[] = [
                { id: Date.now(), content: welcomeChat.responseText, sender: 'ai', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                { id: Date.now() + 1, content: prompt, sender: 'user', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
                { id: Date.now() + 2, content: finalAiText, sender: 'ai', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
            ];
    
            setCurrentPatient(patient);
            setSessionData(newSessionData);
            setActiveChat(promptResponse.session);
            setMessages(simulatedMessages);
            setCurrentView('chat');
    
        } catch (error) {
            console.error("Error starting simulated chat:", error);
            alert("Sorry, there was an error generating the chat simulation. Please try again.");
        } finally {
            setSimulatingPrompt(null);
        }
    };
    
    const handlePromptClick = (prompt: string) => {
        startSimulatedChat(prompt);
    };

    const handleGenerateNewPrompts = async () => {
        setIsGeneratingPrompts(true);
        try {
            const newPrompts = await generatePrompts();
            setDynamicPrompts(newPrompts);
        } catch (error) {
            console.error("Failed to generate new prompts, using initial set.", error);
            setDynamicPrompts(initialExamplePrompts);
        } finally {
            setIsGeneratingPrompts(false);
        }
    };
    
    return (
        <div className="bg-gray-50">
            {currentView === 'landing' && <LandingPage setCurrentView={setCurrentView} startConversation={startConversation} onNewChatClick={openNewPatientModal} handlePromptClick={handlePromptClick} examplePrompts={dynamicPrompts} onGenerateNewPrompts={handleGenerateNewPrompts} isGeneratingPrompts={isGeneratingPrompts} simulatingPrompt={simulatingPrompt} />}
            {currentView === 'chat' && currentPatient && <ChatInterface currentPatient={currentPatient} sessionData={sessionData} messages={messages} inputValue={inputValue} setInputValue={setInputValue} handleSend={handleSend} handleKeyPress={handleKeyPress} endChatAndGoHome={endChatAndGoHome} isAiTyping={isAiTyping} trackConversion={trackConversion} />}
            {currentView === 'analytics' && <AnalyticsDashboard setCurrentView={setCurrentView} chatSessions={chatSessions} formatDuration={formatDuration} />}
            <NewPatientModal isOpen={isNewPatientModalOpen} onClose={closeNewPatientModal} onSubmit={handleNewPatientSubmit} newPatientInfo={newPatientInfo} setNewPatientInfo={setNewPatientInfo} />
        </div>
    );
};

export default DePaulPatientEngagementPlatform;
