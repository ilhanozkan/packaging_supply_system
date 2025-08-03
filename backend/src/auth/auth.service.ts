import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(data: LoginDto) {
    const { email, password } = data;

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user || !(await user.comparePassword(password)))
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.BAD_REQUEST,
      );

    return user.toResponseObject();
  }

  async register(data: RegisterDto) {
    const { email } = data;

    let user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (user)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    user = this.userRepository.create(data);
    await this.userRepository.save(user);

    return user.toResponseObject();
  }
}
