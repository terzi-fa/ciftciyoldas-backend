import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './entities/news.entity';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

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