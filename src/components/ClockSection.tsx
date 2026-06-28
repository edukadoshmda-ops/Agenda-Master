import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flame, Hourglass, Timer as TimerIcon, Award } from 'lucide-react';
import AnalogClock from './AnalogClock';

interface ClockSectionProps {
  theme: 'light' | 'dark';
}

export default function ClockSection({ theme }: ClockSectionProps) {
  const [activeTab, setActiveTab] = useState<'clocks' | 'stopwatch' | 'timer'>('clocks');

  // Digital Clock live time state
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Stopwatch States ---
  const [swActive, setSwActive] = useState(false);
  const [swTime, setSwTime] = useState(0); // in milliseconds
  const [swLaps, setSwLaps] = useState<number[]>([]);
  const swRef = useRef<number | null>(null);

  const startStopwatch = () => {
    if (!swActive) {
      setSwActive(true);
      const startTime = Date.now() - swTime;
      swRef.current = window.setInterval(() => {
        setSwTime(Date.now() - startTime);
      }, 10);
    }
  };

  const pauseStopwatch = () => {
    if (swActive) {
      setSwActive(false);
      if (swRef.current) clearInterval(swRef.current);
    }
  };

  const resetStopwatch = () => {
    setSwActive(false);
    if (swRef.current) clearInterval(swRef.current);
    setSwTime(0);
    setSwLaps([]);
  };

  const lapStopwatch = () => {
    setSwLaps([...swLaps, swTime]);
  };

  const formatStopwatchTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  };

  // --- Timer States ---
  const [timerDuration, setTimerDuration] = useState(10); // Default 10 minutes
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(600); // 10 mins in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startTimer = () => {
    if (!timerActive) {
      setTimerActive(true);
      setTimerDone(false);
      timerRef.current = window.setInterval(() => {
        setTimerSecondsLeft(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            setTimerDone(true);
            if (timerRef.current) clearInterval(timerRef.current);
            // Simulate buzzer
            try {
              if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
            } catch (e) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    if (timerActive) {
      setTimerActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerDone(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerSecondsLeft(timerDuration * 60);
  };

  const handleTimerChange = (mins: number) => {
    setTimerDuration(mins);
    setTimerSecondsLeft(mins * 60);
    setTimerActive(false);
    setTimerDone(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTimerTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Clean intervals on unmount
  useEffect(() => {
    return () => {
      if (swRef.current) clearInterval(swRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div id="clock-tools-view" className="space-y-6">
      {/* Tab controls */}
      <div className={`p-1 rounded-2xl flex justify-between ${theme === 'dark' ? 'bg-navy-900/60' : 'bg-gray-100'} shadow-inner`}>
        <button
          onClick={() => setActiveTab('clocks')}
          className={`flex-1 py-3 text-xs font-semibold rounded-xl transition-all duration-300 ${
            activeTab === 'clocks'
              ? theme === 'dark'
                ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 shadow-md font-bold'
                : 'bg-navy-800 text-white shadow-md font-bold'
              : 'text-gray-400 hover:text-gray-500'
          }`}
        >
          Relógios
        </button>
        <button
          onClick={() => setActiveTab('stopwatch')}
          className={`flex-1 py-3 text-xs font-semibold rounded-xl transition-all duration-300 ${
            activeTab === 'stopwatch'
              ? theme === 'dark'
                ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 shadow-md font-bold'
                : 'bg-navy-800 text-white shadow-md font-bold'
              : 'text-gray-400 hover:text-gray-500'
          }`}
        >
          Cronômetro
        </button>
        <button
          onClick={() => setActiveTab('timer')}
          className={`flex-1 py-3 text-xs font-semibold rounded-xl transition-all duration-300 ${
            activeTab === 'timer'
              ? theme === 'dark'
                ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 shadow-md font-bold'
                : 'bg-navy-800 text-white shadow-md font-bold'
              : 'text-gray-400 hover:text-gray-500'
          }`}
        >
          Temporizador
        </button>
      </div>

      {/* 1. Clocks View */}
      {activeTab === 'clocks' && (
        <div className="space-y-6 text-center animate-fadeIn">
          {/* Beautiful Analog Clock */}
          <div className="py-6">
            <AnalogClock size={220} theme={theme} />
          </div>

          {/* Luxury Digital Clock */}
          <div className={`p-6 rounded-3xl ${theme === 'dark' ? 'glass-premium-dark' : 'glass-premium-light'} shadow-xl max-w-sm mx-auto`}>
            <div className="font-mono text-4xl font-extrabold tracking-widest gold-gradient-text">
              {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-xs text-gray-400 mt-2 font-medium">
              {time.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="text-[10px] text-gold-500 font-bold tracking-widest uppercase mt-3">
              Gabinete Pastoral • UTC -3
            </div>
          </div>
        </div>
      )}

      {/* 2. Stopwatch View */}
      {activeTab === 'stopwatch' && (
        <div className="space-y-6 text-center animate-fadeIn">
          {/* Big Stopwatch Display */}
          <div className={`p-8 rounded-3xl ${theme === 'dark' ? 'glass-premium-dark' : 'glass-premium-light'} shadow-xl max-w-sm mx-auto`}>
            <div className={`p-2.5 rounded-full inline-block mb-3 ${theme === 'dark' ? 'bg-navy-900' : 'bg-gold-50'}`}>
              <TimerIcon className="text-gold-500 animate-pulse" size={24} />
            </div>
            <div className="font-mono text-4xl font-extrabold tracking-wider text-gold-500">
              {formatStopwatchTime(swTime)}
            </div>
            <div className="text-xs text-gray-400 mt-1 font-medium">Cronômetro Ministerial</div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={resetStopwatch}
              className={`p-3 rounded-full transition-colors ${
                theme === 'dark' ? 'bg-navy-900 hover:bg-navy-800 text-gold-400' : 'bg-gray-100 hover:bg-gray-200 text-gold-600'
              }`}
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={swActive ? pauseStopwatch : startStopwatch}
              className={`p-5 rounded-full text-navy-950 transition-all duration-300 shadow-lg ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 shadow-gold-500/10'
                  : 'bg-navy-800 hover:bg-navy-900 text-white'
              }`}
            >
              {swActive ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button
              onClick={lapStopwatch}
              disabled={!swActive}
              className={`p-3 rounded-full transition-colors ${
                !swActive
                  ? 'opacity-30 cursor-not-allowed'
                  : theme === 'dark'
                  ? 'bg-navy-900 hover:bg-navy-800 text-gold-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gold-600'
              }`}
            >
              <Award size={20} />
            </button>
          </div>

          {/* Lap History */}
          {swLaps.length > 0 && (
            <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-navy-900/40' : 'bg-gray-50'} max-w-sm mx-auto max-h-48 overflow-y-auto space-y-2 text-left`}>
              <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest border-b border-gold-500/10 pb-1.5 mb-2">Marcas de Tempo</h4>
              {swLaps.map((lap, idx) => (
                <div key={idx} className="flex justify-between text-xs py-1 font-mono">
                  <span className="text-gray-400">Volta {idx + 1}</span>
                  <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-navy-900'}`}>{formatStopwatchTime(lap)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Timer View */}
      {activeTab === 'timer' && (
        <div className="space-y-6 text-center animate-fadeIn">
          {/* Preset Buttons */}
          <div className="flex flex-wrap justify-center gap-2 max-w-xs mx-auto">
            {[3, 5, 10, 15, 30, 45, 60].map(mins => (
              <button
                key={mins}
                onClick={() => handleTimerChange(mins)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  timerDuration === mins
                    ? theme === 'dark'
                      ? 'bg-gold-500 text-navy-950 shadow-md'
                      : 'bg-navy-800 text-white shadow-md'
                    : theme === 'dark'
                    ? 'bg-navy-900/60 hover:bg-navy-900 text-gold-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-navy-800'
                }`}
              >
                {mins} min
              </button>
            ))}
          </div>

          {/* Big Timer Display */}
          <div className={`p-8 rounded-3xl ${theme === 'dark' ? 'glass-premium-dark' : 'glass-premium-light'} shadow-xl max-w-sm mx-auto relative overflow-hidden`}>
            {timerDone && (
              <div className="absolute inset-0 bg-red-500/10 flex flex-col items-center justify-center animate-pulse">
                <span className="text-red-500 font-bold text-xs uppercase tracking-wider mb-1">Tempo Esgotado!</span>
                <Flame className="text-red-500 animate-bounce" size={24} />
              </div>
            )}
            <div className={`p-2.5 rounded-full inline-block mb-3 ${theme === 'dark' ? 'bg-navy-900' : 'bg-gold-50'}`}>
              <Hourglass className={`text-gold-500 ${timerActive ? 'animate-spin' : ''}`} size={24} />
            </div>
            <div className="font-mono text-5xl font-extrabold tracking-wider text-gold-500">
              {formatTimerTime(timerSecondsLeft)}
            </div>
            <p className="text-xs text-gray-400 mt-1 font-medium">Contagem de Tempo (Pregação/Estudo)</p>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={resetTimer}
              className={`p-3 rounded-full transition-colors ${
                theme === 'dark' ? 'bg-navy-900 hover:bg-navy-800 text-gold-400' : 'bg-gray-100 hover:bg-gray-200 text-gold-600'
              }`}
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={timerActive ? pauseTimer : startTimer}
              className={`p-5 rounded-full text-navy-950 transition-all duration-300 shadow-lg ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 shadow-gold-500/10'
                  : 'bg-navy-800 hover:bg-navy-900 text-white'
              }`}
            >
              {timerActive ? <Pause size={24} /> : <Play size={24} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
