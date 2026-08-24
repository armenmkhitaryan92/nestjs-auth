import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

export type CreateUserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string | null;
  website?: string | null;

  address?: {
    street: string | null;
    suite: string | null;
    city: string | null;
    zipcode: string | null;
    lat: string | null;
    lng: string | null;
  } | null;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public findAll() {
    console.log('Get all users');
    return this.usersRepository.find({
      relations: {
        address: true,
      },
    });
  }

  public create(data: CreateUserData): Promise<User> {
    const user = this.usersRepository.create(data);

    return this.usersRepository.save(user);
  }

  public findById(id: string) {
    return this.usersRepository.findOne({
      where: { id },
      relations: {
        address: true,
      },
    });
  }

  public findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  public findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }
}
