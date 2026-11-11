import React from 'react';
import { School, Baby, Car, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CalculationResults, InputParameters } from '../types';

interface DeficitSectionProps {
  results: CalculationResults;
  params: InputParameters;
}

export const DeficitSection: React.FC<DeficitSectionProps> = ({ results, params }) => {
  const schoolDef = Math.round(results.schoolDeficit);
  const kinderDef = Math.round(results.kindergartenDeficit);
  const parkingDef = Math.round(results.parkingDeficit);

  // Coverage percentages (capped at 100% for progress bar, exact for tooltip)
  const schoolCoveragePct = results.schoolNeeded > 0
    ? Math.min(100, Math.round((params.schoolExisting / results.schoolNeeded) * 100))
    : 100;

  const kinderCoveragePct = results.kindergartenNeeded > 0
    ? Math.min(100, Math.round((params.kindergartenExisting / results.kindergartenNeeded) * 100))
    : 100;

  const parkingCoveragePct = results.parkingConstantNeeded > 0
    ? Math.min(100, Math.round((params.parkingExisting / results.parkingConstantNeeded) * 100))
    : 100;

  // Practical urban facilities needed equivalents
  const getSchoolFacilityAdvice = (deficit: number) => {
    if (deficit <= 0) return 'Текущая сеть школ полностью удовлетворяет спрос жителей ЖК.';
    if (deficit >= 1000) {
      return `Требуется крупный образовательный комплекс на ${deficit} мест (типовой проект школы на 1 224 учащихся).`;
    }
    if (deficit >= 500) {
      return `Требуется строительство средней общеобразовательной школы на ${deficit} мест (типовой блок на 800 мест).`;
    }
    return `Рекомендуется строительство отдельного учебного корпуса / пристройки к смежной школе на ${deficit} мест.`;
  };

  const getKinderFacilityAdvice = (deficit: number) => {
    if (deficit <= 0) return 'Потребность в дошкольных местах обеспечена.';
    if (deficit >= 240) {
      return `Требуется отдельно стоящее здание детского сада на ${deficit} мест (типовой ДОУ на 260–340 мест).`;
    }
    if (deficit >= 120) {
      return `Рекомендуется пристроенный детский сад на ${deficit} мест с отдельной площадкой.`;
    }
    return `Достаточно встроенных групп дошкольного образования на ${deficit} мест на 1-м этаже ЖК.`;
  };

  const getParkingAdvice = (deficit: number) => {
    if (deficit <= 0) return 'Парковочное пространство сбалансировано.';
    if (deficit > 800) {
      return `Рекомендуется многоуровневый отдельно стоящий паркинг на 5–6 этажей (${deficit} м/м) или 2-уровневый подземный.`;
    }
    return `Рекомендуется 1–2 уровневый подземный паркинг под стилобатом (${deficit} м/м).`;
  };

  return (
    <section id="deficit" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-white">
              Дефицит социальной инфраструктуры
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded">
              Ключевая ценность СитиОК
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Оперативный баланс «Требуется vs Существующее» с учетом нормативного охвата Казани и РФ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: ШКОЛЫ */}
        <div
          className={`rounded-xl p-5 border transition-all ${
            schoolDef > 0
              ? 'bg-rose-950/20 border-rose-900/60 shadow-sm shadow-rose-950/30'
              : 'bg-emerald-950/20 border-emerald-900/60 shadow-sm shadow-emerald-950/30'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-lg ${
                  schoolDef > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                <School className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Школьное образование
                </span>
                <span className="text-sm font-bold text-white">Места в школе</span>
              </div>
            </div>

            <div className="text-right">
              {schoolDef > 0 ? (
                <div className="flex items-center gap-1 text-rose-400 font-semibold text-xs bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Дефицит</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-emerald-400 font-semibold text-xs bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Обеспечено</span>
                </div>
              )}
            </div>
          </div>

          {/* Primary Deficit Metric */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400">Итоговый баланс (дефицит/профицит):</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span
                className={`text-3xl font-extrabold font-mono tabular-nums tracking-tight ${
                  schoolDef > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {schoolDef > 0 ? `-${schoolDef.toLocaleString('ru-RU')}` : `+${Math.abs(schoolDef).toLocaleString('ru-RU')}`}
              </span>
              <span className="text-xs font-medium text-slate-400">мест</span>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="mt-3.5 space-y-2 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 font-mono">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 font-sans">Требуется (95% детей 7-18):</span>
              <span className="font-bold text-white tabular-nums">
                {Math.round(results.schoolNeeded).toLocaleString('ru-RU')} мест
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 font-sans">Существующие места:</span>
              <span className="font-semibold text-slate-200 tabular-nums">
                {params.schoolExisting.toLocaleString('ru-RU')} мест
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 font-sans">Всего детей школьного возраста:</span>
              <span className="text-slate-400 tabular-nums">
                {Math.round(results.kids7to18Count).toLocaleString('ru-RU')} чел.
              </span>
            </div>
          </div>

          {/* Coverage Bar */}
          <div className="mt-3.5 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Обеспеченность местами:</span>
              <span className="font-mono text-slate-300 tabular-nums font-semibold">{schoolCoveragePct}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  schoolCoveragePct >= 100 ? 'bg-emerald-500' : schoolCoveragePct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${schoolCoveragePct}%` }}
              />
            </div>
          </div>

          {/* Urban planning recommendation */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300 font-sans leading-relaxed">
            {getSchoolFacilityAdvice(schoolDef)}
          </div>
        </div>

        {/* Card 2: ДЕТСКИЕ САДЫ */}
        <div
          className={`rounded-xl p-5 border transition-all ${
            kinderDef > 0
              ? 'bg-rose-950/20 border-rose-900/60 shadow-sm shadow-rose-950/30'
              : 'bg-emerald-950/20 border-emerald-900/60 shadow-sm shadow-emerald-950/30'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-lg ${
                  kinderDef > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Дошкольное образование
                </span>
                <span className="text-sm font-bold text-white">Места в детсаду</span>
              </div>
            </div>

            <div className="text-right">
              {kinderDef > 0 ? (
                <div className="flex items-center gap-1 text-rose-400 font-semibold text-xs bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Дефицит</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-emerald-400 font-semibold text-xs bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Обеспечено</span>
                </div>
              )}
            </div>
          </div>

          {/* Primary Deficit Metric */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400">Итоговый баланс (дефицит/профицит):</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span
                className={`text-3xl font-extrabold font-mono tabular-nums tracking-tight ${
                  kinderDef > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {kinderDef > 0 ? `-${kinderDef.toLocaleString('ru-RU')}` : `+${Math.abs(kinderDef).toLocaleString('ru-RU')}`}
              </span>
              <span className="text-xs font-medium text-slate-400">мест</span>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="mt-3.5 space-y-2 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 font-mono">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 font-sans">Требуется (85% детей 0-7):</span>
              <span className="font-bold text-white tabular-nums">
                {Math.round(results.kindergartenNeeded).toLocaleString('ru-RU')} мест
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 font-sans">Существующие места:</span>
              <span className="font-semibold text-slate-200 tabular-nums">
                {params.kindergartenExisting.toLocaleString('ru-RU')} мест
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 font-sans">Всего детей до 7 лет:</span>
              <span className="text-slate-400 tabular-nums">
                {Math.round(results.kids0to7Count).toLocaleString('ru-RU')} чел.
              </span>
            </div>
          </div>

          {/* Coverage Bar */}
          <div className="mt-3.5 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Обеспеченность местами:</span>
              <span className="font-mono text-slate-300 tabular-nums font-semibold">{kinderCoveragePct}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  kinderCoveragePct >= 100 ? 'bg-emerald-500' : kinderCoveragePct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${kinderCoveragePct}%` }}
              />
            </div>
          </div>

          {/* Urban planning recommendation */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300 font-sans leading-relaxed">
            {getKinderFacilityAdvice(kinderDef)}
          </div>
        </div>

        {/* Card 3: ПАРКОВКИ */}
        <div
          className={`rounded-xl p-5 border transition-all ${
            parkingDef > 0
              ? 'bg-rose-950/20 border-rose-900/60 shadow-sm shadow-rose-950/30'
              : 'bg-emerald-950/20 border-emerald-900/60 shadow-sm shadow-emerald-950/30'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-lg ${
                  parkingDef > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Транспортный баланс
                </span>
                <span className="text-sm font-bold text-white">Машиноместа</span>
              </div>
            </div>

            <div className="text-right">
              {parkingDef > 0 ? (
                <div className="flex items-center gap-1 text-rose-400 font-semibold text-xs bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Дефицит</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-emerald-400 font-semibold text-xs bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Обеспечено</span>
                </div>
              )}
            </div>
          </div>

          {/* Primary Deficit Metric */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400">Дефицит постоянных мест (1 на 80 м²):</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span
                className={`text-3xl font-extrabold font-mono tabular-nums tracking-tight ${
                  parkingDef > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {parkingDef > 0 ? `-${parkingDef.toLocaleString('ru-RU')}` : `+${Math.abs(parkingDef).toLocaleString('ru-RU')}`}
              </span>
              <span className="text-xs font-medium text-slate-400">м/м</span>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="mt-3.5 space-y-2 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 font-mono">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 font-sans">Постоянные (общ. пл. / 80):</span>
              <span className="font-bold text-white tabular-nums">
                {Math.round(results.parkingConstantNeeded).toLocaleString('ru-RU')} м/м
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 font-sans">Временные (общ. пл. / 560):</span>
              <span className="text-slate-300 tabular-nums">
                {Math.round(results.parkingTemporaryNeeded).toLocaleString('ru-RU')} м/м
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 font-sans">Существующие в проекте:</span>
              <span className="font-semibold text-slate-200 tabular-nums">
                {params.parkingExisting.toLocaleString('ru-RU')} м/м
              </span>
            </div>
          </div>

          {/* Coverage Bar */}
          <div className="mt-3.5 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Обеспеченность паркингом:</span>
              <span className="font-mono text-slate-300 tabular-nums font-semibold">{parkingCoveragePct}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  parkingCoveragePct >= 100 ? 'bg-emerald-500' : parkingCoveragePct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${parkingCoveragePct}%` }}
              />
            </div>
          </div>

          {/* Urban planning recommendation */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300 font-sans leading-relaxed">
            {getParkingAdvice(parkingDef)}
          </div>
        </div>
      </div>
    </section>
  );
};
