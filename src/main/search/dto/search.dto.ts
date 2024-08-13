import { IsOptional, IsString } from 'class-validator'
// import { Category } from '../enum/category.enum'

export class SearchDto {
  @IsString()
  @IsOptional()
  keyword: string
}
