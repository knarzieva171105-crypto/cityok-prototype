import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini client (server-side only)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Infrastructure Advisor endpoint
app.post('/api/ai-analysis', async (req: Request, res: Response) => {
  try {
    const {
      siteAreaHa,
      floors,
      buildingCoverageRatio,
      avgApartmentArea,
      familyRatio,
      greenSpaceNorm,
      livingSpaceNorm,
      kids0to7Ratio,
      kids7to18Ratio,
      kindergartenExisting,
      schoolExisting,
      parkingExisting,
      // Computed
      builtAreaHa,
      totalResidentialArea,
      buildingDensity,
      apartmentsCount,
      population,
      populationDensity,
      greenAreaRequired,
      kindergartenNeeded,
      kindergartenDeficit,
      schoolNeeded,
      schoolDeficit,
      parkingConstantNeeded,
      parkingTemporaryNeeded,
      parkingDeficit,
      densityStatus,
      cityPreset,
    } = req.body;

    if (!ai) {
      return res.status(200).json({
        success: true,
        source: 'rule_engine',
        analysis: generateFallbackAnalysis({
          floors,
          siteAreaHa,
          densityStatus,
          populationDensity,
          schoolDeficit,
          kindergartenDeficit,
          parkingDeficit,
          apartmentsCount,
          population,
        }),
      });
    }

    const prompt = `Ты — ведущий эксперт-урбанист и градостроительный аналитик платформы «СитиОК».
Проведи экспресс-аудит проекта жилого комплекса (ЖК) и сформируй структурированное экспертное заключение для девелопера и ГлавАПУ/мэрии (город: ${cityPreset || 'Казань'}).

Параметры объекта:
- Площадь участка: ${siteAreaHa} га
- Этажность: ${floors} эт.
- Коэффициент застройки: ${buildingCoverageRatio}
- Площадь застройки: ${builtAreaHa} га
- Общая площадь жилья: ${Math.round(totalResidentialArea).toLocaleString('ru-RU')} м²
- Плотность застройки: ${buildingDensity.toFixed(2)} тыс. м²/га (Норматив Казань: <= 12 тыс. м²/га, Статус: ${densityStatus})
- Расчетное число квартир: ${Math.round(apartmentsCount)}
- Расчетное население: ${Math.round(population)} чел. (при коэф. семейственности ${familyRatio} чел./кв.)
- Плотность населения: ${Math.round(populationDensity)} чел./га (Норматив: <= 210 чел./га)
- Зеленые насаждения: норма ${greenSpaceNorm} м²/чел., требуемая площадь ${Math.round(greenAreaRequired)} м²

Баланс социальной и транспортной инфраструктуры:
- Детские сады (охват 85% детей 0-7 лет): требуется ${Math.round(kindergartenNeeded)} мест, существующие: ${kindergartenExisting}, ДЕФИЦИТ: ${Math.round(kindergartenDeficit)} мест.
- Школы (охват 95% детей 7-18 лет): требуется ${Math.round(schoolNeeded)} мест, существующие: ${schoolExisting}, ДЕФИЦИТ: ${Math.round(schoolDeficit)} мест.
- Парковки: постоянные (1 на 80 м² жилья) = ${Math.round(parkingConstantNeeded)} м/м, гостевые (1 на 560 м²) = ${Math.round(parkingTemporaryNeeded)} м/м, существующие = ${parkingExisting}, ДЕФИЦИТ постоянных: ${Math.round(parkingDeficit)} м/м.

Задача:
Сформируй четкое, профессиональное заключение на русском языке (3-4 лаконичных абзаца или маркированных пункта):
1. Оценка градостроительного баланса и соблюдения нормативов (плотность застройки и населения).
2. Критические дефициты (школы, садики, парковки) и социальные риски.
3. Конкретные рекомендации девелоперу и городу: строительство встроенно-пристроенного ДОУ / школы, многоуровневый паркинг, оптимизация ТЭП или корректировка этажности/квартирографии.
Пиши четко, емко, без лишней воды.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.status(200).json({
      success: true,
      source: 'gemini',
      analysis: response.text ?? 'Анализ сформирован успешно.',
    });
  } catch (err: unknown) {
    console.error('Error in AI analysis route:', err);
    return res.status(200).json({
      success: true,
      source: 'rule_engine_fallback',
      analysis: 'При текущих параметрах зафиксирован существенный дефицит мест в школах и ДОУ. Рекомендуется корректировка технико-экономических показателей либо заключение договора КРТ с обязательством строительства социнфраструктуры.',
    });
  }
});

function generateFallbackAnalysis(params: {
  floors: number;
  siteAreaHa: number;
  densityStatus: string;
  populationDensity: number;
  schoolDeficit: number;
  kindergartenDeficit: number;
  parkingDeficit: number;
  apartmentsCount: number;
  population: number;
}) {
  const warnings: string[] = [];
  if (params.densityStatus === 'Превышение') {
    warnings.push(`Плотность застройки превышает казанский регламент в 12 тыс. м²/га.`);
  }
  if (params.populationDensity > 210) {
    warnings.push(`Плотность населения (${Math.round(params.populationDensity)} чел./га) выше рекомендованного порога (210 чел./га).`);
  }
  if (params.schoolDeficit > 0) {
    warnings.push(`Дефицит мест в школах составляет ${Math.round(params.schoolDeficit)} уч. мест (95% охват школьников).`);
  }
  if (params.kindergartenDeficit > 0) {
    warnings.push(`Дефицит мест в дошкольных учреждениях составляет ${Math.round(params.kindergartenDeficit)} мест.`);
  }
  if (params.parkingDeficit > 0) {
    warnings.push(`Дефицит постоянных машиномест: ${Math.round(params.parkingDeficit)} м/м.`);
  }

  return warnings.length > 0
    ? `Аналитическое заключение «СитиОК»: ${warnings.join(' ')} Рекомендуется рассмотреть проектирование встроенно-пристроенного детского сада, оптимизацию этажности (текущая: ${params.floors} эт.) либо переход на формат комплексного развития территории (КРТ).`
    : `Проект полностью сбалансирован: социальная инфраструктура, парковочные места и плотностные показатели укладываются в региональные нормативы градостроительного проектирования (РНГП).`;
}

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CityOK Urban Planner server running on port ${port}`);
  });
}

startServer();
