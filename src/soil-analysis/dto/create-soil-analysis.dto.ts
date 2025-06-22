export class CreateSoilAnalysisDto {
  phLevel: number;
  nitrogenLevel: number;
  phosphorusLevel: number;
  potassiumLevel: number;
  salinityLevel: number;
  organicMatterLevel: number;
  notes?: string;
  fieldId: number;
} 