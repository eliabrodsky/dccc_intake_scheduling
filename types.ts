
export interface Patient {
  id: number;
  name: string;
  phone: string;
  address: string;
  age: number;
  gender: string;
  lastProvider: string;
  lastVisit: string;
  preferredLanguage: string;
  riskLevel: "High" | "Medium" | "Low";
}

export interface Message {
  id: number;
  content: string;
  sender: 'ai' | 'user';
  timestamp: string;
}

export interface AppointmentDetails {
  time: string;
  provider: string;
  location: string;
}

export interface SessionData {
  sessionId?: string;
  patientId?: number;
  startTime?: string;
  needsIdentified?: string[];
  outcome?: string | null;
  appointmentDetails?: AppointmentDetails;
  notes?: string[];
}

export interface ChatRecord {
  id: string;
  patientName: string;
  patientPhone: string;
  dateTime: string;
  chatLengthSeconds: number;
  chatLengthFormatted: string;
  outcomeSummary: string;
  appointmentScheduled: 'Yes' | 'No';
  appointmentDateTime: string;
  appointmentProvider: string;
  appointmentLocation: string;
  needsIdentified: string;
  notes: string;
}
