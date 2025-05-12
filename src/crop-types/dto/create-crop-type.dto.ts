import { IsString, IsOptional } from 'class-validator';

export class CreateCropTypeDto {
  @IsString()
  name: string;  // Ekin türünün adı (zorunlu)

  @IsString()
  @IsOptional()
  description?: string;  // Ekin türünün açıklaması (isteğe bağlı)
}

