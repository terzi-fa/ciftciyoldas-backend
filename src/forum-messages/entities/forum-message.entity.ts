import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('forum_messages')
export class ForumMessage {
  @PrimaryGeneratedColumn()
  id: number;

  

  @Column('text')
  content: string;

  @ManyToOne(() => User, user => user.forumMessages)
  user: User;

  @ManyToOne(() => ForumMessage, message => message.replies, { nullable: true })
  parent_message: ForumMessage;

  @OneToMany(() => ForumMessage, message => message.parent_message)
  replies: ForumMessage[];

  @Column({ default: 0 })
  likes_count: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  updated_at: Date;
}