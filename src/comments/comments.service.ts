import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from '../posts/entities/post.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  public async create(createCommentDto: CreateCommentDto) {
    const post = await this.findPost(createCommentDto.postId);

    const comment = this.commentsRepository.create({
      name: createCommentDto.name,
      email: createCommentDto.email,
      body: createCommentDto.body,
      post,
    });

    return this.commentsRepository.save(comment);
  }

  public findAll() {
    return this.commentsRepository.find();
  }

  public async findOne(id: string) {
    const comment = await this.commentsRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  public async update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findOne(id);

    if (updateCommentDto.postId) {
      comment.post = await this.findPost(updateCommentDto.postId);
    }

    Object.assign(comment, {
      name: updateCommentDto.name ?? comment.name,
      email: updateCommentDto.email ?? comment.email,
      body: updateCommentDto.body ?? comment.body,
    });

    return this.commentsRepository.save(comment);
  }

  public async remove(id: string) {
    const comment = await this.findOne(id);
    await this.commentsRepository.remove(comment);

    return { message: `Comment with ID ${id} deleted successfully` };
  }

  private async findPost(id: string) {
    const post = await this.postsRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }
}
