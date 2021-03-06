import {
  Controller,
  Get,
  Body,
  Post,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { rPost } from './post.entity';
import { PostsService } from './posts.service';
import { UpdateResult, DeleteResult } from 'typeorm';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Get()
  index(): Promise<rPost[]> {
    return this.postService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<rPost> {
    return this.postService.findOne(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() postData: rPost): Promise<rPost> {
    return this.postService.create(postData);
  }

  @Put(':id/upvote')
  async update(
    @Param('id') id: any,
    @Body() postData: rPost
  ): Promise<UpdateResult> {
    postData.id = id;
    return this.postService.update(postData);
  }

  @Delete(':id/delete')
  async delete(@Body('id') id: number): Promise<DeleteResult> {
    return this.postService.delete(id);
  }
}

//replace this with @Param?
