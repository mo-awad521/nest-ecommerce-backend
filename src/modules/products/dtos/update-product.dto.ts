import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  IsArray,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
