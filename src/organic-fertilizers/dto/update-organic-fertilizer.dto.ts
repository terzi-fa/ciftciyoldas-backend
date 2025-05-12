import { IsString, IsDecimal, IsOptional } from 'class-validator';

export class UpdateOrganicFertilizerDto {
  @IsString()
  @IsOptional()
  name: string;  // Gübre adı

  @IsString()
  @IsOptional()
  description: string;  // Gübre açıklaması

  @IsDecimal()
  @IsOptional()
  price: number;  // Gübre fiyatı

  @IsString()
  @IsOptional()
  application_method: string;  // Uygulama yöntemi

  @IsString()
  @IsOptional()
  dosage: string;  // Dozaj ve zamanlama bilgisi

  @IsString()
  @IsOptional()
  storage_conditions: string;  // Depolama ve saklama koşulları

  @IsString()
  @IsOptional()
  material_quality: string;  // Kaliteli malzeme seçimi

  @IsString()
  @IsOptional()
  precautions: string;  // Dikkat edilmesi gerekenler
}
