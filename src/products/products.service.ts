// src/products/products.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // Market için tüm ürünleri listele
  // src/products/products.service.ts
async findAll(): Promise<Product[]> {
  return this.productRepository.find({
    relations: ['user'],
    select: {
      id: true,
      name: true,
      price: true,
      certificate_id: true,
      production_date: true,
      expiration_date: true,
      seller_location: true,
      production_place: true,
      user: {
        id: true,
        full_name: true  // Entity'deki property adını kullanıyoruz
      }
    },
    order: { created_at: 'DESC' }
  });
}

  // Kullanıcının kendi ürünlerini listele
  async findUserProducts(userId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' }
    });
  }

  // Yeni ürün oluştur
  async create(createProductDto: CreateProductDto, userId: number): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      user: { id: userId }
    });
    return this.productRepository.save(product);
  }

  // Ürün güncelle
  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    const updatedProduct = await this.productRepository.findOne({ 
      where: { id },
      relations: ['user']
    });
    
    if (!updatedProduct) {
      throw new NotFoundException('Ürün bulunamadı');
    }
    
    return updatedProduct;
  }

  // Ürün sil
  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  // Ürün sahipliğini kontrol et
  async checkProductOwnership(productId: number, userId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['user']
    });

    if (!product) {
      throw new NotFoundException('Ürün bulunamadı');
    }

    if (product.user.id !== userId) {
      throw new ForbiddenException('Bu ürün üzerinde işlem yapma yetkiniz yok');
    }

    return product;
  }
}