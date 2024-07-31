import { PartialType } from '@nestjs/swagger';
import { CreateBatchPostDto } from './create-batch-post.dto';

export class UpdateBatchPostDto extends PartialType(CreateBatchPostDto) {}
