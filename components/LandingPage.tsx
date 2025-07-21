
import React from 'react';
import { MessageSquare, Calendar, Shield, ArrowRight, UserPlus, HelpCircle, User, RefreshCw, Loader, BarChart3 } from 'lucide-react';
import { Patient } from '../types';
import { patients, CHAT_LOGO_URL } from '../constants';

// A helper to show a fallback UI if the logo image fails to load
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const fallback = document.createElement('div');
    fallback.className = "w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg";
    fallback.textContent = 'D';
    target.replaceWith(fallback);
};

interface LandingPageProps {
    setCurrentView: (view: 'landing' | 'chat' | 'analytics') => void;
    startConversation: (patient: Patient) => void;
    onNewChatClick: () => void;
    handlePromptClick: (prompt: string) => void;
    examplePrompts: string[];
    onGenerateNewPrompts: () => void;
    isGeneratingPrompts: boolean;
    simulatingPrompt: string | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setCurrentView, startConversation, onNewChatClick, handlePromptClick, examplePrompts, onGenerateNewPrompts, isGeneratingPrompts, simulatingPrompt }) => (
    <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <img src={CHAT_LOGO_URL} alt="DePaul Community Health Centers Logo" className="h-10 w-10 rounded-full object-cover" onError={handleImageError} />
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900">DePaul Community Health Centers</h1>
                            <p className="text-sm text-gray-600">AI Patient Re-engagement Platform</p>
                        </div>
                    </div>
                    <button onClick={() => setCurrentView('analytics')} aria-label="View Analytics" className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <BarChart3 size={16} /><span className="hidden sm:inline">Analytics</span>
                    </button>
                </div>
            </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">Caring for Every Patient, <span className="text-blue-600">Every Step of the Way</span></h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">Our AI-powered platform helps bring patients back to care with personalized outreach and convenient scheduling.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12 text-center">
              {[
                { icon: MessageSquare, color: 'blue', title: 'Smart Conversations', text: 'AI-powered chat that understands patient needs and provides personalized responses.' },
                { icon: Calendar, color: 'green', title: 'Flexible Scheduling', text: 'Easy appointment booking with evening and weekend options across all DePaul locations.' },
                { icon: Shield, color: 'purple', title: 'Comprehensive Support', text: 'Assistance with transportation, insurance, and connection to community resources.' }
              ].map(feature => (
                  <div key={feature.title} className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                      <feature.icon size={24} className={`text-${feature.color}-600`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.text}</p>
                  </div>
              ))}
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border">
                <div className="text-center mb-8">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Launch a Simulation</h3>
                    <p className="text-gray-600">Select a patient profile or a guided prompt to start an AI-powered conversation.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-12">
                    <div className="lg:col-span-2">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">1. Select a Patient Scenario</h4>
                        <div className="space-y-6">
                            {patients.map((patient: Patient) => (
                                <button key={patient.id} onClick={() => startConversation(patient)} className="w-full text-left border rounded-lg p-4 sm:p-6 hover:shadow-md hover:border-blue-400 transition-all cursor-pointer group">
                                    <div className="flex items-start sm:items-center space-x-4 mb-4 flex-col sm:flex-row">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mb-3 sm:mb-0"><User size={24} className="text-blue-600" /></div>
                                        <div className="flex-1"><h4 className="font-semibold text-lg text-gray-800">{patient.name}</h4><p className="text-sm text-gray-600">{patient.age} years old</p></div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${patient.riskLevel === 'High' ? 'bg-red-100 text-red-800' : patient.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{patient.riskLevel} Risk</div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
                                        <div><strong className="block text-gray-500">Last Visit</strong> {new Date(patient.lastVisit).toLocaleDateString()}</div>
                                        <div><strong className="block text-gray-500">Provider</strong> {patient.lastProvider}</div>
                                        <div><strong className="block text-gray-500">Days Since</strong> {Math.floor((new Date().getTime() - new Date(patient.lastVisit).getTime()) / (1000 * 3600 * 24))}</div>
                                    </div>
                                    <div className="mt-4 text-right">
                                       <span className="text-blue-600 font-semibold text-sm group-hover:underline">Start Conversation <ArrowRight className="inline h-4 w-4 transform-gpu transition-transform group-hover:translate-x-1" /></span>
                                    </div>
                                </button>
                            ))}
                            <button onClick={onNewChatClick} className="w-full text-left border-2 border-dashed rounded-lg p-6 hover:shadow-md hover:border-blue-500 transition-all cursor-pointer group flex items-center justify-between">
                               <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><UserPlus size={24} className="text-green-600" /></div>
                                  <div>
                                      <h4 className="font-semibold text-lg text-gray-800">New Patient</h4>
                                      <p className="text-sm text-gray-600">Start a chat for a new or unsaved patient.</p>
                                  </div>
                               </div>
                               <span className="text-green-600 font-semibold text-sm group-hover:underline">Start Chat <ArrowRight className="inline h-4 w-4 transform-gpu transition-transform group-hover:translate-x-1" /></span>
                            </button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                             <h4 className="text-lg font-semibold text-gray-800">2. Or, Try a Prompt</h4>
                             <button onClick={onGenerateNewPrompts} disabled={isGeneratingPrompts || !!simulatingPrompt} aria-label="Generate new example prompts" className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-wait transition-colors">
                                {isGeneratingPrompts ? <Loader className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                                <span>{isGeneratingPrompts ? 'Generating...' : 'New Examples'}</span>
                             </button>
                        </div>
                        {examplePrompts.map((prompt: string, index: number) => (
                             <button key={index} onClick={() => handlePromptClick(prompt)} disabled={!!simulatingPrompt} className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 hover:border-blue-400 rounded-lg border transition-all flex items-start space-x-3 group disabled:cursor-wait disabled:opacity-70">
                                 {simulatingPrompt === prompt ? <Loader className="animate-spin text-blue-500 mt-1 flex-shrink-0" size={20} /> : <HelpCircle className="text-blue-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" size={20} />}
                                 <span className="text-gray-700 flex-1">{prompt}</span>
                                 {simulatingPrompt !== prompt && <ArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100" size={16} />}
                             </button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    </div>
);
