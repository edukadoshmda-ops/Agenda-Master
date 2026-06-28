import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Church,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  BookOpen,
  Users,
  Settings as SettingsIcon,
  Plus,
  Bell,
  Heart,
  ChevronRight,
  Sparkles,
  Search,
  X,
  Volume2,
  Lock,
  CloudLightning,
  CloudRain,
  RotateCcw,
  Star,
  Check,
  AlertTriangle,
  FolderOpen,
  LogOut,
  Sliders,
  Smartphone,
  BookMarked,
  Layout,
  RefreshCw
} from 'lucide-react';

import {
  Appointment,
  AppointmentCategory,
  AppointmentPriority,
  Contact,
  Note,
  Task,
  AppSettings
} from './types';

// Importing Custom sub-components
import AnalogClock from './components/AnalogClock';
import CalendarSection from './components/CalendarSection';
import DashboardSection from './components/DashboardSection';
import ClockSection from './components/ClockSection';
import SpeechInput from './components/SpeechInput';
import NotesSection from './components/NotesSection';
import ContactsSection from './components/ContactsSection';
import LockScreen from './components/LockScreen';
import WidgetsPanel from './components/WidgetsPanel';

// --- INITIAL REALISTIC PASTOR DATA ---
const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    title: 'Santa Ceia do Senhor',
    date: new Date().toISOString().split('T')[0], // Today
    time: '09:00',
    location: 'Santuário Principal',
    description: 'Celebração mensal da Santa Ceia. Preparar mensagem sobre comunhão.',
    priority: 'urgente',
    category: 'cultos',
  },
  {
    id: 'app-2',
    title: 'Aconselhamento - Casal Silva',
    date: new Date().toISOString().split('T')[0], // Today
    time: '14:30',
    location: 'Gabinete Pastoral',
    description: 'Conversar sobre restauração familiar e orar juntos.',
    priority: 'prioridade',
    category: 'visitas',
  },
  {
    id: 'app-3',
    title: 'Ensaiar Cerimônia de Casamento',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '19:00',
    location: 'Templo Central',
    description: 'Ensaio geral com os noivos Roberto e Mariana.',
    priority: 'importante',
    category: 'casamentos',
  },
  {
    id: 'app-4',
    title: 'Reunião de Presbíteros',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // In 2 days
    time: '20:00',
    location: 'Sala do Conselho',
    description: 'Deliberar sobre cronograma de missões e finanças do templo.',
    priority: 'normal',
    category: 'reunioes',
  },
  {
    id: 'app-5',
    title: 'Batismo nas Águas',
    date: new Date(Date.now() + 259200000).toISOString().split('T')[0], // In 3 days
    time: '10:00',
    location: 'Piscina Batismal - Templo',
    description: 'Cerimônia especial para 15 novos membros integrados.',
    priority: 'prioridade',
    category: 'batismos',
  }
];

const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Esboço: Vivendo pela Graça Abundante',
    content: 'Texto Base: Efésios 2:8-9.\nTópicos principais:\n1. A iniciativa é de Deus.\n2. O presente é gratuito.\n3. O fruto são boas obras preparadas por Deus.\nIlustração: O perdão de uma dívida impossível.',
    category: 'Esboços de Sermão',
    updatedAt: '26/06/2026',
    color: '#b58028'
  },
  {
    id: 'note-2',
    title: 'Anotações da Reunião com Missões',
    content: '1. Apoiar os missionários no Sertão da Bahia.\n2. Arrecadação especial de alimentos em Julho.\n3. Enviar equipe de jovens para impacto evangelístico em Dezembro.',
    category: 'Visitas e Orações',
    updatedAt: '25/06/2026',
    color: '#2c6595'
  }
];

const INITIAL_TASKS: Task[] = [
  { id: 'task-1', title: 'Preparar sermão de Domingo de Manhã', done: false, date: new Date().toISOString().split('T')[0] },
  { id: 'task-2', title: 'Visitar irmã Odete no Hospital Santa Luzia', done: false, date: new Date().toISOString().split('T')[0] },
  { id: 'task-3', title: 'Revisar relatório financeiro ministerial', done: true },
  { id: 'task-4', title: 'Telefonar para missionário Carlos na Bolívia', done: false }
];

const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'con-1',
    name: 'Presbítero Marcondes',
    role: 'Líderes',
    phone: '(11) 99122-3344',
    email: 'marcondes@igreja.org',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    favorite: true
  },
  {
    id: 'con-2',
    name: 'Diaconisa Valéria',
    role: 'Diáconos',
    phone: '(11) 98833-2211',
    email: 'valeria@igreja.org',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    favorite: true
  },
  {
    id: 'con-3',
    name: 'Obreiro Tiago',
    role: 'Obreiros',
    phone: '(11) 97711-4455',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    favorite: false
  },
  {
    id: 'con-4',
    name: 'Irmã Benedita',
    role: 'Membros',
    phone: '(11) 96622-5566',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    favorite: false
  }
];

const DAILY_VERSES = [
  { text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.', book: 'João 3:16' },
  { text: 'Posso todas as coisas naquele que me fortalece.', book: 'Filipenses 4:13' },
  { text: 'O Senhor é o meu pastor; de nada terei falta.', book: 'Salmo 23:1' },
  { text: 'Lancem sobre ele toda a sua ansiedade, porque ele tem cuidado de vocês.', book: '1 Pedro 5:7' },
  { text: 'Buscai, pois, em primeiro lugar, o seu reino e a sua justiça, e todas estas coisas vos serão acrescentadas.', book: 'Mateus 6:33' }
];

export default function App() {
  // --- LOCAL PERSISTENCE LOADER ---
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('pastor_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('pastor_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('pastor_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('pastor_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('pastor_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.theme === 'pink') {
        parsed.theme = 'dark';
      }
      if (parsed.accentColor === 'pink') {
        parsed.accentColor = 'gold';
      }
      return parsed;
    }
    return {
      theme: 'dark',
      accentColor: 'gold',
      fontFamily: 'sans',
      backgroundStyle: 'gradient',
      pinEnabled: true,
      pinCode: '1234'
    };
  });

  const [visibleWidgets, setVisibleWidgets] = useState(() => {
    const saved = localStorage.getItem('pastor_widgets');
    return saved ? JSON.parse(saved) : {
      clock: true,
      nextAppointment: true,
      daySchedule: true,
      pendingTasks: true,
    };
  });

  // Save changes to localStorage on any state modification
  useEffect(() => {
    localStorage.setItem('pastor_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('pastor_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('pastor_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pastor_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('pastor_settings', JSON.stringify(settings));
    // Apply body theme class
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#0b1420';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#fbf7eb';
    }
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('pastor_widgets', JSON.stringify(visibleWidgets));
  }, [visibleWidgets]);

  // --- STATE AND VIEWS CONFIG ---
  const [activeTab, setActiveTab] = useState<'home' | 'agenda' | 'calendar' | 'dashboard' | 'notes' | 'contacts' | 'settings'>('home');
  const [isLocked, setIsLocked] = useState(settings.pinEnabled);
  const [verseIndex, setVerseIndex] = useState(0);

  // Live ticking time for home tab digital clock
  const [liveTime, setLiveTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // In-app Push Notification Simulator
  const [notification, setNotification] = useState<{ message: string; sub?: string } | null>(null);

  // Modal for Adding manual appointment
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppTitle, setNewAppTitle] = useState('');
  const [newAppDate, setNewAppDate] = useState('');
  const [newAppTime, setNewAppTime] = useState('');
  const [newAppLoc, setNewAppLoc] = useState('');
  const [newAppDesc, setNewAppDesc] = useState('');
  const [newAppPriority, setNewAppPriority] = useState<AppointmentPriority>('normal');
  const [newAppCat, setNewAppCat] = useState<AppointmentCategory>('particular');

  // Cloud backup sync simulator
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('há 2 minutos');

  // Rotate verses
  useEffect(() => {
    const interval = setInterval(() => {
      setVerseIndex(prev => (prev + 1) % DAILY_VERSES.length);
    }, 15000); // 15 seconds carousel
    return () => clearInterval(interval);
  }, []);

  // Set default date/time when opening add modal
  const openManualAddModal = (prefilledDate?: string) => {
    setNewAppTitle('');
    setNewAppDate(prefilledDate || new Date().toISOString().split('T')[0]);
    setNewAppTime('09:00');
    setNewAppLoc('Igreja');
    setNewAppDesc('');
    setNewAppPriority('normal');
    setNewAppCat('particular');
    setShowAddModal(true);
  };

  const handleAddManualAppointment = () => {
    if (!newAppTitle.trim() || !newAppDate || !newAppTime) {
      triggerNotification('Preencha os campos obrigatórios!', 'Título, Data e Horário.');
      return;
    }

    const newApp: Appointment = {
      id: `app-${Date.now()}`,
      title: newAppTitle,
      date: newAppDate,
      time: newAppTime,
      location: newAppLoc || 'Igreja',
      description: newAppDesc,
      priority: newAppPriority,
      category: newAppCat
    };

    setAppointments(prev => [newApp, ...prev]);
    setShowAddModal(false);
    triggerNotification('Compromisso Adicionado!', `${newApp.title} agendado com sucesso.`);
    
    // Simulate smart notifications configuration sound/vibrate trigger
    simulateNotificationTrigger(newApp);
  };

  const triggerNotification = (msg: string, sub?: string) => {
    setNotification({ message: msg, sub });
    
    // Play subtle audio sound simulation using Web Audio API!
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // high pure chime note
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {}

    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const simulateNotificationTrigger = (app: Appointment) => {
    // Wait 3 seconds, then simulate the instant/smart notification popup sounding and vibrating
    setTimeout(() => {
      triggerNotification(
        `[Lembrete] ${app.title}`,
        `Notificação de 30 minutos configurada para o local: ${app.location}`
      );
    }, 3000);
  };

  // --- DELETE APPOINTMENT ---
  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
    triggerNotification('Compromisso Removido');
  };

  // --- SYNC WITH MOCK CLOUD ---
  const handleCloudSync = () => {
    setIsSyncing(true);
    triggerNotification('Sincronizando Nuvem Premium...', 'Fazendo backup criptografado do ministério.');
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      setLastSyncTime(`há alguns segundos às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`);
      triggerNotification('Sincronização Concluída!', 'Seus dados pastorais estão salvos de forma segura.');
    }, 2500);
  };

  // --- SETTINGS DISPATCHERS ---
  const handleTogglePin = () => {
    setSettings(prev => ({
      ...prev,
      pinEnabled: !prev.pinEnabled
    }));
    triggerNotification(
      !settings.pinEnabled ? 'Proteção por PIN Ativada' : 'Proteção por PIN Desativada',
      'Configurações de segurança atualizadas.'
    );
  };

  const handleSetPinCode = (code: string) => {
    if (code.length !== 4 || isNaN(Number(code))) {
      triggerNotification('Código PIN inválido!', 'Deve possuir exatamente 4 números.');
      return;
    }
    setSettings(prev => ({
      ...prev,
      pinCode: code
    }));
    triggerNotification('Novo Código PIN Salvo', `Seu PIN de segurança agora é: ${code}`);
  };

  const handleAccentChange = (color: string) => {
    setSettings(prev => ({ ...prev, accentColor: color }));
    triggerNotification('Aparência Atualizada', `Nova paleta de cores ministerial aplicada.`);
  };

  const handleFontChange = (font: 'sans' | 'serif' | 'display') => {
    setSettings(prev => ({ ...prev, fontFamily: font }));
  };

  const handleBackgroundChange = (style: 'gradient' | 'pure' | 'mesh') => {
    setSettings(prev => ({ ...prev, backgroundStyle: style }));
  };

  // --- ACCENT CLASSIFIER ---
  const getAccentColorClass = () => {
    switch (settings.accentColor) {
      case 'royal': return {
        accentColor: 'royal',
        text: 'text-[#4982b1]',
        bg: 'bg-[#4982b1]',
        fromTo: 'from-[#4982b1] to-[#3a688e]',
        border: 'border-[#4982b1]/20',
        ring: 'ring-[#4982b1]/30',
        hoverText: 'hover:text-[#4982b1]/80',
        tabActiveBg: 'bg-gradient-to-r from-[#4982b1]/25 to-[#4982b1]/10 border border-[#4982b1]/30 text-[#4982b1] font-bold scale-105',
        glow: 'shadow-[#4982b1]/20',
        btnBg: 'from-[#4982b1] to-[#3a688e] hover:from-sky-300 hover:to-sky-500 text-white'
      };
      case 'emerald': return {
        accentColor: 'emerald',
        text: 'text-emerald-400',
        bg: 'bg-emerald-500',
        fromTo: 'from-emerald-400 to-emerald-600',
        border: 'border-emerald-500/20',
        ring: 'ring-emerald-400/30',
        hoverText: 'hover:text-emerald-400/80',
        tabActiveBg: 'bg-gradient-to-r from-emerald-500/25 to-emerald-600/10 border border-emerald-500/30 text-emerald-400 font-bold scale-105',
        glow: 'shadow-emerald-500/20',
        btnBg: 'from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-navy-950'
      };
      case 'ruby': return {
        accentColor: 'ruby',
        text: 'text-rose-400',
        bg: 'bg-rose-500',
        fromTo: 'from-rose-400 to-rose-600',
        border: 'border-rose-500/20',
        ring: 'ring-rose-400/30',
        hoverText: 'hover:text-rose-400/80',
        tabActiveBg: 'bg-gradient-to-r from-rose-500/25 to-rose-600/10 border border-rose-500/30 text-rose-400 font-bold scale-105',
        glow: 'shadow-rose-500/20',
        btnBg: 'from-rose-400 to-rose-600 hover:from-rose-300 hover:to-rose-500 text-white'
      };
      default: // gold
        return {
          accentColor: 'gold',
          text: 'text-gold-400',
          bg: 'bg-gold-500',
          fromTo: 'from-gold-400 to-gold-600',
          border: 'border-gold-500/20',
          ring: 'ring-gold-400/30',
          hoverText: 'hover:text-gold-400/80',
          tabActiveBg: 'bg-gradient-to-r from-gold-500/25 to-gold-600/10 border border-gold-500/30 text-gold-400 font-bold scale-105',
          glow: 'shadow-gold-500/20',
          btnBg: 'from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 text-navy-950'
        };
    }
  };

  const colorsTheme = getAccentColorClass();

  // --- FONT WRAPPER CLASS ---
  const getFontFamilyClass = () => {
    switch (settings.fontFamily) {
      case 'serif': return 'font-serif';
      case 'display': return 'font-display';
      default: return 'font-sans';
    }
  };

  const priorityBadgeColor = (p: AppointmentPriority) => {
    switch (p) {
      case 'urgente': return 'bg-red-500 text-white';
      case 'prioridade': return 'bg-orange-500 text-white';
      case 'importante': return 'bg-green-500 text-white';
      default: return 'bg-gray-400 text-navy-950';
    }
  };

  // Compute Home Page indicators
  const todayStr = new Date().toISOString().split('T')[0];
  const todayApps = appointments.filter(a => a.date === todayStr);
  const urgentApps = appointments.filter(a => a.priority === 'urgente');
  const nextApp = appointments
    .filter(a => a.date >= todayStr)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))[0];

  return (
    <div className={`min-h-screen flex flex-col justify-between ${getFontFamilyClass()} ${
      settings.theme === 'dark'
        ? settings.backgroundStyle === 'pure'
          ? 'bg-black text-white'
          : 'bg-gradient-to-b from-navy-950 via-navy-900 to-black text-white'
        : 'bg-[#fbf7eb] text-navy-950'
    } transition-colors duration-500`}>
      
      {/* 1. LOCKSCREEN OVERLAY */}
      {isLocked && settings.pinEnabled && (
        <LockScreen
          correctPin={settings.pinCode || '1234'}
          onUnlocked={() => {
            setIsLocked(false);
            triggerNotification('Ministério Desbloqueado', 'Bem-vindo de volta, Pastor Daniel.');
          }}
          theme={settings.theme}
        />
      )}

      {/* 2. LIVE SMART NOTIFICATION TOAST POPUP */}
      <AnimatePresence>
        {notification && (
          <motion.div
            id="notification-toast"
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[10000] max-w-sm w-11/12 p-4 rounded-2xl flex items-start gap-3 shadow-2xl border ${
              settings.theme === 'dark'
                ? 'bg-navy-900/95 border-gold-500/25 text-white'
                : 'bg-white border-gold-300 text-navy-950'
            }`}
          >
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500 animate-pulse">
              <Bell size={18} />
            </div>
            <div className="flex-1 space-y-0.5">
              <h4 className="text-xs font-bold">{notification.message}</h4>
              {notification.sub && (
                <p className="text-[10px] text-gray-400 font-medium">{notification.sub}</p>
              )}
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 rounded text-gray-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. APPLICATION HEADER BAR */}
      <header className={`px-4 sm:px-6 py-4 flex justify-between items-center border-b transition-colors duration-300 ${
        settings.theme === 'dark' ? 'border-gold-500/10 bg-navy-950/40 backdrop-blur' : 'border-gray-200/60 bg-white/60 backdrop-blur'
      }`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 shadow-md">
              <Church size={20} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-navy-950" />
          </div>
          <div>
            <h1 className="text-sm font-bold font-display tracking-tight gold-gradient-text uppercase">Pastor Pro</h1>
            <p className="text-[9px] uppercase tracking-widest font-semibold text-gray-400">Premium Suite</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Cloud Sync Status Indicator button */}
          <button
            id="cloud-sync-header-btn"
            onClick={handleCloudSync}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
              isSyncing
                ? 'bg-gold-500/10 text-gold-400 animate-pulse'
                : settings.theme === 'dark'
                ? 'bg-navy-900 text-gold-400 hover:bg-navy-800'
                : 'bg-gold-50 text-gold-700 hover:bg-gold-100'
            }`}
          >
            <RefreshCw size={10} className={isSyncing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Nuvem</span>
          </button>

          {/* Alarm reminder bell */}
          <button
            id="alarm-trigger-demo-btn"
            onClick={() => triggerNotification('Lembretes Sincronizados', 'Lembretes de 1 dia, 2h e 30m ativos.')}
            className={`p-2.5 rounded-xl transition-all relative ${
              settings.theme === 'dark' ? 'bg-navy-900 hover:bg-navy-800 text-gold-400' : 'bg-gray-100 hover:bg-gray-200 text-navy-900'
            }`}
          >
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </button>

          {/* User profile avatar info summary */}
          <div className="flex items-center gap-2">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
              alt="Pastor Daniel"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-xl object-cover border-2 border-gold-500"
            />
            <div className="hidden md:block text-left">
              <h3 className={`text-xs font-bold leading-none ${settings.theme === 'dark' ? 'text-white' : 'text-navy-950'}`}>Pr. Daniel</h3>
              <span className="text-[9px] text-gold-500 font-semibold uppercase">Templo Sede</span>
            </div>
          </div>
        </div>
      </header>

      {/* 4. MAIN CENTRAL CONTENT SCROLLABLE CANVAS */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        <AnimatePresence mode="wait">
          {/* --- VIEW 1. HOME SCREEN (TELA INICIAL) --- */}
          {activeTab === 'home' && (
            <motion.div
              key="home-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-0 -mt-6 -mx-4 sm:-mx-6"
            >
              {/* Divine Header Banner (Inspired by Image 4 & Image 1) */}
              <div className="relative overflow-hidden bg-gradient-to-b from-[#0b1420] via-[#0f1d2e] to-[#0b1420] text-white pt-10 pb-12 px-6 border-b border-gold-500/10">
                {/* Glowing effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
                
                {/* SVG Glowing cross in center */}
                <div className="flex justify-center mb-4">
                  <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-[0_0_15px_rgba(181,128,40,0.6)] animate-float">
                    <defs>
                      <radialGradient id="cross-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ebd6a3" stopOpacity="0.8"/>
                        <stop offset="50%" stopColor="#b58028" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#0b1420" stopOpacity="0"/>
                      </radialGradient>
                      <linearGradient id="cross-goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f5ebd1" />
                        <stop offset="50%" stopColor="#b58028" />
                        <stop offset="100%" stopColor="#7d4d19" />
                      </linearGradient>
                    </defs>
                    <circle cx="50%" cy="50%" r="45%" fill="url(#cross-glow)" />
                    {/* Cross rays */}
                    <g stroke="#ebd6a3" strokeWidth="0.4" opacity="0.3" strokeDasharray="1,2">
                      <line x1="50" y1="5" x2="50" y2="95" strokeWidth="0.8" />
                      <line x1="5" y1="50" x2="95" y2="50" strokeWidth="0.8" />
                      <line x1="15" y1="15" x2="85" y2="85" />
                      <line x1="85" y1="15" x2="15" y2="85" />
                    </g>
                    {/* Fine elegant cross */}
                    <path d="M48.5 20 h3 v18 h12 v3 h-12 v27 h-3 v-27 h-12 v-3 h12 z" fill="url(#cross-goldGrad)" stroke="#ebd6a3" strokeWidth="0.7" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Greeting & digital clock */}
                <div className="text-center space-y-2 relative z-10">
                  <p className="text-[10px] font-display font-extrabold uppercase tracking-[0.25em] text-gold-400">Pastor Pro Premium</p>
                  
                  {settings.theme === 'dark' ? (
                    <h2 className="text-2xl sm:text-3xl font-serif text-[#ebd6a3] tracking-wide leading-tight">
                      Graça e Paz, Pastor Daniel
                    </h2>
                  ) : (
                    <h2 className="text-2xl sm:text-3xl font-serif italic text-[#ebd6a3] tracking-wide leading-tight">
                      A paz do Senhor, Pr. Daniel
                    </h2>
                  )}
                  
                  {/* Big digital clock in center */}
                  <div className="pt-2 select-none pointer-events-none">
                    <span className="text-4xl sm:text-5xl font-mono font-extrabold tracking-widest text-[#ebd6a3] drop-shadow-[0_2px_8px_rgba(181,128,40,0.4)]">
                      {liveTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <p className="text-xs text-gray-300 font-semibold tracking-wider uppercase mt-1">
                      {liveTime.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sliding curved container (Slated Sheet sliding up, like in Image 4) */}
              <div className={`rounded-t-[32px] -mt-6 px-4 sm:px-6 py-8 space-y-6 relative z-20 shadow-inner border-t border-gold-500/10 ${
                settings.theme === 'dark'
                  ? 'bg-navy-950/80 backdrop-blur-xl text-white'
                  : 'bg-[#fbf7eb] text-navy-950'
              }`}>
                
                {/* LIVE ANALOG CLOCK & VERSE OF THE DAY ROW */}
                {visibleWidgets.clock && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {/* Analog clock widget */}
                    <div className={`p-5 rounded-3xl ${settings.theme === 'dark' ? 'glass-premium-dark' : 'bg-white border border-gold-200/50 shadow-md'} flex flex-col justify-center items-center gap-4`}>
                      <AnalogClock size={160} theme={settings.theme} />
                      <div className="text-center">
                        <h4 className="text-[10px] uppercase font-bold text-gold-500 tracking-wider">Cronologia Pastoral</h4>
                        <p className="text-xs text-gray-400">Acompanhamento preciso para sermões e reuniões</p>
                      </div>
                    </div>

                    {/* CAROUSEL GLASSMORPHIC VERSE OF THE DAY CARD with controls (Image 1 and Image 4) */}
                    <div className={`p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between ${
                      settings.theme === 'dark'
                        ? 'bg-gradient-to-br from-[#0c1624] via-[#0f1f33] to-[#0c1624] border-2 border-gold-500/35 shadow-[0_0_25px_rgba(181,128,40,0.15)]'
                        : 'bg-white border border-gold-200 shadow-md'
                    } shadow-xl`}>
                      
                      {/* Gold Accent corner sweep design for Dark mode (Image 1) */}
                      {settings.theme === 'dark' && (
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-gold-500/25 to-transparent rounded-tl-full border-t border-l border-gold-500/20 pointer-events-none" />
                      )}

                      {/* Gold ribbon star indicator badge for Light mode (Image 4) */}
                      {settings.theme === 'light' && (
                        <div className="absolute top-0 right-6 w-8 h-10 bg-gradient-to-b from-gold-400 to-gold-600 rounded-b-md flex items-center justify-center text-white shadow-md">
                          <Star size={14} fill="currentColor" />
                        </div>
                      )}

                      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-extrabold text-gold-500 uppercase tracking-widest flex items-center gap-1.5">
                          <BookMarked size={14} />
                          Verse of the Day
                        </span>
                        
                        {/* Bullet indicators */}
                        <div className="flex gap-1.5 mr-8 sm:mr-0">
                          {DAILY_VERSES.map((_, idx) => (
                            <span
                              key={idx}
                              onClick={() => setVerseIndex(idx)}
                              className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${
                                idx === verseIndex 
                                  ? 'bg-gold-500 w-3' 
                                  : settings.theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Content of verse inside quotes */}
                      <div className="flex-1 flex flex-col justify-center py-2 relative">
                        {/* Open bible watermarked layout overlay in bottom right corner for Light mode (Image 4) */}
                        {settings.theme === 'light' && (
                          <div className="absolute bottom-0 right-0 opacity-15 pointer-events-none">
                            <svg className="w-24 h-16 text-gold-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          </div>
                        )}

                        <p className={`text-base sm:text-lg font-serif font-bold leading-relaxed tracking-wide ${
                          settings.theme === 'dark' ? 'text-white' : 'text-navy-950'
                        }`}>
                          "{DAILY_VERSES[verseIndex].text}"
                        </p>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center z-10">
                        <span className="text-xs font-bold text-gold-500">— {DAILY_VERSES[verseIndex].book}</span>
                        <div className="flex gap-2">
                          <button
                            id="prev-verse-btn"
                            onClick={() => setVerseIndex(prev => (prev - 1 + DAILY_VERSES.length) % DAILY_VERSES.length)}
                            className={`p-1.5 rounded-full border text-gray-400 hover:text-gold-500 transition-all cursor-pointer ${
                              settings.theme === 'dark' ? 'border-gold-500/20 hover:bg-gold-500/10' : 'border-gray-200 hover:bg-gold-50/50 shadow-sm'
                            }`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                          </button>
                          <button
                            id="next-verse-btn"
                            onClick={() => setVerseIndex(prev => (prev + 1) % DAILY_VERSES.length)}
                            className={`p-1.5 rounded-full border text-gray-400 hover:text-gold-500 transition-all cursor-pointer ${
                              settings.theme === 'dark' ? 'border-gold-500/20 hover:bg-gold-500/10' : 'border-gray-200 hover:bg-gold-50/50 shadow-sm'
                            }`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* URGENT COMPROMISSOS HIGHLIGHT ROW */}
                {urgentApps.length > 0 && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-between gap-3 animate-pulse">
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle size={18} />
                      <div className="text-xs">
                        <span className="font-bold">URGENTE:</span> Você possui {urgentApps.length} compromisso(s) urgente(s) agendado(s)!
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('agenda')}
                      className="text-[10px] uppercase font-bold underline cursor-pointer"
                    >
                      Ver Tudo
                    </button>
                  </div>
                )}

                {/* NEXT APPOINTMENT WIDGET CONTAINER */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visibleWidgets.nextAppointment && (
                    <div className={`p-5 rounded-3xl ${settings.theme === 'dark' ? 'glass-premium-dark' : 'bg-white border border-gold-200/50 shadow-md'} shadow-xl flex flex-col justify-between`}>
                      <div>
                        <h3 className={`font-display font-bold text-sm mb-3 flex items-center gap-1.5 ${settings.theme === 'dark' ? 'text-white' : 'text-navy-950'}`}>
                          <Sparkles size={14} className="text-gold-500" />
                          Próximo Compromisso
                        </h3>
                        {nextApp ? (
                          <div className="space-y-2">
                            <h4 className="text-sm font-bold text-gold-500">{nextApp.title}</h4>
                            <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-400">
                              <div><span className="font-bold uppercase text-[9px] block">Data</span> {new Date(nextApp.date + 'T00:00:00').toLocaleDateString('pt-BR')}</div>
                              <div><span className="font-bold uppercase text-[9px] block">Horário</span> {nextApp.time}</div>
                              <div className="col-span-2"><span className="font-bold uppercase text-[9px] block">Local</span> {nextApp.location}</div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400">Nenhum compromisso futuro agendado.</p>
                        )}
                      </div>
                      <button
                        onClick={() => setActiveTab('agenda')}
                        className={`w-full py-2.5 mt-4 rounded-xl text-xs font-semibold text-center border transition-all ${
                          settings.theme === 'dark'
                            ? 'bg-navy-900 border-gold-500/10 text-gold-400 hover:bg-navy-800'
                            : 'bg-gold-50 text-gold-700'
                        }`}
                      >
                        Acessar Agenda Completa
                      </button>
                    </div>
                  )}

                  {/* TODAY SCHEDULE TIMELINE WIDGET */}
                  {visibleWidgets.daySchedule && (
                    <div className={`p-5 rounded-3xl ${settings.theme === 'dark' ? 'glass-premium-dark' : 'bg-white border border-gold-200/50 shadow-md'} shadow-xl flex flex-col justify-between`}>
                      <div>
                        <h3 className={`font-display font-bold text-sm mb-3 flex items-center justify-between ${settings.theme === 'dark' ? 'text-white' : 'text-navy-950'}`}>
                          <span>Agenda de Hoje</span>
                          <span className="text-[10px] bg-gold-500/10 text-gold-500 px-2 py-0.5 rounded-full">{todayApps.length} Eventos</span>
                        </h3>
                        {todayApps.length > 0 ? (
                          <div className="space-y-2.5 max-h-40 overflow-y-auto">
                            {todayApps.map(app => (
                              <div key={app.id} className="flex gap-2.5 items-center text-xs pb-2 border-b border-gold-500/5 last:border-0 last:pb-0">
                                <span className={`w-2.5 h-2.5 rounded-full ${app.priority === 'urgente' ? 'bg-red-500' : 'bg-gold-500'}`} />
                                <div className="flex-1">
                                  <p className={`font-semibold ${settings.theme === 'dark' ? 'text-white' : 'text-navy-950'}`}>{app.title}</p>
                                  <p className="text-[10px] text-gray-400">{app.time} • {app.location}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 py-6">Sua agenda ministerial está livre hoje.</p>
                        )}
                      </div>
                      <button
                        id="home-create-event-btn"
                        onClick={() => openManualAddModal()}
                        className="w-full py-2.5 mt-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 font-bold text-xs hover:from-gold-300 hover:to-gold-500 transition-colors flex items-center justify-center gap-1 shadow-md shadow-gold-500/10"
                      >
                        <Plus size={14} />
                        Novo Compromisso
                      </button>
                    </div>
                  )}
                </div>

                {/* INTEGRATED SPEECH INPUT DIRECTLY ON HOME TAB FOR FAST CAPTURING */}
                <SpeechInput
                  onAddParsedAppointment={(parsed) => {
                    const newApp: Appointment = {
                      id: `app-${Date.now()}`,
                      title: parsed.title || 'Compromisso por Comando Inteligente',
                      date: parsed.date || new Date().toISOString().split('T')[0],
                      time: parsed.time || '09:00',
                      location: parsed.location || 'Igreja',
                      description: parsed.description || 'Criado via assistente inteligente',
                      priority: parsed.priority || 'normal',
                      category: parsed.category || 'particular'
                    };
                    setAppointments(prev => [newApp, ...prev]);
                    triggerNotification('Agendado por IA!', `${newApp.title} agendado.`);
                    simulateNotificationTrigger(newApp);
                  }}
                  theme={settings.theme}
                  accentColor={settings.accentColor}
                />
              </div>
            </motion.div>
          )}

          {/* --- VIEW 2. FULL AGENDA & VOICE ASSISTANT TAB --- */}
          {activeTab === 'agenda' && (
            <motion.div
              key="agenda-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 animate-fadeIn"
            >
              <div className="flex justify-between items-center gap-3 border-b border-gold-500/10 pb-3">
                <div>
                  <h2 className="text-lg font-bold font-display gold-gradient-text uppercase">Agenda Ministerial</h2>
                  <p className="text-xs text-gray-400">Gerencie todos os seus cultos, visitas e cerimônias religiosas.</p>
                </div>
                <button
                  id="agenda-add-appointment-btn"
                  onClick={() => openManualAddModal()}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                    settings.theme === 'dark' ? 'bg-gold-500 text-navy-950 hover:bg-gold-400' : 'bg-navy-800 text-white'
                  }`}
                >
                  <Plus size={14} />
                  Criar Novo
                </button>
              </div>

              {/* List of ALL agenda appointments */}
              {appointments.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  Sua agenda ministerial está completamente vazia. Adicione novos compromissos!
                </div>
              ) : (
                <div className="space-y-3.5">
                  {appointments.map(app => (
                    <div
                      key={app.id}
                      className={`p-4 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 ${
                        settings.theme === 'dark'
                          ? 'bg-navy-900/40 border-gold-500/10 hover:border-gold-500/30'
                          : 'bg-white border-gray-100 hover:border-gold-300 shadow-sm'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${app.priority === 'urgente' ? 'bg-red-500 animate-pulse' : app.priority === 'prioridade' ? 'bg-orange-500' : app.priority === 'importante' ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <h4 className={`text-sm font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-navy-900'}`}>{app.title}</h4>
                          <span className={`text-[8px] uppercase font-bold px-2 py-0.5 rounded-md ${priorityBadgeColor(app.priority)}`}>
                            {app.priority}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-xl">{app.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5 text-[11px] text-gray-400">
                          <span className="font-semibold text-gold-500">Local: {app.location}</span>
                          <span>Data: {new Date(app.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                          <span>Hora: {app.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full ${
                          settings.theme === 'dark' ? 'bg-navy-800 text-gold-400' : 'bg-gold-50 text-gold-700'
                        }`}>
                          {app.category}
                        </span>
                        <button
                          id={`delete-app-${app.id}`}
                          onClick={() => handleDeleteAppointment(app.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* --- VIEW 3. INTERACTIVE CALENDAR TAB --- */}
          {activeTab === 'calendar' && (
            <motion.div
              key="calendar-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <CalendarSection
                appointments={appointments}
                onAddAppointment={(date) => openManualAddModal(date)}
                onSelectAppointment={(app) => {
                  triggerNotification('Detalhes do Compromisso', `${app.title} - ${app.time} no local ${app.location}`);
                }}
                theme={settings.theme}
              />
            </motion.div>
          )}

          {/* --- VIEW 4. DASHBOARD & ANALYTICS TAB --- */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <DashboardSection appointments={appointments} theme={settings.theme} accentColor={settings.accentColor} />
            </motion.div>
          )}

          {/* --- VIEW 5. NOTES AND TASKS CHECKLISTS TAB --- */}
          {activeTab === 'notes' && (
            <motion.div
              key="notes-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <NotesSection
                notes={notes}
                onAddNote={(note) => {
                  const newNote: Note = {
                    id: `note-${Date.now()}`,
                    title: note.title,
                    content: note.content,
                    category: note.category,
                    color: note.color,
                    attachments: note.attachments,
                    audioUrl: note.audioUrl,
                    updatedAt: new Date().toLocaleDateString('pt-BR')
                  };
                  setNotes(prev => [newNote, ...prev]);
                  triggerNotification('Anotação Salva!', `Salva na pasta: ${newNote.category}`);
                }}
                onDeleteNote={(id) => {
                  setNotes(prev => prev.filter(n => n.id !== id));
                  triggerNotification('Anotação Deletada');
                }}
                tasks={tasks}
                onAddTask={(title, date) => {
                  const newTask: Task = {
                    id: `task-${Date.now()}`,
                    title,
                    done: false,
                    date
                  };
                  setTasks(prev => [newTask, ...prev]);
                  triggerNotification('Tarefa Criada!', title);
                }}
                onToggleTask={(id) => {
                  setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
                }}
                onDeleteTask={(id) => {
                  setTasks(prev => prev.filter(t => t.id !== id));
                  triggerNotification('Tarefa Removida');
                }}
                theme={settings.theme}
              />
            </motion.div>
          )}

          {/* --- VIEW 6. CONTACTS & CHURCH MEMBERS TAB --- */}
          {activeTab === 'contacts' && (
            <motion.div
              key="contacts-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <ContactsSection
                contacts={contacts}
                onToggleFavorite={(id) => {
                  setContacts(prev => prev.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c));
                  triggerNotification('Favoritos Atualizados');
                }}
                onAddContact={(con) => {
                  const newCon: Contact = {
                    id: `con-${Date.now()}`,
                    name: con.name,
                    role: con.role,
                    phone: con.phone,
                    email: con.email,
                    avatar: con.avatar,
                    favorite: false
                  };
                  setContacts(prev => [newCon, ...prev]);
                  triggerNotification('Membro Cadastrado!', `${newCon.name} adicionado com sucesso.`);
                }}
                onDeleteContact={(id) => {
                  setContacts(prev => prev.filter(c => c.id !== id));
                  triggerNotification('Membro Removido');
                }}
                theme={settings.theme}
              />
            </motion.div>
          )}

          {/* --- VIEW 7. CUSTOMIZATION & SETTINGS TAB --- */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 animate-fadeIn"
            >
              {/* Theme toggles */}
              <div className={`p-5 rounded-3xl ${settings.theme === 'dark' ? 'glass-premium-dark' : 'glass-premium-light'} shadow-xl space-y-4`}>
                <h3 className={`font-display font-bold text-sm border-b border-gold-500/10 pb-2.5 ${settings.theme === 'dark' ? 'text-white' : 'text-navy-950'}`}>
                  Customização & Tema Visual
                </h3>

                {/* Light vs Dark modes */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Tema de Cores</span>
                  <div className="flex gap-2">
                    <button
                      id="theme-switch-light"
                      onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        settings.theme === 'light'
                          ? 'bg-navy-800 text-white shadow-md'
                          : 'bg-navy-900/20 text-gray-400 hover:text-white'
                      }`}
                    >
                      Claro
                    </button>
                    <button
                      id="theme-switch-dark"
                      onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        settings.theme === 'dark'
                          ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 shadow-md font-bold'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      Escuro Premium
                    </button>
                  </div>
                </div>

                {/* Accent selection */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold block">Paleta de Destaque</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { name: 'gold', label: 'Dourado Imperial', color: '#b58028' },
                      { name: 'royal', label: 'Azul Real', color: '#4982b1' },
                      { name: 'emerald', label: 'Verde Esmeralda', color: '#10b981' },
                      { name: 'ruby', label: 'Vermelho Rubi', color: '#f43f5e' }
                    ].map(ac => (
                      <button
                        key={ac.name}
                        onClick={() => handleAccentChange(ac.name)}
                        className={`w-full px-3 py-2 rounded-xl text-[10px] font-bold border transition-all flex items-center justify-center gap-1.5 ${
                          settings.accentColor === ac.name
                            ? 'bg-white text-navy-950 border-white scale-105 shadow-md'
                            : 'bg-navy-900/40 text-gray-300 border-transparent'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: ac.color }} />
                        <span className="truncate">{ac.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fonts toggling selection */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold block">Tipografia Pastoral</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'sans' as const, label: 'Moderna (Inter)' },
                      { name: 'serif' as const, label: 'Editorial (Playfair)' },
                      { name: 'display' as const, label: 'Tecnológica (Space)' }
                    ].map(font => (
                      <button
                        key={font.name}
                        onClick={() => handleFontChange(font.name)}
                        className={`px-3.5 py-2 rounded-xl text-[10px] font-semibold transition-all ${
                          settings.fontFamily === font.name
                            ? 'bg-gold-500 text-navy-950 font-bold'
                            : 'bg-navy-900/20 text-gray-400'
                        }`}
                      >
                        {font.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Backround texture selections */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold block">Estilo do Plano de Fundo</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'gradient' as const, label: 'Gradiente Suave' },
                      { name: 'mesh' as const, label: 'Profundo Mesh' },
                      { name: 'pure' as const, label: 'Escuro Puro' }
                    ].map(bg => (
                      <button
                        key={bg.name}
                        onClick={() => handleBackgroundChange(bg.name)}
                        className={`px-3.5 py-2 rounded-xl text-[10px] font-semibold transition-all ${
                          settings.backgroundStyle === bg.name
                            ? 'bg-gold-500 text-navy-950 font-bold'
                            : 'bg-navy-900/20 text-gray-400'
                        }`}
                      >
                        {bg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Security section (PIN settings) */}
              <div className={`p-5 rounded-3xl ${settings.theme === 'dark' ? 'glass-premium-dark' : 'glass-premium-light'} shadow-xl space-y-4`}>
                <h3 className={`font-display font-bold text-sm border-b border-gold-500/10 pb-2.5 ${settings.theme === 'dark' ? 'text-white' : 'text-navy-950'}`}>
                  Segurança & Privacidade
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold">Bloqueio por Senha (PIN)</h4>
                    <p className="text-[10px] text-gray-400">Exige senha de 4 dígitos para carregar os dados pastorais</p>
                  </div>
                  <button
                    id="toggle-pin-protection"
                    onClick={handleTogglePin}
                    className={`w-12 h-6.5 rounded-full p-1 transition-all duration-300 ${
                      settings.pinEnabled ? 'bg-gold-500' : 'bg-gray-400'
                    }`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-full bg-navy-950 transition-all ${
                      settings.pinEnabled ? 'translate-x-5.5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {settings.pinEnabled && (
                  <div className="space-y-3 pt-2">
                    <label className="text-[10px] text-gray-400 uppercase font-bold block">Novo Código PIN de 4 Dígitos</label>
                    <div className="flex gap-2">
                      <input
                        id="new-pin-input"
                        type="password"
                        maxLength={4}
                        placeholder="Ex: 5820"
                        className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest text-center w-28 focus:outline-none ${
                          settings.theme === 'dark' ? 'bg-navy-950 text-white border' : 'bg-gray-50 text-navy-950 border'
                        }`}
                        onChange={(e) => {
                          if (e.target.value.length === 4) {
                            handleSetPinCode(e.target.value);
                          }
                        }}
                      />
                      <span className="text-[10px] text-gray-400 font-semibold self-center">Insira 4 números para redefinir instantaneamente.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* WIDGET CUSTOMIZATION CARDS INTEGRATED */}
              <WidgetsPanel
                visibleWidgets={visibleWidgets}
                onToggleWidget={(key) => {
                  setVisibleWidgets(prev => ({
                    ...prev,
                    [key]: !prev[key]
                  }));
                  triggerNotification('Widget Atualizado!', 'Visualização alterada com sucesso.');
                }}
                theme={settings.theme}
              />

              {/* Cloud Sync backup trigger card */}
              <div className={`p-5 rounded-3xl ${settings.theme === 'dark' ? 'glass-premium-dark' : 'glass-premium-light'} shadow-xl space-y-4`}>
                <h3 className={`font-display font-bold text-sm border-b border-gold-500/10 pb-2.5 ${settings.theme === 'dark' ? 'text-white' : 'text-navy-950'}`}>
                  Nuvem & Backup Ministerial
                </h3>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold">Backup Automático Ativo</h4>
                    <p className="text-[10px] text-gray-400">Última sincronização completa: {lastSyncTime}</p>
                  </div>
                  <button
                    id="sync-now-btn"
                    onClick={handleCloudSync}
                    disabled={isSyncing}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSyncing
                        ? 'opacity-50 cursor-not-allowed'
                        : settings.theme === 'dark'
                        ? 'bg-gold-500 text-navy-950 hover:bg-gold-400'
                        : 'bg-navy-800 text-white hover:bg-navy-950'
                    }`}
                  >
                    {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 5. FLOATING COMPROMISSO MANUAL ADD MODAL OVERLAY */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            id="add-appointment-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className={`max-w-md w-full p-6 rounded-3xl space-y-4 shadow-2xl relative border ${
                settings.theme === 'dark' ? 'bg-navy-900 border-gold-500/20 text-white' : 'bg-white border-gold-300 text-navy-950'
              }`}
            >
              {/* Close Button */}
              <button
                id="close-add-modal-btn"
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-500/10 transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 border-b border-gold-500/10 pb-3">
                <Plus className="text-gold-500 animate-spin" size={20} />
                <h3 className="font-display font-bold text-base gold-gradient-text">Agendar Novo Compromisso</h3>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold">Título do Compromisso *</label>
                  <input
                    id="modal-new-title"
                    type="text"
                    required
                    placeholder="Ex: Culto de Jovens, Visita ao Hospital, etc..."
                    value={newAppTitle}
                    onChange={(e) => setNewAppTitle(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl focus:outline-none ${
                      settings.theme === 'dark' ? 'bg-navy-950 border border-gold-500/10 text-white' : 'bg-gray-50 border text-navy-950'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold">Data *</label>
                    <input
                      id="modal-new-date"
                      type="date"
                      required
                      value={newAppDate}
                      onChange={(e) => setNewAppDate(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl focus:outline-none ${
                        settings.theme === 'dark' ? 'bg-navy-950 border text-gold-400' : 'bg-gray-50 border text-navy-950'
                      }`}
                    />
                  </div>

                  {/* Time */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold">Horário *</label>
                    <input
                      id="modal-new-time"
                      type="time"
                      required
                      value={newAppTime}
                      onChange={(e) => setNewAppTime(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl focus:outline-none ${
                        settings.theme === 'dark' ? 'bg-navy-950 border text-gold-400' : 'bg-gray-50 border text-navy-950'
                      }`}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold">Localização</label>
                  <input
                    id="modal-new-loc"
                    type="text"
                    placeholder="Ex: Templo Sede, Hospital Santa Cecília..."
                    value={newAppLoc}
                    onChange={(e) => setNewAppLoc(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl focus:outline-none ${
                      settings.theme === 'dark' ? 'bg-navy-950 border text-white' : 'bg-gray-50 border text-navy-950'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Priority selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold">Prioridade</label>
                    <select
                      id="modal-new-priority"
                      value={newAppPriority}
                      onChange={(e) => setNewAppPriority(e.target.value as AppointmentPriority)}
                      className={`w-full px-3 py-2.5 rounded-xl focus:outline-none font-semibold ${
                        settings.theme === 'dark' ? 'bg-navy-950 border text-gold-400' : 'bg-gray-50 border text-navy-950'
                      }`}
                    >
                      <option value="normal">⚪ Normal</option>
                      <option value="importante">🟢 Importante</option>
                      <option value="prioridade">🟠 Prioridade</option>
                      <option value="urgente">🔴 Urgente</option>
                    </select>
                  </div>

                  {/* Category selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 uppercase font-bold">Categoria</label>
                    <select
                      id="modal-new-cat"
                      value={newAppCat}
                      onChange={(e) => setNewAppCat(e.target.value as AppointmentCategory)}
                      className={`w-full px-3 py-2.5 rounded-xl focus:outline-none font-semibold ${
                        settings.theme === 'dark' ? 'bg-navy-950 border text-gold-400' : 'bg-gray-50 border text-navy-950'
                      }`}
                    >
                      <option value="cultos">Cultos</option>
                      <option value="visitas">Visitas</option>
                      <option value="casamentos">Casamentos</option>
                      <option value="batismos">Batismos</option>
                      <option value="reunioes">Reuniões</option>
                      <option value="administracao">Administração</option>
                      <option value="evangelismo">Evangelismo</option>
                      <option value="estudos">Estudos Bíblicos</option>
                      <option value="eventos">Eventos</option>
                      <option value="particular">Particular</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold">Anotações / Descrição</label>
                  <textarea
                    id="modal-new-desc"
                    placeholder="Breve resumo explicativo para guiar o ministério..."
                    rows={2}
                    value={newAppDesc}
                    onChange={(e) => setNewAppDesc(e.target.value)}
                    className={`w-full px-4 py-2 rounded-xl focus:outline-none resize-none ${
                      settings.theme === 'dark' ? 'bg-navy-950 border text-white' : 'bg-gray-50 border text-navy-950'
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gold-500/10">
                <button
                  id="modal-cancel-btn"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  id="modal-save-btn"
                  onClick={handleAddManualAppointment}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    settings.theme === 'dark'
                      ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 hover:from-gold-300'
                      : 'bg-navy-800 text-white hover:bg-navy-950'
                  }`}
                >
                  Salvar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. FLOATING CAPSULE-SHAPED NAVIGATION BAR (PREMIUM APPLE & MATERIAL DESIGN 3) */}
      <nav className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] xs:w-[92%] max-w-xl z-[999] py-1.5 px-2 sm:py-2 sm:px-3 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.25)] border backdrop-blur-2xl transition-all duration-300 ${
        settings.theme === 'dark'
          ? `bg-navy-950/85 ${colorsTheme.border} text-white shadow-gold-500/5`
          : `bg-white/90 ${colorsTheme.border} text-navy-950 shadow-navy-950/10`
      }`}>
        <div className="w-full flex justify-between items-center gap-0.5 xs:gap-1 sm:gap-2">
          {/* Home Tab */}
          <button
            id="tab-btn-home"
            onClick={() => { setActiveTab('home'); }}
            title="Início"
            className={`flex items-center gap-1 sm:gap-1.5 p-1.5 sm:py-2 sm:px-3 rounded-full transition-all duration-300 cursor-pointer ${
              activeTab === 'home'
                ? colorsTheme.tabActiveBg
                : `text-gray-400 ${colorsTheme.hoverText}`
            }`}
          >
            <Church size={18} className={activeTab === 'home' ? colorsTheme.text : 'text-gray-400'} />
            {activeTab === 'home' && <span className="text-[10px] tracking-tight whitespace-nowrap hidden sm:inline">Início</span>}
          </button>

          {/* Agenda Tab */}
          <button
            id="tab-btn-agenda"
            onClick={() => { setActiveTab('agenda'); }}
            title="Agenda"
            className={`flex items-center gap-1 sm:gap-1.5 p-1.5 sm:py-2 sm:px-3 rounded-full transition-all duration-300 cursor-pointer ${
              activeTab === 'agenda'
                ? colorsTheme.tabActiveBg
                : `text-gray-400 ${colorsTheme.hoverText}`
            }`}
          >
            <ClockIcon size={18} className={activeTab === 'agenda' ? colorsTheme.text : 'text-gray-400'} />
            {activeTab === 'agenda' && <span className="text-[10px] tracking-tight whitespace-nowrap hidden sm:inline">Agenda</span>}
          </button>

          {/* Calendar Tab */}
          <button
            id="tab-btn-calendar"
            onClick={() => { setActiveTab('calendar'); }}
            title="Calendário"
            className={`flex items-center gap-1 sm:gap-1.5 p-1.5 sm:py-2 sm:px-3 rounded-full transition-all duration-300 cursor-pointer ${
              activeTab === 'calendar'
                ? colorsTheme.tabActiveBg
                : `text-gray-400 ${colorsTheme.hoverText}`
            }`}
          >
            <CalendarIcon size={18} className={activeTab === 'calendar' ? colorsTheme.text : 'text-gray-400'} />
            {activeTab === 'calendar' && <span className="text-[10px] tracking-tight whitespace-nowrap hidden sm:inline">Calendário</span>}
          </button>

          {/* Central Quick Add (Fitted directly in line) */}
          <button
            id="central-plus-floating-btn"
            onClick={() => openManualAddModal()}
            title="Adicionar Novo"
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r ${colorsTheme.fromTo} ${colorsTheme.accentColor === 'gold' || colorsTheme.accentColor === 'emerald' ? 'text-navy-950' : 'text-white'} flex items-center justify-center shadow-lg ${colorsTheme.glow} hover:scale-110 active:scale-95 transition-transform duration-200 shrink-0 cursor-pointer`}
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
          </button>

          {/* Dashboard Tab */}
          <button
            id="tab-btn-dashboard"
            onClick={() => { setActiveTab('dashboard'); }}
            title="Painel"
            className={`flex items-center gap-1 sm:gap-1.5 p-1.5 sm:py-2 sm:px-3 rounded-full transition-all duration-300 cursor-pointer ${
              activeTab === 'dashboard'
                ? colorsTheme.tabActiveBg
                : `text-gray-400 ${colorsTheme.hoverText}`
            }`}
          >
            <Sliders size={18} className={activeTab === 'dashboard' ? colorsTheme.text : 'text-gray-400'} />
            {activeTab === 'dashboard' && <span className="text-[10px] tracking-tight whitespace-nowrap hidden sm:inline">Painel</span>}
          </button>

          {/* Notes Tab */}
          <button
            id="tab-btn-notes"
            onClick={() => { setActiveTab('notes'); }}
            title="Estudos"
            className={`flex items-center gap-1 sm:gap-1.5 p-1.5 sm:py-2 sm:px-3 rounded-full transition-all duration-300 cursor-pointer ${
              activeTab === 'notes'
                ? colorsTheme.tabActiveBg
                : `text-gray-400 ${colorsTheme.hoverText}`
            }`}
          >
            <BookOpen size={18} className={activeTab === 'notes' ? colorsTheme.text : 'text-gray-400'} />
            {activeTab === 'notes' && <span className="text-[10px] tracking-tight whitespace-nowrap hidden sm:inline">Estudos</span>}
          </button>

          {/* Contacts Tab */}
          <button
            id="tab-btn-contacts"
            onClick={() => { setActiveTab('contacts'); }}
            title="Igreja"
            className={`flex items-center gap-1 sm:gap-1.5 p-1.5 sm:py-2 sm:px-3 rounded-full transition-all duration-300 cursor-pointer ${
              activeTab === 'contacts'
                ? colorsTheme.tabActiveBg
                : `text-gray-400 ${colorsTheme.hoverText}`
            }`}
          >
            <Users size={18} className={activeTab === 'contacts' ? colorsTheme.text : 'text-gray-400'} />
            {activeTab === 'contacts' && <span className="text-[10px] tracking-tight whitespace-nowrap hidden sm:inline">Igreja</span>}
          </button>

          {/* Settings Tab */}
          <button
            id="tab-btn-settings"
            onClick={() => { setActiveTab('settings'); }}
            title="Ajustes"
            className={`flex items-center gap-1 sm:gap-1.5 p-1.5 sm:py-2 sm:px-3 rounded-full transition-all duration-300 cursor-pointer ${
              activeTab === 'settings'
                ? colorsTheme.tabActiveBg
                : `text-gray-400 ${colorsTheme.hoverText}`
            }`}
          >
            <SettingsIcon size={18} className={activeTab === 'settings' ? colorsTheme.text : 'text-gray-400'} />
            {activeTab === 'settings' && <span className="text-[10px] tracking-tight whitespace-nowrap font-medium hidden sm:inline">Ajustes</span>}
          </button>
        </div>
      </nav>

      {/* Extra bottom padding to avoid tabbar overlaps */}
      <div className="h-28" />
    </div>
  );
}
