import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ReturnUser } from '../users/interfaces/user-types';

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

    const user = await this.usersService.create({
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
            lat: registerDto.address.geo?.lat ?? null,
            lng: registerDto.address.geo?.lng ?? null,
          }
        : null,
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      website: user.website,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,

      address: user.address
        ? {
            street: user.address.street ?? null,
            suite: user.address.suite ?? null,
            city: user.address.city ?? null,
            zipcode: user.address.zipcode ?? null,
            geo: {
              lat: user.address?.lat ?? null,
              lng: user.address?.lng ?? null,
            },
          }
        : null,

      createdAt: user.createdAt,
    };
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

    return {
      accessToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        website: user.website,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,

        address: user.address
          ? {
              street: user.address.street ?? null,
              suite: user.address.suite ?? null,
              city: user.address.city ?? null,
              zipcode: user.address.zipcode ?? null,
              geo: {
                lat: user.address?.lat ?? null,
                lng: user.address?.lng ?? null,
              },
            }
          : null,

        createdAt: user.createdAt,
      },
    };
  }
}
