import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Query,
    Param,
    UseInterceptors,
    UploadedFile,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { UsersService } from './users.service';
  import { Express } from 'express';
  import * as csv from 'csv-parser';
  import * as fs from 'fs';
  
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Post('signup')
    async signUp(@Body() body: { name: string; email: string; password: string }) {
      return this.usersService.signUp(body.name, body.email, body.password);
    }
  
    @Post('signin')
    async signIn(@Body() body: { email: string; password: string }) {
      const user = await this.usersService.signIn(body.email, body.password);
      if (!user) {
        return { message: 'Invalid credentials' };
      }
      return { message: 'Login successful', user };
    }
  
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async bulkUpload(@UploadedFile() file: Express.Multer.File) {
      const results = [];
      const stream = fs.createReadStream(file.path).pipe(csv());
      for await (const row of stream) {
        results.push(row);
      }
      await this.usersService.bulkCreate(results);
      return { message: 'Users uploaded successfully', count: results.length };
    }

    @Get('list')
  async listUsers(
    @Query('page') page = 1, // Default to page 1
    @Query('limit') limit = 10, // Default to limit 10
    ) {
    return this.usersService.listUsers(Number(page), Number(limit));
    }


    @Get('search')
    async searchUsers(@Query('q') query: string) {
    return this.usersService.searchUsers(query);
    }

    @Delete(':id')
async deleteUser(@Param('id') id: string) {
  return this.usersService.deleteUser(id);
}

  }
  