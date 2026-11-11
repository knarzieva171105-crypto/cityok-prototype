import React from 'react';
import { Building2, FileText, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenReport: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenReport,
  activeSection,
  setActiveSection,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
          <Building2 className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            СитиОК <span className="text-orange-400 font-medium text-xs ml-1 font-mono">B2G / MVP</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium tracking-wide">
            Сценарное планирование инфраструктуры
          </span>
        </div>
      </div>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => setActiveSection('metrics')}
          className={`transition-colors whitespace-nowrap hover:text-white ${
            activeSection === 'metrics' ? 'text-orange-400 font-semibold border-b-2 border-orange-500 pb-0.5' : ''
          }`}
        >
          ТЭП застройки
        </button>
        <button
          onClick={() => setActiveSection('deficit')}
          className={`transition-colors whitespace-nowrap hover:text-white ${
            activeSection === 'deficit' ? 'text-orange-400 font-semibold border-b-2 border-orange-500 pb-0.5' : ''
          }`}
        >
          Дефицит инфраструктуры
        </button>
        <button
          onClick={() => setActiveSection('masterplan')}
          className={`transition-colors whitespace-nowrap hover:text-white ${
            activeSection === 'masterplan' ? 'text-orange-400 font-semibold border-b-2 border-orange-500 pb-0.5' : ''
          }`}
        >
          Баланс территории
        </button>
        <button
          onClick={() => setActiveSection('assistant')}
          className={`transition-colors whitespace-nowrap hover:text-white ${
            activeSection === 'assistant' ? 'text-orange-400 font-semibold border-b-2 border-orange-500 pb-0.5' : ''
          }`}
        >
          ИИ-Помощник
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onReset}
          title="Сбросить параметры к базовым значениям ТЗ"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Сброс ТЗ</span>
        </button>
        <button
          onClick={onOpenReport}
          className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 active:scale-[0.98] rounded-lg shadow-sm shadow-orange-500/20 transition-all whitespace-nowrap"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Градостроительный паспорт</span>
        </button>
      </div>
    </header>
  );
};
