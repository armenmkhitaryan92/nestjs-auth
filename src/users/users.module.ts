import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesGuard } from './guards/roles.guard';
import { Address } from './entities/address.entity';
import { UsersController } from './users.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])], // User Entity
  controllers: [UsersController],
  providers: [UsersService, JwtAuthGuard, RolesGuard],
  exports: [UsersService],
})
export class UsersModule {}
