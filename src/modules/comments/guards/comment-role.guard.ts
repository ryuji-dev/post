import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { User, UserRole } from 'src/modules/users/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class CommentRoleGuard implements CanActivate {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;
    const commentId = request.params.commentId;
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException('존재하지 않는 댓글입니다.');
    }

    return user.role === UserRole.ADMIN || comment.user.id === user.id;
  }
}
