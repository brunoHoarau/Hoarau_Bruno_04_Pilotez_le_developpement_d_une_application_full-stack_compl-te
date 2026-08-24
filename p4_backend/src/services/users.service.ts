import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/users/create-user.dto';
import { UpdateUserDto } from '../dto/users/update-user.dto';

@Injectable()
export class UsersService {
  remove(id: number) {
      throw new Error('Method not implemented.');
  }
  update(id: number, updateUserDto: UpdateUserDto) {
      throw new Error('Method not implemented.');
  }
  findOneById(id: number) {
      throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findOneByEmail(createUserDto.email);
    
    if (existingUser) {
      throw new ConflictException(
        'Cette adresse email est déjà utilisée.',
      );
    }
    
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

}