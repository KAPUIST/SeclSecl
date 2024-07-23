import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export enum AuthProviderType {
  GOOGLE = 'google',
  CREDENTIALS = 'credentials'

}
export class RegisterWithProviderDto {
  @ApiProperty()
  @IsString()
  uid: string;

  @ApiProperty({ required: false })
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  image?: string;

  @ApiProperty({ enum: AuthProviderType })
  type: AuthProviderType;
}

export class RegisterWithCredentialsDto {
  @ApiProperty({ required: false })
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  image?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class LoginOutputDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: User;
}