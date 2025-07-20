
import React from 'react';
import { Send, MessageSquare, Calendar, Users, Phone, Clock, BarChart3, TrendingUp, Shield, ArrowRight, CheckCircle, UserPlus, HelpCircle, User, RefreshCw, Loader } from 'lucide-react';
import { Patient } from '../types';
import { patients, CHAT_LOGO_URL } from '../constants';

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackHtml: string) => {
    const target = e.currentTarget;
    if (target.parentElement) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = fallbackHtml.trim();
        const fallbackElement = wrapper.firstChild;
        if (fallbackElement) {
            target.parentElement.replaceChild(fallbackElement, target);
        }
    }
};

export const LandingPage = ({ setCurrentView, startConversation, onNewChatClick, handlePromptClick, examplePrompts, onGenerateNewPrompts, isGeneratingPrompts, simulatingPrompt }) => (
    <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <img src={CHAT_LOGO_URL} alt="DePaul Community Health Centers" className="h-12 w-12 rounded-full" onError={(e) => handleImageError(e, '<div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center border-2 border-blue-700"><div class="text-white text-lg font-bold">D</div></div>')} />
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900">DePaul Community Health Centers</h1>
                            <p className="text-sm text-gray-600">AI Patient Re-engagement Platform</p>
                        </div>
                    </div>
                    <button onClick={() => setCurrentView('analytics')} className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <BarChart3 size={16} /><span>Analytics</span>
                    </button>
                </div>
            </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Caring for Every Patient, <span className="text-blue-600">Every Step of the Way</span></h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">Our AI-powered patient re-engagement system helps bring patients back to care with personalized outreach, convenient scheduling, and comprehensive support services.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Conversations</h3>
                <p className="text-gray-600">AI-powered chat that understands patient needs and provides personalized responses.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar size={24} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Flexible Scheduling</h3>
                <p className="text-gray-600">Easy appointment booking with evening and weekend options across all DePaul locations.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield size={24} className="text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Comprehensive Support</h3>
                <p className="text-gray-600">Assistance with transportation, insurance, and connection to community resources.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border">
                <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Launch a Simulation</h3>
                    <p className="text-gray-600">Select a patient profile or a guided prompt to start an AI-powered conversation.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Patient Scenarios */}
                    <div className="lg:col-span-2">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">1. Select a Patient Scenario</h4>
                        <div className="space-y-6">
                            {patients.map((patient: Patient) => (
                                <div key={patient.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => startConversation(patient)}>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"><Users size={24} className="text-blue-600" /></div>
                                        <div className="flex-1"><h4 className="font-semibold text-lg text-gray-800">{patient.name}</h4><p className="text-sm text-gray-600">{patient.age} years old</p></div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${patient.riskLevel === 'High' ? 'bg-red-100 text-red-800' : patient.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{patient.riskLevel} Risk</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                                        <div><strong className="block text-gray-500">Last Visit</strong> {new Date(patient.lastVisit).toLocaleDateString()}</div>
                                        <div><strong className="block text-gray-500">Provider</strong> {patient.lastProvider}</div>
                                        <div><strong className="block text-gray-500">Days Since</strong> {Math.floor((new Date().getTime() - new Date(patient.lastVisit).getTime()) / (1000 * 60 * 60 * 24))}</div>
                                    </div>
                                    <div className="mt-4 text-right">
                                       <span className="text-blue-600 font-semibold text-sm group-hover:underline">Start Conversation <ArrowRight className="inline h-4 w-4" /></span>
                                    </div>
                                </div>
                            ))}
                            <div className="border-2 border-dashed rounded-lg p-6 hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer group flex items-center justify-between" onClick={onNewChatClick}>
                               <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><UserPlus size={24} className="text-green-600" /></div>
                                  <div>
                                      <h4 className="font-semibold text-lg text-gray-800">New Patient</h4>
                                      <p className="text-sm text-gray-600">Start a chat for a new or unsaved patient.</p>
                                  </div>
                               </div>
                               <span className="text-green-600 font-semibold text-sm group-hover:underline">Start Chat <ArrowRight className="inline h-4 w-4" /></span>
                            </div>
                        </div>
                    </div>
                    {/* Example Prompts */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                             <h4 className="text-lg font-semibold text-gray-800">2. Or, Try a Guided Prompt</h4>
                             <button onClick={onGenerateNewPrompts} disabled={isGeneratingPrompts || simulatingPrompt} className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-wait">
                                {isGeneratingPrompts ? <Loader className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                                <span>{isGeneratingPrompts ? 'Generating...' : 'New Examples'}</span>
                             </button>
                        </div>
                        {examplePrompts.map((prompt: string, index: number) => (
                             <button key={index} onClick={() => handlePromptClick(prompt)} disabled={simulatingPrompt !== null} className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 hover:border-blue-400 rounded-lg border transition-all flex items-start space-x-3 group disabled:cursor-wait disabled:opacity-70">
                                 {simulatingPrompt === prompt ? <Loader className="animate-spin text-blue-500 mt-1 flex-shrink-0" size={20} /> : <HelpCircle className="text-blue-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" size={20} />}
                                 <span className="text-gray-700 flex-1">{prompt}</span>
                                 {simulatingPrompt !== prompt && <ArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors" size={16} />}
                             </button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    </div>
);
