import { InputParameters, CalculationResults, ScenarioPreset } from '../types';

export const DEFAULT_PARAMETERS: InputParameters = {
  siteAreaHa: 10,
  floors: 3,
  buildingCoverageRatio: 0.4,
  avgApartmentArea: 55,
  familyRatio: 2.5,
  greenSpaceNorm: 6,
  livingSpaceNorm: 30,
  kids0to7Ratio: 0.07,
  kids7to18Ratio: 0.12,
  kindergartenExisting: 0,
  schoolExisting: 0,
  parkingExisting: 0,
};

// Preset scenarios for rapid planning
export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'default',
    name: 'Базовый проект (ТЗ)',
    description: '10 га, 3 этажа, малоэтажная жилая застройка без существующей инфраструктуры',
    params: { ...DEFAULT_PARAMETERS },
  },
  {
    id: 'kazan_comfort_mid',
    name: 'Казань — Комфорт (7 эт.)',
    description: 'Участок 8 га, среднеэтажная застройка 7 этажей, частичная обеспеченность',
    params: {
      siteAreaHa: 8,
      floors: 7,
      buildingCoverageRatio: 0.35,
      avgApartmentArea: 58,
      familyRatio: 2.4,
      greenSpaceNorm: 7,
      livingSpaceNorm: 30,
      kids0to7Ratio: 0.075,
      kids7to18Ratio: 0.125,
      kindergartenExisting: 120,
      schoolExisting: 250,
      parkingExisting: 600,
    },
  },
  {
    id: 'kazan_highrise',
    name: 'Казань — Высотный квартал (16 эт.)',
    description: 'Участок 12 га, 16 этажей, высокая плотность населения и нагрузка на школы',
    params: {
      siteAreaHa: 12,
      floors: 16,
      buildingCoverageRatio: 0.28,
      avgApartmentArea: 52,
      familyRatio: 2.3,
      greenSpaceNorm: 6,
      livingSpaceNorm: 30,
      kids0to7Ratio: 0.07,
      kids7to18Ratio: 0.12,
      kindergartenExisting: 220,
      schoolExisting: 500,
      parkingExisting: 1800,
    },
  },
  {
    id: 'kazan_eco_low',
    name: 'Эко-квартал малоэтажный (4 эт.)',
    description: 'Участок 15 га, 4 этажа, увеличенные зеленые зоны (8 м²/чел.)',
    params: {
      siteAreaHa: 15,
      floors: 4,
      buildingCoverageRatio: 0.3,
      avgApartmentArea: 65,
      familyRatio: 2.6,
      greenSpaceNorm: 8,
      livingSpaceNorm: 35,
      kids0to7Ratio: 0.08,
      kids7to18Ratio: 0.13,
      kindergartenExisting: 180,
      schoolExisting: 300,
      parkingExisting: 800,
    },
  },
];

/**
 * Computes all technical-economic indicators (ТЭП) and social infrastructure deficits.
 * Adheres strictly to the user's formulas and Kazan standards.
 */
export function calculateUrbanMetrics(params: InputParameters): CalculationResults {
  const {
    siteAreaHa,
    floors,
    buildingCoverageRatio,
    avgApartmentArea,
    familyRatio,
    greenSpaceNorm,
    kids0to7Ratio,
    kids7to18Ratio,
    kindergartenExisting,
    schoolExisting,
    parkingExisting,
  } = params;

  // 1. Площадь застройки = Площадь участка × Коэф. застройки (в га)
  const builtAreaHa = siteAreaHa * buildingCoverageRatio;
  const builtAreaM2 = builtAreaHa * 10000;

  // Общая площадь жилья = Площадь застройки × Этажность × 10000 (м²)
  const totalResidentialArea = builtAreaHa * floors * 10000;

  // Плотность застройки = Общая площадь жилья / Площадь участка / 1000 (тыс. м²/га)
  const buildingDensity = siteAreaHa > 0 ? (totalResidentialArea / siteAreaHa / 1000) : 0;
  // Норматив Казань: <= 12 тыс. м²/га
  const densityStatus: 'ОК' | 'Превышение' = buildingDensity <= 12 ? 'ОК' : 'Превышение';

  // 2. Количество квартир = Общая площадь жилья / Средняя площадь квартиры
  const apartmentsCount = avgApartmentArea > 0 ? (totalResidentialArea / avgApartmentArea) : 0;

  // Численность населения = Количество квартир × Коэф. семейственности
  const population = apartmentsCount * familyRatio;

  // Плотность населения = Численность населения / Площадь участка (чел./га)
  // Норматив: <= 210 чел./га
  const populationDensity = siteAreaHa > 0 ? (population / siteAreaHa) : 0;
  const popDensityStatus: 'ОК' | 'Превышение' = populationDensity <= 210 ? 'ОК' : 'Превышение';

  // 3. Озеленение
  // Площадь озеленения = Численность населения × Норма озеленения
  const greenAreaRequired = population * greenSpaceNorm;
  // Обеспеченность озеленением = Площадь озеленения / Численность населения (Норматив: >= 6 м²/чел.)
  const greenProvision = population > 0 ? (greenAreaRequired / population) : 0;
  const greenStatus: 'ОК' | 'Недостаточно' = greenProvision >= 6 ? 'ОК' : 'Недостаточно';

  // 4. Социальная инфраструктура
  const kids0to7Count = population * kids0to7Ratio;
  // Требуемые места в садике = Численность населения × Доля детей 0-7 × 0.85 (85% охвата)
  const kindergartenNeeded = population * kids0to7Ratio * 0.85;
  // Дефицит садика = Требуемые места в садике - Существующие места в садике
  const kindergartenDeficit = kindergartenNeeded - kindergartenExisting;

  const kids7to18Count = population * kids7to18Ratio;
  // Требуемые места в школе = Численность населения × Доля детей 7-18 × 0.95 (95% охвата: "95 мест на 100 детей")
  const schoolNeeded = population * kids7to18Ratio * 0.95;
  // Дефицит школы = Требуемые места в школе - Существующие места в школе
  const schoolDeficit = schoolNeeded - schoolExisting;

  // 5. Парковки
  // Требуемые машиноместа (постоянные) = Общая площадь жилья / 80
  const parkingConstantNeeded = totalResidentialArea / 80;
  // Требуемые машиноместа (временные) = Общая площадь жилья / 560
  const parkingTemporaryNeeded = totalResidentialArea / 560;
  const parkingTotalNeeded = parkingConstantNeeded + parkingTemporaryNeeded;
  // Дефицит парковки = Требуемые постоянные места - Существующие машиноместа
  const parkingDeficit = parkingConstantNeeded - parkingExisting;
  const parkingTotalDeficit = parkingTotalNeeded - parkingExisting;

  return {
    builtAreaHa,
    builtAreaM2,
    totalResidentialArea,
    buildingDensity,
    densityStatus,
    apartmentsCount,
    population,
    populationDensity,
    popDensityStatus,
    greenAreaRequired,
    greenProvision,
    greenStatus,
    kids0to7Count,
    kindergartenNeeded,
    kindergartenDeficit,
    kids7to18Count,
    schoolNeeded,
    schoolDeficit,
    parkingConstantNeeded,
    parkingTemporaryNeeded,
    parkingTotalNeeded,
    parkingDeficit,
    parkingTotalDeficit,
  };
}

/**
 * Generates instant analytical conclusion for the AI assistant block
 * that mimics an intelligent urban planning co-pilot in real time.
 */
export function generateRealtimeAiAdvice(
  params: InputParameters,
  results: CalculationResults
): {
  headline: string;
  summary: string;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
} {
  const { floors } = params;
  const schoolDef = Math.round(results.schoolDeficit);
  const kinderDef = Math.round(results.kindergartenDeficit);
  const parkingDef = Math.round(results.parkingDeficit);
  const isDensityExceeded = results.densityStatus === 'Превышение';
  const isPopExceeded = results.popDensityStatus === 'Превышение';

  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (isDensityExceeded || schoolDef > 400 || kinderDef > 200 || isPopExceeded) {
    riskLevel = 'high';
  } else if (schoolDef > 0 || kinderDef > 0 || parkingDef > 0) {
    riskLevel = 'medium';
  }

  const recommendations: string[] = [];

  // School analysis
  if (schoolDef > 0) {
    if (schoolDef >= 800) {
      recommendations.push(
        `Критический дефицит школ: не хватает ${schoolDef.toLocaleString('ru-RU')} уч. мест. Необходим земельный участок под отдельное типовое школьное здание на 1 000–1 200 мест со спортивным ядром.`
      );
    } else if (schoolDef >= 300) {
      recommendations.push(
        `Дефицит школ составляет ${schoolDef.toLocaleString('ru-RU')} мест. Рекомендуется предусмотреть строительство нового учебного блока или пристройки к ближайшей СОШ.`
      );
    } else {
      recommendations.push(
        `Локальный дефицит мест в школе (${schoolDef} мест). Возможно перераспределение в смежные микрорайоны при соблюдении 500-метровой пешеходной доступности.`
      );
    }
  } else {
    recommendations.push(
      `Потребность в школьных местах полностью покрыта (профицит: ${Math.abs(schoolDef)} мест).`
    );
  }

  // Kindergarten analysis
  if (kinderDef > 0) {
    if (kinderDef >= 220) {
      recommendations.push(
        `Дефицит детсадов: ${kinderDef.toLocaleString('ru-RU')} мест. Требуется выделение отдельного пятна застройки под типовой детский сад на 260–300 мест.`
      );
    } else {
      recommendations.push(
        `Дефицит ДОУ (${kinderDef} мест). Оптимально предусмотреть встроенно-пристроенный детский сад на первых этажах жилых секций с огороженной прогулочной зоной.`
      );
    }
  } else {
    recommendations.push(
      `Дошкольная инфраструктура сбалансирована (запас: ${Math.abs(kinderDef)} мест).`
    );
  }

  // Parking analysis
  if (parkingDef > 0) {
    recommendations.push(
      `Дефицит постоянных машиномест: ${parkingDef.toLocaleString('ru-RU')} м/м. Наземной плоскостной парковки будет недостаточно; целесообразно запроектировать подземный паркинг под дворовой платформой либо многоуровневый отдельно стоящий паркинг.`
    );
  }

  // Density & height advice
  if (isDensityExceeded) {
    const targetFloors = Math.max(1, Math.floor((12 * 1000) / (params.buildingCoverageRatio * 10000)));
    recommendations.push(
      `Плотность застройки (${results.buildingDensity.toFixed(1)} тыс. м²/га) превышает регламент Казани (12 тыс. м²/га). Для приведения в норматив рекомендуется скорректировать этажность до ${targetFloors} эт. либо снизить пятно застройки.`
    );
  }

  if (isPopExceeded) {
    recommendations.push(
      `Плотность населения (${Math.round(results.populationDensity)} чел./га) превышает нормативные 210 чел./га. Это создаст пиковую нагрузку на улично-дорожную сеть в часы пик.`
    );
  }

  let headline = 'Сбалансированный проект: инфраструктура в норме';
  if (riskLevel === 'high') {
    headline = 'Критические риски: превышение нормативов и дефицит социнфраструктуры';
  } else if (riskLevel === 'medium') {
    headline = 'Требуется компенсация дефицита социальной инфраструктуры';
  }

  const summary = `При текущих параметрах ЖК (${floors} эт., ${params.siteAreaHa} га) расчетное население составит ${Math.round(
    results.population
  ).toLocaleString('ru-RU')} чел. в ${Math.round(results.apartmentsCount).toLocaleString(
    'ru-RU'
  )} квартирах. Дефицит мест в школах: ${schoolDef.toLocaleString(
    'ru-RU'
  )} мест (охват 95%), в детских садах: ${kinderDef.toLocaleString(
    'ru-RU'
  )} мест (охват 85%). Постоянных машиномест не хватает: ${parkingDef.toLocaleString('ru-RU')} м/м.`;

  return {
    headline,
    summary,
    recommendations,
    riskLevel,
  };
}
