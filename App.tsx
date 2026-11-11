import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SidebarInputs } from './components/SidebarInputs';
import { MetricsGrid } from './components/MetricsGrid';
import { DeficitSection } from './components/DeficitSection';
import { AiAssistantCard } from './components/AiAssistantCard';
import { TerritoryVisualizer } from './components/TerritoryVisualizer';
import { ScenarioCompare } from './components/ScenarioCompare';
import { ExportReportModal } from './components/ExportReportModal';
import { InputParameters } from './types';
import { DEFAULT_PARAMETERS, calculateUrbanMetrics } from './utils/calculator';
import { SlidersHorizontal } from 'lucide-react';

export default function App() {
  const [params, setParams] = useState<InputParameters>({ ...DEFAULT_PARAMETERS });
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('metrics');
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);

  // Memoized reactive calculation of all urban parameters
  const results = useMemo(() => calculateUrbanMetrics(params), [params]);

  const handleResetToDefault = () => {
    setParams({ ...DEFAULT_PARAMETERS });
  };

  const handleSelectScenario = (newParams: InputParameters) => {
    setParams({ ...newParams });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* 3-Zone Clean Header */}
      <Header
        onReset={handleResetToDefault}
        onOpenReport={() => setReportModalOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Workspace Layout (Sidebar + Dashboard Viewport) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Streamlit-style Sidebar */}
        <SidebarInputs
          params={params}
          onChange={setParams}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Dashboard Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-7">
          {/* Top Quick-Glance Banner (Interactive controls & Context) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 items-center justify-center text-orange-400">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight">
                  Сценарная модель жилого комплекса: {params.siteAreaHa} га · {params.floors} этажей
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Меняйте слайдеры слева для мгновенной переоценки дефицита школ, детсадов и парковок в реальном времени
                </p>
              </div>
            </div>

            {/* Quick Floor Selector shortcuts */}
            <div className="flex items-center gap-1.5 self-start sm:self-center">
              <span className="text-[11px] text-slate-400 mr-1 hidden md:inline">Этажность:</span>
              {[3, 5, 9, 16, 24].map((f) => (
                <button
                  key={f}
                  onClick={() => setParams((prev) => ({ ...prev, floors: f }))}
                  className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md transition-all ${
                    params.floors === f
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/25'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={`Установить этажность: ${f} эт.`}
                >
                  {f} эт.
                </button>
              ))}
            </div>
          </div>

          {/* 1. Блок «Дефицит инфраструктуры» (Ключевая ценность СитиОК) */}
          <DeficitSection results={results} params={params} />

          {/* 2. Блок «ИИ-помощник СитиОК» (Аналитическое заключение) */}
          <AiAssistantCard params={params} results={results} />

          {/* 3. Технико-экономические показатели (ТЭП и формулы) */}
          <MetricsGrid results={results} params={params} />

          {/* 4. Градостроительный баланс территории и нормативы Казани */}
          <TerritoryVisualizer params={params} results={results} />

          {/* 5. Сценарная матрица (Сравнение вариантов) */}
          <ScenarioCompare
            currentParams={params}
            onSelectScenario={handleSelectScenario}
          />
        </main>
      </div>

      {/* Printable / Exportable Modal */}
      <ExportReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        params={params}
        results={results}
      />
    </div>
  );
}
