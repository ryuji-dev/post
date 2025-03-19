import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Request } from 'express';
import { User, UserRole } from 'src/modules/users/entities/user.entity';

@Injectable()
export class PostRoleGuard implements CanActivate {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;
    const postId = request.params.postid;
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    if (!post) {
      throw new NotFoundException('존재하지 않는 포스트입니다.');
    }

    return user.role === UserRole.ADMIN || post.user.id === user.id;
  }
}
