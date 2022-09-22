import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOkResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DoesUserExist } from 'src/core/guards/doesUserExist.guard';
import { UserDto } from '../users/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // run the validation first on local strategy class
  @UseGuards(AuthGuard('local'))
  @ApiOkResponse({ description: 'User logged out successfully' })
  @ApiUnauthorizedResponse({ description: 'User not logged in' })
  @ApiBody({ type: UserDto })
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(DoesUserExist)
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiBody({ type: UserDto })
  @Post('signup')
  async signup(@Body() user: UserDto) {
    return this.authService.createUser(user);
  }
}
