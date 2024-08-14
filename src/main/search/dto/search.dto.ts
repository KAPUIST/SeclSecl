import { IsOptional, IsString } from 'class-validator'

export class SearchDto {
  @IsString()
  @IsOptional()
  keyword: string
}
