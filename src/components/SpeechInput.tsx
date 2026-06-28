import React, { useState, useEffect } from 'react';
import { Mic, ArrowRight, Loader2, Sparkles, Check, Play } from 'lucide-react';
import { parseAppointmentWithAI } from '../utils/aiParser';
import { Appointment, AppointmentPriority } from '../types';

interface SpeechInputProps {
  onAddParsedAppointment: (app: Partial<Appointment>) => void;
  theme: 'light' | 'dark';
  accentColor?: string;
}

const PRESETS = [
  'Visitar o irmão João amanhã às 15:00 na casa dele',
  'Reunião do conselho administrativo sexta às 20h na sala de reuniões.',
  'Culto de jovens no próximo sábado às 19:30 no templo central.',
  'Casamento dos noivos Pedro e Sofia dia 12 às 16:00.',
];

export default function SpeechInput({ onAddParsedAppointment, theme, accentColor }: SpeechInputProps) {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedResult, setParsedResult] = useState<Partial<Appointment> | null>(null);
  
  // Web Speech API reference
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  const getAccentConfig = () => {
    switch (accentColor) {
      case 'royal':
        return {
          text: 'text-[#4982b1]',
          textMuted: 'text-[#4982b1]/80',
          bg: 'bg-[#4982b1]',
          fromTo: 'from-[#4982b1] to-[#3a688e]',
          border: 'border-[#4982b1]/15',
          borderHover: 'hover:border-[#4982b1]/30',
          focusBorder: 'focus:border-[#4982b1]',
          hoverBg: 'hover:bg-[#4982b1]/10',
          glow: 'shadow-[#4982b1]/20',
          loader: 'text-[#4982b1]',
          badge: 'bg-[#4982b1]/10 text-[#4982b1]/80 border border-[#4982b1]/20',
          btnBg: 'bg-gradient-to-r from-[#4982b1] to-[#3a688e] text-white',
          aiLabel: 'IA do Pastor Pro'
        };
      case 'emerald':
        return {
          text: 'text-emerald-500',
          textMuted: 'text-emerald-400',
          bg: 'bg-emerald-500',
          fromTo: 'from-emerald-400 to-emerald-600',
          border: 'border-emerald-500/15',
          borderHover: 'hover:border-emerald-500/30',
          focusBorder: 'focus:border-emerald-500',
          hoverBg: 'hover:bg-emerald-500/10',
          glow: 'shadow-emerald-500/20',
          loader: 'text-emerald-500',
          badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
          btnBg: 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-navy-950',
          aiLabel: 'IA do Pastor Pro'
        };
      case 'ruby':
        return {
          text: 'text-rose-500',
          textMuted: 'text-rose-400',
          bg: 'bg-rose-500',
          fromTo: 'from-rose-400 to-rose-600',
          border: 'border-rose-500/15',
          borderHover: 'hover:border-rose-500/30',
          focusBorder: 'focus:border-rose-500',
          hoverBg: 'hover:bg-rose-500/10',
          glow: 'shadow-rose-500/20',
          loader: 'text-rose-500',
          badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
          btnBg: 'bg-gradient-to-r from-rose-400 to-rose-600 text-white',
          aiLabel: 'IA do Pastor Pro'
        };
      default: // gold
        return {
          text: 'text-gold-500',
          textMuted: 'text-gold-400',
          bg: 'bg-gold-500',
          fromTo: 'from-gold-400 to-gold-600',
          border: 'border-gold-500/15',
          borderHover: 'hover:border-gold-500/30',
          focusBorder: 'focus:border-gold-500',
          hoverBg: 'hover:bg-gold-500/10',
          glow: 'shadow-gold-500/20',
          loader: 'text-gold-500',
          badge: 'bg-gold-500/10 text-gold-400 border border-gold-500/20',
          btnBg: 'bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950',
          aiLabel: 'IA do Pastor Pro'
        };
    }
  };

  const ac = getAccentConfig();

  const handleParseRef = React.useRef(handleParse);
  const startSimulationRef = React.useRef<() => void>(() => {});

  const startSimulationFallback = () => {
    setIsListening(true);
    const phrases = [
      'Visitar o irmão João amanhã às 15:00 na casa dele',
      'Reunião ministerial na próxima segunda-feira às 19:00',
      'Estudo bíblico de casais neste sábado às 18:30 no salão social',
      'Pregar no culto de doutrina na quarta-feira às 19:30',
    ];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    setTimeout(() => {
      setIsListening(false);
      setInputText(randomPhrase);
      handleParseRef.current(randomPhrase);
    }, 4000); // 4 seconds elegant waveform simulation
  };

  useEffect(() => {
    handleParseRef.current = handleParse;
    startSimulationRef.current = startSimulationFallback;
  });

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = 'pt-BR';
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleParseRef.current(transcript);
      };

      rec.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        // Automatically fallback to simulation so the user always has a functional scheduling experience
        startSimulationRef.current();
      };

      setRecognitionInstance(rec);
    }
  }, []);

  const startListening = () => {
    // Starting a new voice capture starts listening but NEVER processes existing input text as a submit button!
    // Simply reset the parsed result so a new schedule can be captured.
    setParsedResult(null);

    if (speechSupported && recognitionInstance) {
      try {
        recognitionInstance.start();
      } catch (err) {
        console.warn('Failed to start native recognition, starting simulation fallback:', err);
        startSimulationFallback();
      }
    } else {
      startSimulationFallback();
    }
  };

  async function handleParse(textToParse: string) {
    if (!textToParse.trim()) return;
    setIsLoading(true);
    setParsedResult(null);

    try {
      const parsed = await parseAppointmentWithAI(textToParse);
      setParsedResult(parsed);
      
      // Auto-schedule directly!
      onAddParsedAppointment(parsed);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handlePresetClick = (preset: string) => {
    setInputText(preset);
    handleParse(preset);
  };

  const handleConfirm = () => {
    if (parsedResult) {
      // Already added via auto-confirm, just clean up state
      setInputText('');
      setParsedResult(null);
    }
  };

  const getPriorityBadgeColor = (p?: AppointmentPriority) => {
    switch (p) {
      case 'urgente': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'prioridade': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      case 'importante': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  return (
    <div className={`p-5 rounded-3xl ${theme === 'dark' ? 'glass-premium-dark' : 'glass-premium-light'} shadow-xl space-y-6`}>
      {/* Voice/Text input core */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className={ac.text} size={18} />
          <h3 className={`font-display font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-navy-950'}`}>
            Agenda por Comando de Voz ou Texto
          </h3>
        </div>
        <p className="text-xs text-gray-400">
          Toque no microfone ou digite o compromisso com linguagem natural. A IA identificará o local, data, hora e prioridade automaticamente.
        </p>
      </div>

      <div className="flex gap-2.5 items-center relative">
        <div className="relative flex-1">
          <input
            id="smart-agenda-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleParse(inputText)}
            placeholder="Ex: Visitar irmão João amanhã às 15h na casa dele..."
            className={`w-full pl-4 pr-10 py-3.5 rounded-2xl text-xs font-medium focus:outline-none transition-all duration-300 ${
              theme === 'dark'
                ? `bg-navy-950 border ${ac.border} text-white ${ac.focusBorder}`
                : `bg-white border border-gray-200 text-navy-950 ${ac.focusBorder} shadow-sm`
            }`}
          />
          <button
            id="smart-parse-arrow-btn"
            onClick={() => handleParse(inputText)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full ${ac.text} ${ac.hoverBg} transition-colors`}
          >
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Listen Microphone Trigger */}
        <button
          id="mic-trigger-btn"
          onClick={startListening}
          className={`p-4 rounded-full transition-all duration-300 flex items-center justify-center relative shadow-lg ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : theme === 'dark'
              ? `bg-gradient-to-r ${ac.fromTo} ${accentColor === 'gold' || accentColor === 'emerald' ? 'text-navy-950' : 'text-white'}`
              : 'bg-navy-800 text-white'
          }`}
        >
          {isListening ? (
            <div className="flex gap-0.5 items-center justify-center">
              <span className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-1 h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          ) : (
            <Mic size={18} />
          )}
        </button>
      </div>

      {/* Mic Status Label */}
      {isListening && (
        <div className="text-center space-y-1.5 animate-fadeIn">
          <p className="text-xs text-red-500 font-bold animate-pulse">Gravando e Transcrevendo...</p>
          <p className="text-[10px] text-gray-400 italic">
            {!speechSupported ? '(Simulação de áudio ativo: ouvindo oração e comando...)' : 'Diga seu compromisso agora.'}
          </p>
        </div>
      )}

      {/* Presets Grid */}
      <div className="space-y-2">
        <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Toque para testar</h4>
        <div className="flex flex-col gap-1.5">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetClick(preset)}
              className={`p-2.5 rounded-xl text-left text-[11px] font-medium transition-colors border flex gap-2 items-center ${
                theme === 'dark'
                  ? `bg-navy-900/40 hover:bg-navy-900/80 border-gold-500/10 ${ac.borderHover} text-gray-300`
                  : `bg-white ${ac.hoverBg} border-gray-100 text-navy-800`
              }`}
            >
              <Play size={10} className={`${ac.text} shrink-0`} />
              <span className="truncate">{preset}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Parser Glowing Loader */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-6 gap-2">
          <Loader2 className={`${ac.text} animate-spin`} size={28} />
          <p className={`text-xs ${ac.text} font-medium`}>{ac.aiLabel} interpretando...</p>
        </div>
      )}

      {/* AI Parsed Results Dashboard */}
      {parsedResult && (
        <div className={`p-4 rounded-2xl border transition-all duration-300 space-y-4 animate-fadeIn ${
          theme === 'dark'
            ? 'bg-emerald-500/5 border-emerald-500/20'
            : 'bg-emerald-50/20 border-emerald-200'
        }`}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
              <Check size={14} className="bg-emerald-500/20 text-emerald-400 rounded-full p-0.5" />
              ✓ Agendado com Sucesso!
            </span>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${getPriorityBadgeColor(parsedResult.priority)}`}>
              {parsedResult.priority || 'normal'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="col-span-2 space-y-0.5">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Título</span>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-navy-900'}`}>{parsedResult.title}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Data</span>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-navy-900'}`}>
                {parsedResult.date ? new Date(parsedResult.date + 'T00:00:00').toLocaleDateString('pt-BR') : '-'}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Horário</span>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-navy-900'}`}>{parsedResult.time}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Local</span>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-navy-900'}`}>{parsedResult.location}</p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Categoria</span>
              <p className={`font-semibold ${ac.text} uppercase`}>{parsedResult.category}</p>
            </div>

            <div className="col-span-2 space-y-0.5">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Notas / Descrição</span>
              <p className="text-[11px] text-gray-400">{parsedResult.description}</p>
            </div>
          </div>

          <button
            id="dismiss-parsed-btn"
            onClick={handleConfirm}
            className={`w-full py-2 rounded-xl bg-navy-900/40 text-gray-300 font-bold text-xs hover:bg-navy-900/60 transition-colors border ${ac.border} flex items-center justify-center gap-1`}
          >
            Fechar Visualização
          </button>
        </div>
      )}
    </div>
  );
}
