import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import axios from 'axios';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async getAgricultureNews(): Promise<any[]> {
    return this.getAgricultureNewsFromRSS();
  }

  async getLatestAgricultureNews(): Promise<any[]> {
    return this.getAgricultureNewsFromRSS();
  }

  // RSS Feed'lerden çekme (Ana kaynak)
  async getAgricultureNewsFromRSS(): Promise<any[]> {
    try {
      // Çalışan RSS feed'ler - güncellenmiş liste
      const rssFeeds = [
        // Tarım ve Orman Bakanlığı
        'https://www.tarimorman.gov.tr/haberler/rss',
        'https://www.tarimorman.gov.tr/duyurular/rss',
        'https://www.tarimorman.gov.tr/basin/rss',
        
        // Tarım Haber Siteleri
        'https://www.tarimdanhaber.com/feed',
        'https://www.tarimhaberleri.com/feed',
        'https://www.tarimdunyasi.net/feed',
        'https://www.tarim.gov.tr/feed',
        'https://www.tarimorman.gov.tr/feed',
        
        // Alternatif formatlar
        'https://www.tarimdanhaber.com/rss.xml',
        'https://www.tarimhaberleri.com/rss.xml',
        'https://www.tarimdunyasi.net/rss.xml',
        'https://www.tarim.gov.tr/rss.xml',
        'https://www.tarimorman.gov.tr/rss.xml',
        
        // Google News RSS (tarım araması)
        'https://news.google.com/rss/search?q=tarım+çiftçi&hl=tr&gl=TR&ceid=TR:tr',
        'https://news.google.com/rss/search?q=agriculture+farming&hl=tr&gl=TR&ceid=TR:tr',
        
        // Yahoo News RSS
        'https://news.yahoo.com/rss/topics/agriculture',
        
        // Alternatif kaynaklar
        'https://www.aa.com.tr/tr/rss/default?cat=gundem',
        'https://www.trthaber.com/rss.php?cat=ekonomi',
        'https://www.anadoluajansi.com.tr/rss/tr/gundem',
      ];

      const allNews: any[] = [];

      for (const feedUrl of rssFeeds) {
        try {
          console.log(`RSS feed deneniyor: ${feedUrl}`);
          const response = await axios.get(feedUrl, {
            timeout: 5000, // 5 saniye timeout
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          
          console.log(`RSS feed başarılı: ${feedUrl}, status: ${response.status}`);
          
          // RSS XML'i parse et
          const newsItems = this.parseRSSFeed(response.data);
          allNews.push(...newsItems);
          
          // En az 10 haber bulduysa dur
          if (allNews.length >= 10) {
            console.log(`Yeterli haber bulundu: ${allNews.length}`);
            break;
          }
        } catch (feedError) {
          console.error(`RSS feed hatası (${feedUrl}):`, feedError.message);
        }
      }

      // Haberleri tarihe göre sırala ve en fazla 15 haber döndür
      const sortedNews = allNews
        .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
        .slice(0, 15);

      console.log(`Toplam ${sortedNews.length} haber bulundu`);

      // Eğer RSS'den haber gelmezse örnek haberler döndür
      if (sortedNews.length === 0) {
        console.log('RSS\'den haber gelmedi, örnek haberler döndürülüyor');
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
      console.log('RSS parsing başlıyor, data length:', xmlData?.length || 0);
      
      if (!xmlData || typeof xmlData !== 'string') {
        console.log('Geçersiz XML data');
        return news;
      }

      // Farklı RSS formatlarını dene
      let itemMatches = xmlData.match(/<item>([\s\S]*?)<\/item>/g);
      
      if (!itemMatches) {
        // Alternatif format - Atom
        itemMatches = xmlData.match(/<entry>([\s\S]*?)<\/entry>/g);
      }
      
      if (!itemMatches) {
        // Başka format - genel
        itemMatches = xmlData.match(/<(item|entry)>([\s\S]*?)<\/(item|entry)>/g);
      }

      console.log(`Bulunan item sayısı: ${itemMatches?.length || 0}`);

      if (itemMatches) {
        itemMatches.forEach((item, index) => {
          try {
            // Farklı formatlarda title arama
            const titleMatch = item.match(/<title[^>]*>(.*?)<\/title>/i) || 
                              item.match(/<name[^>]*>(.*?)<\/name>/i);
            
            // Farklı formatlarda description arama
            const descriptionMatch = item.match(/<(description|summary|content)[^>]*>(.*?)<\/(description|summary|content)>/i) ||
                                   item.match(/<content[^>]*>(.*?)<\/content>/i);
            
            // Farklı formatlarda link arama
            const linkMatch = item.match(/<link[^>]*>(.*?)<\/link>/i) ||
                             item.match(/<link[^>]*href="([^"]*)"[^>]*>/i) ||
                             item.match(/<url[^>]*>(.*?)<\/url>/i);
            
            // Farklı formatlarda tarih arama
            const pubDateMatch = item.match(/<(pubDate|published|updated|date)[^>]*>(.*?)<\/(pubDate|published|updated|date)>/i);

            if (titleMatch && descriptionMatch) {
              const title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
              const content = descriptionMatch[1] || descriptionMatch[2] || '';
              const cleanContent = content.replace(/<[^>]*>/g, '').trim();
              
              console.log(`Haber ${index + 1}: ${title.substring(0, 50)}...`);
              
              // Sadece tarım ile ilgili haberleri al
              if (this.isAgricultureRelated(title, cleanContent)) {
                // URL'yi kontrol et ve geçerli hale getir
                let url = linkMatch ? (linkMatch[1] || linkMatch[2]) : null;
                if (!url || url === '#' || url === '') {
                  // Geçerli bir URL yoksa, haber detayı için placeholder
                  url = `https://www.tarimorman.gov.tr/haberler/${encodeURIComponent(title)}`;
                }
                
                news.push({
                  title: title,
                  content: cleanContent,
                  url: url,
                  image_url: 'https://via.placeholder.com/300x200?text=Tarım+Haberi',
                  published_at: pubDateMatch ? pubDateMatch[2] : new Date().toISOString(),
                  source: 'Tarım Haberleri',
                });
                
                console.log(`Tarım haberi eklendi: ${title.substring(0, 30)}...`);
              }
            }
          } catch (itemError) {
            console.error(`Item parsing hatası (${index}):`, itemError.message);
          }
        });
      }
    } catch (error) {
      console.error('RSS parsing hatası:', error);
    }

    console.log(`Toplam ${news.length} tarım haberi parse edildi`);
    return news;
  }

  // Haberin tarım ile ilgili olup olmadığını kontrol et
  private isAgricultureRelated(title: string, content: string): boolean {
    const agricultureKeywords = [
      // Türkçe tarım terimleri
      'tarım', 'çiftçi', 'çiftçilik', 'ekin', 'hasat', 'organik', 'gübre', 'pestisit',
      'tarla', 'bahçe', 'sera', 'tohum', 'fide', 'sulama', 'drenaj', 'ziraat',
      'veteriner', 'hayvancılık', 'balıkçılık', 'ormancılık', 'çiftlik', 'farm',
      'mahsul', 'ürün', 'verim', 'toprak', 'ekoloji', 'sürdürülebilir',
      'biyolojik', 'doğal', 'geleneksel', 'modern tarım', 'akıllı tarım',
      'hassas tarım', 'dikey tarım', 'hidroponik', 'aerooponik',
      
      // İngilizce tarım terimleri
      'agriculture', 'farmer', 'farming', 'crop', 'harvest', 'organic', 'fertilizer',
      'pesticide', 'field', 'garden', 'greenhouse', 'seed', 'seedling', 'irrigation',
      'veterinary', 'livestock', 'fishing', 'forestry', 'farm', 'yield', 'soil',
      'ecology', 'sustainable', 'biological', 'natural', 'traditional', 'modern farming',
      'smart farming', 'precision agriculture', 'vertical farming', 'hydroponic', 'aeroponic',
      
      // Bitki türleri
      'buğday', 'arpa', 'mısır', 'pirinç', 'patates', 'domates', 'salatalık',
      'wheat', 'barley', 'corn', 'rice', 'potato', 'tomato', 'cucumber',
      
      // Hayvan türleri
      'sığır', 'koyun', 'keçi', 'tavuk', 'balık', 'arı', 'kovan',
      'cattle', 'sheep', 'goat', 'chicken', 'fish', 'bee', 'hive',
      
      // Tarım ekipmanları
      'traktör', 'pulluk', 'biçerdöver', 'sulama sistemi', 'sera sistemi',
      'tractor', 'plow', 'harvester', 'irrigation system', 'greenhouse system'
    ];

    const text = (title + ' ' + content).toLowerCase();
    
    // En az 1 tarım kelimesi içermeli (gevşetildi)
    const matchedKeywords = agricultureKeywords.filter(keyword => text.includes(keyword));
    
    console.log(`Haber kontrolü: "${title.substring(0, 50)}..." - Bulunan kelimeler: ${matchedKeywords.join(', ')}`);
    
    return matchedKeywords.length >= 1; // En az 1 tarım kelimesi olmalı (gevşetildi)
  }

  // Örnek tarım haberleri (son çare)
  private getSampleAgricultureNews(): any[] {
    return [
      {
        title: 'Organik Tarımda Yeni Dönem Başlıyor',
        content: 'Türkiye\'de organik tarım uygulamaları hızla yaygınlaşıyor. Çiftçiler organik üretim tekniklerini benimsiyor ve verimlilik artıyor. Tarım ve Orman Bakanlığı organik tarım desteklerini artırıyor.',
        url: 'https://www.tarimorman.gov.tr/haberler/organik-tarimda-yeni-donem',
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