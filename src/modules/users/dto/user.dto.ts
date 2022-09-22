import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MinLength, IsEnum } from 'class-validator';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export class UserDto {
  @ApiProperty({ type: String, description: 'name' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ type: String, description: 'email' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ type: String, description: 'password' })
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @ApiProperty({ type: String, description: 'gender' })
  @IsNotEmpty()
  @IsEnum(Gender, { message: 'Gender must be either male or female' })
  readonly gender: Gender;
}
