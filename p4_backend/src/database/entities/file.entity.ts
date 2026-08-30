import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

import { User } from './user.entity';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Index({ unique: true })
  @Column()
  token!: string;

  @Column()
  filename!: string;

  @Column()
  originalName!: string;

  @Column()
  mimetype!: string;

  @Column()
  size!: number;

  @Column()
  storagePath!: string;

  @Column({ type: 'varchar', nullable: true })
  passwordHash!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  physicalDeletedAt!: Date | null;

  @Column()
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user: User) => user.files, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: number;
}