
import React from 'react';
import { MessageSquare, Clock, TrendingUp, CheckCircle, BarChart3, Home } from 'lucide-react';
import { ChatRecord } from '../types';
import { CHAT_LOGO_URL } from '../constants';

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const fallback = document.createElement('div');
    fallback.className = "w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg";
    fallback.textContent = 'D';
    e.currentTarget.replaceWith(fallback);
};

interface AnalyticsDashboardProps {
    setCurrentView: (view: 'landing' | 'chat' | 'analytics') => void;
    chatSessions: ChatRecord[];
    formatDuration: (seconds: number) => string;
}

const StatCard: React.FC<{ icon: React.ElementType, color: string, value: string | number, label: string }> = ({ icon: Icon, color, value, label }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                <Icon size={24} className={`text-${color}-600`} />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-600">{label}</p>
            </div>
        </div>
    </div>
);

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ setCurrentView, chatSessions }) => {
    const totalSessions = chatSessions.length;
    const appointmentsScheduled = chatSessions.filter(s => s.outcomeSummary === "Clicked 'Schedule Online'").length;
    const avgChatLengthSeconds = totalSessions > 0 ? Math.round(chatSessions.reduce((sum, s) => sum + s.chatLengthSeconds, 0) / totalSessions) : 0;
    const conversionRate = totalSessions > 0 ? Math.round((appointmentsScheduled / totalSessions) * 100) : 0;
    
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getNeedBadgeClass = (need: string): string => {
        const lowerNeed = need.toLowerCase().trim();
        if (lowerNeed.includes('transportation')) return 'bg-purple-100 text-purple-800';
        if (lowerNeed.includes('insurance')) return 'bg-orange-100 text-orange-800';
        if (lowerNeed.includes('scheduling')) return 'bg-cyan-100 text-cyan-800';
        return 'bg-gray-100 text-gray-800';
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <img src={CHAT_LOGO_URL} alt="DePaul Logo" className="h-10 w-10 rounded-full object-cover" onError={handleImageError} />
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">DePaul AI Analytics</h1>
                                <p className="text-sm text-gray-600">Patient Engagement Insights</p>
                            </div>
                        </div>
                        <button onClick={() => setCurrentView('landing')} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Home size={16} />
                            <span>Back to Home</span>
                        </button>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={MessageSquare} color="blue" value={totalSessions} label="Total Sessions" />
                    <StatCard icon={CheckCircle} color="green" value={appointmentsScheduled} label="Conversions" />
                    <StatCard icon={Clock} color="purple" value={formatDuration(avgChatLengthSeconds)} label="Avg. Chat Length" />
                    <StatCard icon={TrendingUp} color="orange" value={`${conversionRate}%`} label="Conversion Rate" />
                </div>
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">Patient Chat Sessions</h3>
                    </div>
                    <div className="overflow-x-auto">
                        {totalSessions === 0 ? (
                            <div className="text-center py-16">
                                <BarChart3 size={48} className="text-gray-300 mx-auto mb-4" />
                                <h4 className="text-lg font-medium text-gray-800">No Chat Sessions Yet</h4>
                                <p className="text-gray-500 mt-1">Start a patient conversation to see analytics data here.</p>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['Patient', 'Contact', 'Date/Time', 'Length', 'Outcome', 'Needs Identified', 'Notes'].map(header => (
                                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {chatSessions.slice().reverse().map((session: ChatRecord) => (
                                        <tr key={session.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{session.patientName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{session.patientPhone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(session.dateTime).toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">{session.chatLengthFormatted}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${session.appointmentScheduled === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {session.outcomeSummary}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1">
                                                    {session.needsIdentified.split(', ').filter(Boolean).map((need, i) => (
                                                        <span key={i} className={`px-2 py-1 text-xs rounded-full ${getNeedBadgeClass(need)}`}>{need}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 max-w-xs break-words">{session.notes}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
