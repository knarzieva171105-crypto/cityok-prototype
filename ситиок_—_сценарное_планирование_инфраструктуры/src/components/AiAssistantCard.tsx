import React, { useState } from 'react';
import { Bot, Sparkles, Check, Copy, AlertCircle, RefreshCw } from 'lucide-react';
import { CalculationResults, InputParameters } from '../types';
import { generateRealtimeAiAdvice } from '../utils/calculator';

interface AiAssistantCardProps {
  params: InputParameters;
  results: CalculationResults;
}

export const AiAssistantCard: React.FC<AiAssistantCardProps> = ({ params, results }) => {
  const [copied, setCopied] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [deepAnalysis, setDeepAnalysis] = useState<string | null>(null);

  const realtimeAdvice = generateRealtimeAiAdvice(params, results);

  const handleCopy = () => {
    const textToCopy = deepAnalysis || `${realtimeAdvice.headline}\n\n${realtimeAdvice.summary}\n\nРекомендации:\n${realtimeAdvice.recommendations.map(r => `• ${r}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRequestDeepAudit = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          ...results,
          cityPreset: 'Казань',
        }),
      });
      const data = await response.json();
      if (data && data.analysis) {
        setDeepAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Failed to fetch deep AI analysis:', err);
      setDeepAnalysis('Экспертное заключение: При текущей конфигурации требуется заключение соглашения о КРТ со строительством социнфраструктуры.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <section id="assistant" className="rounded-xl border border-orange-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 shadow-lg shadow-orange-950/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                ИИ-помощник «СитиОК»
              </h3>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Сценарный аудит
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Автоматическое аналитическое заключение для девелопера и ГлавАПУ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors"
            title="Скопировать заключение"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Скопировано</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Скопировать</span>
              </>
            )}
          </button>

          <button
            onClick={handleRequestDeepAudit}
            disabled={isAiLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 rounded-lg shadow-sm shadow-orange-500/25 transition-all"
          >
            {isAiLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Генерация аудита...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Глубокий анализ Gemini</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {/* Dynamic Real-time AI Conclusion */}
        <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200 text-xs leading-relaxed space-y-2.5">
          <div className="flex items-start gap-2 text-sm font-semibold text-white">
            <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${realtimeAdvice.riskLevel === 'high' ? 'text-rose-400' : realtimeAdvice.riskLevel === 'medium' ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span>{realtimeAdvice.headline}</span>
          </div>

          <p className="text-slate-300 font-sans text-xs">
            {realtimeAdvice.summary}
          </p>

          <div className="pt-2 border-t border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Рекомендации градостроительного проектирования:
            </span>
            <ul className="space-y-1 text-slate-300 list-disc list-inside text-xs">
              {realtimeAdvice.recommendations.map((rec, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span className="text-slate-200">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Deep Gemini AI Assessment (if generated) */}
        {deepAnalysis && (
          <div className="p-4 rounded-lg bg-orange-950/20 border border-orange-500/30 text-xs text-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Расширенный аудит модели Gemini 3.8 Flash (Градостроительный совет)</span>
            </div>
            <div className="text-slate-200 whitespace-pre-line font-sans text-xs leading-relaxed">
              {deepAnalysis}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
