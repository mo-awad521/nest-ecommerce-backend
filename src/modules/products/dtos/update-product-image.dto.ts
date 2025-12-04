import { IsOptional, IsString } from 'class-validator';

export class UpdateProductImageDto {
  @IsOptional()
  @IsString()
  url?: string;
}
