// src/products/products.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Market - Tüm ürünleri listele
  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  // Kullanıcının kendi ürünlerini listele
  @Get('my-products')
  async findMyProducts(@Request() req) {
    return this.productsService.findUserProducts(req.user.id);
  }

  // Yeni ürün ekle
  @Post()
  async create(@Request() req, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto, req.user.id);
  }

  // Kendi ürününü güncelle
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    // Önce ürünün sahibi olup olmadığını kontrol et
    await this.productsService.checkProductOwnership(+id, req.user.id);
    return this.productsService.update(+id, updateProductDto);
  }

  // Kendi ürününü sil
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    // Önce ürünün sahibi olup olmadığını kontrol et
    await this.productsService.checkProductOwnership(+id, req.user.id);
    return this.productsService.remove(+id);
  }
}