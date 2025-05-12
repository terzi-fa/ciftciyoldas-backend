// src/products/dto/create-product.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Ürün adı zorunludur' })
  @IsString({ message: 'Ürün adı metin olmalıdır' })
  name: string;

  @IsNotEmpty({ message: 'Sertifika ID zorunludur' })
  @IsString({ message: 'Sertifika ID metin olmalıdır' })
  certificate_id: string;

  @IsNotEmpty({ message: 'Üretim tarihi zorunludur' })
  @IsDateString({}, { message: 'Geçerli bir üretim tarihi giriniz' })
  production_date: string;

  @IsNotEmpty({ message: 'Son kullanma tarihi zorunludur' })
  @IsDateString({}, { message: 'Geçerli bir son kullanma tarihi giriniz' })
  expiration_date: string;

  @IsNotEmpty({ message: 'Fiyat zorunludur' })
  @IsNumber({}, { message: 'Fiyat sayısal bir değer olmalıdır' })
  @Min(0, { message: 'Fiyat 0\'dan büyük olmalıdır' })
  price: number;

  @IsNotEmpty({ message: 'Satıcı lokasyonu zorunludur' })
  @IsString({ message: 'Satıcı lokasyonu metin olmalıdır' })
  seller_location: string;

  @IsNotEmpty({ message: 'Üretim yeri zorunludur' })
  @IsString({ message: 'Üretim yeri metin olmalıdır' })
  production_place: string;
}