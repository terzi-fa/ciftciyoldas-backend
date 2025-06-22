import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './entities/news.entity';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // Test endpoint'i
  @Get('test')
  async testNews() {
    return { message: 'News API çalışıyor!', timestamp: new Date().toISOString() };
  }

  // Yeni endpoint'ler - Harici API'den haber çekme
  @Get('agriculture')
  async getAgricultureNews() {
    return this.newsService.getAgricultureNews();
  }

  @Get('agriculture/latest')
  async getLatestAgricultureNews() {
    return this.newsService.getLatestAgricultureNews();
  }

  @Get('agriculture/rss')
  async getAgricultureNewsFromRSS() {
    return this.newsService.getAgricultureNewsFromRSS();
  }

  // Eski endpoint'ler (artık kullanılmayacak)
  @Get()
  findAll(): Promise<News[]> {
    return this.newsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<News> {
    return this.newsService.findOne(+id);
  }

  @Post()
  create(@Body() news: Partial<News>): Promise<News> {
    return this.newsService.create(news);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() news: Partial<News>): Promise<News> {
    return this.newsService.update(+id, news);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.newsService.remove(+id);
  }
} 