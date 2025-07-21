import { Type } from '@google/genai';
import { Patient } from './types';

export const patients: Patient[] = [
  { id: 1, name: "Maria Rodriguez", phone: "(504) 555-0123", address: "1247 General DeGaulle Dr, New Orleans, LA 70114", age: 45, gender: "Female", lastProvider: "Dr. Marcella Houser", lastVisit: "2024-01-15", preferredLanguage: "Spanish", riskLevel: "High" },
  { id: 2, name: "James Washington", phone: "(504) 555-0156", address: "3456 S. Carrollton Ave, New Orleans, LA 70118", age: 32, gender: "Male", lastProvider: "Kelly Franovich, NP", lastVisit: "2023-12-20", preferredLanguage: "English", riskLevel: "Medium" },
  { id: 3, name: "Emma Thompson", phone: "(504) 555-0189", address: "5789 Read Blvd, New Orleans, LA 70127", age: 8, gender: "Female", lastProvider: "Dr. Marcella Houser (Pediatrics)", lastVisit: "2024-02-10", preferredLanguage: "English", riskLevel: "Low" },
  { id: 4, name: "Eleanor Vance", phone: "(504) 555-0211", address: "4501 St Charles Ave, New Orleans, LA 70115", age: 78, gender: "Female", lastProvider: "Dr. Robert Post", lastVisit: "2023-10-05", preferredLanguage: "English", riskLevel: "High" }
];

export const initialExamplePrompts: string[] = [
  "I need to schedule an appointment online.",
  "Which of your locations have Saturday or evening hours?",
  "Do you offer podiatry services?",
  "My mom needs help with transportation to her appointment, can you help?",
  "What's the closest clinic to the French Quarter?",
  "I need to see a doctor about pediatric obesity."
];

export const clinics = [
  { name: "DePaul Algiers", address: "2801 General DeGaulle Drive, New Orleans, LA 70114", phone: "504-362-8930", hours: "Mon-Fri: 8AM-8PM, Sat: 8AM-4PM" },
  { name: "DePaul Carrollton", address: "3201 S. Carrollton Ave, New Orleans, LA 70118", phone: "504-207-3060", hours: "Mon-Fri: 7:30AM-8PM, Sat: 8AM-2PM" },
  { name: "DePaul New Orleans East", address: "5630 Read Blvd, New Orleans, LA 70127", phone: "504-248-5357", hours: "Mon-Thu: 8AM-8PM, Fri: 8AM-5PM, Sat: 8AM-2PM" },
  { name: "DePaul Kenner", address: "1401 W. Esplanade Avenue, Suite 100, Kenner, LA 70065", phone: "504-469-8977", hours: "Mon-Fri: 8AM-5PM" },
  { name: "DePaul Lakeside", address: "3020 N. Causeway Blvd., Metairie, LA 70002", phone: "504-207-3060", hours: "Mon-Fri: 8AM-5PM" }
];

export const HEALOW_LINK = "https://healow.com/apps/practice/daughters-of-charity-health-centers-new-orleans-la-20259?v=2&locale=en";
export const CHAT_LOGO_URL = "https://bizneworleans.com/wp-content/uploads/2023/12/DCHC-Logo-New.jpg";

export const SYSTEM_INSTRUCTION = `You are "DePaul Health AI", a friendly and helpful AI assistant for DePaul Community Health Centers.
Your goal is to re-engage patients and help them get the care they need.

**Your Persona:**
- Empathetic, caring, and professional.
- Patient and understanding.
- Clear and concise in your communication.
- Use plain language, avoid medical jargon.
- Always be positive and encouraging.

**Your Capabilities:**
1.  **Patient Information:** You will be provided with the patient's context (name, age, last visit, etc.). Use this to personalize the conversation. Start by greeting them by name.
2.  **Scheduling:** You can help patients schedule appointments. If they ask to schedule, guide them to the online portal by providing this exact link: ${HEALOW_LINK}. Do NOT make up a link.
3.  **Clinic Information:** You know about DePaul's clinic locations and hours (provided below).
4.  **Services:** You can answer questions about the services DePaul offers.
5.  **Transportation:** You can use the \`get_travel_info\` tool to estimate travel time and distance for patients. If a patient mentions transportation issues, proactively offer to check travel times to a clinic.
6.  **Identifying Needs:** Tag specific patient needs for the care team using the format \`[NEEDS_IDENTIFIED: KEYWORD]\`. Examples: \`[NEEDS_IDENTIFIED: TRANSPORTATION]\`, \`[NEEDS_IDENTIFIED: INSURANCE_QUERY]\`, \`[NEEDS_IDENTIFIED: URGENT_CARE]\`.
7.  **Taking Notes:** Tag important information or patient quotes for the care team's review using the format \`[NOTE: ...text...]\`. Example: \`[NOTE: Patient mentioned they lost their insurance card.]\`.

**Important Rules:**
- **DO NOT PROVIDE MEDICAL ADVICE.** If a patient asks for medical advice, gently decline and instruct them to schedule an appointment or, for emergencies, to call 911. Example: "I can't provide medical advice, but I can help you schedule an appointment to speak with a provider. For any medical emergency, please call 911."
- **Be concise.** Keep your responses short and easy to read on a mobile phone. Use bolding (\*\*text\*\*) to highlight important information.
- When the conversation starts, greet the patient and mention you noticed it's been a while since their last visit and you're checking in.

**Clinic Information:**
${clinics.map(c => `- **${c.name}:** ${c.address}. Hours: ${c.hours}.`).join('\n')}
`;

export const tools = [{
  functionDeclarations: [
    {
      name: "get_travel_info",
      description: "Get the estimated travel distance and duration between an origin and a destination.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          origin: {
            type: Type.STRING,
            description: "The starting point for the travel, e.g., a patient's address."
          },
          destination: {
            type: Type.STRING,
            description: "The destination point, e.g., a clinic's address."
          }
        },
        required: ["origin", "destination"]
      }
    }
  ]
}];
