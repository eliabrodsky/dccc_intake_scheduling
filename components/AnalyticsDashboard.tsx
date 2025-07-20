
import React from 'react';
import { MessageSquare, Clock, TrendingUp, CheckCircle, BarChart3 } from 'lucide-react';
import { ChatRecord } from '../types';
import { CHAT_LOGO_URL } from '../constants';

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

export const AnalyticsDashboard = ({ setCurrentView, chatSessions, formatDuration }) => {
    const totalSessions = chatSessions.length;
    const appointmentsScheduled = chatSessions.filter(s => s.outcomeSummary === "Clicked 'Schedule Online'").length;
    const avgChatLength = chatSessions.length > 0 ? Math.round(chatSessions.reduce((sum, s) => sum + s.chatLengthSeconds, 0) / chatSessions.length) : 0;
    
    const getNeedBadgeClass = (need: string) => {
        const lowerNeed = need.toLowerCase().trim();
        if (lowerNeed.includes('transportation')) return 'bg-purple-100 text-purple-800';
        if (lowerNeed.includes('insurance')) return 'bg-orange-100 text-orange-800';
        if (lowerNeed.includes('scheduling')) return 'bg-cyan-100 text-cyan-800';
        return 'bg-gray-100 text-gray-800';
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-16"><div className="flex items-center space-x-3"><img src={CHAT_LOGO_URL} alt="DePaul Community Health Centers" className="h-10 w-10 rounded-full" onError={(e) => handleImageError(e, '<div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">D</div>')} /><div><h1 className="text-lg font-bold text-gray-900">DePaul AI Analytics</h1><p className="text-sm text-gray-600">Patient Engagement Insights</p></div></div><button onClick={() => setCurrentView('landing')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Back to Home</button></div></div></header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><MessageSquare size={20} className="text-blue-600" /></div><div><p className="text-2xl font-bold text-gray-900">{totalSessions}</p><p className="text-sm text-gray-600">Total Sessions</p></div></div></div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle size={20} className="text-green-600" /></div><div><p className="text-2xl font-bold text-gray-900">{appointmentsScheduled}</p><p className="text-sm text-gray-600">Conversions</p></div></div></div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Clock size={20} className="text-purple-600" /></div><div><p className="text-2xl font-bold text-gray-900">{formatDuration(avgChatLength)}</p><p className="text-sm text-gray-600">Avg Chat Length</p></div></div></div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"><TrendingUp size={20} className="text-orange-600" /></div><div><p className="text-2xl font-bold text-gray-900">{totalSessions > 0 ? Math.round((appointmentsScheduled / totalSessions) * 100) : 0}%</p><p className="text-sm text-gray-600">Conversion Rate</p></div></div></div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border"><div className="p-6 border-b"><h3 className="text-lg font-semibold text-gray-900">Patient Chat Sessions</h3></div><div className="overflow-x-auto">{chatSessions.length === 0 ? (<div className="text-center py-8"><BarChart3 size={48} className="text-gray-400 mx-auto mb-4" /><p className="text-gray-600">No chat sessions yet. Start a patient conversation to see analytics!</p></div>) : (<table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chat Length</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Needs</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{chatSessions.slice().reverse().map((session: ChatRecord) => (<tr key={session.id}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session.patientName}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.patientPhone}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${new Date(session.dateTime).toLocaleDateString()} ${new Date(session.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.chatLengthFormatted}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${session.outcomeSummary === "Clicked 'Schedule Online'" ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{session.outcomeSummary}</span></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><div className="flex flex-wrap gap-1">{session.needsIdentified.split(', ').filter(n => n).map((need, i) => (<span key={i} className={`px-2 py-1 text-xs rounded-full ${getNeedBadgeClass(need)}`}>{need}</span>))}</div></td><td className="px-6 py-4 text-sm text-gray-500 max-w-xs break-words">{session.notes}</td></tr>))}</tbody></table>)}</div></div>
            </main>
        </div>
    );
};
