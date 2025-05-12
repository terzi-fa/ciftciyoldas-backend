import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Yeni kullanıcı oluştur
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Bu email adresi zaten kullanımda');
    }

    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  // Tüm kullanıcıları getir
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'full_name', 'email', 'created_at'] // Şifreyi hariç tut
    });
  }

  // ID'ye göre kullanıcı getir
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      select: ['id', 'full_name', 'email', 'created_at']
    });
    
    if (!user) {
      throw new NotFoundException(`${id} ID'li kullanıcı bulunamadı`);
    }
    return user;
  }

  // Email'e göre kullanıcı getir (auth için)
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ 
      where: { email },
      select: ['id', 'full_name', 'email', 'password', 'created_at']
    });
  }

  // Kullanıcı güncelle
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Bu email adresi zaten kullanımda');
      }
    }

    const updated = Object.assign(user, updateUserDto);
    return await this.userRepository.save(updated);
  }

  // Kullanıcı sil
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  // Kullanıcının sensörlerini getir
  async getUserSensors(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['sensors']
    });
    if (!user) {
      throw new NotFoundException(`${userId} ID'li kullanıcı bulunamadı`);
    }
    return user.sensors;
  }

  // Kullanıcının ürünlerini getir
  async getUserProducts(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['products']
    });
    if (!user) {
      throw new NotFoundException(`${userId} ID'li kullanıcı bulunamadı`);
    }
    return user.products;
  }
}