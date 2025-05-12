export class FertilizerRecommendationDto {
  recommended_fertilizers: string[];
  explanation: string;
  application_notes: string;
  crop_type_id: number;
  growth_stage_id: number;
  nutrients: { [key: string]: number };
} 