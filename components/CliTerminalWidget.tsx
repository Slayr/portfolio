'use client';

import { useState, useRef, FormEvent } from 'react';
import { Terminal as TermIcon, ChevronRight as InputArrowRight } from 'lucide-react';

export function CliTerminalWidget() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [inputValue, setInputValue] = useState('');
  const [cliHistory, setCliHistory] = useState<string[]>([
    'Rishi Mihir Popat Direct Modem Access Port v1.02',
    'Enter your NAME to establish linkage:'
  ]);
  const cliInputRef = useRef<HTMLInputElement>(null);

  const handleCliSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanInput = inputValue.trim();
    if (!cleanInput && step < 3) return;

    let nextStep = step;
    let newHistory = [...cliHistory, `guest@portfolio:~$ ${cleanInput}`];

    if (step === 0) {
      setFormData(prev => ({ ...prev, name: cleanInput }));
      newHistory.push(`NAME SECURED: "${cleanInput}"`, 'Enter your EMAIL:');
      nextStep = 1;
    } else if (step === 1) {
      if (!cleanInput.includes('@')) {
        newHistory.push('ERROR: VALID CONFIG REQUIRED.', 'Enter your EMAIL:');
      } else {
        setFormData(prev => ({ ...prev, email: cleanInput }));
        newHistory.push(`EMAIL LOGGED: "${cleanInput}"`, 'Enter your MESSAGE:');
        nextStep = 2;
      }
    } else if (step === 2) {
      setFormData(prev => ({ ...prev, message: cleanInput }));
      newHistory.push(`MSG SECURED. Confirm packet transmission? (Y/N)`);
      nextStep = 3;
    } else if (step === 3) {
      if (cleanInput.toLowerCase() === 'y' || cleanInput.toLowerCase() === 'yes' || !cleanInput) {
        newHistory.push('ENCRYPTING...', 'SENDING PACKET...', 'TRANSMISSION SUCCESS.', 'Type "reset" to restart.');
        window.location.href = `mailto:rishipopat@outlook.com?subject=Modem contact from ${formData.name}&body=${formData.message}%0D%0A%0D%0AFrom: ${formData.name} (${formData.email})`;
        nextStep = 4;
      } else {
        newHistory.push('TRANSMISSION ABORTED.', 'Type "reset" to restart.');
        nextStep = 4;
      }
    } else if (step === 4) {
      if (cleanInput.toLowerCase() === 'reset' || cleanInput.toLowerCase() === 'clear') {
        setFormData({ name: '', email: '', message: '' });
        newHistory = ['Rishi Mihir Popat Direct Modem Access Port v1.02', 'Enter your NAME to establish linkage:'];
        nextStep = 0;
      } else {
        newHistory.push('COMMAND INVALID. Type "reset".');
      }
    }

    setCliHistory(newHistory);
    setInputValue('');
    setStep(nextStep);
  };

  return (
    <div 
      id="contact-widget"
      onClick={() => cliInputRef.current?.focus()}
      className="md:col-span-4 te-card bg-black border-4 border-black text-neo-green font-mono p-6 min-h-[400px] flex flex-col justify-between relative shadow-[8px_8px_0px_0px_#000] cursor-text"
    >
      {/* Top tab bar */}
      <div className="absolute top-0 left-0 right-0 bg-[#151515] border-b-2 border-black px-4 py-2 flex items-center justify-between text-[9px] font-black text-neutral-400 select-none">
        <div className="flex items-center gap-2">
          <TermIcon size={12} className="text-neo-green animate-pulse" />
          <span>GUEST@PORTFOLIO:~</span>
        </div>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </div>
      </div>

      {/* Terminal log */}
      <div className="flex-1 overflow-y-auto mt-6 mb-4 space-y-1 text-xs font-bold pr-2 pt-2 select-none">
        {cliHistory.map((line, i) => (
          <div key={i} className={line.startsWith('guest@') ? 'text-neo-cyan' : line.includes('SUCCESS') ? 'text-neo-yellow' : line.includes('ERROR') ? 'text-red-500' : 'text-neo-green'}>
            {line}
          </div>
        ))}
      </div>

      {/* Terminal Input */}
      <form onSubmit={handleCliSubmit} className="border-t border-neutral-800 pt-3 flex items-center gap-2">
        <span className="text-neo-cyan text-xs font-bold shrink-0">guest@portfolio:~$</span>
        <input
          ref={cliInputRef}
          type={step === 1 ? 'email' : 'text'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-transparent text-neo-green border-none outline-none font-mono text-xs font-bold caret-neo-green"
          placeholder={step === 3 ? '[Y/N]' : step === 4 ? 'Type "reset"...' : 'Type input...'}
        />
        <button type="submit" className="text-neo-green hover:text-white shrink-0 p-1">
          <InputArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
