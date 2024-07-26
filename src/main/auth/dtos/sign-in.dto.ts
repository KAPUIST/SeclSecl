import { PickType } from '@nestjs/swagger'
import { User } from 'src/main/users/entities/user.entity'

export class SignInDto extends PickType(User, ['email', 'password']) {}
