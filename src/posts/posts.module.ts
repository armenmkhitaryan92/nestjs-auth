import { Module } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { User } from '../users/entities/user.entity';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [TypeOrmModule.forFeature([Post, User])],
})
export class PostsModule {}
