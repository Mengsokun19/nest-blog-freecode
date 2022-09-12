import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
  Request,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostDto } from './dto/post.dto';
import { Post as PostEntity } from './post.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll() {
    return await this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const post = await this.postsService.findOne(id);

    if (!post) {
      throw new NotFoundException('Post does not exist!');
    }

    return post;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() post: PostDto, @Request() req): Promise<PostEntity> {
    // create the new post
    return await this.postsService.create(post, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() post: PostDto,
    @Request() req,
  ): Promise<PostEntity> {
    // get the number of row affected and the updated post
    const { numberOfAffectedRows, updatedPost } =
      await this.postsService.update(id, post, req.user.id);

    // if number of affected row = 0, means the post does not exist
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException('Post does not exist!');
    }

    return updatedPost;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: number, @Request() req) {
    const deletedPost = await this.postsService.delete(id, req.user.id);

    // if number of affected row = 0, means the post does not exist
    if (deletedPost === 0) {
      throw new NotFoundException('Post does not exist!');
    }

    return 'Successfully Deleted!';
  }
}
