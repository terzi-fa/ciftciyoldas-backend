import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  // Yeni mesaj oluştur
  async create(senderId: number, createMessageDto: CreateMessageDto): Promise<Message> {
    const message = this.messageRepository.create({
      content: createMessageDto.content,
      sender: { id: senderId },
      receiver: { id: createMessageDto.receiver_id }
    });

    return await this.messageRepository.save(message);
  }

  // Kullanıcının gelen mesajlarını getir
  async getReceivedMessages(userId: number): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { receiver: { id: userId } },
      relations: ['sender'],
      order: { created_at: 'DESC' }
    });
  }

  // Kullanıcının gönderdiği mesajları getir
  async getSentMessages(userId: number): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { sender: { id: userId } },
      relations: ['receiver'],
      order: { created_at: 'DESC' }
    });
  }

  // İki kullanıcı arasındaki mesajlaşma geçmişini getir
  async getConversation(userId: number, otherUserId: number): Promise<Message[]> {
    return await this.messageRepository.find({
      where: [
        { sender: { id: userId }, receiver: { id: otherUserId } },
        { sender: { id: otherUserId }, receiver: { id: userId } }
      ],
      relations: ['sender', 'receiver'],
      order: { created_at: 'ASC' }
    });
  }

  // Mesajı okundu olarak işaretle
  async markAsRead(messageId: number, userId: number): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId, receiver: { id: userId } }
    });

    if (!message) {
      throw new NotFoundException('Mesaj bulunamadı');
    }

    message.is_read = true;
    return await this.messageRepository.save(message);
  }
}