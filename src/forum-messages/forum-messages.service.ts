import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ForumMessage } from './entities/forum-message.entity';
import { CreateForumMessageDto } from './dto/create-forum-message.dto';
import { UpdateForumMessageDto } from './dto/update-forum-message.dto';

@Injectable()
export class ForumMessagesService {
  constructor(
    @InjectRepository(ForumMessage)
    private readonly forumMessageRepository: Repository<ForumMessage>,
  ) {}

  // Yeni forum mesajı oluştur
  async create(userId: number, createForumMessageDto: CreateForumMessageDto): Promise<any> {
    const message = this.forumMessageRepository.create({
      ...createForumMessageDto,
      user: { id: userId }
    });

    if (createForumMessageDto.parent_message_id) {
      message.parent_message = { id: createForumMessageDto.parent_message_id } as ForumMessage;
    }

    const saved = await this.forumMessageRepository.save(message);
    // Kullanıcıyı da ekle
    const full = await this.forumMessageRepository.findOne({
      where: { id: saved.id },
      relations: ['user']
    });
    return full;
  }

  // Tüm ana mesajları getir
  async findAllMainMessages(): Promise<ForumMessage[]> {
    return await this.forumMessageRepository.find({
      where: { parent_message: IsNull() }, // Burayı değiştirdik
      relations: ['user', 'replies'],
      order: { created_at: 'DESC' }
    });
  }

  // Belirli bir mesajı ve yanıtlarını getir
  async findOne(id: number): Promise<ForumMessage> {
    const message = await this.forumMessageRepository.findOne({
      where: { id },
      relations: ['user', 'replies', 'replies.user']
    });

    if (!message) {
      throw new NotFoundException('Mesaj bulunamadı');
    }

    return message;
  }

  // Mesajı güncelle
  async update(id: number, userId: number, updateForumMessageDto: UpdateForumMessageDto): Promise<ForumMessage> {
    const message = await this.forumMessageRepository.findOne({
      where: { id, user: { id: userId } }
    });

    if (!message) {
      throw new NotFoundException('Mesaj bulunamadı veya düzenleme yetkiniz yok');
    }

    Object.assign(message, updateForumMessageDto);
    message.updated_at = new Date();

    return await this.forumMessageRepository.save(message);
  }

  // Mesajı sil
  async remove(id: number, userId: number): Promise<void> {
    const message = await this.forumMessageRepository.findOne({
      where: { id, user: { id: userId } }
    });

    if (!message) {
      throw new NotFoundException('Mesaj bulunamadı veya silme yetkiniz yok');
    }

    await this.forumMessageRepository.remove(message);
  }

  // Mesajı beğen
  async likeMessage(id: number): Promise<ForumMessage> {
    const message = await this.forumMessageRepository.findOne({
      where: { id }
    });

    if (!message) {
      throw new NotFoundException('Mesaj bulunamadı');
    }

    message.likes_count += 1;
    return await this.forumMessageRepository.save(message);
  }
}