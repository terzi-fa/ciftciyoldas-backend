 import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateFieldDto {
  @IsString()
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  area: number;

  @IsString()
  @IsOptional()
  soilType?: string;

  @IsString()
  @IsOptional()
  cropType?: string;

  @IsString()
  @IsOptional()
  description?: string;
} 