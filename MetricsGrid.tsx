import React from 'react';
import { Building, Users, Trees, Home, Compass, Layers } from 'lucide-react';
import { CalculationResults, InputParameters } from '../types';

interface MetricsGridProps {
  results: CalculationResults;
  params: InputParameters;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ results, params }) => {
  return (
    <section id="metrics" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span>Технико-экономические показатели (ТЭП)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Расчетные метрики застройки по формулам вычислительного ядра СитиОК
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono flex items-center gap-3">
          <span>Участок: <strong className="text-white">{params.siteAreaHa} га</strong></span>
          <span>·</span>
          <span>Этажность: <strong className="text-orange-400">{params.floors} эт.</strong></span>
          <span>·</span>
          <span>К. застройки: <strong className="text-white">{params.buildingCoverageRatio}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Площадь застройки */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Пл. застройки</span>
            <Layers className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {results.builtAreaHa.toFixed(2)}
              <span className="text-xs font-normal text-slate-400 ml-1">га</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {Math.round(results.builtAreaM2).toLocaleString('ru-RU')} м²
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
            {params.siteAreaHa} га × {params.buildingCoverageRatio}
          </div>
        </div>

        {/* Metric 2: Общая площадь жилья */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Площадь жилья</span>
            <Building className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {(results.totalResidentialArea / 1000).toFixed(1)}
              <span className="text-xs font-normal text-slate-400 ml-1">тыс. м²</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {Math.round(results.totalResidentialArea).toLocaleString('ru-RU')} м²
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
            {results.builtAreaHa.toFixed(2)} га × {params.floors} эт. × 10 000
          </div>
        </div>

        {/* Metric 3: Плотность застройки (Kazan norm <= 12) */}
        <div
          className={`border rounded-xl p-3.5 flex flex-col justify-between transition-colors ${
            results.densityStatus === 'Превышение'
              ? 'bg-rose-950/20 border-rose-900/60'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Плотность застройки
            </span>
            <Compass className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                {results.buildingDensity.toFixed(2)}
              </span>
              <span className="text-xs font-normal text-slate-400">тыс. м²/га</span>
            </div>
            <div className="mt-1">
              {results.densityStatus === 'ОК' ? (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Норматив Казань: ОК
                </span>
              ) : (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  Превышение (&gt; 12)
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
            Норма Казани: ≤ 12 тыс. м²/га
          </div>
        </div>

        {/* Metric 4: Квартиры и население */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Население ЖК</span>
            <Users className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {Math.round(results.population).toLocaleString('ru-RU')}
              <span className="text-xs font-normal text-slate-400 ml-1">чел.</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {Math.round(results.apartmentsCount).toLocaleString('ru-RU')} квартир
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
            {params.familyRatio} чел./кв. · {params.avgApartmentArea} м²/кв.
          </div>
        </div>

        {/* Metric 5: Плотность населения (Norm <= 210) */}
        <div
          className={`border rounded-xl p-3.5 flex flex-col justify-between transition-colors ${
            results.popDensityStatus === 'Превышение'
              ? 'bg-rose-950/20 border-rose-900/60'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Плотность жильцов
            </span>
            <Home className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                {Math.round(results.populationDensity)}
              </span>
              <span className="text-xs font-normal text-slate-400">чел./га</span>
            </div>
            <div className="mt-1">
              {results.popDensityStatus === 'ОК' ? (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  В норме (≤ 210)
                </span>
              ) : (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  Превышение (&gt; 210)
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
            Норматив: ≤ 210 чел./га
          </div>
        </div>

        {/* Metric 6: Озеленение */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Озеленение</span>
            <Trees className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold font-mono text-white tabular-nums">
              {results.greenProvision.toFixed(1)}
              <span className="text-xs font-normal text-slate-400 ml-1">м²/чел.</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
              Требуется {Math.round(results.greenAreaRequired).toLocaleString('ru-RU')} м²
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
            Норматив: ≥ 6 м²/чел. (ОК)
          </div>
        </div>
      </div>
    </section>
  );
};
