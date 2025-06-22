import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import axios from 'axios';

@Injectable()
export class NewsService {
  private readonly GNEWS_API_KEY = process.env.GNEWS_API_KEY || 'your_gnews_api_key_here';
  private readonly GNEWS_API_BASE_URL = 'https://gnews.io/api/v4';

  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async getAgricultureNews(): Promise<any[]> {
    try {
      // GNews API'den tarım haberlerini çek
      const response = await axios.get(`${this.GNEWS_API_BASE_URL}/search`, {
        params: {
          q: 'tarım OR organik tarım OR agriculture OR organic farming',
          lang: 'tr,en',
          country: 'tr',
          max: 20,
          apikey: this.GNEWS_API_KEY,
        },
      });

      if (response.data.articles) {
        return response.data.articles.map(article => ({
          title: article.title,
          content: article.description,
          url: article.url,
          image_url: article.image,
          published_at: article.publishedAt,
          source: article.source.name,
        }));
      }

      return [];
    } catch (error) {
      console.error('GNews API hatası:', error);
      // Fallback olarak RSS feed'lerden çek
      return this.getAgricultureNewsFromRSS();
    }
  }

  async getLatestAgricultureNews(): Promise<any[]> {
    try {
      // Son 7 günün tarım haberlerini çek
      const response = await axios.get(`${this.GNEWS_API_BASE_URL}/search`, {
        params: {
          q: 'tarım OR organik tarım OR agriculture OR organic farming',
          lang: 'tr,en',
          country: 'tr',
          max: 15,
          apikey: this.GNEWS_API_KEY,
        },
      });

      if (response.data.articles) {
        return response.data.articles.map(article => ({
          title: article.title,
          content: article.description,
          url: article.url,
          image_url: article.image,
          published_at: article.publishedAt,
          source: article.source.name,
        }));
      }

      return [];
    } catch (error) {
      console.error('GNews API hatası:', error);
      // Fallback olarak RSS feed'lerden çek
      return this.getAgricultureNewsFromRSS();
    }
  }

  // RSS Feed'lerden çekme (Fallback)
  async getAgricultureNewsFromRSS(): Promise<any[]> {
    try {
      // Çalışan RSS feed'ler
      const rssFeeds = [
        'https://www.tarimorman.gov.tr/rss.xml',
        'https://www.tarimdunyasi.net/rss.xml',
        'https://www.tarimhaberleri.com/rss.xml',
        'https://www.tarimdanhaber.com/rss.xml',
        'https://www.tarim.gov.tr/rss.xml',
      ];

      const allNews: any[] = [];

      for (const feedUrl of rssFeeds) {
        try {
          const response = await axios.get(feedUrl, {
            timeout: 3000, // 3 saniye timeout
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          // RSS XML'i parse et
          const newsItems = this.parseRSSFeed(response.data);
          allNews.push(...newsItems);
        } catch (feedError) {
          console.error(`RSS feed hatası (${feedUrl}):`, feedError.message);
        }
      }

      // Haberleri tarihe göre sırala ve en fazla 15 haber döndür
      const sortedNews = allNews
        .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
        .slice(0, 15);

      // Eğer RSS'den haber gelmezse örnek haberler döndür
      if (sortedNews.length === 0) {
        return this.getSampleAgricultureNews();
      }

      return sortedNews;
    } catch (error) {
      console.error('RSS haber çekme hatası:', error);
      // Son çare olarak örnek haberler döndür
      return this.getSampleAgricultureNews();
    }
  }

  // Basit RSS parser
  private parseRSSFeed(xmlData: string): any[] {
    const news: any[] = [];
    try {
      // Farklı RSS formatlarını dene
      let itemMatches = xmlData.match(/<item>([\s\S]*?)<\/item>/g);
      
      if (!itemMatches) {
        // Alternatif format
        itemMatches = xmlData.match(/<entry>([\s\S]*?)<\/entry>/g);
      }

      if (itemMatches) {
        itemMatches.forEach(item => {
          const titleMatch = item.match(/<title>(.*?)<\/title>/);
          const descriptionMatch = item.match(/<description>(.*?)<\/description>/);
          const linkMatch = item.match(/<link>(.*?)<\/link>/);
          const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);

          if (titleMatch && descriptionMatch) {
            const title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
            const content = descriptionMatch[1].replace(/<[^>]*>/g, '').trim();
            
            // Sadece tarım ile ilgili haberleri al
            if (this.isAgricultureRelated(title, content)) {
              news.push({
                title: title,
                content: content,
                url: linkMatch ? linkMatch[1] : '#',
                image_url: 'https://via.placeholder.com/300x200?text=Tarım+Haberi',
                published_at: pubDateMatch ? pubDateMatch[1] : new Date().toISOString(),
                source: 'Tarım Haberleri',
              });
            }
          }
        });
      }
    } catch (error) {
      console.error('RSS parsing hatası:', error);
    }

    return news;
  }

  // Haberin tarım ile ilgili olup olmadığını kontrol et
  private isAgricultureRelated(title: string, content: string): boolean {
    const agricultureKeywords = [
      'tarım', 'çiftçi', 'ekin', 'hasat', 'organik', 'gübre', 'pestisit',
      'agriculture', 'farmer', 'crop', 'harvest', 'organic', 'fertilizer',
      'tarla', 'bahçe', 'sera', 'tohum', 'fide', 'sulama', 'drenaj',
      'field', 'garden', 'greenhouse', 'seed', 'seedling', 'irrigation',
      'ziraat', 'veteriner', 'hayvancılık', 'balıkçılık', 'ormancılık',
      'veterinary', 'livestock', 'fishing', 'forestry', 'çiftlik', 'farm'
    ];

    const text = (title + ' ' + content).toLowerCase();
    return agricultureKeywords.some(keyword => text.includes(keyword));
  }

  // Örnek tarım haberleri (son çare)
  private getSampleAgricultureNews(): any[] {
    return [
      {
        title: 'Organik Tarımda Yeni Dönem Başlıyor',
        content: 'Türkiye\'de organik tarım uygulamaları hızla yaygınlaşıyor. Çiftçiler organik üretim tekniklerini benimsiyor ve verimlilik artıyor. Tarım ve Orman Bakanlığı organik tarım desteklerini artırıyor.',
        url: 'https://example.com/organik-tarim',
        image_url: 'https://via.placeholder.com/300x200?text=Organik+Tarım',
        published_at: new Date().toISOString(),
        source: 'Tarım Haberleri',
      },
      {
        title: 'Sürdürülebilir Tarım İçin Yeni Projeler',
        content: 'Sürdürülebilir tarım uygulamaları ile toprak verimliliği artırılıyor ve çevre korunuyor. Çiftçiler yeni teknikleri öğreniyor ve uyguluyor. Su tasarrufu sağlayan sistemler yaygınlaşıyor.',
        url: 'https://example.com/surdurulebilir-tarim',
        image_url: 'https://via.placeholder.com/300x200?text=Sürdürülebilir+Tarım',
        published_at: new Date().toISOString(),
        source: 'Tarım Haberleri',
      },
      {
        title: 'Akıllı Tarım Teknolojileri Yaygınlaşıyor',
        content: 'Drone teknolojisi ve IoT sensörleri ile tarımda verimlilik artırılıyor. Çiftçiler teknolojiyi daha etkin kullanıyor. Hassas tarım uygulamaları ile maliyetler düşüyor.',
        url: 'https://example.com/akilli-tarim',
        image_url: 'https://via.placeholder.com/300x200?text=Akıllı+Tarım',
        published_at: new Date().toISOString(),
        source: 'Tarım Haberleri',
      },
      {
        title: 'Tohum Islahı Çalışmaları Hızlanıyor',
        content: 'Yerli tohum üretimi ve ıslah çalışmaları ile tarımsal verimlilik artırılıyor. Çiftçiler kaliteli tohumlara erişiyor. Yerli tohum çeşitleri geliştiriliyor.',
        url: 'https://example.com/tohum-islahi',
        image_url: 'https://via.placeholder.com/300x200?text=Tohum+Islahı',
        published_at: new Date().toISOString(),
        source: 'Tarım Haberleri',
      },
      {
        title: 'Su Tasarrufu İçin Modern Sulama Sistemleri',
        content: 'Damla sulama ve yağmurlama sistemleri ile su tasarrufu sağlanıyor. Çiftçiler su kaynaklarını daha verimli kullanıyor. Devlet sulama sistemleri için destek veriyor.',
        url: 'https://example.com/sulama-sistemleri',
        image_url: 'https://via.placeholder.com/300x200?text=Sulama+Sistemleri',
        published_at: new Date().toISOString(),
        source: 'Tarım Haberleri',
      },
      {
        title: 'Çiftçi Destekleri Artırılıyor',
        content: 'Tarım destekleri ve çiftçi yardımları artırılıyor. Genç çiftçilere özel destekler veriliyor. Tarımsal kredi faizleri düşürülüyor.',
        url: 'https://example.com/ciftci-destekleri',
        image_url: 'https://via.placeholder.com/300x200?text=Çiftçi+Destekleri',
        published_at: new Date().toISOString(),
        source: 'Tarım Haberleri',
      },
      {
        title: 'Seracılıkta Yeni Teknolojiler',
        content: 'Modern sera teknolojileri ile yıl boyu üretim yapılıyor. LED aydınlatma ve otomasyon sistemleri kullanılıyor. Seracılıkta verimlilik artıyor.',
        url: 'https://example.com/seracilik',
        image_url: 'https://via.placeholder.com/300x200?text=Seracılık',
        published_at: new Date().toISOString(),
        source: 'Tarım Haberleri',
      },
    ];
  }

  // Eski veritabanı metodları (artık kullanılmayacak)
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