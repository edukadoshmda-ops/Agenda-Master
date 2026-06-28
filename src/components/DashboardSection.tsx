import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Droplets, Calendar, ChevronDown, Bell, Eye, Award } from 'lucide-react';
import { Appointment } from '../types';

interface DashboardSectionProps {
  appointments: Appointment[];
  theme: 'light' | 'dark';
  accentColor?: string;
}

export default function DashboardSection({ appointments, theme, accentColor }: DashboardSectionProps) {
  const [timeRange, setTimeRange] = useState('1 de Maio – 31 de Maio, 2025');

  // Exact data inspired by Image 2
  const growthData = [
    { name: 'Nov', visits: 70, baptisms: 15, events: 5 },
    { name: 'Dez', visits: 80, baptisms: 20, events: 8 },
    { name: 'Jan', visits: 105, baptisms: 24, events: 10 },
    { name: 'Fev', visits: 98, baptisms: 18, events: 6 },
    { name: 'Mar', visits: 125, baptisms: 28, events: 14 },
    { name: 'Abr', visits: 138, baptisms: 32, events: 11 },
    { name: 'Mai', visits: 156, baptisms: 23, events: 12 },
  ];

  const pieChartData = [
    { name: 'Visitas Domiciliares', value: 65, percentage: '41.7%', color: '#b58028' },
    { name: 'Visitas na Igreja', value: 53, percentage: '34.0%', color: '#1a4063' },
    { name: 'Visitas Hospitalares', value: 28, percentage: '17.9%', color: '#4982b1' },
    { name: 'Outras', value: 10, percentage: '6.4%', color: '#ebd6a3' },
  ];

  const topEvents = [
    { id: '1', title: 'Evangelismo Comunitário', count: 56, date: '12 de Abr, 2025' },
    { id: '2', title: 'Conferência de Jovens', count: 42, date: '3 de Mai, 2025' },
    { id: '3', title: 'Culto de Domingo', count: 38, date: '18 de Mai, 2025' },
  ];

  return (
    <div id="analytics-dashboard-view" className="space-y-6">
      {/* 1. Header Banner & Branding (Inspired by Image 2) */}
      <div className="flex justify-between items-center flex-wrap gap-4 pb-4 border-b border-gold-500/10">
        {/* Shield Logo with Pastor Pro Text */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-10 h-10 drop-shadow-[0_2px_8px_rgba(181,128,40,0.3)]" viewBox="0 0 100 100">
              <path d="M50,10 L85,25 L85,55 C85,75 50,90 50,90 C50,90 15,75 15,55 L15,25 Z" fill="#0b1420" stroke="#b58028" strokeWidth="4" />
              {/* Fine gold cross inside */}
              <path d="M47,25 h6 v20 h14 v6 h-14 v25 h-6 v-25 h-14 v-6 h14 z" fill="#b58028" />
            </svg>
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg leading-tight text-navy-950 dark:text-[#ebd6a3] tracking-wide">
              Pastor Pro
            </h1>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-gold-500 -mt-0.5">
              Premium
            </p>
          </div>
        </div>

        {/* Right side Actions: Notifications & Avatar */}
        <div className="flex items-center gap-3">
          {/* Bell Notifications */}
          <div className="relative cursor-pointer p-2 rounded-full border border-gold-500/10 hover:bg-gold-500/5 transition-all">
            <Bell size={18} className="text-navy-950 dark:text-gold-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-500 rounded-full ring-2 ring-white dark:ring-navy-950" />
          </div>

          {/* User Profile Avatar */}
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gold-400 shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" 
              alt="Pr. Daniel Profile" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>

      {/* Title & Date Picker Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-navy-950 dark:text-white">
            Painel Analítico
          </h2>
          <p className="text-xs text-gray-400">
            Visão geral do impacto do seu ministério
          </p>
        </div>

        {/* Dropdown date selector */}
        <div className="relative inline-block self-start sm:self-auto">
          <button 
            id="analytics-date-picker"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/15 bg-white dark:bg-navy-900 text-xs font-semibold text-gray-600 dark:text-gray-300 shadow-sm cursor-pointer hover:bg-gold-500/5 transition-all"
          >
            <Calendar size={14} className="text-gold-500" />
            <span>{timeRange}</span>
            <ChevronDown size={12} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* 2. Top Metrics Row (Inspired by Image 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Visits Card */}
        <div className={`p-5 rounded-3xl relative overflow-hidden transition-all duration-300 ${
          theme === 'dark' ? 'glass-premium-dark border-gold-500/10' : 'bg-white border border-gold-200/40 shadow-sm hover:shadow-md'
        }`}>
          <div className="flex justify-between items-start">
            <div className="mt-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block">Visitas</span>
              <span className="text-3xl font-display font-black text-navy-950 dark:text-white mt-1 block">156</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-500 shrink-0">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[11px]">
            <span className="font-extrabold text-emerald-500">↑ 12.5%</span>
            <span className="text-gray-400">vs 1 de Abr - 30 de Abr</span>
          </div>
        </div>

        {/* Baptisms Card */}
        <div className={`p-5 rounded-3xl relative overflow-hidden transition-all duration-300 ${
          theme === 'dark' ? 'glass-premium-dark border-gold-500/10' : 'bg-[#f4f7fb] border border-gold-200/30 shadow-sm hover:shadow-md'
        }`}>
          <div className="flex justify-between items-start">
            <div className="mt-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block">Batismos</span>
              <span className="text-3xl font-display font-black text-navy-950 dark:text-white mt-1 block">23</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1a4063]/10 flex items-center justify-center text-[#1a4063] dark:text-[#4982b1] shrink-0">
              <Droplets size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[11px]">
            <span className="font-extrabold text-emerald-500">↑ 27.8%</span>
            <span className="text-gray-400">vs 1 de Abr - 30 de Abr</span>
          </div>
        </div>

        {/* Events Card */}
        <div className={`p-5 rounded-3xl relative overflow-hidden transition-all duration-300 ${
          theme === 'dark' ? 'glass-premium-dark border-gold-500/10' : 'bg-[#faf7ee] border border-gold-200/50 shadow-sm hover:shadow-md'
        }`}>
          <div className="flex justify-between items-start">
            <div className="mt-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block">Eventos</span>
              <span className="text-3xl font-display font-black text-navy-950 dark:text-white mt-1 block">12</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold-600/10 flex items-center justify-center text-gold-600 shrink-0">
              <Calendar size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[11px]">
            <span className="font-extrabold text-amber-600">↑ 9.1%</span>
            <span className="text-gray-400">vs 1 de Abr - 30 de Abr</span>
          </div>
        </div>
      </div>

      {/* 3. Ministry Growth Dark Chart Section (Inspired by Image 2) */}
      <div className="p-6 rounded-3xl bg-[#0b1420] text-white border border-gold-500/10 shadow-xl relative overflow-hidden">
        {/* Glow behind line ends */}
        <div className="absolute -right-20 top-20 w-44 h-44 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h3 className="font-serif font-bold text-sm tracking-wide text-white">
              Crescimento do Ministério
            </h3>
          </div>

          {/* Custom pill legend */}
          <div className="flex items-center gap-3 flex-wrap text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ebd6a3]" />
              <span className="text-gray-300">Visitas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4982b1]" />
              <span className="text-gray-300">Batismos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#b58028]" />
              <span className="text-gray-300">Eventos</span>
            </div>
            
            {/* Monthly Dropdown selector */}
            <div className="bg-[#101d2e] border border-gold-500/15 px-2 py-1 rounded-lg text-gold-400 font-bold flex items-center gap-1 cursor-pointer">
              <span>Mensal</span>
              <ChevronDown size={10} />
            </div>
          </div>
        </div>

        {/* Multi-series Line Chart */}
        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData} margin={{ top: 10, right: 35, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} axisLine={false} tickLine={false} domain={[0, 200]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f1d2e', borderColor: '#b58028', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ fontSize: '11px' }}
              />
              
              {/* Visits series (Yellow-Beige) */}
              <Line 
                type="monotone" 
                dataKey="visits" 
                stroke="#ebd6a3" 
                strokeWidth={3} 
                dot={{ r: 3, fill: '#ebd6a3', strokeWidth: 0 }} 
                activeDot={{ r: 5 }} 
              />
              {/* Baptisms series (Blue) */}
              <Line 
                type="monotone" 
                dataKey="baptisms" 
                stroke="#4982b1" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: '#4982b1', strokeWidth: 0 }} 
                activeDot={{ r: 4 }}
              />
              {/* Events series (Gold) */}
              <Line 
                type="monotone" 
                dataKey="events" 
                stroke="#b58028" 
                strokeWidth={2} 
                dot={{ r: 3, fill: '#b58028', strokeWidth: 0 }} 
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Current Indicators overlay block on right-most of lines as seen in Image 2 */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-5 text-[9px] font-bold select-none pointer-events-none">
            <div className="bg-[#ebd6a3] text-navy-950 px-1.5 py-0.5 rounded-md text-center shadow-md">156</div>
            <div className="bg-[#4982b1] text-white px-1.5 py-0.5 rounded-md text-center shadow-md">23</div>
            <div className="bg-white/10 border border-gold-500/20 text-white px-1.5 py-0.5 rounded-md text-center shadow-md">12</div>
          </div>
        </div>
      </div>

      {/* 4. Two columns sub-panels (Inspired by Image 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Visits by Type Donut chart */}
        <div className={`p-5 rounded-3xl ${
          theme === 'dark' ? 'glass-premium-dark border-gold-500/10' : 'bg-white border border-gold-200/40 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-4 border-b border-gold-500/5 pb-2.5">
            <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <h3 className={`font-serif font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-navy-950'}`}>
              Visitas por Tipo
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Recharts Donut Circle with Total label inside */}
            <div className="w-36 h-36 relative flex items-center justify-center">
              <div className="absolute text-center select-none pointer-events-none">
                <span className="text-xl font-black text-navy-950 dark:text-white block">156</span>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400 block -mt-1">Total</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={58}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Structured Legend labels aligned like Image 2 */}
            <div className="flex-1 space-y-2.5 w-full">
              {pieChartData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-500 dark:text-gray-300 font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-navy-950 dark:text-white">{item.value}</span>
                    <span className="text-gray-400 font-normal text-[10px]">({item.percentage})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Top Events Feed */}
        <div className={`p-5 rounded-3xl flex flex-col justify-between ${
          theme === 'dark' ? 'glass-premium-dark border-gold-500/10' : 'bg-white border border-gold-200/40 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-gold-500/5 pb-2.5">
              <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.248.58 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.176 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.3c-.78-.562-.381-1.81.58-1.81h4.908a1 1 0 00.95-.69l1.519-4.674z" />
              </svg>
              <h3 className={`font-serif font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-navy-950'}`}>
                Principais Eventos
              </h3>
            </div>

            {/* List Feed */}
            <div className="space-y-3">
              {topEvents.map(event => (
                <div 
                  key={event.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gold-500/5 hover:bg-gold-500/10 transition-colors border border-gold-500/5"
                >
                  <div className="flex items-center gap-3">
                    {/* Calendar outline box */}
                    <div className="w-9 h-9 rounded-lg bg-white dark:bg-navy-900 border border-gold-500/15 flex items-center justify-center text-gold-500 shrink-0">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-navy-950 dark:text-white leading-snug">
                        {event.title}
                      </h4>
                      <p className="text-[10px] text-gray-400">
                        {event.date}
                      </p>
                    </div>
                  </div>
                  
                  {/* Attendance count */}
                  <div className="text-right">
                    <span className="text-sm font-black text-navy-950 dark:text-white block">
                      {event.count}
                    </span>
                    <span className="text-[8px] uppercase font-bold text-gray-400 block -mt-1">
                      Membros
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Trigger Link */}
          <div className="mt-4 pt-2 border-t border-gold-500/5 text-center sm:text-right">
            <button 
              id="dashboard-view-all-events"
              className="text-xs font-bold text-gold-500 hover:text-gold-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ver todos os eventos</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
