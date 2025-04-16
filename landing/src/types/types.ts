export type FormStep = 'selection' | 'new' | 'ongoing';

export interface User {
  id: string;
  email: string;
  username?: string;
  created_at: string;
  updated_at: string;
  role: 'admin' | 'client';
  is_active: boolean;
}

export interface Client {
  id: string;
  user_id: string; // Añadido según la solicitud
  full_name: string;
  passport_number: string;
  date_of_birth: string;
  email: string;
  phone_number: string;
  current_job?: string;
  current_agency?: string;
  has_completed_form?: boolean; // Añadido según la solicitud
  created_at: string;
  updated_at: string;
}

export interface NewResidenceApplication {
  id: string;
  client_id: string;
  place_of_birth: string;
  pesel_number: string;
  height_cm: number;
  eye_color: 'Marrón' | 'Azul' | 'Verde' | 'Avellana';
  hair_color: 'Negro' | 'Marrón' | 'Rubio' | 'Pelirrojo' | 'Gris';
  has_tattoos: boolean;
  father_name: string;
  mother_name: string;
  marital_status: 'Soltero/a' | 'Casado/a' | 'Divorciado/a' | 'Viudo/a';
  education_level: 'Primaria' | 'Secundaria' | 'Licenciatura' | 'Maestría' | 'Doctorado';
  address: string;
  city: string;
  zip_code: string;
  eu_entry_date: string;
  poland_arrival_date: string;
  transport_method: 'Aéreo' | 'Terrestre' | 'Marítimo';
  traveled_last_5_years: boolean;
  has_relatives_in_poland: boolean;
  created_at: string;
  updated_at: string;
}

export interface OngoingResidenceProcess {
  id: string;
  client_id: string;
  first_name: string;
  last_name: string;
  has_work_permit: boolean;
  voivodato: string;
  process_stage: 'Solicitud Presentada' | 'Tarjeta Amarilla' | 'Sello Rojo' | 'Negativo' | 'Desconocido';
  case_number?: string;
  current_address: string;
  whatsapp_number: string;
  created_at: string;
  updated_at: string;
  completed_steps: number;
  total_steps: number
}

export interface ClientDocument {
  id: string;
  client_id: string;
  document_type: 'passport' | 'yellow_card' | 'other';
  file_path: string;
  file_name: string;
  upload_date: string;
  status: 'Pendiente' | 'Verificado' | 'Rechazado';
}

export interface ClientTattoo {
  id: string;
  client_id: string;
  location: string;
  created_at: string;
}

export interface ClientTravel {
  id: string;
  client_id: string;
  start_date: string;
  end_date: string;
  country: string;
  reason: string;
  created_at: string;
}

export interface ClientRelative {
  id: string;
  client_id: string;
  relationship: string;
  full_name: string;
  residency_status: string;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  client_id: string;
  ticket_number: string;
  subject: string;
  status: 'Abierto' | 'En Proceso' | 'Respondido' | 'Cerrado';
  priority: 'Baja' | 'Media' | 'Alta';
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  is_from_admin: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  client_id: string;
  reference_number: string;
  amount: number;
  due_date: string;
  installment_number: number;
  total_installments: number;
  status: 'Pendiente' | 'Pagado' | 'Vencido';
  payment_date?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentSetting {
  id: string;
  process_type: string;
  total_amount: number;
  installments: number;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  notification_type: 'document' | 'payment' | 'appointment' | 'status' | 'ticket' | 'general';
  related_id?: string;
  created_at: string;
}

export interface Alert {
  id: string;
  client_id: string;
  title: string;
  description: string;
  due_date?: string;
  priority: 'Baja' | 'Media' | 'Alta';
  status: 'Pendiente' | 'En Proceso' | 'Completada';
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface ProcessStage {
  id: string;
  stage_name: string;
  stage_order: number;
  description?: string;
  estimated_time_days?: number;
  created_at: string;
  updated_at: string;
}

export interface ClientProcessStage {
  id: string;
  client_id: string;
  stage_id: string;
  start_date?: string;
  completed_date?: string;
  status: 'No Iniciado' | 'En Proceso' | 'Completado';
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Tipos para el formulario
export interface TattooDetail {
  id: string;
  location: string;
}

export interface TravelDetail {
  id: string;
  start_date: string;
  end_date: string;
  country: string;
  reason: string;
}

export interface RelativeDetail {
  id: string;
  relationship: string;
  full_name: string;
  residency_status: string;
}

export interface DocumentStats {
  verified: number;
  pending: number;
  rejected: number;
}

export interface JobOffer {
  id: number;
  title: string;
  hourlyPay: string;
  city: string;
  imageUrl: string;
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
  hasTraveledLastFiveYears: boolean | null;
  travels: TravelDetail[];
  workPermit: string;
  currentAgencyName: string;
  currentJob: string;
  relativesInPoland: boolean | null;
  relatives: RelativeDetail[];

  // New Process - Documents
  passportFile: File | null;

  // Ongoing Process - Personal Information (some overlap with New)
  firstName: string; // Añadido para coincidir con OngoingResidenceProcess
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
  hasTraveledLastFiveYears: null,
  travels: [],
  workPermit: '',
  currentAgencyName: '',
  currentJob: '',
  relativesInPoland: null,
  relatives: [],
  passportFile: null,
  firstName: '', // Añadido para coincidir con OngoingResidenceProcess
  lastName: '',
  hasWorkPermit: null,
  voivodeship: '',
  processStage: '',
  caseNumber: '',
  whatsappNumber: '',
  currentAddress: '',
  yellowCard: null,
};