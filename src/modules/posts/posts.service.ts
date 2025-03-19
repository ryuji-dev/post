import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
import { FindOperator, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ListAllPostDto,
  OrderByOption,
  OrderOption,
} from './dto/list-all-post.dto';
import { title } from 'process';
import { PostView } from './entities/post-view.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(PostView)
    private postViewRepository: Repository<PostView>,
  ) {}

  async createPost(createPostDto: CreatePostDto, user: User) {
    const post = this.postRepository.create({ ...createPostDto, user });
    return await this.postRepository.save(post);
  }

  async findAll(options: ListAllPostDto) {
    // const whereCondition: FindOptionsWhere<Post>[] = [];
    // if (options.title) {
    //   whereCondition.push({ title: ILike(`%${options.title}%`) });
    // }
    // if (options.content) {
    //   whereCondition.push({ content: ILike(`%${options.content}%`) });
    // }
    // const [data, total] = await this.postRepository.findAndCount({
    //   relations: ['user'],
    //   where: whereCondition.length ? whereCondition : {},
    //   take: options.limit,
    //   skip: options.limit * (options.page - 1),
    //   select: {
    //     user: {
    //       id: true,
    //       name: true,
    //     },
    //   },
    // });
    const queryBuilder = this.postRepository
      .createQueryBuilder('p')
      .take(options.limit)
      .skip(options.limit * (options.page - 1))
      .innerJoin('p.user', 'u')
      .select([
        'p.id',
        'p.title',
        'p.createdAt',
        'p.thumbnailUrl',
        'p.views',
        'u.id',
        'u.name',
      ]);

    if (options.title) {
      queryBuilder.andWhere('p.title LIKE :title', {
        title: `%${options.title}%`,
      });
    }
    if (options.content) {
      queryBuilder.andWhere('p.title LIKE :content', {
        content: `%${options.content}%`,
      });
    }

    if (
      options.orderBy &&
      [OrderByOption.VIEWS, OrderByOption.CREATED_AT].includes(options.orderBy)
    ) {
      queryBuilder.orderBy(`p.${options.orderBy}`, options.order);
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page: +options.page,
      limit: +options.limit,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  async findOne(id: string, user: User) {
    const data = await this.postRepository.findOne({ where: { id } });
    if (data) {
      const checkPostView = await this.postViewRepository.findOne({
        where: { user: { id: user.id }, post: { id: data.id } },
        order: { createdAt: OrderOption.DESC },
      });
      if (checkPostView) {
        if (Date.now() - checkPostView.createdAt.getTime() <= 60 * 10 * 1000) {
          return {
            data,
          };
        }
      }

      const postView = this.postViewRepository.create({
        post: data,
        user,
      });
      await this.postViewRepository.save(postView);

      // 조회수 올리는 로직

      // const postViewCount = await this.postViewRepository.count({
      //   where: { post: { id: data.id } },
      // });
      // data.views = postViewCount;
      // await this.postRepository.save(data);
    }
    return {
      data,
    };
  }

  async findPostById(id: string) {
    return this.postRepository.findOne({ where: { id } });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
