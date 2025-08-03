import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserResponseDto } from './dto/user-response.dto';

type PaginationParamsType = {
  page: number;
  limit: number;
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async listAllUsers({
    page = 1,
    limit,
  }: PaginationParamsType): Promise<UserResponseDto[]> {
    const offset = limit || 10;

    const users = await this.userRepository.find({
      take: offset,
      skip: (page - 1) * offset,
    });

    return users.map(user => user.toResponseObject());
  }
}
