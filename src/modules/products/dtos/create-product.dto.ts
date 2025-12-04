import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  // صور المنتج (روابط Cloudinary)
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  images: string[];
}
