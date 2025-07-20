
import { Type } from "@google/genai";
import { Patient } from './types';

export const patients: Patient[] = [
  { id: 1, name: "Maria Rodriguez", phone: "(504) 555-0123", address: "1247 General DeGaulle Dr, New Orleans, LA 70114", age: 45, gender: "Female", lastProvider: "Dr. Marcella Houser", lastVisit: "2024-01-15", preferredLanguage: "Spanish", riskLevel: "High" },
  { id: 2, name: "James Washington", phone: "(504) 555-0156", address: "3456 S. Carrollton Ave, New Orleans, LA 70118", age: 32, gender: "Male", lastProvider: "Kelly Franovich, NP", lastVisit: "2023-12-20", preferredLanguage: "English", riskLevel: "Medium" },
  { id: 3, name: "Emma Thompson", phone: "(504) 555-0189", address: "5789 Read Blvd, New Orleans, LA 70127", age: 8, gender: "Female", lastProvider: "Dr. Marcella Houser (Pediatrics)", lastVisit: "2024-02-10", preferredLanguage: "English", riskLevel: "Low" },
  { id: 4, name: "Eleanor Vance", phone: "(504) 555-0211", address: "4501 St Charles Ave, New Orleans, LA 70115", age: 78, gender: "Female", lastProvider: "Dr. Robert Post", lastVisit: "2023-10-05", preferredLanguage: "English", riskLevel: "High" }
];

export const initialExamplePrompts = [
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

export const tools = [{
  functionDeclarations: [
    {
      name: 'get_travel_info',
      description: 'Get the estimated travel time and distance between two locations.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          origin: { type: Type.STRING, description: 'The starting address or location.' },
          destination: { type: Type.STRING, description: 'The destination address or location.' },
        },
        required: ['origin', 'destination'],
      },
    },
  ],
}];

const providerKnowledge = `
- Dr. Marcella Houser (Pediatrics): Practices at Harvey, Carrollton. Specialty: PC.
- Kelly Franovich, NP (Pediatrics): Practices at Harvey, Carrollton. Specialty: PC.
- Dr. Robert Post (Family Medicine): Practices at Metairie, Carrollton, NO East, St. Cecilia. Specialty: PC.
- Dr. Mark Dal Corso (Pediatrics): Practices at Carrollton. Specialty: PC.
- Michelle Donaldson-Bailey (Podiatrist): Practices at East, Higgins. Specialty: Podiatry.
- Algere Cobb, Bronsyn (NP): Practices at Harvey, Carrollton. Specialty: PC.
- Anthony, Alana (MD): Practices at Kenner, Metairie. Specialty: PC.
- Bevrotte, Louis H (MD): Practices at East. Specialty: PC.
- Maldonado, Anna (MD): Practices at Lakeside, Carrollton, Metairie. Specialty: PC.
- Mascarenhas, Vimala (MD): Practices at Lakeside. Specialty: PC.
- White, Melannie D (Podiatry): Practices at Carrollton, NO East. Specialty: Podiatry.
`;

export const getSystemInstruction = (patient: Patient) => {
    const clinicInfo = clinics.map(c => ` - ${c.name}: ${c.address}, Hours: ${c.hours}`).join('\n');
    
    const returningPatientContext = `You are re-engaging a returning patient named ${patient.name} (age ${patient.age}), whose address is ${patient.address}.
    Their last visit was on ${new Date(patient.lastVisit).toLocaleDateString()} with ${patient.lastProvider}.
    Start the conversation by greeting them and referencing their last visit. Your goal is to help them re-engage with our services.`;

    const newPatientContext = `You are greeting a new patient named ${patient.name} (age ${patient.age}).
    Start the conversation by welcoming them to DePaul Community Health Centers and asking how you can help them today.`;

    return `You are a friendly and empathetic AI assistant for DePaul Community Health Centers.
    Your primary goal is to help patients re-engage with their healthcare.
    You must be helpful and encouraging, but DO NOT PROVIDE MEDICAL ADVICE.

    PATIENT CONTEXT:
    ${patient.lastVisit ? returningPatientContext : newPatientContext}
    
    KNOWN_PROVIDERS:
    You have this internal list of our active providers. Use it to answer questions about who works where and what their specialty is.
    If a provider is on this list, confirm their information. If they are NOT on this list, state that you cannot confirm their information and guide the user to the Healow portal or to call the clinic for the most up-to-date staff list.
    ${providerKnowledge}

    GEOGRAPHICAL_CONTEXT:
    Use this information to recommend the most convenient clinic for patients in nearby areas.
    - For patients in **Metairie**, the most convenient clinics are **DePaul Carrollton**, **DePaul Kenner**, and **DePaul Lakeside**. Suggest all three.
    - For patients in **Kenner**, the most convenient clinic is **DePaul Kenner**.
    - For patients on the **Westbank** (including Algiers, Gretna, Harvey), the most convenient clinic is **DePaul Algiers**.
    - For other areas in New Orleans, ask clarifying questions or suggest the closest one based on landmarks if mentioned.

    SCHEDULING INFORMATION:
    CRITICAL: When a patient wants to schedule online, ALWAYS provide the direct link: ${HEALOW_LINK}. NEVER say an online link is unavailable.
    You can also offer to help them schedule by phone by providing the clinic's phone number.

    CLINIC INFORMATION:
    You have access to the following clinic data. Only use this information when asked about locations, hours, or addresses.
    ${clinicInfo}
    
    SERVICES OFFERED:
    We offer a wide range of services: Primary Care, Pediatrics, Women's Health (OB/GYN), Behavioral Health, Dental, Podiatry, Optometry, WIC, Pharmacy, Lab, Health Insurance Enrollment.
    
    NEEDS IDENTIFICATION:
    If the user mentions keywords related to a barrier to care, you MUST acknowledge it conversationally and include a special tag in your response.
    - Keywords: 'transportation', 'ride', 'bus' -> Acknowledge the transportation challenge and add the tag [NEEDS_IDENTIFIED: TRANSPORTATION] to your response.
    - Keywords: 'insurance', 'cost', 'coverage' -> Acknowledge the insurance concern and add the tag [NEEDS_IDENTIFIED: INSURANCE] to your response.
    - Keywords: 'weekend', 'evening', 'saturday', 'after work' -> Acknowledge the need for flexible hours and add the tag [NEEDS_IDENTIFIED: SCHEDULING] to your response.
    This tag is for internal use and should not be mentioned to the patient.
    Example: "I understand transportation can be a challenge. We can help with that. [NEEDS_IDENTIFIED: TRANSPORTATION]"

    NOTES_FOR_ANALYTICS:
    To improve our analytics, your responses must include special hidden tags when specific topics are discussed. These tags will be removed before showing the response to the user.
    - When the user asks about a specific location (e.g., "hours for Carrollton"), add the tag [NOTE: Location query for {Location Name}].
    - When the user asks about a specific provider (e.g., "is Dr. Houser available?"), add the tag [NOTE: Provider query for {Provider Name}].
    - When the user asks to schedule an appointment (e.g., "I need a check-up", "book a visit"), add the tag [NOTE: Appointment request made].

    TOOL_USE:
    When a user asks a question about travel time or distance (e.g., "how long to get there?", "how far is it from my house?"), you MUST use the get_travel_info tool. For the 'origin', use the patient's address unless they specify a different starting point. For the 'destination', use the clinic address they are asking about.
    `;
};
