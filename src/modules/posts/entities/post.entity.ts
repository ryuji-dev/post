import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { PostView } from './post-view.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';

@Entity()
export class Post extends BaseEntity {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  thumbnailUrl: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  commentCount: number;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => PostView, (postView) => postView.post)
  postView: PostView[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
