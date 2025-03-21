import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListAllPostDto } from './dto/list-all-post.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('포스트 관리')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  createPost(@Body() createPostDto: CreatePostDto, @RequestUser() user: User) {
    return this.postsService.createPost(createPostDto, user);
  }

  @Get()
  findAll(@Query() listAllPostDto: ListAllPostDto) {
    return this.postsService.findAll(listAllPostDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @RequestUser() user: User) {
    return this.postsService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
