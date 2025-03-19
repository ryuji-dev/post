import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { IsNull, Repository } from 'typeorm';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private postsService: PostsService,
  ) {}
  async createComment(
    createCommentDto: CreateCommentDto,
    postId: string,
    user: User,
  ) {
    const post = await this.postsService.findPostById(postId);

    if (!post) {
      throw new NotFoundException('해당하는 게시글이 없습니다.');
    }

    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      user,
      post,
    });

    return await this.commentRepository.save(comment);
  }

  async createReply(
    createCommentDto: CreateCommentDto,
    user: User,
    postId: string,
    commentId: string,
  ) {
    const post = await this.postsService.findPostById(postId);

    if (!post) {
      throw new NotFoundException('해당하는 게시글이 없습니다.');
    }
    const parent = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!parent) {
      throw new NotFoundException('해당하는 댓글이 없습니다.');
    }

    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      user,
      post,
      parent,
    });

    return await this.commentRepository.save(comment);
  }

  async findCommentsByPostId(postId: string, limit: number) {
    // const data = await this.commentRepository.find({
    //   relations: ['user', 'replies', 'replies.user'],
    //   where: {
    //     post: {
    //       id: postId,
    //     },
    //     parent: IsNull(),
    //   },
    //   take: limit,
    //   select: {
    //     user: {
    //       id: true,
    //       name: true,
    //     },
    //     replies: {
    //       id: true,
    //       content: true,
    //       createdAt: true,
    //       user: {
    //         id: true,
    //         name: true,
    //       },
    //     },
    //   },
    // });

    const data = await this.commentRepository
      .createQueryBuilder('c')
      .leftJoin('c.user', 'u')
      .leftJoin('c.replies', 'r')
      .leftJoin('r.user', 'ru')
      .andWhere('c.postId = :postId', { postId })
      .andWhere('c.parentId  IS NULL')
      .select([
        'c.id',
        'c.content',
        'c.createdAt',
        'u.id',
        'u.name',
        'r.id',
        'r.content',
        'r.createdAt',
        'ru.id',
        'ru.name',
      ])
      .take(limit)
      .getMany();
    return { data };
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async updateComment(commentId: string, updateCommentDto: UpdateCommentDto) {
    // const comment = await this.commentRepository.findOne({
    //   where: { id: commentId },
    // });

    // if (!comment) {
    //   throw new NotFoundException('해당하는 댓글이 없습니다.');
    // }

    // comment.content = updateCommentDto.content;
    // return await this.commentRepository.save(comment);

    const result = await this.commentRepository.update(commentId, {
      content: updateCommentDto.content,
    });

    if (result.affected === 0) {
      throw new NotFoundException('해당하는 댓글이 없습니다.');
    }
  }

  async removeComment(commentId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['post'],
    });

    if (!comment) {
      throw new NotFoundException('해당하는 댓글이 없습니다.');
    }

    await this.commentRepository.remove(comment);
  }
}
