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
  async create(userId: number, createForumMessageDto: CreateForumMessageDto): Promise<ForumMessage> {
    const message = this.forumMessageRepository.create({
      content: createForumMessageDto.content,
      user: { id: userId },
    });

    return await this.forumMessageRepository.save(message);
  }

  // Tüm mesajları getir
  async findAll(): Promise<ForumMessage[]> {
    return await this.forumMessageRepository.find({
      relations: ['user'],
      order: {
        created_at: 'DESC',
      },
    });
  }

  // Belirli bir mesajı getir
  async findOne(id: number): Promise<ForumMessage> {
    const message = await this.forumMessageRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!message) {
      throw new NotFoundException(`Forum mesajı #${id} bulunamadı`);
    }

    return message;
  }

  // Mesajı güncelle
  async update(id: number, updateForumMessageDto: UpdateForumMessageDto): Promise<ForumMessage> {
    const message = await this.findOne(id);
    Object.assign(message, updateForumMessageDto);
    return await this.forumMessageRepository.save(message);
  }

  // Mesajı sil
  async remove(id: number): Promise<void> {
    const message = await this.findOne(id);
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