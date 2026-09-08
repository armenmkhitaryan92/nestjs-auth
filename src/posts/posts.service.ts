import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    const user = await this.usersRepository.findOne({
      where: { id: createPostDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with id: ${createPostDto.userId} not found`,
      );
    }

    const post = this.postsRepository.create({
      title: createPostDto.title,
      body: createPostDto.body,
      user: user,
    });

    /*const savedPost = await this.postsRepository.save(post);

    return {
      id: savedPost.id,
      title: savedPost.title,
      body: savedPost.body,
    };*/

    return await this.postsRepository.save(post);
  }

  public findAll() {
    return this.postsRepository.find();
  }

  public findOne(id: string) {
    return this.postsRepository.findOne({
      where: { id },
    });
  }

  public async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    Object.assign(post, updatePostDto);

    return this.postsRepository.save(post);
  }

  public async remove(id: string) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    await this.postsRepository.remove(post);

    return {
      message: `Post with ID ${id} deleted successfully`,
    };
  }
}
