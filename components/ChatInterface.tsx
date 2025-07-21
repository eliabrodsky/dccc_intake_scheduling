
import React, { useEffect, useRef } from 'react';
import { Send, Phone, User, Home } from 'lucide-react';
import { Message, Patient, SessionData } from '../types';
import { HEALOW_LINK, CHAT_LOGO_URL } from '../constants';

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const fallback = document.createElement('span');
    fallback.className = 'text-blue-600 text-sm font-bold';
    fallback.textContent = 'D';
    e.currentTarget.parentElement?.replaceWith(fallback);
};

interface ChatInterfaceProps {
    currentPatient: Patient;
    sessionData: SessionData;
    messages: Message[];
    inputValue: string;
    setInputValue: (value: string) => void;
    handleSend: () => void;
    handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    endChatAndGoHome: () => void;
    isAiTyping: boolean;
    trackConversion: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentPatient, sessionData, messages, inputValue, setInputValue, handleSend, handleKeyPress, endChatAndGoHome, isAiTyping, trackConversion }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isAiTyping]);
    
    const renderMessageContent = (content: string) => {
        // Replace **text** with <strong>text</strong>
        let htmlContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Replace the HEALOW_LINK with a proper anchor tag
        htmlContent = htmlContent.replace(
            new RegExp(HEALOW_LINK, 'g'), 
            `<a href="${HEALOW_LINK}" target="_blank" rel="noopener noreferrer" class="text-blue-500 font-semibold hover:underline">online scheduling portal</a>`
        );
        return { __html: htmlContent };
    };

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-100 shadow-xl border-x" role="log" aria-live="polite">
            <header className="bg-blue-600 text-white p-4 flex items-center justify-between space-x-3 flex-shrink-0 shadow-md">
                <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center p-1">
                        <img src={CHAT_LOGO_URL} alt="DePaul Logo" className="h-full w-full object-cover rounded-full" onError={handleImageError} />
                    </div>
                    <div className="flex-1">
                        <h1 className="font-bold">DePaul Health AI</h1>
                        <p className="text-sm opacity-90">Patient Re-engagement</p>
                    </div>
                </div>
                <button onClick={endChatAndGoHome} aria-label="End chat and go home" className="flex items-center space-x-2 text-sm bg-white bg-opacity-20 px-3 py-1 rounded-lg hover:bg-opacity-30 transition-colors">
                    <Home size={16}/>
                    <span className="hidden sm:inline">Home</span>
                </button>
            </header>

            <div className="bg-white border-b p-3 flex items-center space-x-3 flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><Phone size={16} className="text-green-600" /></div>
                <div className="flex-1"><h3 className="font-medium text-gray-800">{currentPatient.name}</h3><p className="text-sm text-gray-500">{currentPatient.phone}</p></div>
                <div className="text-xs text-gray-500">Session: {sessionData.sessionId?.slice(-6)}</div>
            </div>

            <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
                {messages.map((message) => (
                    <div key={message.id} className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.sender === 'ai' && (
                             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border shadow-sm">
                                <img src={CHAT_LOGO_URL} alt="AI Avatar" className="p-1 h-full w-full object-cover rounded-full" onError={handleImageError} />
                            </div>
                        )}
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${message.sender === 'user' ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-white text-gray-900 rounded-bl-lg border'}`}>
                            <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={renderMessageContent(message.content)} />
                             {message.content.includes(HEALOW_LINK) && (
                                <div className="mt-3">
                                    <a href={HEALOW_LINK} target="_blank" rel="noopener noreferrer" onClick={trackConversion} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors">
                                      Schedule Online Now
                                    </a>
                                </div>
                             )}
                            <p className={`text-xs mt-1 text-right ${message.sender === 'user' ? 'text-blue-100 opacity-70' : 'text-gray-400'}`}>{message.timestamp}</p>
                        </div>
                         {message.sender === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 text-white"><User size={16} /></div>
                        )}
                    </div>
                ))}
                {isAiTyping && (
                    <div className="flex items-end gap-2 justify-start">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border shadow-sm">
                            <img src={CHAT_LOGO_URL} alt="AI Avatar" className="p-1 h-full w-full object-cover rounded-full" onError={handleImageError} />
                        </div>
                        <div className="px-4 py-3 rounded-2xl shadow-sm bg-white text-gray-900 rounded-bl-lg border">
                            <div className="flex items-center space-x-1">
                                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '-0.3s'}}></span>
                                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '-0.15s'}}></span>
                                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            <footer className="border-t bg-white p-4 flex-shrink-0">
                <div className="flex space-x-2">
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your response..." aria-label="Chat input" className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition" autoComplete="off" />
                    <button onClick={handleSend} disabled={!inputValue.trim() || isAiTyping} aria-label="Send message" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex-shrink-0"><Send size={20} /></button>
                </div>
            </footer>
        </div>
    );
};
