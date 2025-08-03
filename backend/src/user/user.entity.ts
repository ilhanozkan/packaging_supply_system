import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { UserRole } from './enum/user-role.enum';
import { UserResponseDto } from './dto/user-response.dto';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'text',
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  toResponseObject(): UserResponseDto {
    const { id, email, firstName, lastName, role } = this;

    const responseObject: UserResponseDto = {
      id,
      email,
      firstName,
      lastName,
      role,
    };

    return responseObject;
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  comparePassword(attempt: string) {
    const { password } = this;

    return bcrypt.compare(attempt, password);
  }

  private get token() {
    const { id, email } = this;

    return jwt.sign({ id, email }, 'SECRET');
  }
}
