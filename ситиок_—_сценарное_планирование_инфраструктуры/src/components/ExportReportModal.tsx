import React, { useState } from 'react';
import { X, Printer, Copy, Check, Building2 } from 'lucide-react';
import { CalculationResults, InputParameters } from '../types';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: InputParameters;
  results: CalculationResults;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  params,
  results,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyReport = () => {
    const text = `ГРАДОСТРОИТЕЛЬНЫЙ ПАСПОРТ ОБЪЕКТА (СитиОК)
Дата формирования: ${new Date().toLocaleDateString('ru-RU')}
Город / Регламент: Казань (РНГП г. Казани / СП 42.13330)

1. ПАРАМЕТРЫ ЗАСТРОЙКИ:
- Площадь участка: ${params.siteAreaHa} га
- Этажность: ${params.floors} эт.
- Коэффициент застройки: ${params.buildingCoverageRatio}
- Площадь застройки: ${results.builtAreaHa.toFixed(2)} га (${Math.round(results.builtAreaM2)} м²)
- Общая площадь жилья: ${Math.round(results.totalResidentialArea).toLocaleString('ru-RU')} м²
- Плотность застройки: ${results.buildingDensity.toFixed(2)} тыс. м²/га (Норма: <= 12, Статус: ${results.densityStatus})

2. ДЕМОГРАФИЯ:
- Количество квартир: ${Math.round(results.apartmentsCount)}
- Расчетное население: ${Math.round(results.population)} чел.
- Плотность населения: ${Math.round(results.populationDensity)} чел./га (Норма: <= 210, Статус: ${results.popDensityStatus})

3. БАЛАНС ИНФРАСТРУКТУРЫ И ДЕФИЦИТ:
- Школы (охват 95%): требуется ${Math.round(results.schoolNeeded)} мест, существующие: ${params.schoolExisting}, ДЕФИЦИТ: ${Math.round(results.schoolDeficit)} мест.
- Детские сады (охват 85%): требуется ${Math.round(results.kindergartenNeeded)} мест, существующие: ${params.kindergartenExisting}, ДЕФИЦИТ: ${Math.round(results.kindergartenDeficit)} мест.
- Парковки (1 на 80 м²): требуется ${Math.round(results.parkingConstantNeeded)} м/м, существующие: ${params.parkingExisting}, ДЕФИЦИТ: ${Math.round(results.parkingDeficit)} м/м.
- Озеленение: норма ${params.greenSpaceNorm} м²/чел., требуемая площадь ${Math.round(results.greenAreaRequired)} м².`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Градостроительный паспорт объекта</h3>
              <p className="text-[11px] text-slate-400 font-mono">Система сценарного планирования «СитиОК»</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Скопировано' : 'Текст'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Печать / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content / Printable Document */}
        <div className="p-6 space-y-6 text-slate-200 text-xs font-sans max-h-[75vh] overflow-y-auto">
          {/* Header Metadata */}
          <div className="flex justify-between items-start border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs text-orange-400 font-bold uppercase tracking-wider block">
                Заключение о социальной обеспеченности ЖК
              </span>
              <h1 className="text-xl font-extrabold text-white mt-1">
                Проект жилого комплекса: {params.siteAreaHa} га, {params.floors} этажей
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                Нормативная база: Градостроительный кодекс РФ, РНГП г. Казани, СП 42.13330
              </p>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-400">
              <div>Дата: {new Date().toLocaleDateString('ru-RU')}</div>
              <div>Версия ядра: 1.4-MVP</div>
            </div>
          </div>

          {/* Table 1: TEP */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              1. Технико-экономические показатели
            </h4>
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left font-mono">
                <tbody className="divide-y divide-slate-800/80">
                  <tr className="bg-slate-950/40">
                    <td className="p-2.5 font-sans text-slate-300">Площадь земельного участка</td>
                    <td className="p-2.5 font-bold text-white text-right">{params.siteAreaHa} га ({params.siteAreaHa * 10000} м²)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans text-slate-300">Предельная этажность</td>
                    <td className="p-2.5 font-bold text-white text-right">{params.floors} этажей</td>
                  </tr>
                  <tr className="bg-slate-950/40">
                    <td className="p-2.5 font-sans text-slate-300">Коэффициент застройки участка</td>
                    <td className="p-2.5 text-white text-right">{params.buildingCoverageRatio} ({results.builtAreaHa.toFixed(2)} га застройки)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans text-slate-300">Общая площадь жилья</td>
                    <td className="p-2.5 font-bold text-white text-right">{Math.round(results.totalResidentialArea).toLocaleString('ru-RU')} м²</td>
                  </tr>
                  <tr className="bg-slate-950/40">
                    <td className="p-2.5 font-sans text-slate-300">Плотность застройки жилого района</td>
                    <td className="p-2.5 font-bold text-right">
                      <span className={results.densityStatus === 'ОК' ? 'text-emerald-400' : 'text-rose-400'}>
                        {results.buildingDensity.toFixed(2)} тыс. м²/га (Норма Казань ≤ 12: {results.densityStatus})
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans text-slate-300">Расчетное число квартир</td>
                    <td className="p-2.5 text-white text-right">{Math.round(results.apartmentsCount).toLocaleString('ru-RU')} шт. (при ср. пл. {params.avgApartmentArea} м²)</td>
                  </tr>
                  <tr className="bg-slate-950/40">
                    <td className="p-2.5 font-sans text-slate-300">Расчетное население</td>
                    <td className="p-2.5 font-bold text-white text-right">{Math.round(results.population).toLocaleString('ru-RU')} чел. ({params.familyRatio} чел./кв.)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans text-slate-300">Плотность населения</td>
                    <td className="p-2.5 font-bold text-right">
                      <span className={results.popDensityStatus === 'ОК' ? 'text-emerald-400' : 'text-rose-400'}>
                        {Math.round(results.populationDensity)} чел./га (Норма ≤ 210: {results.popDensityStatus})
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Infrastructure Deficit */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              2. Баланс социальной и транспортной инфраструктуры
            </h4>
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 text-[10px] font-sans uppercase">
                    <th className="p-2.5">Инфраструктура</th>
                    <th className="p-2.5 text-right">Требуется</th>
                    <th className="p-2.5 text-right">Существует</th>
                    <th className="p-2.5 text-right">Дефицит / Баланс</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  <tr>
                    <td className="p-2.5 font-sans text-slate-200">
                      Школы (охват 95% детей 7-18 лет)
                    </td>
                    <td className="p-2.5 text-right text-white">{Math.round(results.schoolNeeded)} мест</td>
                    <td className="p-2.5 text-right text-slate-300">{params.schoolExisting} мест</td>
                    <td className="p-2.5 text-right font-bold">
                      <span className={results.schoolDeficit > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                        {results.schoolDeficit > 0 ? `-${Math.round(results.schoolDeficit)} мест` : `+${Math.abs(Math.round(results.schoolDeficit))} мест`}
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-slate-950/40">
                    <td className="p-2.5 font-sans text-slate-200">
                      Детские сады (охват 85% детей 0-7 лет)
                    </td>
                    <td className="p-2.5 text-right text-white">{Math.round(results.kindergartenNeeded)} мест</td>
                    <td className="p-2.5 text-right text-slate-300">{params.kindergartenExisting} мест</td>
                    <td className="p-2.5 text-right font-bold">
                      <span className={results.kindergartenDeficit > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                        {results.kindergartenDeficit > 0 ? `-${Math.round(results.kindergartenDeficit)} мест` : `+${Math.abs(Math.round(results.kindergartenDeficit))} мест`}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans text-slate-200">
                      Машиноместа постоянные (1 на 80 м² жилья)
                    </td>
                    <td className="p-2.5 text-right text-white">{Math.round(results.parkingConstantNeeded)} м/м</td>
                    <td className="p-2.5 text-right text-slate-300">{params.parkingExisting} м/м</td>
                    <td className="p-2.5 text-right font-bold">
                      <span className={results.parkingDeficit > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                        {results.parkingDeficit > 0 ? `-${Math.round(results.parkingDeficit)} м/м` : `+${Math.abs(Math.round(results.parkingDeficit))} м/м`}
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-slate-950/40">
                    <td className="p-2.5 font-sans text-slate-200">
                      Машиноместа гостевые / временные (1 на 560 м²)
                    </td>
                    <td className="p-2.5 text-right text-white">{Math.round(results.parkingTemporaryNeeded)} м/м</td>
                    <td className="p-2.5 text-right text-slate-300">—</td>
                    <td className="p-2.5 text-right text-slate-400">В границах УДС</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans text-slate-200">
                      Зеленые насаждения (норма ≥ 6 м²/чел.)
                    </td>
                    <td className="p-2.5 text-right text-white">{Math.round(results.greenAreaRequired)} м²</td>
                    <td className="p-2.5 text-right text-slate-300">{results.greenProvision.toFixed(1)} м²/чел.</td>
                    <td className="p-2.5 text-right font-bold text-emerald-400">Норма обеспечена</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer sign */}
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between items-center">
            <span>Сформировано алгоритмическим модулем «СитиОК»</span>
            <span>Для градостроительного совета и девелоперских служб</span>
          </div>
        </div>
      </div>
    </div>
  );
};
