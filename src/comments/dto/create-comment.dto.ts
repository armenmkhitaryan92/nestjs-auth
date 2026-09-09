import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  postId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
