import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

export class CreateOrganicFertilizerRecordDto {
  @IsNumber()
  fieldId: number;

  @IsString()
  fertilizerType: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  cost: number;

  @IsDate()
  applicationDate: Date;

  @IsString()
  @IsOptional()
  notes?: string;
} 