import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateSensorDto {
  @IsNotEmpty()
  @IsString()
  sensor_id: string;  // sensor_code yerine sensor_id kullanıyoruz çünkü entity'de bu şekilde

  @IsOptional()
  @IsNumber()
  ph_value?: number;  // pH değeri (0-14 arası)

  @IsOptional()
  @IsNumber()
  nitrogen_ratio?: number;  // Azot oranı (%)

  @IsOptional()
  @IsNumber()
  phosphorus_ratio?: number;  // Fosfor oranı (%)

  @IsOptional()
  @IsNumber()
  potassium_ratio?: number;  // Potasyum oranı (%)

  @IsOptional()
  @IsNumber()
  humidity_ratio?: number;  // Nem oranı (%)

  @IsOptional()
  @IsNumber()
  soil_temperature?: number;  // Toprak sıcaklığı (°C)

  @IsOptional()
  @IsNumber()
  electrical_conductivity?: number;  // Elektriksel iletkenlik (dS/m)

  @IsOptional()
  @IsString()
  notes?: string;  // Ekstra notlar

  @IsOptional()
  @IsNumber()
  userId?: number;  // Kullanıcı ID'si (opsiyonel, JWT ile de alınabilir)

  @IsOptional()
  @IsNumber()
  field_id?: number;
}