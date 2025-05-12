import { IsString, IsOptional } from 'class-validator';

export class UpdateCropTypeDto {
  @IsString()
  @IsOptional()
  name?: string;  // Ekin türünün adı (isteğe bağlı)

  @IsString()
  @IsOptional()
  description?: string;  // Ekin türünün açıklaması (isteğe bağlı)
}
