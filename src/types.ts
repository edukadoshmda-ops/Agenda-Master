export type AppointmentPriority = 'urgente' | 'prioridade' | 'importante' | 'normal';

export type AppointmentCategory =
  | 'cultos'
  | 'visitas'
  | 'casamentos'
  | 'batismos'
  | 'reunioes'
  | 'administracao'
  | 'evangelismo'
  | 'estudos'
  | 'eventos'
  | 'particular';

export interface Appointment {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  description: string;
  priority: AppointmentPriority;
  category: AppointmentCategory;
  audioUrl?: string; // Audio recordings
  attachments?: { name: string; url?: string; type: 'image' | 'document' }[];
  reminderSent?: boolean;
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
  date?: string; // YYYY-MM-DD
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string; // Folder
  updatedAt: string;
  color: string;
  attachments?: { name: string; url?: string; type: 'image' | 'document' }[];
  audioUrl?: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  avatar?: string;
  favorite: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  accentColor: string; // 'gold' | 'royal' | 'emerald' | 'ruby'
  fontFamily: 'sans' | 'serif' | 'display';
  backgroundStyle: 'gradient' | 'pure' | 'mesh';
  pinEnabled: boolean;
  pinCode?: string;
}

export interface Holiday {
  date: string; // MM-DD
  name: string;
  type: 'national' | 'christian';
}
