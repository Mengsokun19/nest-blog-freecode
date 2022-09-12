import { Inject, Injectable } from '@nestjs/common';
import { POST_REPOSITORY } from 'src/core/constants';
import { User } from '../users/user.entity';
import { PostDto } from './dto/post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: typeof Post,
  ) {}

  // accept the post object with userId who create the post
  async create(post: PostDto, userId): Promise<Post> {
    return await this.postRepository.create<Post>({ ...post, userId });
  }

  // return all the post with user and excludes the user's password
  async findAll(): Promise<Post[]> {
    return await this.postRepository.findAll<Post>({
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }

  async findOne(id: number): Promise<Post> {
    return await this.postRepository.findOne<Post>({
      where: { id },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }

  // update the existing post where the id and userId matches
  async update(id: number, data, userId) {
    const [numberOfAffectedRows, [updatedPost]] =
      await this.postRepository.update(
        { ...data },
        { returning: true, where: { id, userId } },
      );
    return { numberOfAffectedRows, updatedPost };
  }

  async delete(id: number, userId) {
    return await this.postRepository.destroy({
      where: { id, userId },
    });
  }
}
