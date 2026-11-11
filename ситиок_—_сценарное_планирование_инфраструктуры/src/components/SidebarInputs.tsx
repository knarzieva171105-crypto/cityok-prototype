import React, { useState } from 'react';
import { Sliders, Bookmark, ChevronDown, ChevronRight, School, Baby, Car, Sparkles, Undo2 } from 'lucide-react';
import { InputParameters } from '../types';
import { SCENARIO_PRESETS, DEFAULT_PARAMETERS } from '../utils/calculator';

interface SidebarInputsProps {
  params: InputParameters;
  onChange: (newParams: InputParameters) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const SidebarInputs: React.FC<SidebarInputsProps> = ({
  params,
  onChange,
  isOpen,
  onToggle,
}) => {
  const [activePreset, setActivePreset] = useState<string>('default');
  const [showExistingGroup, setShowExistingGroup] = useState<boolean>(true);
  const [showAdvancedDemographics, setShowAdvancedDemographics] = useState<boolean>(false);

  const handlePresetSelect = (presetId: string) => {
    setActivePreset(presetId);
    const preset = SCENARIO_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      onChange({ ...preset.params });
    }
  };

  const updateParam = <K extends keyof InputParameters>(key: K, value: number) => {
    setActivePreset('custom');
    onChange({
      ...params,
      [key]: value,
    });
  };

  return (
    <aside
      className={`transition-all duration-200 border-r border-slate-800 bg-slate-900/90 backdrop-blur-md flex flex-col shrink-0 ${
        isOpen ? 'w-84 xl:w-92' : 'w-12'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-slate-800">
        {isOpen ? (
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
            <Sliders className="w-4 h-4 text-orange-400" />
            <span>Параметры моделирования</span>
          </div>
        ) : (
          <button
            onClick={onToggle}
            className="w-full flex justify-center py-1 text-slate-400 hover:text-orange-400 transition-colors"
            title="Развернуть панель параметров"
          >
            <Sliders className="w-4 h-4" />
          </button>
        )}
        {isOpen && (
          <button
            onClick={onToggle}
            className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Свернуть боковую панель"
          >
            Свернуть
          </button>
        )}
      </div>

      {isOpen && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-300">
          {/* Preset scenarios */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-orange-400" />
                Сценарные пресеты
              </label>
              {activePreset !== 'default' && (
                <button
                  onClick={() => handlePresetSelect('default')}
                  className="text-[10px] text-orange-400 hover:underline flex items-center gap-1"
                >
                  <Undo2 className="w-2.5 h-2.5" /> к ТЗ
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {SCENARIO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] font-medium transition-all ${
                    activePreset === preset.id
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                  }`}
                >
                  <div className="font-semibold truncate">{preset.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-800/80" />

          {/* Primary Key Sliders: Area & Floors */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-400 uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Ключевые факторы нагрузки
            </div>

            {/* Site Area Slider */}
            <div className="space-y-1.5 bg-slate-800/40 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-200">Площадь участка</label>
                <div className="flex items-center gap-1 font-mono text-orange-400 font-bold text-sm tabular-nums">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={params.siteAreaHa}
                    onChange={(e) => updateParam('siteAreaHa', Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right text-orange-300 focus:outline-none focus:border-orange-500 text-xs font-mono"
                  />
                  <span>га</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="0.5"
                value={params.siteAreaHa}
                onChange={(e) => updateParam('siteAreaHa', parseFloat(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 га</span>
                <span>По ТЗ: 10 га</span>
                <span>40 га</span>
              </div>
            </div>

            {/* Floors Slider */}
            <div className="space-y-1.5 bg-slate-800/40 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-200">Этажность</label>
                <div className="flex items-center gap-1 font-mono text-orange-400 font-bold text-sm tabular-nums">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    step="1"
                    value={params.floors}
                    onChange={(e) => updateParam('floors', Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right text-orange-300 focus:outline-none focus:border-orange-500 text-xs font-mono"
                  />
                  <span>эт.</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="32"
                step="1"
                value={params.floors}
                onChange={(e) => updateParam('floors', parseInt(e.target.value, 10))}
                className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 эт.</span>
                <span>По ТЗ: 3 эт.</span>
                <span>32 эт.</span>
              </div>
            </div>

            {/* Building Coverage Ratio */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-300">Коэффициент застройки</label>
                <span className="font-mono text-white font-semibold tabular-nums">
                  {params.buildingCoverageRatio.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.7"
                step="0.05"
                value={params.buildingCoverageRatio}
                onChange={(e) => updateParam('buildingCoverageRatio', parseFloat(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-1 bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>0.10</span>
                <span>Норма: 0.40</span>
                <span>0.70</span>
              </div>
            </div>

            {/* Average Apartment Area */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-300">Ср. площадь квартиры</label>
                <span className="font-mono text-white font-semibold tabular-nums">
                  {params.avgApartmentArea} м²
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="120"
                step="5"
                value={params.avgApartmentArea}
                onChange={(e) => updateParam('avgApartmentArea', parseInt(e.target.value, 10))}
                className="w-full accent-orange-500 cursor-pointer h-1 bg-slate-700 rounded-lg"
              />
            </div>

            {/* Family Ratio */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-300">Коэф. семейственности</label>
                <span className="font-mono text-white font-semibold tabular-nums">
                  {params.familyRatio.toFixed(1)} чел./кв.
                </span>
              </div>
              <input
                type="range"
                min="1.5"
                max="3.5"
                step="0.1"
                value={params.familyRatio}
                onChange={(e) => updateParam('familyRatio', parseFloat(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-1 bg-slate-700 rounded-lg"
              />
            </div>

            {/* Green Space Norm */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-300">Норма озеленения</label>
                <span className="font-mono text-white font-semibold tabular-nums">
                  {params.greenSpaceNorm} м²/чел.
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="14"
                step="1"
                value={params.greenSpaceNorm}
                onChange={(e) => updateParam('greenSpaceNorm', parseInt(e.target.value, 10))}
                className="w-full accent-orange-500 cursor-pointer h-1 bg-slate-700 rounded-lg"
              />
              <span className="text-[10px] text-slate-400">Норматив Казани: ≥ 6 м²/чел.</span>
            </div>
          </div>

          <div className="h-px bg-slate-800/80" />

          {/* Existing Infrastructure (Crucial for Deficit Calculation) */}
          <div className="space-y-2.5">
            <button
              onClick={() => setShowExistingGroup(!showExistingGroup)}
              className="w-full flex items-center justify-between text-[11px] font-bold text-slate-200 uppercase tracking-wider hover:text-white"
            >
              <div className="flex items-center gap-1.5">
                <BuildingIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Существующие места в районе</span>
              </div>
              {showExistingGroup ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {showExistingGroup && (
              <div className="space-y-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Baby className="w-3 h-3 text-amber-400" />
                      Места в садике
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="2000"
                      value={params.kindergartenExisting}
                      onChange={(e) => updateParam('kindergartenExisting', Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-18 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <School className="w-3 h-3 text-sky-400" />
                      Места в школе
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      value={params.schoolExisting}
                      onChange={(e) => updateParam('schoolExisting', Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-18 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Car className="w-3 h-3 text-indigo-400" />
                      Машиноместа
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      value={params.parkingExisting}
                      onChange={(e) => updateParam('parkingExisting', Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-18 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-slate-800/80" />

          {/* Demographic Factors Accordion */}
          <div className="space-y-2">
            <button
              onClick={() => setShowAdvancedDemographics(!showAdvancedDemographics)}
              className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-400 hover:text-slate-200"
            >
              <span>Демографические коэффициенты</span>
              {showAdvancedDemographics ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>

            {showAdvancedDemographics && (
              <div className="space-y-2.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Доля детей 0-7 лет:</span>
                  <span className="font-mono text-white font-medium">{(params.kids0to7Ratio * 100).toFixed(0)}% (0.07)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Доля детей 7-18 лет:</span>
                  <span className="font-mono text-white font-medium">{(params.kids7to18Ratio * 100).toFixed(0)}% (0.12)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Жилищная обеспеч.:</span>
                  <span className="font-mono text-white font-medium">{params.livingSpaceNorm} м²/чел.</span>
                </div>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  Охват дошкольным образованием: 85%
                  <br />
                  Охват школьным образованием: 95%
                </div>
              </div>
            )}
          </div>

          {/* Reset button */}
          <div className="pt-2">
            <button
              onClick={() => {
                setActivePreset('default');
                onChange({ ...DEFAULT_PARAMETERS });
              }}
              className="w-full py-2 px-3 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-lg border border-slate-700/80 transition-colors flex items-center justify-center gap-1.5"
            >
              <Undo2 className="w-3.5 h-3.5 text-orange-400" />
              Вернуть исходные параметры ТЗ
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
