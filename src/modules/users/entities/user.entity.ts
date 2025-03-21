import { BaseEntity } from 'src/common/entities/base.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum SocialType {
  GOOGLE = 'google',
  KAKAO = 'kakao',
  NAVER = 'naver',
  COMMON = 'common',
}

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true, default: SocialType.COMMON })
  socialId: string;

  @Column({ type: 'enum', enum: SocialType, default: SocialType.COMMON })
  socialType: SocialType;

  @Column({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
