import { Module } from '@nestjs/common';
import { userProviders } from './user.providers';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, ...userProviders],
  exports: [UsersService],
})
export class UsersModule {}
