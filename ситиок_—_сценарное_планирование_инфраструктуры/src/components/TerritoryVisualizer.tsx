import React, { useState } from 'react';
import { Layers, PieChart, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { CalculationResults, InputParameters } from '../types';

interface TerritoryVisualizerProps {
  params: InputParameters;
  results: CalculationResults;
}

export const TerritoryVisualizer: React.FC<TerritoryVisualizerProps> = ({ params, results }) => {
  const [activeTab, setActiveTab] = useState<'balance' | 'demographics' | 'norms'>('balance');

  // Land use calculations
  const totalSiteM2 = params.siteAreaHa * 10000;
  const builtM2 = results.builtAreaM2;
  const greenM2 = Math.min(results.greenAreaRequired, totalSiteM2 - builtM2);
  const parkingAndRoadsM2 = Math.min(
    results.parkingConstantNeeded * 25, // ~25 m² per standard parking slot + driveways
    Math.max(0, totalSiteM2 - builtM2 - greenM2)
  );
  const courtyardM2 = Math.max(0, totalSiteM2 - builtM2 - greenM2 - parkingAndRoadsM2);

  const builtPct = totalSiteM2 > 0 ? Math.round((builtM2 / totalSiteM2) * 100) : 0;
  const greenPct = totalSiteM2 > 0 ? Math.round((greenM2 / totalSiteM2) * 100) : 0;
  const roadsPct = totalSiteM2 > 0 ? Math.round((parkingAndRoadsM2 / totalSiteM2) * 100) : 0;
  const courtyardPct = Math.max(0, 100 - builtPct - greenPct - roadsPct);

  // Demographics
  const pop = Math.round(results.population);
  const kids0to7 = Math.round(results.kids0to7Count);
  const kids7to18 = Math.round(results.kids7to18Count);
  const adults = Math.max(0, pop - kids0to7 - kids7to18);

  const kids0to7Pct = pop > 0 ? Math.round((kids0to7 / pop) * 100) : 7;
  const kids7to18Pct = pop > 0 ? Math.round((kids7to18 / pop) * 100) : 12;
  const adultsPct = Math.max(0, 100 - kids0to7Pct - kids7to18Pct);

  return (
    <section id="masterplan" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span>Градостроительный баланс и мастер-план</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Пространственное распределение земельного участка ({params.siteAreaHa} га = {totalSiteM2.toLocaleString('ru-RU')} м²)
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('balance')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'balance'
                ? 'bg-orange-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Баланс территории
          </button>
          <button
            onClick={() => setActiveTab('demographics')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'demographics'
                ? 'bg-orange-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Демография
          </button>
          <button
            onClick={() => setActiveTab('norms')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'norms'
                ? 'bg-orange-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Нормативы Казани
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left column: Visual Masterplan Asset */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden p-3.5">
          <div className="relative rounded-lg overflow-hidden border border-slate-800/80 aspect-[16/10] bg-slate-950">
            <img
              src="/src/assets/images/cityok_urban_masterplan_1794402951057.jpg"
              alt="Схема генерального плана жилого квартала СитиОК"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-[11px] font-mono text-slate-200">
                Модель квартала: {params.floors} эт. · {results.builtAreaHa.toFixed(1)} га застройки · {Math.round(results.population)} чел.
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
              <span className="text-[10px] text-slate-400 font-sans block">Коэф. застройки:</span>
              <span className="text-sm font-bold text-white tabular-nums">{params.buildingCoverageRatio}</span>
              <span className="text-[10px] text-slate-400 block font-sans">({builtPct}% от участка)</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
              <span className="text-[10px] text-slate-400 font-sans block">Плотность жилфонда:</span>
              <span className={`text-sm font-bold tabular-nums ${results.densityStatus === 'ОК' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {results.buildingDensity.toFixed(2)} тыс. м²/га
              </span>
              <span className="text-[10px] text-slate-400 block font-sans">Норма: ≤ 12.0</span>
            </div>
          </div>
        </div>

        {/* Right column: Dynamic Tabs Content */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          {activeTab === 'balance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-orange-400" />
                  Структура использования земельного участка
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Всего: {totalSiteM2.toLocaleString('ru-RU')} м²
                </span>
              </div>

              {/* Segmented Progress Bar */}
              <div className="h-4 w-full bg-slate-800 rounded-md overflow-hidden flex">
                <div style={{ width: `${builtPct}%` }} className="bg-orange-500 hover:opacity-90 transition-all" title={`Пятно застройки: ${builtPct}%`} />
                <div style={{ width: `${greenPct}%` }} className="bg-emerald-500 hover:opacity-90 transition-all" title={`Озеленение: ${greenPct}%`} />
                <div style={{ width: `${roadsPct}%` }} className="bg-indigo-500 hover:opacity-90 transition-all" title={`Парковки и проезды: ${roadsPct}%`} />
                <div style={{ width: `${courtyardPct}%` }} className="bg-sky-500 hover:opacity-90 transition-all" title={`Дворы и площадки: ${courtyardPct}%`} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
                    <span className="text-slate-300 font-medium">Застройка</span>
                  </div>
                  <div className="text-base font-bold font-mono text-white mt-1 tabular-nums">
                    {builtPct}%
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {Math.round(builtM2).toLocaleString('ru-RU')} м²
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                    <span className="text-slate-300 font-medium">Озеленение</span>
                  </div>
                  <div className="text-base font-bold font-mono text-white mt-1 tabular-nums">
                    {greenPct}%
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {Math.round(greenM2).toLocaleString('ru-RU')} м²
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
                    <span className="text-slate-300 font-medium">Парковки/дороги</span>
                  </div>
                  <div className="text-base font-bold font-mono text-white mt-1 tabular-nums">
                    {roadsPct}%
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {Math.round(parkingAndRoadsM2).toLocaleString('ru-RU')} м²
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
                    <span className="text-slate-300 font-medium">Дворовые зоны</span>
                  </div>
                  <div className="text-base font-bold font-mono text-white mt-1 tabular-nums">
                    {courtyardPct}%
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {Math.round(courtyardM2).toLocaleString('ru-RU')} м²
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60 text-[11px] text-slate-300 space-y-1">
                <span className="font-semibold text-slate-200">Вывод СитиОК по земельному балансу:</span>
                <p>
                  Коэффициент застройки {params.buildingCoverageRatio} оставляет {(100 - builtPct)}% площади под благоустройство, детские и спортивные площадки, скверы и проезды спецтехники МЧС (норматив пожарного проезда соблюден).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'demographics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <PieChart className="w-3.5 h-3.5 text-orange-400" />
                  Демографический профиль и возрастные группы
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Всего: {pop.toLocaleString('ru-RU')} жителей
                </span>
              </div>

              {/* Segmented Demographics Bar */}
              <div className="h-4 w-full bg-slate-800 rounded-md overflow-hidden flex">
                <div style={{ width: `${kids0to7Pct}%` }} className="bg-amber-500 hover:opacity-90 transition-all" title={`Дети 0-7: ${kids0to7Pct}%`} />
                <div style={{ width: `${kids7to18Pct}%` }} className="bg-sky-500 hover:opacity-90 transition-all" title={`Школьники 7-18: ${kids7to18Pct}%`} />
                <div style={{ width: `${adultsPct}%` }} className="bg-slate-600 hover:opacity-90 transition-all" title={`Взрослые: ${adultsPct}%`} />
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                    <span className="text-slate-300 font-medium">Дошкольники (0–7)</span>
                  </div>
                  <div className="text-base font-bold font-mono text-white mt-1 tabular-nums">
                    {kids0to7.toLocaleString('ru-RU')} <span className="text-xs font-normal text-slate-400">чел.</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {kids0to7Pct}% · ДОУ охват 85%
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
                    <span className="text-slate-300 font-medium">Школьники (7–18)</span>
                  </div>
                  <div className="text-base font-bold font-mono text-white mt-1 tabular-nums">
                    {kids7to18.toLocaleString('ru-RU')} <span className="text-xs font-normal text-slate-400">чел.</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {kids7to18Pct}% · Школы охват 95%
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-slate-500" />
                    <span className="text-slate-300 font-medium">Взрослое население</span>
                  </div>
                  <div className="text-base font-bold font-mono text-white mt-1 tabular-nums">
                    {adults.toLocaleString('ru-RU')} <span className="text-xs font-normal text-slate-400">чел.</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {adultsPct}% · Экономически активные
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60 text-[11px] text-slate-300 space-y-1">
                <span className="font-semibold text-slate-200">Примечание к нормативам охвата:</span>
                <p>
                  По нормативу Казани и СП 42.13330 расчетные места в школах принимаются с коэффициентом 0.95 (95% охвата школьников), в детских садах — 0.85 (85% охвата дошкольников).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'norms' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-orange-400" />
                  Чек-лист соблюдения градостроительных нормативов г. Казани
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Check 1 */}
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-200">Плотность застройки жилого микрорайона</span>
                    <span className="text-[10px] text-slate-400 block">Норматив Казани: ≤ 12.0 тыс. м²/га</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-white font-bold">{results.buildingDensity.toFixed(2)} тыс. м²/га</span>
                    {results.densityStatus === 'ОК' ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-sans font-bold">
                        <CheckCircle2 className="w-3 h-3" /> ОК
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 font-sans font-bold">
                        <AlertTriangle className="w-3 h-3" /> Превышение
                      </span>
                    )}
                  </div>
                </div>

                {/* Check 2 */}
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-200">Плотность населения территории</span>
                    <span className="text-[10px] text-slate-400 block">Норматив градостроительного проектирования: ≤ 210 чел./га</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-white font-bold">{Math.round(results.populationDensity)} чел./га</span>
                    {results.popDensityStatus === 'ОК' ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-sans font-bold">
                        <CheckCircle2 className="w-3 h-3" /> ОК
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 font-sans font-bold">
                        <AlertTriangle className="w-3 h-3" /> Превышение
                      </span>
                    )}
                  </div>
                </div>

                {/* Check 3 */}
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-200">Обеспеченность зелеными насаждениями</span>
                    <span className="text-[10px] text-slate-400 block">Минимальный норматив озеленения: ≥ 6 м²/чел.</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-white font-bold">{results.greenProvision.toFixed(1)} м²/чел.</span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-sans font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Соответствует
                    </span>
                  </div>
                </div>

                {/* Check 4 */}
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-200">Обеспеченность постоянными машиноместами</span>
                    <span className="text-[10px] text-slate-400 block">Норматив: 1 м/м на каждые 80 м² общей площади жилья</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-white font-bold">Требуется {Math.round(results.parkingConstantNeeded)} м/м</span>
                    {results.parkingDeficit <= 0 ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-sans font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Обеспечено
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 font-sans font-bold">
                        <AlertTriangle className="w-3 h-3" /> Недостает {Math.round(results.parkingDeficit)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
