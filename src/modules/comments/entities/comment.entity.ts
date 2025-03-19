import { BaseEntity } from 'src/common/entities/base.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Comment extends BaseEntity {
  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  post: Post;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    onDelete: 'CASCADE',
  })
  parent: Comment;
}
