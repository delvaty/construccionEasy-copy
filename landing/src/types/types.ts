export type FormStep = 'selection' | 'new' | 'ongoing';

export interface TattooDetail {
  id: string; // For unique key prop
  location: string;
}

export interface RelativeDetail {
  id: string; // For unique key prop
  relationship: string;
  fullName: string;
  residencyStatus: string; // e.g., 'yes_temp', 'yes_perm', 'in_progress', 'no', 'unknown'
}

export interface TravelDetail {
  id: string; // For unique key prop
  startDate: string;
  endDate: string;
  country: string;
  reason: string; // e.g., 'tourism', 'work', 'other'
}

export interface FormData {
  // Selection
  processType: 'new' | 'ongoing' | '';

  // New Process - Personal Information
  fullName: string;
  passportNumber: string;
  placeOfBirth: string;
  dateOfBirth: string;
  peselNumber: string;
  height: string;
  eyeColor: string;
  hairColor: string;
  hasTattoos: boolean | null;
  tattoos: TattooDetail[];

  // New Process - Family Information
  fatherName: string;
  motherName: string;
  maritalStatus: string;
  educationLevel: string;

  // New Process - Contact Information
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  zipCode: string;

  // New Process - Travel & Work Information
  euEntryDate: string;
  polandArrivalDate: string;
  transportMethod: string;
  hasTraveledLastFiveYears: boolean | null; // Changed from travelsLastFiveYears (string)
  travels: TravelDetail[]; // Array for travel details
  workPermit: string; // Consider moving or clarifying this field's purpose/location
  currentAgencyName: string;
  currentJob: string;
  relativesInPoland: boolean | null;
  relatives: RelativeDetail[];

  // New Process - Documents
  passportFile: File | null;

  // Ongoing Process - Personal Information (some overlap with New)
  lastName: string;

  // Ongoing Process - Work Information
  hasWorkPermit: boolean | null;

  // Ongoing Process - Process Information
  voivodeship: string;
  processStage: string;
  caseNumber: string;

  // Ongoing Process - Contact Information (some overlap with New)
  whatsappNumber: string;
  currentAddress: string;

  // Ongoing Process - Documents
  yellowCard: File | null;
}

export const initialFormData: FormData = {
  processType: '',
  fullName: '',
  passportNumber: '',
  placeOfBirth: '',
  dateOfBirth: '',
  peselNumber: '',
  height: '',
  eyeColor: '',
  hairColor: '',
  hasTattoos: null,
  tattoos: [],
  fatherName: '',
  motherName: '',
  maritalStatus: '',
  educationLevel: '',
  email: '',
  phoneNumber: '',
  address: '',
  city: '',
  zipCode: '',
  euEntryDate: '',
  polandArrivalDate: '',
  transportMethod: '',
  hasTraveledLastFiveYears: null, // Changed initial state
  travels: [], // Initialize as empty array
  workPermit: '',
  currentAgencyName: '',
  currentJob: '',
  relativesInPoland: null,
  relatives: [],
  passportFile: null,
  lastName: '',
  hasWorkPermit: null,
  voivodeship: '',
  processStage: '',
  caseNumber: '',
  whatsappNumber: '',
  currentAddress: '',
  yellowCard: null,
};
