import { BaseEntity } from 'src/common/entities/base.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
