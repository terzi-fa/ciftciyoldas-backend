import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async findAll(): Promise<News[]> {
    return this.newsRepository.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<News> {
    return this.newsRepository.findOneOrFail({ where: { id } });
  }

  async create(news: Partial<News>): Promise<News> {
    const newNews = this.newsRepository.create(news);
    return this.newsRepository.save(newNews);
  }

  async update(id: number, news: Partial<News>): Promise<News> {
    await this.newsRepository.update(id, news);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.newsRepository.update(id, { is_active: false });
  }
} 