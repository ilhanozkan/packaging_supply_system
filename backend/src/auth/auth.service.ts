import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from './jwt.service';

import { UserRole } from '../user/enum/user-role.enum';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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
        'Geçersiz e-posta veya parola',
        HttpStatus.BAD_REQUEST,
      );

    const token = this.jwtService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
    });

    return user.toResponseObject(token);
  }

  async register(data: RegisterDto) {
    const { email, isSupplier } = data;

    let user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (user)
      throw new HttpException('Kullanıcı zaten mevcut', HttpStatus.BAD_REQUEST);

    user = this.userRepository.create(data);
    user.role = isSupplier ? UserRole.SUPPLIER : UserRole.CUSTOMER;
    await this.userRepository.save(user);

    const token = this.jwtService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
    });

    return user.toResponseObject(token);
  }
}
