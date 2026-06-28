import React from 'react';
import { Eye, EyeOff, Layout, Clock, Calendar, CheckSquare, ClipboardList } from 'lucide-react';

interface WidgetsPanelProps {
  visibleWidgets: {
    clock: boolean;
    nextAppointment: boolean;
    daySchedule: boolean;
    pendingTasks: boolean;
  };
  onToggleWidget: (key: 'clock' | 'nextAppointment' | 'daySchedule' | 'pendingTasks') => void;
  theme: 'light' | 'dark';
}

export default function WidgetsPanel({ visibleWidgets, onToggleWidget, theme }: WidgetsPanelProps) {
  return (
    <div id="widgets-panel" className={`p-5 rounded-3xl ${theme === 'dark' ? 'glass-premium-dark' : 'glass-premium-light'} shadow-xl space-y-4`}>
      <div className="flex items-center gap-2 border-b border-gold-500/10 pb-3">
        <Layout className="text-gold-500" size={18} />
        <div>
          <h3 className={`font-display font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-navy-950'}`}>
            Painel de Widgets da Tela Inicial
          </h3>
          <p className="text-[10px] text-gray-400">Ative ou oculte os blocos dinâmicos premium de sua tela inicial.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Widget Clock */}
        <div className={`p-3.5 rounded-2xl flex items-center justify-between border ${
          theme === 'dark' ? 'bg-navy-950/60 border-gold-500/10' : 'bg-white border-gray-100 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
              <Clock size={16} />
            </div>
            <div>
              <h4 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-navy-900'}`}>Relógio Analógico/Digital</h4>
              <p className="text-[9px] text-gray-400">Mostrador de luxo ativo na tela inicial</p>
            </div>
          </div>
          <button
            id="toggle-widget-clock"
            onClick={() => onToggleWidget('clock')}
            className={`p-1.5 rounded-lg transition-all ${
              visibleWidgets.clock ? 'text-gold-500 bg-gold-500/10' : 'text-gray-400 hover:text-gray-500'
            }`}
          >
            {visibleWidgets.clock ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        {/* Widget Next Appointment */}
        <div className={`p-3.5 rounded-2xl flex items-center justify-between border ${
          theme === 'dark' ? 'bg-navy-950/60 border-gold-500/10' : 'bg-white border-gray-100 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
              <Calendar size={16} />
            </div>
            <div>
              <h4 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-navy-900'}`}>Próximo Compromisso</h4>
              <p className="text-[9px] text-gray-400">Lembrete rápido do compromisso urgente</p>
            </div>
          </div>
          <button
            id="toggle-widget-nextApp"
            onClick={() => onToggleWidget('nextAppointment')}
            className={`p-1.5 rounded-lg transition-all ${
              visibleWidgets.nextAppointment ? 'text-gold-500 bg-gold-500/10' : 'text-gray-400 hover:text-gray-500'
            }`}
          >
            {visibleWidgets.nextAppointment ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        {/* Widget Day Schedule */}
        <div className={`p-3.5 rounded-2xl flex items-center justify-between border ${
          theme === 'dark' ? 'bg-navy-950/60 border-gold-500/10' : 'bg-white border-gray-100 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
              <ClipboardList size={16} />
            </div>
            <div>
              <h4 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-navy-900'}`}>Agenda do Dia</h4>
              <p className="text-[9px] text-gray-400">Linha de tempo com as atividades de hoje</p>
            </div>
          </div>
          <button
            id="toggle-widget-daySched"
            onClick={() => onToggleWidget('daySchedule')}
            className={`p-1.5 rounded-lg transition-all ${
              visibleWidgets.daySchedule ? 'text-gold-500 bg-gold-500/10' : 'text-gray-400 hover:text-gray-500'
            }`}
          >
            {visibleWidgets.daySchedule ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        {/* Widget Pending Tasks */}
        <div className={`p-3.5 rounded-2xl flex items-center justify-between border ${
          theme === 'dark' ? 'bg-navy-950/60 border-gold-500/10' : 'bg-white border-gray-100 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-500">
              <CheckSquare size={16} />
            </div>
            <div>
              <h4 className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-navy-900'}`}>Tarefas Pendentes</h4>
              <p className="text-[9px] text-gray-400">Mini checklist de afazeres diários</p>
            </div>
          </div>
          <button
            id="toggle-widget-pendingTasks"
            onClick={() => onToggleWidget('pendingTasks')}
            className={`p-1.5 rounded-lg transition-all ${
              visibleWidgets.pendingTasks ? 'text-gold-500 bg-gold-500/10' : 'text-gray-400 hover:text-gray-500'
            }`}
          >
            {visibleWidgets.pendingTasks ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
