export interface InputParameters {
  siteAreaHa: number;              // Площадь участка, га (default 10)
  floors: number;                  // Этажность (default 3)
  buildingCoverageRatio: number;   // Коэффициент застройки (default 0.4)
  avgApartmentArea: number;        // Средняя площадь квартиры, м² (default 55)
  familyRatio: number;             // Коэф. семейственности, чел./кв. (default 2.5)
  greenSpaceNorm: number;          // Норма озеленения, м²/чел. (default 6)
  livingSpaceNorm: number;         // Жилищная обеспеченность, м²/чел. (default 30)
  kids0to7Ratio: number;           // Доля детей 0-7 лет (default 0.07)
  kids7to18Ratio: number;          // Доля детей 7-18 лет (default 0.12)
  kindergartenExisting: number;    // Существующие места в садике (default 0)
  schoolExisting: number;          // Существующие места в школе (default 0)
  parkingExisting: number;         // Существующие машиноместа (default 0)
}

export interface CalculationResults {
  // 1. Площади и объемы
  builtAreaHa: number;             // Площадь застройки = Площадь участка × Коэф. застройки (га)
  builtAreaM2: number;             // Площадь застройки в м²
  totalResidentialArea: number;    // Общая площадь жилья = Площадь застройки × Этажность × 10000 (м²)
  buildingDensity: number;         // Плотность застройки = Общая площадь жилья / Площадь участка / 1000 (тыс. м²/га)
  densityStatus: 'ОК' | 'Превышение'; // Норматив Казань: <= 12 тыс. м²/га

  // 2. Жители и квартиры
  apartmentsCount: number;         // Количество квартир = Общая площадь жилья / Средняя площадь квартиры
  population: number;              // Численность населения = Количество квартир × Коэф. семейственности
  populationDensity: number;       // Плотность населения = Численность населения / Площадь участка (чел./га)
  popDensityStatus: 'ОК' | 'Превышение'; // Норматив: <= 210 чел./га

  // 3. Озеленение
  greenAreaRequired: number;       // Площадь озеленения = Численность населения × Норма озеленения (м²)
  greenProvision: number;          // Обеспеченность озеленением = Площадь озеленения / Численность населения (м²/чел.)
  greenStatus: 'ОК' | 'Недостаточно'; // Норматив: >= 6 м²/чел.

  // 4. Социальная инфраструктура
  kids0to7Count: number;           // Всего детей 0-7
  kindergartenNeeded: number;      // Требуемые места в садике = Население × Доля 0-7 × 0.85
  kindergartenDeficit: number;     // Дефицит садика = Требуемые места - Существующие

  kids7to18Count: number;          // Всего детей 7-18
  schoolNeeded: number;            // Требуемые места в школе = Население × Доля 7-18 × 0.95
  schoolDeficit: number;           // Дефицит школы = Требуемые места - Существующие

  // 5. Парковки
  parkingConstantNeeded: number;   // Требуемые машиноместа (постоянные) = Общая площадь жилья / 80
  parkingTemporaryNeeded: number;  // Требуемые машиноместа (временные) = Общая площадь жилья / 560
  parkingTotalNeeded: number;      // Сумма постоянных и временных
  parkingDeficit: number;          // Дефицит парковки = Требуемые постоянные места - Существующие машиноместа
  parkingTotalDeficit: number;     // С учетом временных
}

export interface ScenarioPreset {
  id: string;
  name: string;
  description: string;
  params: InputParameters;
}
