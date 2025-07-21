
import React from 'react';

interface NewPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (info: { name: string; phone: string; age: string }) => void;
    newPatientInfo: { name: string; phone: string; age: string };
    setNewPatientInfo: React.Dispatch<React.SetStateAction<{ name: string; phone: string; age: string }>>;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({ isOpen, onClose, onSubmit, newPatientInfo, setNewPatientInfo }) => {
    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPatientInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPatientInfo.name && newPatientInfo.age) {
            onSubmit(newPatientInfo);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="bg-white rounded-lg p-8 shadow-2xl w-full max-w-md">
                <h2 id="modal-title" className="text-2xl font-bold mb-4 text-gray-800">New Patient Information</h2>
                <p className="mb-6 text-gray-600">Please provide some basic information to get started.</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" id="name" name="name" value={newPatientInfo.name} onChange={handleChange} required className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                        <input type="tel" id="phone" name="phone" value={newPatientInfo.phone} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <input type="number" id="age" name="age" value={newPatientInfo.age} onChange={handleChange} required className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed" disabled={!newPatientInfo.name || !newPatientInfo.age}>Start Chat</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
