import { IsString, IsNotEmpty, IsDateString, IsDecimal, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;  // Ürün adı

  @IsString()
  @IsOptional()
  certificate_id?: string;  // Sertifika ID

  @IsDateString()
  @IsOptional()
  production_date?: string;  // Üretim tarihi

  @IsDateString()
  @IsOptional()
  expiration_date?: string;  // Son kullanma tarihi

  @IsDecimal()
  @IsOptional()
  price?: number;  // Fiyat

  @IsString()
  @IsOptional()
  seller_location?: string;  // Satıcı lokasyonu
}
