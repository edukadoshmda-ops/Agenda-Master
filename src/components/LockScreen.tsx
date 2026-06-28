import React, { useState } from 'react';
import { Fingerprint, Delete, Lock } from 'lucide-react';

interface LockScreenProps {
  correctPin: string;
  onUnlocked: () => void;
  theme: 'light' | 'dark';
}

export default function LockScreen({ correctPin, onUnlocked, theme }: LockScreenProps) {
  const [enteredPin, setEnteredPin] = useState('');
  const [error, setError] = useState(false);
  const [isBiometricSimulating, setIsBiometricSimulating] = useState(false);

  const handleNumberClick = (num: number) => {
    if (enteredPin.length >= 4) return;
    setError(false);
    
    const newPin = enteredPin + num;
    setEnteredPin(newPin);

    if (newPin === correctPin) {
      setTimeout(() => {
        onUnlocked();
      }, 200);
    } else if (newPin.length === 4) {
      setTimeout(() => {
        setError(true);
        setEnteredPin('');
      }, 300);
    }
  };

  const handleDelete = () => {
    setEnteredPin(enteredPin.slice(0, -1));
    setError(false);
  };

  const handleBiometricSimulate = () => {
    setIsBiometricSimulating(true);
    setError(false);
    setTimeout(() => {
      setIsBiometricSimulating(false);
      onUnlocked();
    }, 1800);
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 transition-all duration-500 ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-navy-950 via-navy-900 to-black text-white'
        : 'bg-gradient-to-b from-navy-50 via-white to-gold-50 text-navy-950'
    }`}>
      <div className="max-w-xs w-full text-center space-y-6 animate-fadeIn">
        {/* Shield Header */}
        <div className="flex flex-col items-center space-y-2">
          <div className="p-4 rounded-full bg-gold-500/10 text-gold-500 border border-gold-500/20 animate-float">
            <Lock size={32} />
          </div>
          <h2 className="font-display font-bold text-xl gold-gradient-text tracking-wider">Pastor Pro Premium</h2>
          <p className="text-xs text-gray-400 font-medium">Acesso ministerial restrito e protegido</p>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-4 py-3">
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                error
                  ? 'bg-red-500 animate-bounce'
                  : idx < enteredPin.length
                  ? 'bg-gold-500 scale-110 shadow-lg shadow-gold-500/40'
                  : theme === 'dark'
                  ? 'bg-navy-800 border border-gold-500/10'
                  : 'bg-gray-200'
              }`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-xs font-bold animate-shake">Passcode Incorreto. Tente novamente.</p>
        )}

        {isBiometricSimulating && (
          <div className="text-center space-y-1 animate-fadeIn">
            <p className="text-gold-500 text-xs font-bold animate-pulse">Escaneando Face ID / Impressão Digital...</p>
          </div>
        )}

        {/* iOS style Passcode Keypad Grid */}
        <div className="grid grid-cols-3 gap-4 justify-items-center py-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              id={`keypad-btn-${num}`}
              onClick={() => handleNumberClick(num)}
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-display text-lg font-semibold border transition-all active:scale-95 duration-200 ${
                theme === 'dark'
                  ? 'bg-navy-900/40 hover:bg-navy-900 border-gold-500/10 hover:border-gold-500/40 text-white'
                  : 'bg-white hover:bg-gold-50 border-gray-100 text-navy-950 shadow-sm'
              }`}
            >
              {num}
            </button>
          ))}

          {/* Biometrics simulate button */}
          <button
            id="keypad-biometrics-btn"
            onClick={handleBiometricSimulate}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-gold-500 hover:bg-gold-500/15 transition-all duration-200 ${
              isBiometricSimulating ? 'animate-pulse text-emerald-400' : ''
            }`}
          >
            <Fingerprint size={24} />
          </button>

          {/* 0 Key */}
          <button
            id="keypad-btn-0"
            onClick={() => handleNumberClick(0)}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-display text-lg font-semibold border transition-all active:scale-95 duration-200 ${
              theme === 'dark'
                ? 'bg-navy-900/40 hover:bg-navy-900 border-gold-500/10 hover:border-gold-500/40 text-white'
                : 'bg-white hover:bg-gold-50 border-gray-100 text-navy-950 shadow-sm'
            }`}
          >
            0
          </button>

          {/* Backspace Key */}
          <button
            id="keypad-delete-btn"
            onClick={handleDelete}
            className="w-14 h-14 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95"
          >
            <Delete size={20} />
          </button>
        </div>

        <div className="text-[10px] text-gray-400 font-semibold tracking-wide">
          Sua privacidade é nossa prioridade ministerial.
        </div>
      </div>
    </div>
  );
}
