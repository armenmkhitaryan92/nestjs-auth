import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { CreateUserData, ReturnUser } from '../users/interfaces/user-types';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(registerDto: RegisterDto): Promise<ReturnUser> {
    const email = registerDto.email.toLowerCase().trim();

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException(
        'A user with this email address already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    const userToCreate: CreateUserData = {
      firstName: registerDto.firstName.trim(),
      lastName: registerDto.lastName.trim(),
      email,
      password: hashedPassword,

      phone: registerDto.phone?.trim() || null,
      website: registerDto.website?.trim() || null,

      address: registerDto.address
        ? {
            street: registerDto.address.street?.trim() || null,
            suite: registerDto.address.suite?.trim() || null,
            city: registerDto.address.city?.trim() || null,
            zipcode: registerDto.address.zipcode?.trim() || null,
            lat: registerDto.address?.lat ?? null,
            lng: registerDto.address?.lng ?? null,
          }
        : null,

      company: registerDto.company
        ? {
            name: registerDto.company.name?.trim() || null,
            catchPhrase: registerDto.company.catchPhrase?.trim() || null,
            bs: registerDto.company.bs?.trim() || null,
          }
        : null,
    };

    const user = await this.usersService.create(userToCreate);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...returnUser } = user;

    return returnUser;
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; user: ReturnUser }> {
    const email = loginDto.email.toLowerCase().trim();

    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('This account is inactive');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...returnUser } = user;

    return {
      accessToken,
      user: returnUser,
    };
  }
}
