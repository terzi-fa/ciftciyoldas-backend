import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsNumber()
  user_id: number;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsString()
  type: string;

  @IsString()
  category: string;

  @IsBoolean()
  @IsOptional()
  is_read?: boolean;
} 