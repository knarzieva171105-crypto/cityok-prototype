import React from 'react';
import { Columns3, ArrowRight } from 'lucide-react';
import { InputParameters } from '../types';
import { calculateUrbanMetrics, SCENARIO_PRESETS } from '../utils/calculator';

interface ScenarioCompareProps {
  currentParams: InputParameters;
  onSelectScenario: (params: InputParameters) => void;
}

export const ScenarioCompare: React.FC<ScenarioCompareProps> = ({
  currentParams,
  onSelectScenario,
}) => {
  const currentMetrics = calculateUrbanMetrics(currentParams);

  // Compute metrics for standard scenarios
  const comparisonList = [
    {
      id: 'current',
      title: 'Текущий сценарий в редакторе',
      isCurrent: true,
      params: currentParams,
      metrics: currentMetrics,
    },
    ...SCENARIO_PRESETS.slice(0, 3).map((preset) => ({
      id: preset.id,
      title: preset.name,
      isCurrent: false,
      params: preset.params,
      metrics: calculateUrbanMetrics(preset.params),
    })),
  ];

  return (
    <section className="space-y-3 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Columns3 className="w-4 h-4 text-orange-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Сценарная матрица: сравнение вариантов застройки
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Сравнение градостроительных альтернатив
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-2.5 px-3">Параметр / Сценарий</th>
              {comparisonList.map((sc) => (
                <th
                  key={sc.id}
                  className={`py-2.5 px-3 min-w-[150px] ${
                    sc.isCurrent ? 'bg-orange-500/10 text-orange-300 border-x border-orange-500/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{sc.title}</span>
                    {sc.isCurrent && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-500 text-white font-bold">
                        Активный
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono">
            {/* Row 1: Site Area & Floors */}
            <tr className="hover:bg-slate-850/50">
              <td className="py-2.5 px-3 font-sans text-slate-300 font-medium">
                Участок и этажность
              </td>
              {comparisonList.map((sc) => (
                <td
                  key={sc.id}
                  className={`py-2.5 px-3 ${sc.isCurrent ? 'bg-orange-500/5 border-x border-orange-500/20 text-white font-bold' : 'text-slate-300'}`}
                >
                  {sc.params.siteAreaHa} га · {sc.params.floors} эт.
                </td>
              ))}
            </tr>

            {/* Row 2: Residential Area */}
            <tr className="hover:bg-slate-850/50">
              <td className="py-2.5 px-3 font-sans text-slate-300 font-medium">
                Общая площадь жилья
              </td>
              {comparisonList.map((sc) => (
                <td
                  key={sc.id}
                  className={`py-2.5 px-3 ${sc.isCurrent ? 'bg-orange-500/5 border-x border-orange-500/20 text-white font-bold' : 'text-slate-300'}`}
                >
                  {(sc.metrics.totalResidentialArea / 1000).toFixed(1)} тыс. м²
                </td>
              ))}
            </tr>

            {/* Row 3: Building Density */}
            <tr className="hover:bg-slate-850/50">
              <td className="py-2.5 px-3 font-sans text-slate-300 font-medium">
                Плотность застройки (Казань ≤ 12)
              </td>
              {comparisonList.map((sc) => (
                <td
                  key={sc.id}
                  className={`py-2.5 px-3 ${sc.isCurrent ? 'bg-orange-500/5 border-x border-orange-500/20' : ''}`}
                >
                  <span
                    className={`font-semibold ${
                      sc.metrics.densityStatus === 'ОК' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {sc.metrics.buildingDensity.toFixed(2)} ({sc.metrics.densityStatus})
                  </span>
                </td>
              ))}
            </tr>

            {/* Row 4: Population */}
            <tr className="hover:bg-slate-850/50">
              <td className="py-2.5 px-3 font-sans text-slate-300 font-medium">
                Численность населения
              </td>
              {comparisonList.map((sc) => (
                <td
                  key={sc.id}
                  className={`py-2.5 px-3 ${sc.isCurrent ? 'bg-orange-500/5 border-x border-orange-500/20 text-white font-bold' : 'text-slate-300'}`}
                >
                  {Math.round(sc.metrics.population).toLocaleString('ru-RU')} чел.
                </td>
              ))}
            </tr>

            {/* Row 5: School Deficit */}
            <tr className="hover:bg-slate-850/50">
              <td className="py-2.5 px-3 font-sans text-slate-300 font-medium">
                Дефицит мест в школе (95% охват)
              </td>
              {comparisonList.map((sc) => {
                const def = Math.round(sc.metrics.schoolDeficit);
                return (
                  <td
                    key={sc.id}
                    className={`py-2.5 px-3 ${sc.isCurrent ? 'bg-orange-500/5 border-x border-orange-500/20' : ''}`}
                  >
                    <span className={`font-bold ${def > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {def > 0 ? `-${def} мест` : `+${Math.abs(def)} мест`}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Row 6: Kindergarten Deficit */}
            <tr className="hover:bg-slate-850/50">
              <td className="py-2.5 px-3 font-sans text-slate-300 font-medium">
                Дефицит детсадов (85% охват)
              </td>
              {comparisonList.map((sc) => {
                const def = Math.round(sc.metrics.kindergartenDeficit);
                return (
                  <td
                    key={sc.id}
                    className={`py-2.5 px-3 ${sc.isCurrent ? 'bg-orange-500/5 border-x border-orange-500/20' : ''}`}
                  >
                    <span className={`font-bold ${def > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {def > 0 ? `-${def} мест` : `+${Math.abs(def)} мест`}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Row 7: Parking Deficit */}
            <tr className="hover:bg-slate-850/50">
              <td className="py-2.5 px-3 font-sans text-slate-300 font-medium">
                Дефицит машиномест
              </td>
              {comparisonList.map((sc) => {
                const def = Math.round(sc.metrics.parkingDeficit);
                return (
                  <td
                    key={sc.id}
                    className={`py-2.5 px-3 ${sc.isCurrent ? 'bg-orange-500/5 border-x border-orange-500/20' : ''}`}
                  >
                    <span className={`font-bold ${def > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {def > 0 ? `-${def} м/м` : `+${Math.abs(def)} м/м`}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Actions */}
            <tr>
              <td className="py-3 px-3"></td>
              {comparisonList.map((sc) => (
                <td
                  key={sc.id}
                  className={`py-3 px-3 ${sc.isCurrent ? 'bg-orange-500/5 border-x border-orange-500/20' : ''}`}
                >
                  {!sc.isCurrent && (
                    <button
                      onClick={() => onSelectScenario(sc.params)}
                      className="flex items-center gap-1 text-[11px] font-sans font-medium text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 px-2.5 py-1 rounded transition-colors"
                    >
                      <span>Выбрать</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
